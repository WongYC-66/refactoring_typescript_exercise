export interface UserProperty {
  name: string;
  email: string;
}

export interface CustermerProperty extends UserProperty {
  cart: string[]
}

interface UserBehaviour {
  login(): void;
  logout(): void;
  notify(message: string): void;
}

interface AdminBehaviour {
  deleteUser(user: User): void;
  addProduct(productName: string): void;
}

interface CustomerBehaviour {
  addToCart(prodouct: string): void;
  checkout(): void;
  reviewProduct(product: string, review: string): void;
}

interface PremiumCustomerBehaviour {
  applyDiscount(percent: number): void;
}

class UserService implements UserBehaviour {
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

class AdminService implements AdminBehaviour {
  constructor(private user: UserProperty) { }
  deleteUser(user: User) {
    console.log(`${this.user.name} deleted user ${user.name}`);
  }

  addProduct(productName: string) {
    console.log(`${this.user.name} added product ${productName}`);
  }
}

class CustomerService implements CustomerBehaviour {
  constructor(private user: CustermerProperty) { }
  addToCart(product: string) {
    this.user.cart.push(product);
    console.log(`${this.user.name} added ${product} to cart`);
  }

  checkout() {
    console.log(`${this.user.name} checked out: ${this.user.cart.join(", ")}`);
    this.user.cart = [];
  }

  reviewProduct(product: string, review: string) {
    console.log(`${this.user.name} reviewed ${product}: ${review}`);
  }
}

class PremiumCustomerService implements PremiumCustomerBehaviour {
  constructor(private user: CustermerProperty) { }
  applyDiscount(percent: number) {
    console.log(`${this.user.name} applied discount of ${percent}%`);
  }
}

export class User implements UserProperty, UserBehaviour {
  private userService: UserService;

  constructor(public name: string, public email: string) {
    this.userService = new UserService(this)
  }

  login = () => this.userService.login()
  logout = () => this.userService.logout()
  notify = (message: string) => this.userService.notify(message)
}

export class AdminUser implements UserProperty, UserBehaviour, AdminBehaviour {
  private userService: UserService;
  private adminService: AdminService;

  constructor(public name: string, public email: string) {
    this.userService = new UserService(this)
    this.adminService = new AdminService(this)
  }

  login = () => this.userService.login()
  logout = () => this.userService.logout()
  notify = (message: string) => this.userService.notify(message)
  deleteUser = (user: User) => this.adminService.deleteUser(user);
  addProduct = (productName: string) => this.adminService.addProduct(productName);
}

export class CustomerUser implements CustermerProperty, UserBehaviour, CustomerBehaviour {
  private userService: UserService;
  private customerService: CustomerService
  cart: string[]

  constructor(public name: string, public email: string) {
    this.userService = new UserService(this)
    this.customerService = new CustomerService(this)
    this.cart = []
  }

  login = () => this.userService.login()
  logout = () => this.userService.logout()
  notify = (message: string) => this.userService.notify(message)
  addToCart = (product: string) => this.customerService.addToCart(product)
  checkout = () => this.customerService.checkout()
  reviewProduct = (product: string, review: string) => this.customerService.reviewProduct(product, review)
}

export class PremiumCustomer implements CustermerProperty, UserBehaviour, CustomerBehaviour, PremiumCustomerBehaviour {
  private userService: UserService;
  private customerService: CustomerService
  private previumCustomerSerivce: PremiumCustomerService;
  cart: string[];

  constructor(public name: string, public email: string) {
    this.userService = new UserService(this)
    this.customerService = new CustomerService(this)
    this.previumCustomerSerivce = new PremiumCustomerService(this)
    this.cart = []
  }

  login = () => this.userService.login()
  logout = () => this.userService.logout()
  notify = (message: string) => this.userService.notify(message)
  addToCart = (product: string) => this.customerService.addToCart(product)
  checkout = () => this.customerService.checkout()
  reviewProduct = (product: string, review: string) => this.customerService.reviewProduct(product, review)
  applyDiscount = (percent: number) => this.previumCustomerSerivce.applyDiscount(percent)
}




