// ==========================
// Inheritance Version
// ==========================

// Base class for all users
export class User {
  constructor(public name: string, public email: string) {}

  login() {
    console.log(`${this.name} logged in`);
  }

  logout() {
    console.log(`${this.name} logged out`);
  }

  notify(message: string) {
    console.log(`Sending email to ${this.email}: ${message}`);
  }
}

// Admin user
export class AdminUser extends User {
  deleteUser(user: User) {
    console.log(`${this.name} deleted user ${user.name}`);
  }

  addProduct(productName: string) {
    console.log(`${this.name} added product ${productName}`);
  }
}

// Customer user
export class CustomerUser extends User {
  cart: string[] = [];

  addToCart(product: string) {
    this.cart.push(product);
    console.log(`${this.name} added ${product} to cart`);
  }

  checkout() {
    console.log(`${this.name} checked out: ${this.cart.join(", ")}`);
    this.cart = [];
  }

  reviewProduct(product: string, review: string) {
    console.log(`${this.name} reviewed ${product}: ${review}`);
  }
}

// Premium customer inherits everything from CustomerUser
export class PremiumCustomer extends CustomerUser {
  applyDiscount(percent: number) {
    console.log(`${this.name} applied discount of ${percent}%`);
  }
}