import React, { useState, useMemo } from 'react';
import { Product, CustomizationState, CartItem } from '../types';
import { calculateCustomizationPrice } from '../utils/pricing';

interface ProductDetailsScreenProps {
  product: Product;
  onBack: () => void;
  onAddToCartCustomized: (item: CartItem) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShowToast: (msg: string) => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  product,
  onBack,
  onAddToCartCustomized,
  isFavorite,
  onToggleFavorite,
  onShowToast
}) => {
  const [temperature, setTemperature] = useState<'hot' | 'iced'>('iced');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [sweetness, setSweetness] = useState<'0%' | '50%' | '100%' | '120%'>('100%');
  const [shots, setShots] = useState<'2' | '3' | 'decaf'>('3');
  const [milk, setMilk] = useState<'whole' | 'skimmed' | 'oat' | 'almond' | 'lactose-free'>('oat');
  const [addons, setAddons] = useState({
    vanillaSyrup: true,
    caramelSyrup: false,
    whippedCream: false,
    caramelDrizzle: true,
  });
  const [quantity, setQuantity] = useState(1);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const customState: CustomizationState = useMemo(() => {
    const sizePrice = size === 'medium' ? 0.75 : size === 'large' ? 1.50 : 0;
    const shotsPrice = shots === '3' ? 0.80 : 0;
    const milkPrice = milk === 'oat' || milk === 'almond' ? 0.70 : milk === 'lactose-free' ? 0.50 : 0;
    let addonsPrice = 0;
    if (addons.vanillaSyrup) addonsPrice += 0.60;
    if (addons.caramelSyrup) addonsPrice += 0.60;
    if (addons.whippedCream) addonsPrice += 0.50;
    if (addons.caramelDrizzle) addonsPrice += 0.40;

    return {
      temperature,
      size,
      sizePrice,
      sweetness,
      shots,
      shotsPrice,
      milk,
      milkPrice,
      addons,
      addonsPrice,
      quantity
    };
  }, [temperature, size, sweetness, shots, milk, addons, quantity]);

  const priceCalc = useMemo(() => {
    return calculateCustomizationPrice(product.price, customState);
  }, [product.price, customState]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} - BUN & BREW`,
        text: `Handcrafted ${product.name} at BUN & BREW Artisanal Roastery.`
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      onShowToast('Product link copied to clipboard!');
    }
  };

  const handleAdd = () => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      customization: customState,
      unitPrice: priceCalc.unitPrice,
      totalPrice: priceCalc.totalPrice,
      quantity
    };
    onAddToCartCustomized(cartItem);
    onShowToast(`Added ${quantity}x ${product.name} to order!`);
  };

  return (
    <div className="flex flex-col w-full pb-36 max-w-lg mx-auto bg-surface">
      {/* Top Utility Context Bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-surface-container text-primary active:scale-95 transition-all text-xs font-bold cursor-pointer hover:bg-surface-container-high"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          <span>Back to Menu</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            aria-label="Save to favorites"
            className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-90 transition-all cursor-pointer hover:bg-surface-container-high"
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                isFavorite ? 'text-error' : 'text-primary'
              }`}
              style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              favorite
            </span>
          </button>
          <button
            onClick={handleShare}
            aria-label="Share product"
            className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-90 transition-all cursor-pointer hover:bg-surface-container-high"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">ios_share</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Display */}
      <div className="px-4 pt-1">
        <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container-high shadow-md">
          <div className="relative h-72 w-full">
            <img
              className="w-full h-full object-cover"
              alt={product.name}
              src={product.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
            
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary text-[11px] font-bold shadow-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                BUN &amp; BREW Signature
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-on-primary text-[11px] font-bold shadow-xs">
                Best Seller
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/30 backdrop-blur-md text-on-primary text-[11px] font-medium">
                Single Origin Arabica
              </span>
              <div className="flex items-center gap-1 bg-surface-container-lowest/30 backdrop-blur-md px-2.5 py-1 rounded-full text-on-primary text-[11px] font-bold">
                <span
                  className="material-symbols-outlined text-[15px] text-tertiary-fixed-dim"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span>{product.rating} ({product.reviewsCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Header & Narrative */}
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-primary tracking-tight">{product.name}</h2>
            <p className="text-xs font-semibold text-secondary mt-0.5">
              Espresso • Sweetened Milk • Madagascar Cream
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">
              ${priceCalc.unitPrice.toFixed(2)}
            </span>
            <span className="block text-[11px] text-on-surface-variant font-medium">
              Base from ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
          {product.description}
        </p>

        {/* Meta Attribute Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3.5">
          <div className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-surface-container text-center">
            <span className="material-symbols-outlined text-[20px] text-secondary">schedule</span>
            <span className="text-xs font-bold text-primary mt-0.5">4-6 mins</span>
            <span className="text-[10px] text-on-surface-variant">Prep Time</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-surface-container text-center">
            <span className="material-symbols-outlined text-[20px] text-secondary">bolt</span>
            <span className="text-xs font-bold text-primary mt-0.5">Med-High</span>
            <span className="text-[10px] text-on-surface-variant">Caffeine (~180mg)</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-surface-container text-center">
            <span className="material-symbols-outlined text-[20px] text-secondary">eco</span>
            <span className="text-xs font-bold text-primary mt-0.5">Craft Roast</span>
            <span className="text-[10px] text-on-surface-variant">Sumatra &amp; Huila</span>
          </div>
        </div>
      </div>

      {/* Customization Controls */}
      <div className="px-4 pt-5 flex flex-col gap-5">
        {/* 1. Temperature */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">Temperature</span>
            <span className="text-xs text-secondary font-semibold">
              {temperature === 'iced' ? 'Iced (Clear Ice)' : 'Hot (Ceramic Cup)'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-container">
            <button
              type="button"
              onClick={() => setTemperature('hot')}
              className={`min-h-[48px] rounded-xl flex items-center justify-center gap-2 px-3 text-xs font-bold transition-all cursor-pointer ${
                temperature === 'hot'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-error">
                local_fire_department
              </span>
              <span>Hot (Ceramic)</span>
            </button>
            <button
              type="button"
              onClick={() => setTemperature('iced')}
              className={`min-h-[48px] rounded-xl flex items-center justify-center gap-2 px-3 text-xs font-bold transition-all cursor-pointer ${
                temperature === 'iced'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">ac_unit</span>
              <span>Iced (Clear Ice)</span>
            </button>
          </div>
        </div>

        {/* 2. Cup Size */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">Cup Size</span>
            <span className="text-xs text-on-surface-variant">Required</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'small' as const, label: 'Small', vol: '8 oz', sub: 'Base' },
              { id: 'medium' as const, label: 'Medium', vol: '12 oz', sub: '+ $0.75' },
              { id: 'large' as const, label: 'Large', vol: '16 oz', sub: '+ $1.50' },
            ].map((s) => {
              const isSelected = size === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id)}
                  className={`min-h-[64px] rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container text-primary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-xs font-bold">{s.label}</span>
                  <span className={`text-[11px] ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                    {s.vol}
                  </span>
                  <span className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-primary-fixed' : 'text-secondary'}`}>
                    {s.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Sweetness Level */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">Sweetness Level</span>
            <span className="text-xs text-secondary font-semibold">{sweetness}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: '0%' as const, sub: 'None' },
              { val: '50%' as const, sub: 'Less' },
              { val: '100%' as const, sub: 'Regular' },
              { val: '120%' as const, sub: 'Extra' },
            ].map((sw) => {
              const isSelected = sweetness === sw.val;
              return (
                <button
                  key={sw.val}
                  type="button"
                  onClick={() => setSweetness(sw.val)}
                  className={`min-h-[48px] rounded-xl flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-xs font-bold">{sw.val}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                    {sw.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Espresso Strength */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">Espresso Strength</span>
            <span className="text-xs text-on-surface-variant">Extracted fresh</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '2' as const, label: 'Standard', sub: '2 Shots' },
              { id: '3' as const, label: 'Extra Bold', sub: '3 Shots (+$0.80)' },
              { id: 'decaf' as const, label: 'Decaf', sub: 'Swiss Water' },
            ].map((sh) => {
              const isSelected = shots === sh.id;
              return (
                <button
                  key={sh.id}
                  type="button"
                  onClick={() => setShots(sh.id)}
                  className={`min-h-[52px] rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container text-primary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-xs font-bold">{sh.label}</span>
                  <span className={`text-[10px] font-semibold ${isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                    {sh.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Milk Option */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">Milk Option</span>
            <span className="text-xs text-secondary font-semibold">Specialty Steamed</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'whole' as const, label: 'Whole Milk (Creamy)', desc: 'Local Dairy Organic', price: 'Included' },
              { id: 'skimmed' as const, label: 'Skimmed Milk', desc: 'Light & Balanced', price: 'Included' },
              { id: 'oat' as const, label: 'Oat Milk (Barista Edition)', desc: 'Recommended with Spanish Latte', price: '+ $0.70' },
              { id: 'almond' as const, label: 'California Almond Milk', desc: 'Nutty & Silk-smooth', price: '+ $0.70' },
              { id: 'lactose-free' as const, label: 'Lactose-Free Milk', desc: 'Gentle digestibility', price: '+ $0.50' },
            ].map((m) => {
              const isSelected = milk === m.id;
              return (
                <label
                  key={m.id}
                  onClick={() => setMilk(m.id)}
                  className={`flex items-center justify-between min-h-[50px] px-3.5 rounded-2xl cursor-pointer select-none transition-all ${
                    isSelected
                      ? 'bg-surface-container-lowest shadow-sm ring-1 ring-secondary/40'
                      : 'bg-surface-container hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-primary' : 'bg-surface-container-highest'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isSelected ? 'bg-on-primary' : 'bg-transparent'
                        }`}
                      ></span>
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-primary">{m.label}</span>
                      <span className="text-[11px] text-on-surface-variant">{m.desc}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {m.price}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 6. Add-ons & Drizzles */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">Add-ons &amp; Drizzles</span>
            <span className="text-xs text-on-surface-variant">Optional</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'vanillaSyrup' as const, label: 'Vanilla Bean Syrup', desc: 'Pure Madagascar extract', price: '+ $0.60' },
              { key: 'caramelSyrup' as const, label: 'Artisan Caramel Syrup', desc: 'House-cooked brown sugar', price: '+ $0.60' },
              { key: 'whippedCream' as const, label: 'Extra Whipped Cream', desc: 'Fresh vanilla cold cream cap', price: '+ $0.50' },
              { key: 'caramelDrizzle' as const, label: 'Caramel Drizzle', desc: 'Torched salted ribbon on top', price: '+ $0.40' },
            ].map((addon) => {
              const isChecked = addons[addon.key];
              return (
                <label
                  key={addon.key}
                  onClick={() =>
                    setAddons((prev) => ({ ...prev, [addon.key]: !prev[addon.key] }))
                  }
                  className={`flex items-center justify-between min-h-[50px] px-3.5 rounded-2xl cursor-pointer select-none transition-all ${
                    isChecked
                      ? 'bg-surface-container-lowest shadow-sm ring-1 ring-secondary/40'
                      : 'bg-surface-container hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        isChecked ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-primary">{addon.label}</span>
                      <span className="text-[11px] text-on-surface-variant">{addon.desc}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${isChecked ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {addon.price}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Barista's Promise */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-start gap-3 border border-surface-container">
          <span className="material-symbols-outlined text-[20px] text-secondary mt-0.5">
            sentiment_satisfied
          </span>
          <div className="flex-1">
            <span className="text-xs font-bold text-primary block">Barista's Promise</span>
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Handcrafted upon ticket print. Double-shot extracted at 9 bars for maximal sweetness and smooth crema.
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Checkout Bar */}
      <aside className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(59,36,28,0.08)] pb-safe border-t border-surface-container max-w-lg mx-auto">
        {/* Live Breakdown Drawer Trigger */}
        <div className="px-4 pt-2 pb-1 flex items-center justify-between text-on-surface-variant">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-secondary hover:underline"
          >
            <span>View price breakdown</span>
            <span
              className={`material-symbols-outlined text-[16px] text-secondary transition-transform duration-200 ${
                showBreakdown ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>
          <span className="text-[11px] text-on-surface-variant font-medium">
            {size.toUpperCase()} • {milk.toUpperCase()} • {shots} SHOTS
          </span>
        </div>

        {/* Collapsible Price Breakdown Panel */}
        {showBreakdown && (
          <div className="px-4 py-2 mx-4 mb-2 rounded-xl bg-surface-container-low text-on-surface-variant text-xs flex flex-col gap-1 border border-surface-container animate-in fade-in duration-150">
            <div className="flex justify-between">
              <span>Base Drink ({product.name})</span>
              <span>${priceCalc.basePrice.toFixed(2)}</span>
            </div>
            {priceCalc.sizeDelta > 0 && (
              <div className="flex justify-between">
                <span>{size.toUpperCase()} Size</span>
                <span>+${priceCalc.sizeDelta.toFixed(2)}</span>
              </div>
            )}
            {priceCalc.shotsDelta > 0 && (
              <div className="flex justify-between">
                <span>Extra Bold (3 Shots)</span>
                <span>+${priceCalc.shotsDelta.toFixed(2)}</span>
              </div>
            )}
            {priceCalc.milkDelta > 0 && (
              <div className="flex justify-between">
                <span>{milk.toUpperCase()} Milk</span>
                <span>+${priceCalc.milkDelta.toFixed(2)}</span>
              </div>
            )}
            {priceCalc.addonsDelta > 0 && (
              <div className="flex justify-between">
                <span>Selected Add-ons</span>
                <span>+${priceCalc.addonsDelta.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 font-bold text-primary border-t border-surface-container">
              <span>Per Drink</span>
              <span>${priceCalc.unitPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Controls Row */}
        <div className="px-4 pb-3 pt-1 flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="h-[52px] px-2 rounded-full bg-surface-container flex items-center justify-between gap-2 shadow-inner">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary active:scale-90 transition-transform cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="text-base font-bold text-primary w-6 text-center select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary active:scale-90 transition-transform cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 h-[52px] rounded-full bg-primary text-on-primary px-5 flex items-center justify-between shadow-lg active:scale-[0.98] transition-all cursor-pointer hover:bg-primary-container"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span className="text-sm font-bold">Add to Order</span>
            </div>
            <span className="text-base font-extrabold text-on-primary">
              ${priceCalc.totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
};
