interface Item {
  name: string,
  price: number
}

type UserType = "guest" | "member" | "vip";
type PaymentMethod = "card" | "paypal" | "crypto";
type Inventory = Record<string, number>

interface Cache {
  total?: number
  discount?: number
}

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
  discountRate: Record<string, number>
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
  private cache: Cache = {};
  constructor(private params: CalculatorParams) { }
  getTotal = (): number => {
    if (this.cache.total) return this.cache.total
    return this.cache.total = this.params.items.reduce((s, x) => s + x.price, 0)
  }
  getDiscount = (): number => {
    if (this.cache.discount) return this.cache.discount
    let discount = 0
    let total = this.getTotal()
    let discountRate = this.params.discountRate[this.params.userType] ?? 0
    discount += total * discountRate
    if (this.params?.coupon === "NEWYEAR" && this.params.now.getMonth() === 0) {
      discount += 20;
    }
    return this.cache.discount = discount
  }
  getShipping = () => {
    let total = this.getTotal()
    let discount = this.getDiscount()
    return total - discount > 100 ? 0 : 10
  }
  getTax = () => {
    let total = this.getTotal()
    let discount = this.getDiscount()
    if (this.params.paymentMethod !== "crypto") {
      return (total - discount) * 0.1;
    }
    return 0
  }
  getFinalPrice() {
    return this.getTotal() - this.getDiscount() + this.getTax() + this.getShipping();
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
    discountRate: {
      "vip": 0.1,
      "member": 0.05,
    }
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
