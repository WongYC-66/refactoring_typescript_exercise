interface login {
  (this: User): void
}

interface logout {
  (this: User): void
}

interface notify {
  (this: User, message: string): void
}

interface deleteUser {
  (this: User, user: User): void
}

interface addProduct {
  (this: User, productName: string): void
}

interface addToCart {
  (this: CustomerUser, product: string): void
}

interface checkout {
  (this: CustomerUser): void
}

interface reviewProduct {
  (this: CustomerUser, product: string, review: string): void
}

interface applyDiscount {
  (this: PremiumCustomer, percent: number): void
}


export interface User {
  name: string,
  email: string,
  login(): void,
  logout(): void,
  notify(message: string): void
}

export interface AdminUser extends User {
  deleteUser(user: User): void;
  addProduct(productName: string): void;
}

export interface CustomerUser extends User {
  cart: string[],
  addToCart(product: string): void,
  checkout(): void,
  reviewProduct(product: string, review: string): void,
}

export interface PremiumCustomer extends CustomerUser {
  applyDiscout(percent: number): void
}

// 

const login: login = function () {
  console.log(`${this.name} logged in`);
}

const logout: logout = function () {
  console.log(`${this.name} logged in`);
}

const notify: notify = function (message) {
  console.log(`Sending email to ${this.email}: ${message}`);
}

const deleteUser: deleteUser = function (user) {
  console.log(`${this.name} deleted user ${user.name}`);
}

const addProduct: addProduct = function (productName) {
  console.log(`${this.name} added product ${productName}`);
}

const addToCart: addToCart = function (product) {
  console.log(`${this.name} added product ${product}`);
}

const checkout: checkout = function () {
  console.log(`${this.name} checked out: ${this.cart.join(", ")}`);
  this.cart = [];
}

const reviewProduct: reviewProduct = function (product, review) {
  console.log(`${this.name} reviewed ${product}: ${review}`);
}

const applyDiscount: applyDiscount = function (percent) {
  console.log(`${this.name} applied discount of ${percent}%`);
}


export class User implements User {
  constructor(name: string, email: string) {
    this.name = name
    this.email = email
  }
  login = login
  logout = logout
  notify = notify
}

export class AdminUser implements AdminUser {
  constructor(name: string, email: string) {
    this.name = name
    this.email = email
  }
  login = login
  logout = logout
  notify = notify
  deleteUser = deleteUser
  addProduct = addProduct
}

export class CustomerUser implements CustomerUser {
  constructor(name: string, email: string) {
    this.name = name
    this.email = email
    this.cart = [] as string[]
  }
  login = login
  logout = logout
  notify = notify
  deleteUser = deleteUser
  addProduct = addProduct
  addToCart = addToCart
  checkout = checkout
  reviewProduct = reviewProduct
}


export class PremiumCustomer implements PremiumCustomer {
  constructor(name: string, email: string) {
    this.name = name
    this.email = email
    this.cart = [] as string[]
  }
  login = login
  logout = logout
  notify = notify
  deleteUser = deleteUser
  addProduct = addProduct
  addToCart = addToCart
  checkout = checkout
  reviewProduct = reviewProduct
  applyDiscount = applyDiscount
}






