// =======================================
// Minimal test utilities (Node-style)
// =======================================

import { OrderFactory } from "./refactored";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(err);
  }
}

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

function expectClose(actual: number, expected: number, epsilon = 1e-6) {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

// =======================================
// Base behavior tests using factory
// =======================================

test("PhysicalOrder base total = 100", () => {
  const order = OrderFactory.create("P-BASE", { type: 'physical' }, { id: "P-BASE" });
  if (order.calculateTotal() !== 100) {
    throw new Error("Base physical total broken");
  }
});

test("DigitalOrder base total = 50", () => {
  const order = OrderFactory.create("D-BASE", { type: 'digital' }, { id: "D-BASE" });
  if (order.calculateTotal() !== 50) {
    throw new Error("Base digital total broken");
  }
});

test("Base checkout logs correctly", () => {
  const order = OrderFactory.create("P-CHK", { type: 'physical' }, { id: "P-CHK" });

  const logs = captureConsole(() => order.checkout());

  if (logs[0] !== "Checking out order P-CHK") {
    throw new Error("Base checkout broken");
  }
});

// =======================================
// Pricing rules
// =======================================

test("Discounted Physical Order total = 90", () => {
  const order = OrderFactory.create("P-DISC", { type: 'physical', discount: true }, { id: "P-DISC" });
  expectClose(order.calculateTotal(), 90);
});

test("Taxed Physical Order total = 110", () => {
  const order = OrderFactory.create("P-TAX", { type: 'physical', tax: true }, { id: "P-TAX" });
  expectClose(order.calculateTotal(), 110);
});

test("Discounted + Taxed Physical Order total = 99", () => {
  const order = OrderFactory.create("P-DISC-TAX", { type: 'physical', discount: true, tax: true }, { id: "P-DISC-TAX" });
  expectClose(order.calculateTotal(), 99);
});

test("Discounted Digital Order total = 45", () => {
  const order = OrderFactory.create("D-DISC", { type: 'digital', discount: true }, { id: "D-DISC" });
  expectClose(order.calculateTotal(), 45);
});

test("Express Physical Order adds 20", () => {
  const order = OrderFactory.create("P-EXP", { type: 'physical', express: true }, { id: "P-EXP" });
  expectClose(order.calculateTotal(), 120);
});

test("Express Discounted Physical Order total = 110", () => {
  const order = OrderFactory.create("P-EXP-DISC", { type: 'physical', discount: true, express: true }, { id: "P-EXP-DISC" });
  expectClose(order.calculateTotal(), 110);
});

// =======================================
// Fulfillment behavior
// =======================================

test("Physical order ships item", () => {
  const order = OrderFactory.create("P-SHIP", { type: 'physical' }, { id: "P-SHIP" });

  const logs = captureConsole(() => order.ship());

  if (logs[0] !== "Shipping physical order") {
    throw new Error("Physical shipping broken");
  }
});

test("Digital order downloads item", () => {
  const order = OrderFactory.create("D-DL", { type: 'digital' }, { id: "D-DL" });

  const logs = captureConsole(() => order.download());

  if (logs[0] !== "Downloading digital item") {
    throw new Error("Digital download broken");
  }
});

// =======================================
// Logging (cross-cutting concern)
// =======================================

test("Logged Physical Order logs audit before checkout", () => {
  const order = OrderFactory.create("P-LOG", { type: 'physical' }, { id: "P-LOG", logger: true });

  const logs = captureConsole(() => order.checkout());

  if (logs[0] !== "Audit log start") {
    throw new Error("Missing audit log");
  }

  if (logs[1] !== "Checking out order P-LOG") {
    throw new Error("Checkout order incorrect");
  }
});

test("Logged Discounted Physical Order logs audit before checkout", () => {
  const order = OrderFactory.create("P-DISC-LOG", { type: 'physical', discount: true }, { id: "P-DISC-LOG", logger: true });

  const logs = captureConsole(() => order.checkout());

  if (logs[0] !== "Audit log start") {
    throw new Error("Missing audit log");
  }

  if (logs[1] !== "Checking out order P-DISC-LOG") {
    throw new Error("Checkout order incorrect");
  }
});

test("Logged Digital Order logs audit before checkout", () => {
  const order = OrderFactory.create("D-LOG", { type: 'digital' }, { id: "D-LOG", logger: true });

  const logs = captureConsole(() => order.checkout());

  if (logs[0] !== "Audit log start") {
    throw new Error("Missing audit log");
  }

  if (logs[1] !== "Checking out order D-LOG") {
    throw new Error("Checkout order incorrect");
  }
});
