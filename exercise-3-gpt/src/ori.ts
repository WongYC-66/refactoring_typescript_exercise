// ================================
// DO NOT REFACTOR YET
// Write tests first.
// ================================

abstract class Order {
  constructor(public id: string) {}

  abstract calculateTotal(): number;

  checkout() {
    console.log(`Checking out order ${this.id}`);
  }
}

// ================================
// Base order types
// ================================

export class PhysicalOrder extends Order {
  calculateTotal(): number {
    return 100;
  }

  ship() {
    console.log("Shipping physical order");
  }
}

export class DigitalOrder extends Order {
  calculateTotal(): number {
    return 50;
  }

  download() {
    console.log("Downloading digital item");
  }
}

// ================================
// Discounts & taxes (inheritance abuse)
// ================================

export class DiscountedPhysicalOrder extends PhysicalOrder {
  calculateTotal(): number {
    return super.calculateTotal() * 0.9;
  }
}

export class TaxedPhysicalOrder extends PhysicalOrder {
  calculateTotal(): number {
    return super.calculateTotal() * 1.1;
  }
}

export class DiscountedTaxedPhysicalOrder extends TaxedPhysicalOrder {
  calculateTotal(): number {
    return super.calculateTotal() * 0.9;
  }
}

export class DiscountedDigitalOrder extends DigitalOrder {
  calculateTotal(): number {
    return super.calculateTotal() * 0.9;
  }
}

// ================================
// Logging variants
// ================================

export class LoggedPhysicalOrder extends PhysicalOrder {
  checkout() {
    console.log("Audit log start");
    super.checkout();
  }
}

export class LoggedDiscountedPhysicalOrder extends DiscountedPhysicalOrder {
  checkout() {
    console.log("Audit log start");
    super.checkout();
  }
}

export class LoggedDigitalOrder extends DigitalOrder {
  checkout() {
    console.log("Audit log start");
    super.checkout();
  }
}

// ================================
// Shipping variants
// ================================

export class ExpressPhysicalOrder extends PhysicalOrder {
  calculateTotal(): number {
    return super.calculateTotal() + 20;
  }
}

export class ExpressDiscountedPhysicalOrder extends DiscountedPhysicalOrder {
  calculateTotal(): number {
    return super.calculateTotal() + 20;
  }
}
