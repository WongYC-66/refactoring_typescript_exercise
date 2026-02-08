interface OrderProperty {
  id: string,
}

interface OrderBehaviour {
  calculateTotal(): number,
  checkout(): void,
  ship?(): void,
  download?(): void,
}

class Order implements OrderProperty {
  constructor(public id: string) { }
  checkout() {
    console.log(`Checking out order ${this.id}`);
  }
}

export class PhysicalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
  }
  calculateTotal = () => 100
  checkout = () => this.order.checkout();
  ship = () => console.log("Shipping physical order")
}

export class DigitalOrder implements OrderBehaviour {
  private order: Order
  constructor(id: string) {
    this.order = new Order(id)
  }
  calculateTotal = () => 50
  checkout = () => this.order.checkout();
  download = () => console.log("Downloading digital item");
}

export class DiscountedPhysicalOrder implements OrderBehaviour {
  private physicalOrder: PhysicalOrder
  constructor(id: string) {
    this.physicalOrder = new PhysicalOrder(id)
  }
  calculateTotal = () => this.physicalOrder.calculateTotal() * 0.9
  checkout = () => this.physicalOrder.checkout();
  ship = () => this.physicalOrder.ship();
}

export class TaxedPhysicalOrder implements OrderBehaviour {
  private physicalOrder: PhysicalOrder
  constructor(id: string) {
    this.physicalOrder = new PhysicalOrder(id)
  }
  calculateTotal = () => this.physicalOrder.calculateTotal() * 1.1
  checkout = () => this.physicalOrder.checkout();
  ship = () => this.physicalOrder.ship();
}

export class DiscountedTaxedPhysicalOrder implements OrderBehaviour {
  private taxedPhysicalOrder: TaxedPhysicalOrder
  constructor(id: string) {
    this.taxedPhysicalOrder = new TaxedPhysicalOrder(id)
  }
  calculateTotal = () => this.taxedPhysicalOrder.calculateTotal() * 0.9
  checkout = () => this.taxedPhysicalOrder.checkout();
  ship = () => this.taxedPhysicalOrder.ship();
}

export class DiscountedDigitalOrder implements OrderBehaviour {
  private digitalOrder: DigitalOrder
  constructor(id: string) {
    this.digitalOrder = new DigitalOrder(id)
  }
  calculateTotal = () => this.digitalOrder.calculateTotal() * 0.9
  checkout = () => this.digitalOrder.checkout();
}

export class LoggedPhysicalOrder implements OrderBehaviour {
  private physicalOrder: PhysicalOrder
  constructor(id: string) {
    this.physicalOrder = new PhysicalOrder(id)
  }
  calculateTotal = () => this.physicalOrder.calculateTotal()
  checkout = () => {
    console.log("Audit log start");
    this.physicalOrder.checkout();
  }
  ship = () => this.physicalOrder.ship();
}

export class LoggedDiscountedPhysicalOrder implements OrderBehaviour {
  private discountedPhysicalOrder: DiscountedPhysicalOrder
  constructor(id: string) {
    this.discountedPhysicalOrder = new DiscountedPhysicalOrder(id)
  }
  calculateTotal = () => this.discountedPhysicalOrder.calculateTotal()
  checkout = () => {
    console.log("Audit log start");
    this.discountedPhysicalOrder.checkout();
  }
  ship = () => this.discountedPhysicalOrder.ship();
}

export class LoggedDigitalOrder implements OrderBehaviour {
  private digitalOrder: DigitalOrder
  constructor(id: string) {
    this.digitalOrder = new DigitalOrder(id)
  }
  calculateTotal = () => this.digitalOrder.calculateTotal()
  checkout = () => {
    console.log("Audit log start");
    this.digitalOrder.checkout();
  }
  download = () => this.digitalOrder.download()
}

export class ExpressPhysicalOrder implements OrderBehaviour {
  private physicalOrder: PhysicalOrder
  constructor(id: string) {
    this.physicalOrder = new PhysicalOrder(id)
  }
  calculateTotal = () => this.physicalOrder.calculateTotal() + 20
  checkout = () => this.physicalOrder.checkout()
  ship = () => this.physicalOrder.ship();
}

export class ExpressDiscountedPhysicalOrder implements OrderBehaviour {
  private discountedPhysicalOrder: DiscountedPhysicalOrder
  constructor(id: string) {
    this.discountedPhysicalOrder = new DiscountedPhysicalOrder(id)
  }
  calculateTotal = () => this.discountedPhysicalOrder.calculateTotal() + 20
  checkout = () => this.discountedPhysicalOrder.checkout()
  ship = () => this.discountedPhysicalOrder.ship();
}

