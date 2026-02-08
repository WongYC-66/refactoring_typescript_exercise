// =======================================
// Minimal test utilities (Node-style)
// =======================================

import {
  PhysicalOrder,
  DigitalOrder,
  DiscountedPhysicalOrder,
  TaxedPhysicalOrder,
  DiscountedTaxedPhysicalOrder,
  DiscountedDigitalOrder,
  LoggedPhysicalOrder,
  LoggedDiscountedPhysicalOrder,
  LoggedDigitalOrder,
  ExpressPhysicalOrder,
  ExpressDiscountedPhysicalOrder,
} from "./ori";

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
// Base behavior tests
// =======================================

test("PhysicalOrder base total = 100", () => {
  const order = new PhysicalOrder("P-BASE");
  if (order.calculateTotal() !== 100) {
    throw new Error("Base physical total broken");
  }
});

test("DigitalOrder base total = 50", () => {
  const order = new DigitalOrder("D-BASE");
  if (order.calculateTotal() !== 50) {
    throw new Error("Base digital total broken");
  }
});

test("Base checkout logs correctly", () => {
  const order = new PhysicalOrder("P-CHK");

  const logs = captureConsole(() => order.checkout());

  if (logs[0] !== "Checking out order P-CHK") {
    throw new Error("Base checkout broken");
  }
});

// =======================================
// Pricing rules
// =======================================

test("Discounted Physical Order total = 90", () => {
  const order = new DiscountedPhysicalOrder("P-DISC");
  expectClose(order.calculateTotal(), 90);
});

test("Taxed Physical Order total = 110", () => {
  const order = new TaxedPhysicalOrder("P-TAX");
  expectClose(order.calculateTotal(), 110);
});

test("Discounted + Taxed Physical Order total = 99", () => {
  const order = new DiscountedTaxedPhysicalOrder("P-DISC-TAX");
  expectClose(order.calculateTotal(), 99);
});

test("Discounted Digital Order total = 45", () => {
  const order = new DiscountedDigitalOrder("D-DISC");
  expectClose(order.calculateTotal(), 45);
});

test("Express Physical Order adds 20", () => {
  const order = new ExpressPhysicalOrder("P-EXP");
  expectClose(order.calculateTotal(), 120);
});

test("Express Discounted Physical Order total = 110", () => {
  const order = new ExpressDiscountedPhysicalOrder("P-EXP-DISC");
  expectClose(order.calculateTotal(), 110);
});

// =======================================
// Fulfillment behavior
// =======================================

test("Physical order ships item", () => {
  const order = new PhysicalOrder("P-SHIP");

  const logs = captureConsole(() => order.ship());

  if (logs[0] !== "Shipping physical order") {
    throw new Error("Physical shipping broken");
  }
});

test("Digital order downloads item", () => {
  const order = new DigitalOrder("D-DL");

  const logs = captureConsole(() => order.download());

  if (logs[0] !== "Downloading digital item") {
    throw new Error("Digital download broken");
  }
});

// =======================================
// Logging (cross-cutting concern)
// =======================================

test("Logged Physical Order logs audit before checkout", () => {
  const order = new LoggedPhysicalOrder("P-LOG");

  const logs = captureConsole(() => order.checkout());

  if (logs[0] !== "Audit log start") {
    throw new Error("Missing audit log");
  }

  if (logs[1] !== "Checking out order P-LOG") {
    throw new Error("Checkout order incorrect");
  }
});

test("Logged Discounted Physical Order logs audit before checkout", () => {
  const order = new LoggedDiscountedPhysicalOrder("P-DISC-LOG");

  const logs = captureConsole(() => order.checkout());

  if (logs[0] !== "Audit log start") {
    throw new Error("Missing audit log");
  }

  if (logs[1] !== "Checking out order P-DISC-LOG") {
    throw new Error("Checkout order incorrect");
  }
});

test("Logged Digital Order logs audit before checkout", () => {
  const order = new LoggedDigitalOrder("D-LOG");

  const logs = captureConsole(() => order.checkout());

  if (logs[0] !== "Audit log start") {
    throw new Error("Missing audit log");
  }

  if (logs[1] !== "Checking out order D-LOG") {
    throw new Error("Checkout order incorrect");
  }
});
