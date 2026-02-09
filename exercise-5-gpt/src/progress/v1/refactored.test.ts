import { Notifier, SmsChannel, NormalPolicy, EmailChannel, UrgentPolicy, VipPolicy, LoggingPolicy, QuietHoursPolicy, EncryptPolicy } from "./refactored"

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
  const matchers = {
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
    toThrow() {
      let threw = false;
      try {
        actual();
      } catch {
        threw = true;
      }
      if (!threw) {
        throw new Error(`Expected function to throw`);
      }
    }
  };

  return {
    ...matchers,
    not: {
      toBe(expected: any) {
        if (actual === expected) {
          throw new Error(`Expected NOT "${expected}"`);
        }
      },
      toContain(expected: any) {
        if (actual.includes(expected)) {
          throw new Error(`Expected "${actual}" NOT to contain "${expected}"`);
        }
      }
    }
  };
}

// =====================
// Test helpers
// =====================

function captureConsole(fn: () => void): string[] {
  const logs: string[] = [];
  const original = console.log;

  console.log = (...args: any[]) => {
    logs.push(args.join(" "));
  };

  try {
    fn();
  } finally {
    console.log = original;
  }

  return logs;
}

// =====================
// Unit tests
// =====================

test("SMS channel sends normal message", () => {
  const notifier = new Notifier(
    "user-1",
    new SmsChannel(),
    [new NormalPolicy()]
  );

  const logs = captureConsole(() => {
    notifier.send("hello");
  });

  expect(logs[0]).toBe("SMS to user-1: hello");
});

test("Urgent policy transforms message", () => {
  const notifier = new Notifier(
    "user-1",
    new EmailChannel(),
    [new UrgentPolicy()]
  );

  const logs = captureConsole(() => {
    notifier.send("server down");
  });

  expect(logs[0]).toContain("🚨 SERVER DOWN");
});

test("VIP policy prefixes message", () => {
  const notifier = new Notifier(
    "user-2",
    new EmailChannel(),
    [new VipPolicy()]
  );

  const logs = captureConsole(() => {
    notifier.send("welcome");
  });

  expect(logs[0]).toContain("VIP");
});

test("Policies apply in order", () => {
  const notifier = new Notifier(
    "user-3",
    new SmsChannel(),
    [new VipPolicy(), new UrgentPolicy()]
  );

  const logs = captureConsole(() => {
    notifier.send("alert");
  });

  expect(logs[0]).toContain("VIP");
  expect(logs[0]).toContain("ALERT");
});

test("Logging policy runs after send", () => {
  const notifier = new Notifier(
    "user-4",
    new SmsChannel(),
    [new NormalPolicy()],
    [new LoggingPolicy()]
  );

  const logs = captureConsole(() => {
    notifier.send("ping");
  });

  expect(logs.length).toBe(2);
  expect(logs[1]).toContain("LOG");
});

test("Quiet hours policy blocks sending", () => {
  const notifier = new Notifier(
    "user-5",
    new EmailChannel(),
    [new NormalPolicy()],
    [new QuietHoursPolicy()]
  );

  expect(() => notifier.send("newsletter")).toThrow();
});

test("Encrypt policy modifies payload", () => {
  const notifier = new Notifier(
    "user-6",
    new SmsChannel(),
    [new EncryptPolicy()]
  );

  const logs = captureConsole(() => {
    notifier.send("secret");
  });

  expect(logs[0]).not.toContain("secret");
});

test("Different channels can be swapped without changing logic", () => {
  const sms = new Notifier(
    "user-7",
    new SmsChannel(),
    [new NormalPolicy()]
  );

  const email = new Notifier(
    "user-7",
    new EmailChannel(),
    [new NormalPolicy()]
  );

  const smsLogs = captureConsole(() => sms.send("hi"));
  const emailLogs = captureConsole(() => email.send("hi"));

  expect(smsLogs[0]).toContain("SMS");
  expect(emailLogs[0]).toContain("Email");
});
