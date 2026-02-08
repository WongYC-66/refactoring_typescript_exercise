import { processOrder } from "./ori"


// ===============================
// Minimal test runner
// ===============================
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log("✅", name);
  } catch (e: any) {
    console.error("❌", name);
    console.error("   ", e.message);
  }
}

function captureConsole(fn: () => any) {
  const original = console.log;
  const logs: string[] = [];
  console.log = (...args) => logs.push(args.join(" "));

  let result;
  try {
    result = fn();
  } finally {
    console.log = original;
  }

  return { logs, result };
}

// ===============================
// Shared test data
// ===============================
type Order = {
  id: string;
  items: { name: string; price: number }[];
  userType: "guest" | "member" | "vip";
  coupon?: string;
  paymentMethod: "card" | "paypal" | "crypto";
};

const baseInventory = {
  Phone: 10,
  Laptop: 5,
};

function cloneInventory() {
  return JSON.parse(JSON.stringify(baseInventory));
}

const nowJanuary = new Date("2026-01-10");
const nowFebruary = new Date("2026-02-10");

// ===============================
// Unit tests for processOrder
// ===============================
test("Guest order: tax + shipping applied", () => {
  const inventory = cloneInventory();

  const order: Order = {
    id: "o1",
    items: [{ name: "Phone", price: 100 }],
    userType: "guest",
    paymentMethod: "card",
  };

  const { result } = captureConsole(() =>
    processOrder(order, inventory, nowFebruary)
  );

  // 100 + 10 tax + 10 shipping
  if (result !== 120) throw new Error("Incorrect final amount");
});

test("Member gets 5% discount", () => {
  const inventory = cloneInventory();

  const order: Order = {
    id: "o2",
    items: [{ name: "Laptop", price: 200 }],
    userType: "member",
    paymentMethod: "card",
  };

  const { result } = captureConsole(() =>
    processOrder(order, inventory, nowFebruary)
  );

  // 200 - 10 discount + 19 tax
  if (result !== 209) throw new Error("Member discount broken");
});

test("VIP + NEWYEAR coupon only applies in January", () => {
  const inventory = cloneInventory();

  const order: Order = {
    id: "o3",
    items: [{ name: "Phone", price: 150 }],
    userType: "vip",
    coupon: "NEWYEAR",
    paymentMethod: "paypal",
  };

  const { result } = captureConsole(() =>
    processOrder(order, inventory, nowJanuary)
  );

  // 150 - 15 - 20 + 11.5 tax
  if (result !== 126.5) throw new Error("VIP NEWYEAR logic wrong");
});

test("Crypto payment has no tax", () => {
  const inventory = cloneInventory();

  const order: Order = {
    id: "o4",
    items: [{ name: "Phone", price: 100 }],
    userType: "guest",
    paymentMethod: "crypto",
  };

  const { result } = captureConsole(() =>
    processOrder(order, inventory, nowFebruary)
  );

  // 100 + 10 shipping
  if (result !== 110) throw new Error("Crypto tax rule violated");
});

test("Inventory is decremented", () => {
  const inventory = cloneInventory();

  const order: Order = {
    id: "o5",
    items: [{ name: "Phone", price: 100 }],
    userType: "guest",
    paymentMethod: "card",
  };

  captureConsole(() =>
    processOrder(order, inventory, nowFebruary)
  );

  if (inventory.Phone !== 9) {
    throw new Error("Inventory not reduced");
  }
});

test("Out of stock throws error", () => {
  const inventory = { Phone: 0 };

  const order: Order = {
    id: "o6",
    items: [{ name: "Phone", price: 100 }],
    userType: "guest",
    paymentMethod: "card",
  };

  let threw = false;
  try {
    processOrder(order, inventory, nowFebruary);
  } catch {
    threw = true;
  }

  if (!threw) throw new Error("Expected out-of-stock error");
});
