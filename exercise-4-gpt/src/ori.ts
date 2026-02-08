type Order = {
  id: string;
  items: { name: string; price: number }[];
  userType: "guest" | "member" | "vip";
  coupon?: string;
  paymentMethod: "card" | "paypal" | "crypto";
};

export function processOrder(
  order: Order,
  inventory: Record<string, number>,
  now: Date
) {
  let total = 0;
  let discount = 0;
  let tax = 0;
  let shipping = 0;

  console.log("Start order:", order.id);

  // price calculation
  for (const item of order.items) {
    if (!inventory[item.name] || inventory[item.name] <= 0) {
      throw new Error("Out of stock: " + item.name);
    }
    total += item.price;
  }

  // discounts
  if (order.userType === "member") {
    discount += total * 0.05;
  }

  if (order.userType === "vip") {
    discount += total * 0.1;
  }

  if (order.coupon === "NEWYEAR" && now.getMonth() === 0) {
    discount += 20;
  }

  // shipping
  if (total - discount > 100) {
    shipping = 0;
  } else {
    shipping = 10;
  }

  // tax
  if (order.paymentMethod !== "crypto") {
    tax = (total - discount) * 0.1;
  }

  const finalAmount = total - discount + tax + shipping;

  // payment
  if (order.paymentMethod === "card") {
    console.log("Charging credit card:", finalAmount);
  } else if (order.paymentMethod === "paypal") {
    console.log("Redirecting to PayPal:", finalAmount);
  } else {
    console.log("Processing crypto payment:", finalAmount);
  }

  // inventory update
  for (const item of order.items) {
    inventory[item.name] -= 1;
  }

  // notification
  if (order.userType !== "guest") {
    console.log("Sending confirmation email to user");
  }

  console.log("Order complete:", order.id);

  return finalAmount;
}
