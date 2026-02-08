// ==========================
// Unit Tests for Inheritance Version
// ==========================

import { User, AdminUser, CustomerUser, PremiumCustomer } from './refactored'

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

// 1. Test User login/logout/notify
test("User should login, logout, and notify", () => {
  const user = new User("Alice", "alice@example.com");

  let output = captureConsole(() => user.login());
  if (output[0] !== "Alice logged in") throw new Error("login failed");

  output = captureConsole(() => user.logout());
  if (output[0] !== "Alice logged out") throw new Error("logout failed");

  output = captureConsole(() => user.notify("Hello!"));
  if (output[0] !== "Sending email to alice@example.com: Hello!") throw new Error("notify failed");
});

// 2. Test AdminUser actions
test("AdminUser should add product and delete user", () => {
  const admin = new AdminUser("Bob", "bob@example.com");
  const user = new User("Charlie", "charlie@example.com");

  let output = captureConsole(() => admin.addProduct("Laptop"));
  if (output[0] !== "Bob added product Laptop") throw new Error("addProduct failed");

  output = captureConsole(() => admin.deleteUser(user));
  if (output[0] !== "Bob deleted user Charlie") throw new Error("deleteUser failed");
});

// 3. Test CustomerUser cart and checkout
test("CustomerUser should add to cart and checkout", () => {
  const customer = new CustomerUser("Dave", "dave@example.com");

  let output = captureConsole(() => customer.addToCart("Phone"));
  if (output[0] !== "Dave added Phone to cart") throw new Error("addToCart failed");

  output = captureConsole(() => customer.addToCart("Tablet"));
  if (customer.cart.length !== 2) throw new Error("cart length incorrect");

  output = captureConsole(() => customer.checkout());
  if (output[0] !== "Dave checked out: Phone, Tablet") throw new Error("checkout failed");
  if (Number(customer.cart.length) !== 0) throw new Error("cart not cleared after checkout");
});

// 4. Test CustomerUser review
test("CustomerUser should review product", () => {
  const customer = new CustomerUser("Eve", "eve@example.com");
  const output = captureConsole(() => customer.reviewProduct("Laptop", "Great!"));
  if (output[0] !== "Eve reviewed Laptop: Great!") throw new Error("reviewProduct failed");
});

// 5. Test PremiumCustomer discount
test("PremiumCustomer should apply discount", () => {
  const premium = new PremiumCustomer("Frank", "frank@example.com");
  const output = captureConsole(() => premium.applyDiscount(15));
  if (output[0] !== "Frank applied discount of 15%") throw new Error("applyDiscount failed");
});
