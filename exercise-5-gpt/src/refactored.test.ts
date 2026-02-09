import { Notifier } from "./refactored";

// =====================
// Tiny test runner
// =====================

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (e: any) {
    console.error(`❌ ${name}`);
    console.error("   ", e.message);
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected "${expected}", got "${actual}"`);
      }
    },
    toContain(expected: any) {
      if (!actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
    not: {
      toContain(expected: any) {
        if (actual.includes(expected)) {
          throw new Error(`Expected "${actual}" NOT to contain "${expected}"`);
        }
      }
    },
    toThrow() {
      let threw = false;
      try {
        actual();
      } catch {
        threw = true;
      }
      if (!threw) throw new Error("Expected function to throw");
    }
  };
}

// =====================
// Test helpers
// =====================

function captureConsole(fn: () => void): string[] {
  const logs: string[] = [];
  const original = console.log;

  console.log = (...args: any[]) => logs.push(args.join(" "));
  try {
    fn();
  } finally {
    console.log = original;
  }

  return logs;
}

// =====================
// Options-only composition tests
// =====================

test("Default notifier sends SMS with no options", () => {
  const notifier = new Notifier("u1", {
    channel: "sms"
  });

  const logs = captureConsole(() => notifier.send("hello"));

  expect(logs.length).toBe(1);
  expect(logs[0]).toContain("SMS");
  expect(logs[0]).toContain("hello");
});

test("Email channel selected via option", () => {
  const notifier = new Notifier("u2", {
    channel: "email"
  });

  const logs = captureConsole(() => notifier.send("welcome"));

  expect(logs[0]).toContain("Email");
});

test("Urgent option transforms message", () => {
  const notifier = new Notifier("u3", {
    channel: "email",
    urgent: true
  });

  const logs = captureConsole(() => notifier.send("server down"));

  expect(logs[0]).toContain("🚨");
  expect(logs[0]).toContain("SERVER DOWN");
});

test("VIP option prefixes message", () => {
  const notifier = new Notifier("u4", {
    channel: "sms",
    vip: true
  });

  const logs = captureConsole(() => notifier.send("welcome"));

  expect(logs[0]).toContain("VIP");
});

test("Multiple options compose deterministically", () => {
  const notifier = new Notifier("u5", {
    channel: "sms",
    vip: true,
    urgent: true
  });

  const logs = captureConsole(() => notifier.send("alert"));

  expect(logs[0]).toContain("VIP");
  expect(logs[0]).toContain("ALERT");
});

test("Encrypt option hides original message", () => {
  const notifier = new Notifier("u6", {
    channel: "sms",
    encrypt: true
  });

  const logs = captureConsole(() => notifier.send("secret"));

  expect(logs[0]).not.toContain("secret");
});

test("Logging option runs after delivery", () => {
  const notifier = new Notifier("u7", {
    channel: "sms",
    logging: true
  });

  const logs = captureConsole(() => notifier.send("ping"));

  expect(logs.length).toBe(2);
  expect(logs[1]).toContain("LOG");
});

test("Quiet hours option blocks delivery", () => {
  const notifier = new Notifier("u8", {
    channel: "email",
    quietHours: true,
    currentDate: new Date("2026-02-09T23:30:00Z")
  });

  expect(() => notifier.send("newsletter")).toThrow();
});

test("Changing channel does not affect policies", () => {
  const options = {
    urgent: true,
    vip: true
  };

  const sms = new Notifier("u9", { channel: "sms", ...options });
  const email = new Notifier("u9", { channel: "email", ...options });

  const smsLog = captureConsole(() => sms.send("down"))[0];
  const emailLog = captureConsole(() => email.send("down"))[0];

  expect(smsLog).toContain("🚨");
  expect(emailLog).toContain("🚨");
});

test("Notifier exposes zero infrastructure details", () => {
  const notifier = new Notifier("u10", {
    channel: "sms",
    urgent: true,
    vip: true,
    encrypt: true,
    logging: true
  });

  const logs = captureConsole(() => notifier.send("system"));

  expect(logs[0]).not.toContain("system");
  expect(logs[1]).toContain("LOG");
});
