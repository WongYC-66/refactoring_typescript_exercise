interface Item {
  name: string,
  price: number
}

type UserType = "guest" | "member" | "vip";
type PaymentMethod = "card" | "paypal" | "crypto";
type Inventory = Record<string, number>

interface Order {
  id: string;
  items: Item[];
  userType: UserType;
  coupon?: string;
  paymentMethod: PaymentMethod
};

interface CalculatorParams {
  items: Item[]
  userType: UserType
  coupon?: string
  now: Date
  paymentMethod: PaymentMethod
}


class InventoryService {
  constructor(private items: Item[], private inventory: Inventory) { }
  validateHasStock = () => {
    for (const item of this.items) {
      if (!this.inventory[item.name] || this.inventory[item.name] <= 0) {
        throw new Error("Out of stock: " + item.name);
      }
    }
  }
  updateInventory = () => {
    console.log(this.items)
    for (const item of this.items) {
      this.inventory[item.name] -= 1;
    }
    console.log(this.items)
  }
}

class PriceCalculator {
  private total: number = 0;
  private discount: number = 0;
  private shipping: number = 0;
  private tax: number = 0;
  constructor(private params: CalculatorParams) { }

  getTotal = () => this.total = this.params.items.reduce((s, x) => s + x.price, 0)
  getDiscount = () => {
    switch (this.params.userType) {
      case "vip":
        this.discount += this.total * 0.1;
        break
      case "member":
        this.discount += this.total * 0.05;
        break
      default:
        break
    }
    if (this.params?.coupon === "NEWYEAR" && this.params.now.getMonth() === 0) {
      this.discount += 20;
    }
  }
  getShipping = () => {
    if (this.total - this.discount > 100) {
      this.shipping = 0;
    } else {
      this.shipping = 10;
    }
  }
  getTax = () => {
    if (this.params.paymentMethod !== "crypto") {
      this.tax = (this.total - this.discount) * 0.1;
    }
  }
  getFinalPrice() {
    this.getTotal()
    this.getDiscount()
    this.getShipping()
    this.getTax()
    return this.total - this.discount + this.tax + this.shipping;
  }
}

class PaymentService {
  constructor(private paymentMethod: PaymentMethod) { }
  pay = (finalAmount: number) => {
    switch (this.paymentMethod) {
      case "card":
        console.log("Charging credit card:", finalAmount);
        break
      case "paypal":
        console.log("Redirecting to PayPal:", finalAmount);
        break
      default:
        console.log("Processing crypto payment:", finalAmount);
    }
  }
}

class NotificationService {
  constructor(private userType: UserType) { }
  notify = () => {
    if (this.userType !== "guest") {
      console.log("Sending confirmation email to user");
    }
  }
}

export function processOrder(order: Order, inventory: Inventory, now: Date) {
  const calculatorService = new PriceCalculator({
    items: order.items,
    userType: order.userType,
    coupon: order.coupon,
    now,
    paymentMethod: order.paymentMethod,
  })
  const inventoryService = new InventoryService(order.items, inventory)
  const paymentService = new PaymentService(order.paymentMethod)
  const notifyService = new NotificationService(order.userType)
  console.log("Start order:", order.id);
  inventoryService.validateHasStock()
  const finalAmount = calculatorService.getFinalPrice()
  paymentService.pay(finalAmount)
  inventoryService.updateInventory()
  notifyService.notify()
  console.log("Order complete:", order.id);
  return finalAmount;
}
