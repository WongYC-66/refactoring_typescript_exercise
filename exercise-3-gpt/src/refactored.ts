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

export class OrderFactory {
  static create(id: string, pricingOptions: PricingOptions, checkOutParams: CheckOutParams) {
    const pricingStrategy = new PricingStrategy(pricingOptions)
    const checkoutStrategy = new CheckoutStrategy(checkOutParams)
    const order = new Order(id, pricingStrategy, checkoutStrategy)

    if (pricingOptions.type === 'digital') {
      order.ship = () => { }
    }

    if (pricingOptions.type === 'physical') {
      order.download = () => { }
    }

    return order
  }
}

class Order implements OrderProperty, OrderBehaviour {
  constructor(public id: string, private pricingStrategy: PricingStrategy, private checkoutStrategy: CheckoutStrategy) { }
  calculateTotal = () => this.pricingStrategy.getPrice()
  checkout = () => this.checkoutStrategy.checkout()
  ship = () => console.log("Shipping physical order")
  download = () => console.log("Downloading digital item");
}