import React, { useState } from 'react';
import { CartItem } from '../types';
import { calculateCartTotals } from '../utils/pricing';
import { USER_AVATAR } from '../data/mockData';
import { BunBrewLogo } from './BunBrewLogo';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQty: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onEditItem?: (item: CartItem) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  onEditItem
}) => {
  const [upsellAdded, setUpsellAdded] = useState(false);
  const [promoCode] = useState('BREWSTUDENT20');

  const { subtotal, discount, ecoFee, tax, total, itemCount } = calculateCartTotals(
    cartItems,
    upsellAdded,
    0.20
  );

  return (
    <div className="flex flex-col w-full pb-36 max-w-lg mx-auto bg-surface min-h-screen">
      {/* Native Cart Stack Header */}
      <header className="fixed top-0 left-0 right-0 z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(59,36,28,0.05)] max-w-lg mx-auto">
        <div className="h-16 px-3 flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            <button
              onClick={onContinueShopping}
              aria-label="Go back"
              className="w-11 h-11 rounded-full flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-surface-container-low cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </button>
            <BunBrewLogo size={28} className="hidden sm:block mr-1" />
            <h1 className="text-lg font-bold text-primary truncate tracking-tight">Cart</h1>
          </div>
          <div className="flex items-center pr-1">
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src={USER_AVATAR} />
          </div>
        </div>
      </header>

      {/* Top spacing placeholder for fixed header */}
      <div className="h-16"></div>
      {/* Pickup Fulfillment Banner */}
      <div className="px-4 pt-3 pb-2">
        <div className="bg-surface-container flex items-center justify-between p-3 rounded-2xl shadow-xs border border-surface-container">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                Order Fulfillment
              </span>
              <p className="text-xs font-bold text-on-surface truncate">
                Pickup • Downtown Roastery
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold bg-surface-container-lowest text-primary px-3 py-1 rounded-full shadow-xs flex-shrink-0 border border-surface-container">
            10–15 mins
          </span>
        </div>
      </div>

      {/* Cart Header Subline & Counter */}
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-bold text-primary">Order Bag</h2>
          <span className="text-xs text-on-surface-variant font-semibold">
            ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">eco</span>
          <span className="text-xs">Compostable pack</span>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="px-4 flex flex-col gap-3">
        {cartItems.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-surface-container">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-secondary mx-auto mb-3">
              <span className="material-symbols-outlined text-[28px]">local_mall</span>
            </div>
            <h3 className="text-base font-bold text-primary">Your bag is empty</h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-4">
              Explore our freshly roasted menu or take the taste concierge.
            </p>
            <button
              onClick={onContinueShopping}
              className="px-5 h-10 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer active:scale-95 transition-all"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          cartItems.map((item) => (
            <article
              key={item.id}
              className="bg-surface-container-lowest rounded-2xl p-3 shadow-xs border border-surface-container transition-all"
            >
              <div className="flex gap-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low">
                  <img
                    className="w-full h-full object-cover"
                    alt={item.product.name}
                    src={item.product.image}
                  />
                  <span className="absolute top-1 left-1 bg-surface-container-lowest/90 backdrop-blur-xs text-[10px] font-bold text-secondary px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    {item.customization.temperature === 'iced' ? (
                      <>
                        <span className="material-symbols-outlined text-[11px] text-[#39765A]">ac_unit</span>
                        <span>Iced</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[11px] text-[#ba1a1a]">local_fire_department</span>
                        <span>Hot</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-primary leading-tight truncate">
                      {item.product.name}
                    </h3>
                    <span className="text-sm font-extrabold text-primary flex-shrink-0">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Micro Customizations Pills / List */}
                  <div className="mt-1 bg-surface-container-low rounded-xl p-2 text-on-surface-variant text-[11px] flex flex-col gap-0.5 border border-surface-container/60">
                    <div className="flex items-center justify-between">
                      <span>
                        {item.customization.size.toUpperCase()} (
                        {item.customization.size === 'small'
                          ? '8 oz'
                          : item.customization.size === 'medium'
                          ? '12 oz'
                          : '16 oz'}
                        ) • {item.customization.milk.toUpperCase()} MILK
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-secondary font-semibold">
                      <span>{item.customization.shots} Shots extracted</span>
                    </div>
                    <div className="truncate text-on-surface-variant/80">
                      Sweet ({item.customization.sweetness})
                      {item.customization.addons.vanillaSyrup && ' • Vanilla'}
                      {item.customization.addons.caramelDrizzle && ' • Caramel Drizzle'}
                    </div>
                  </div>

                  {/* Quantity Stepper & Actions */}
                  <div className="flex items-center justify-between mt-2.5 pt-1">
                    <div className="flex items-center bg-surface-container-low rounded-full px-1 py-0.5 border border-surface-container">
                      <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-primary active:scale-90 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, 1)}
                        aria-label="Increase quantity"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-primary active:scale-90 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {onEditItem && (
                        <button
                          onClick={() => onEditItem(item)}
                          className="text-xs font-bold text-secondary hover:text-primary active:scale-95 transition-all flex items-center gap-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">tune</span>
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Remove item"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error active:scale-90 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Upsell Snack Suggestion (Chef's Pair) */}
      <div className="px-4 mt-3">
        <div className="bg-surface-container-low rounded-2xl p-3 shadow-xs border border-surface-container flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt="Flaky spiral cinnamon cruffin"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfQKXNz7BnOfsBe-tQT88DCvxnyRc5n0tePHoQWA6R4p-z1--DPeo4A7hD1-Y0_5SMSafUUtJWQjp0PPhP7zY-CRRrh0lXA9VZItnAfq9CWkxpRKnTZgiqqCNRMn7-RC3JXlw8E9BGWMTtQxSMyQ88eXxYPdo-NPytdV2xHiPUVttXtjsDaCdmHbp8ej2HQ0psQExJwXUZCKm-iJ1zH-ml3-gkDCNyWhUd74SJ4T599sKEm1y-Ymdm"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-secondary-container text-on-secondary-container px-1.5 rounded-md">
                  Chef's Pair
                </span>
                <span className="text-xs font-bold text-primary truncate">
                  Cinnamon Cruffin
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant truncate mt-0.5">
                Pairs perfectly with Spanish Latte
              </span>
            </div>
          </div>
          <button
            onClick={() => setUpsellAdded(!upsellAdded)}
            className={`flex-shrink-0 h-9 px-3 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer ${
              upsellAdded
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-primary text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {upsellAdded ? 'check' : 'add'}
            </span>
            <span>{upsellAdded ? 'Added' : '$2.50'}</span>
          </button>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className="px-4 mt-3">
        <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-xs border border-surface-container flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center gap-2 bg-surface-container-low rounded-full px-3 py-2 border border-surface-container">
              <span className="material-symbols-outlined text-[20px] text-secondary flex-shrink-0">
                loyalty
              </span>
              <input
                className="bg-transparent text-xs font-bold text-primary tracking-wider uppercase flex-1 outline-none"
                readOnly
                type="text"
                value={promoCode}
              />
              <span className="material-symbols-outlined text-[18px] text-[#39765A]">
                check_circle
              </span>
            </div>
            <button className="text-xs font-bold text-secondary px-2 hover:text-primary active:scale-95 cursor-pointer">
              Change
            </button>
          </div>

          <div className="bg-surface-container-low text-[#39765A] rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium border border-surface-container">
            <span className="material-symbols-outlined text-[18px] flex-shrink-0">celebration</span>
            <span className="flex-1">Promo applied: 20% Student &amp; Campus discount (-${discount.toFixed(2)})</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Receipt Card */}
      <div className="px-4 mt-3">
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>Subtotal ({itemCount} items)</span>
            <span className="text-primary font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-[#39765A] font-medium">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
              <span>Promo ({promoCode})</span>
            </div>
            <span className="font-bold">-${discount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span>Eco-Packaging &amp; Cup Fee</span>
              <span className="material-symbols-outlined text-[14px] text-outline">help_outline</span>
            </div>
            <span className="text-primary font-semibold">${ecoFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>Taxes (Est. 5%)</span>
            <span className="text-primary font-semibold">${tax.toFixed(2)}</span>
          </div>

          <div className="py-1 flex items-center justify-between opacity-30">
            <div className="w-full h-[1px] bg-outline"></div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-base font-bold text-primary">Total</span>
              <span className="block text-[11px] text-on-surface-variant">
                Includes all taxes and barista tip
              </span>
            </div>
            <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tactile Cafe Note */}
      <div className="px-4 mt-3 text-center">
        <p className="text-xs text-on-surface-variant flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-secondary">coffee</span>
          Crafted with whole single-origin beans roasted on-site today.
        </p>
      </div>

      {/* Sticky Bottom Checkout Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(59,36,28,0.08)] pb-safe pt-2 px-4 max-w-lg mx-auto border-t border-surface-container">
        <div className="flex flex-col gap-1.5 pb-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant font-medium">Estimated Total</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-primary">${total.toFixed(2)}</span>
                <span className="text-xs text-secondary font-semibold">pickup</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px] text-[#39765A]">
                verified_user
              </span>
              <span>100% Organic</span>
            </div>
          </div>

          <button
            onClick={onProceedToCheckout}
            disabled={cartItems.length === 0}
            className="w-full h-[52px] bg-primary text-on-primary rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform cursor-pointer hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            <span>Proceed to Checkout</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>

          <button
            onClick={onContinueShopping}
            className="w-full py-1 text-center text-xs font-bold text-secondary hover:text-primary active:opacity-75 transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
