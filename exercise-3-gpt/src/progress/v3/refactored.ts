interface OrderProperty {
  id: string,
}

interface OrderBehaviour {
  calculateTotal(): number,
  checkout(): void,
  ship?(): void,
  download?(): void,
}

class PricingStrategy {
  private price: number;
  constructor(isPhysical: boolean, hasDiscount: boolean, hasTax: boolean, hasExpress: boolean) {
    this.price = isPhysical ? 100 : 50;
    if (hasTax) this.price *= 1.1
    if (hasDiscount) this.price *= 0.9
    if (hasExpress) this.price += 20
  }
  getPrice = () => this.price
}

class CheckoutStrategy {
  constructor(private hasLogger: boolean, private id: string) { }
  checkout = () => {
    if (this.hasLogger) console.log("Audit log start");
    console.log(`Checking out order ${this.id}`);
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
    const pricingStrategy = new PricingStrategy(true, false, false, false)
    const checkoutStrategy = new CheckoutStrategy(false, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class DigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(false, false, false, false)
    const checkoutStrategy = new CheckoutStrategy(false, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout();
  download = () => this.order.download();
}

export class DiscountedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(true, true, false, false)
    const checkoutStrategy = new CheckoutStrategy(false, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class TaxedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(true, false, true, false)
    const checkoutStrategy = new CheckoutStrategy(false, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class DiscountedTaxedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(true, true, true, false)
    const checkoutStrategy = new CheckoutStrategy(false, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class DiscountedDigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(false, true, false, false)
    const checkoutStrategy = new CheckoutStrategy(false, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout();
  download = () => this.order.download();
}

export class LoggedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(true, false, false, false)
    const checkoutStrategy = new CheckoutStrategy(true, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal();
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class LoggedDiscountedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(true, true, false, false)
    const checkoutStrategy = new CheckoutStrategy(true, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class LoggedDigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(false, false, false, false)
    const checkoutStrategy = new CheckoutStrategy(true, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal()
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class ExpressPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(true, false, false, true)
    const checkoutStrategy = new CheckoutStrategy(false, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal();
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class ExpressDiscountedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    const pricingStrategy = new PricingStrategy(true, true, false, true)
    const checkoutStrategy = new CheckoutStrategy(false, id)
    this.order = new Order(id, pricingStrategy, checkoutStrategy)
  }
  calculateTotal = () => this.order.calculateTotal();
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

