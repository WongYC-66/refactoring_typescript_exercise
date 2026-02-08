interface OrderProperty {
  id: string,
}

interface OrderBehaviour {
  calculateTotal(): number,
  checkout(): void,
  ship?(): void,
  download?(): void,
}

interface PricingOptions {
  type: 'physical' | 'digital',
  discount?: boolean,
  tax?: boolean,
  express?: boolean,
}

interface CheckOutParams {
  id: string,
  logger?: boolean,
}

class PricingStrategy {
  private price: number;
  constructor(options: PricingOptions) {
    this.price = options.type === 'physical' ? 100 : 50;
    if (options.tax) this.price *= 1.1
    if (options.discount) this.price *= 0.9
    if (options.express) this.price += 20
  }
  getPrice = () => this.price
}

class CheckoutStrategy {
  constructor(private params: CheckOutParams) { }
  checkout = () => {
    if (this.params.logger) console.log("Audit log start");
    console.log(`Checking out order ${this.params.id}`);
  }
}

class OrderFactory {
  static create(id: string, pricingOptions: PricingOptions, checkOutParams: CheckOutParams) {
    const pricingStrategy = new PricingStrategy(pricingOptions)
    const checkoutStrategy = new CheckoutStrategy(checkOutParams)
    return new Order(id, pricingStrategy, checkoutStrategy)
  }
}

class Order implements OrderProperty {
  constructor(public id: string, private pricingStrategy: PricingStrategy, private checkoutStrategy: CheckoutStrategy) { }
  calculateTotal = () => this.pricingStrategy.getPrice()
  checkout = () => this.checkoutStrategy.checkout()
  ship = () => console.log("Shipping physical order")
  download = () => console.log("Downloading digital item");
}

export class PhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'physical'
    }
    const checkOutParams: CheckOutParams = { id }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class DigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'digital'
    }
    const checkOutParams: CheckOutParams = { id }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout();
  download = () => this.order.download();
}

export class DiscountedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'physical',
      discount: true
    }
    const checkOutParams: CheckOutParams = { id }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class TaxedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'physical',
      tax: true
    }
    const checkOutParams: CheckOutParams = { id }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class DiscountedTaxedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'physical',
      tax: true,
      discount: true,
    }
    const checkOutParams: CheckOutParams = { id }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class DiscountedDigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'digital',
      discount: true
    }
    const checkOutParams: CheckOutParams = { id }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout();
  download = () => this.order.download();
}

export class LoggedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'physical',
    }
    const checkOutParams: CheckOutParams = { id, logger: true }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal();
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class LoggedDiscountedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'physical',
      discount: true,
    }
    const checkOutParams: CheckOutParams = { id, logger: true }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class LoggedDigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'digital',
    }
    const checkOutParams: CheckOutParams = { id, logger: true }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class ExpressPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'physical',
      express: true,
    }
    const checkOutParams: CheckOutParams = { id }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal();
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class ExpressDiscountedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingOptions: PricingOptions = {
      type: 'physical',
      discount: true,
      express: true,
    }
    const checkOutParams: CheckOutParams = { id }
    this.order = OrderFactory.create(id, pricingOptions, checkOutParams)
  }
  calculateTotal = () => this.order.calculateTotal();
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

