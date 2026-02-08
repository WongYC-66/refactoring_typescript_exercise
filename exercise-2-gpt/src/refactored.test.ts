// ==========================
// Unit Tests for Composition Version
// ==========================

import { User } from './refactored'

function captureConsole(fn: () => void): string[] {
  const output: string[] = [];
  const originalLog = console.log;
  console.log = (msg?: any, ...args: any[]) => {
    output.push([msg, ...args].join(" "));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  return output;
}

function test(description: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${description}`);
  } catch (err) {
    console.error(`❌ ${description}`);
    console.error(err);
  }
}

// ==========================
// Tests
// ==========================

// 1. Base user behavior
test("User should login, logout, and notify", () => {
  const user = new User("Alice", "alice@example.com");

  let output = captureConsole(() => user.login());
  if (output[0] !== "Alice logged in") throw new Error("login failed");

  output = captureConsole(() => user.logout());
  if (output[0] !== "Alice logged out") throw new Error("logout failed");

  output = captureConsole(() => user.notify("Hello!"));
  if (output[0] !== "Sending email to alice@example.com: Hello!") {
    throw new Error("notify failed");
  }
});

// 2. Admin capability
test("User with admin capability should add product and delete user", () => {
  const admin = new User("Bob", "bob@example.com");
  const target = new User("Charlie", "charlie@example.com");

  admin.enableAdmin(); // 👈 capability, not subclass

  let output = captureConsole(() => admin.admin!.addProduct("Laptop"));
  if (output[0] !== "Bob added product Laptop") {
    throw new Error("addProduct failed");
  }

  output = captureConsole(() => admin.admin!.deleteUser(target));
  if (output[0] !== "Bob deleted user Charlie") {
    throw new Error("deleteUser failed");
  }
});

// 3. Customer cart + checkout
test("User with customer capability should add to cart and checkout", () => {
  const user = new User("Dave", "dave@example.com");

  user.enableCustomer(); // 👈 attach capability

  let output = captureConsole(() => user.customer!.addToCart("Phone"));
  if (output[0] !== "Dave added Phone to cart") {
    throw new Error("addToCart failed");
  }

  output = captureConsole(() => user.customer!.addToCart("Tablet"));
  if (user.customer!.cart.length !== 2) {
    throw new Error("cart length incorrect");
  }

  output = captureConsole(() => user.customer!.checkout());
  if (output[0] !== "Dave checked out: Phone, Tablet") {
    throw new Error("checkout failed");
  }

  if (Number(user.customer!.cart.length) !== 0) {
    throw new Error("cart not cleared after checkout");
  }
});

// 4. Customer review
test("User with customer capability should review product", () => {
  const user = new User("Eve", "eve@example.com");

  user.enableCustomer();

  const output = captureConsole(() =>
    user.customer!.reviewProduct("Laptop", "Great!")
  );

  if (output[0] !== "Eve reviewed Laptop: Great!") {
    throw new Error("reviewProduct failed");
  }
});

// 5. Premium capability
test("User with premium capability should apply discount", () => {
  const user = new User("Frank", "frank@example.com");

  user.enableCustomer();
  user.enablePremium(); // 👈 layered capability

  const output = captureConsole(() =>
    user.premium!.applyDiscount(15)
  );

  if (output[0] !== "Frank applied discount of 15%") {
    throw new Error("applyDiscount failed");
  }
});
