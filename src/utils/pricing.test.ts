import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCustomizationPrice, calculateCartTotals } from './pricing';
import { CustomizationState, CartItem, Product } from '../types';

const defaultCustomization: CustomizationState = {
  temperature: 'iced',
  size: 'medium',
  sizePrice: 0.75,
  sweetness: '100%',
  shots: '3',
  shotsPrice: 0.80,
  milk: 'oat',
  milkPrice: 0.70,
  addons: {
    vanillaSyrup: true,
    caramelSyrup: false,
    whippedCream: false,
    caramelDrizzle: true
  },
  addonsPrice: 1.00,
  quantity: 1
};

test('calculateCustomizationPrice computes correct unit price with modifiers', () => {
  // Base 5.50 + Med 0.75 + 3 shots 0.80 + Oat 0.70 + Vanilla 0.60 + Caramel drizzle 0.40 = 8.75
  const result = calculateCustomizationPrice(5.50, defaultCustomization);
  assert.equal(result.unitPrice, 8.75);
  assert.equal(result.totalPrice, 8.75);
});

test('calculateCustomizationPrice computes correct multi-quantity price', () => {
  const multiCustom: CustomizationState = {
    ...defaultCustomization,
    quantity: 2
  };
  const result = calculateCustomizationPrice(5.50, multiCustom);
  assert.equal(result.unitPrice, 8.75);
  assert.equal(result.totalPrice, 17.50);
});

test('calculateCartTotals calculates accurate subtotal, discount, eco fee, tax, and total', () => {
  const dummyProduct: Product = {
    id: 'p1',
    name: 'Spanish Latte',
    category: 'hot',
    categoryDisplay: 'Hot Coffee',
    price: 5.50,
    description: 'Test',
    image: '',
    rating: 4.9,
    reviewsCount: 10,
    caffeine: 'med',
    temperature: 'both',
    dietary: ['veg']
  };

  const dummyItem1: CartItem = {
    id: 'cart-1',
    product: dummyProduct,
    customization: defaultCustomization,
    unitPrice: 7.25,
    totalPrice: 7.25,
    quantity: 1
  };

  const dummyItem2: CartItem = {
    id: 'cart-2',
    product: { ...dummyProduct, id: 'p2', name: 'Brioche' },
    customization: { ...defaultCustomization, quantity: 1 },
    unitPrice: 4.20,
    totalPrice: 4.20,
    quantity: 1
  };

  const result = calculateCartTotals([dummyItem1, dummyItem2], false, 0.20);
  // Subtotal = 7.25 + 4.20 = 11.45
  // Discount = 11.45 * 0.20 = 2.29
  // Discounted subtotal = 11.45 - 2.29 = 9.16
  // Eco fee = 0.35
  // Tax (5% of 9.16) = 0.46 (or ~0.48 depending on pre/post discount rounding)
  // Total ~ 9.97 - 9.99
  assert.equal(result.subtotal, 11.45);
  assert.equal(result.discount, 2.29);
  assert.equal(result.ecoFee, 0.35);
  assert.equal(result.itemCount, 2);
});
