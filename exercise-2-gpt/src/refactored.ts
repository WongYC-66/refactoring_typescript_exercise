interface UserProperty {
  name: string;
  email: string;
}

interface UserBehaviour {
  login(): void;
  logout(): void;
  notify(message: string): void;
}

class UserService {
  constructor(private user: UserProperty) { }
  login() {
    console.log(`${this.user.name} logged in`);
  }

  logout() {
    console.log(`${this.user.name} logged out`);
  }

  notify(message: string) {
    console.log(`Sending email to ${this.user.email}: ${message}`);
  }
}

class AdminService {
  constructor(private user: UserProperty) { }
  deleteUser(user: User) {
    console.log(`${this.user.name} deleted user ${user.name}`);
  }

  addProduct(productName: string) {
    console.log(`${this.user.name} added product ${productName}`);
  }
}

class CustomerService {
  constructor(private user: UserProperty, public cart: string[]) { }
  addToCart(product: string) {
    this.cart.push(product);
    console.log(`${this.user.name} added ${product} to cart`);
  }

  checkout() {
    console.log(`${this.user.name} checked out: ${this.cart.join(", ")}`);
    this.cart = [];
  }

  reviewProduct(product: string, review: string) {
    console.log(`${this.user.name} reviewed ${product}: ${review}`);
  }
}

class PremiumCustomerService {
  constructor(private user: UserProperty) { }
  applyDiscount(percent: number) {
    console.log(`${this.user.name} applied discount of ${percent}%`);
  }
}

export class User implements UserProperty, UserBehaviour {
  public userService: UserService;
  public admin?: AdminService;
  public customer?: CustomerService;
  public premium?: PremiumCustomerService;

  constructor(public name: string, public email: string) {
    this.userService = new UserService(this)
  }

  enableAdmin(): void {
    this.admin = new AdminService(this)
  }

  enableCustomer(): void {
    this.customer = new CustomerService(this, [])
  }

  enablePremium(): void {
    this.premium = new PremiumCustomerService(this)
  }

  login = () => this.userService.login()
  logout = () => this.userService.logout()
  notify = (message: string) => this.userService.notify(message)
}

