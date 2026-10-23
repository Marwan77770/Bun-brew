import { CustomizationState, CartItem } from '../types';

export const BASE_SPANISH_LATTE_PRICE = 5.50;

export interface PriceBreakdown {
  basePrice: number;
  sizeDelta: number;
  shotsDelta: number;
  milkDelta: number;
  addonsDelta: number;
  unitPrice: number;
  totalPrice: number;
}

export function calculateCustomizationPrice(basePrice: number, custom: CustomizationState): PriceBreakdown {
  const sizeDelta = custom.size === 'medium' ? 0.75 : custom.size === 'large' ? 1.50 : 0.00;
  const shotsDelta = custom.shots === '3' ? 0.80 : 0.00;
  const milkDelta = custom.milk === 'oat' || custom.milk === 'almond' ? 0.70 : custom.milk === 'lactose-free' ? 0.50 : 0.00;

  let addonsDelta = 0;
  if (custom.addons.vanillaSyrup) addonsDelta += 0.60;
  if (custom.addons.caramelSyrup) addonsDelta += 0.60;
  if (custom.addons.whippedCream) addonsDelta += 0.50;
  if (custom.addons.caramelDrizzle) addonsDelta += 0.40;

  const unitPrice = parseFloat((basePrice + sizeDelta + shotsDelta + milkDelta + addonsDelta).toFixed(2));
  const totalPrice = parseFloat((unitPrice * custom.quantity).toFixed(2));

  return {
    basePrice,
    sizeDelta,
    shotsDelta,
    milkDelta,
    addonsDelta,
    unitPrice,
    totalPrice
  };
}

export interface CartCalculation {
  subtotal: number;
  discount: number;
  ecoFee: number;
  tax: number;
  total: number;
  itemCount: number;
}

export function calculateCartTotals(
  items: CartItem[],
  upsellCruffinAdded: boolean = false,
  promoDiscountRate: number = 0.20
): CartCalculation {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of items) {
    subtotal += item.totalPrice;
    itemCount += item.quantity;
  }

  if (upsellCruffinAdded) {
    subtotal += 2.50;
    itemCount += 1;
  }

  const discount = parseFloat((subtotal * promoDiscountRate).toFixed(2));
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const ecoFee = items.length > 0 ? 0.35 : 0;
  const tax = parseFloat((discountedSubtotal * 0.05).toFixed(2));
  const total = parseFloat((discountedSubtotal + ecoFee + tax).toFixed(2));

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount,
    ecoFee,
    tax,
    total,
    itemCount
  };
}
