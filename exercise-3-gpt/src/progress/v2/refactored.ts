interface OrderProperty {
  id: string,
  total: number,
}

interface OrderBehaviour {
  calculateTotal(): number,
  checkout(): void,
  ship?(): void,
  download?(): void,
}

class Order implements OrderProperty {
  public total: number

  constructor(public id: string) {
    this.total = 0
  }

  makePhysical = () => this.total = 100
  makeDigital = () => this.total = 50
  applyDiscount = () => this.total *= 0.9
  applyTax = () => this.total *= 1.1
  applyExpress = () => this.total += 20
  applyLogger = () => this.checkout = () => {
    console.log("Audit log start");
    console.log(`Checking out order ${this.id}`);
  }

  checkout() {
    console.log(`Checking out order ${this.id}`);
  }

  ship = () => console.log("Shipping physical order")
  download = () => console.log("Downloading digital item");
}

export class PhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makePhysical()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class DigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makeDigital()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout();
  download = () => this.order.download();
}

export class DiscountedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makePhysical()
    this.order.applyDiscount()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class TaxedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makePhysical()
    this.order.applyTax()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class DiscountedTaxedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makePhysical()
    this.order.applyTax()
    this.order.applyDiscount()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class DiscountedDigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makeDigital()
    this.order.applyDiscount()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout();
  download = () => this.order.download();
}

export class LoggedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makePhysical()
    this.order.applyLogger()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class LoggedDiscountedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makePhysical()
    this.order.applyDiscount()
    this.order.applyLogger()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class LoggedDigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makeDigital()
    this.order.applyLogger()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class ExpressPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makePhysical()
    this.order.applyExpress()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

export class ExpressDiscountedPhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
    this.order.makePhysical()
    this.order.applyDiscount()
    this.order.applyExpress()
  }
  calculateTotal = () => this.order.total
  checkout = () => this.order.checkout()
  ship = () => this.order.ship()
}

