import React, { useState } from 'react';
import { CartItem } from '../types';
import { calculateCartTotals } from '../utils/pricing';
import { USER_AVATAR } from '../data/mockData';
import { BunBrewLogo } from './BunBrewLogo';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderConfirmed: (ticketNumber: string) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cartItems,
  onBack,
  onOrderConfirmed
}) => {
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [timePref, setTimePref] = useState<'asap' | 'later'>('asap');
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'card' | 'cash' | 'loyalty'>('apple');
  const [baristaNote, setBaristaNote] = useState('Extra napkins please, thank you! ☕');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [assignedTicket] = useState('#BB-8042');

  const { subtotal, tax, discount, total } = calculateCartTotals(cartItems, false, 0.20);

  const handleConfirm = () => {
    if (!agreeTerms) {
      alert('Please agree to the pickup terms before placing your order.');
      return;
    }
    setShowCelebration(true);
  };

  const handleGoToTracking = () => {
    setShowCelebration(false);
    onOrderConfirmed(assignedTicket);
  };

  return (
    <div className="flex flex-col w-full pb-36 max-w-lg mx-auto bg-surface min-h-screen">
      {/* Native Checkout Stack Header */}
      <header className="fixed top-0 left-0 right-0 z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(59,36,28,0.05)] max-w-lg mx-auto">
        <div className="h-16 px-3 flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-11 h-11 rounded-full flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-surface-container-low cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </button>
            <BunBrewLogo size={28} className="hidden sm:block mr-1" />
            <h1 className="text-lg font-bold text-primary truncate tracking-tight">Checkout</h1>
          </div>
          <div className="flex items-center pr-1">
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src={USER_AVATAR} />
          </div>
        </div>
      </header>

      {/* Top spacing placeholder for fixed header */}
      <div className="h-16"></div>

      {/* Progress Header Indicator */}
      <div className="px-4 pt-1 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-secondary">
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Checkout Flow
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
            Step 2 of 2
          </span>
        </div>
        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden flex">
          <div className="w-full h-full bg-primary-container rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4 mt-2">
        {/* Fulfillment Toggle */}
        <div className="bg-surface-container-high p-1 rounded-full flex relative shadow-xs">
          <button
            type="button"
            onClick={() => setFulfillment('pickup')}
            className={`flex-1 py-2.5 px-3 rounded-full flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              fulfillment === 'pickup'
                ? 'bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={fulfillment === 'pickup' ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              storefront
            </span>
            <span>Store Pickup</span>
          </button>
          <button
            type="button"
            onClick={() => setFulfillment('delivery')}
            className={`flex-1 py-2.5 px-3 rounded-full flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              fulfillment === 'delivery'
                ? 'bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
            <span>Express Delivery</span>
          </button>
        </div>

        {/* Fulfillment Details Section */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col gap-4">
          {/* Store Location Card */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0 text-secondary border border-surface-container">
                <span className="material-symbols-outlined text-[22px]">location_on</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                  Pickup Location
                </span>
                <h3 className="text-base font-bold text-primary leading-tight mt-0.5">
                  Downtown Roastery &amp; Café
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">442 Campus Way, Bldg B</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#39765A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39765A]"></span>
                    Open until 10 PM
                  </span>
                  <span className="text-on-surface-variant text-xs">•</span>
                  <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">navigation</span> 350m away
                  </span>
                </div>
              </div>
            </div>
            <button className="text-xs font-bold text-secondary hover:text-primary cursor-pointer pt-0.5">
              Change
            </button>
          </div>

          {/* Time Preference Selector */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary">Pickup Timing</span>
              <span className="text-[11px] text-on-surface-variant">Freshly ground</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTimePref('asap')}
                className={`p-3 rounded-xl flex flex-col items-start gap-0.5 text-left transition-all cursor-pointer border ${
                  timePref === 'asap'
                    ? 'bg-secondary-container/40 text-primary border-secondary/40 shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant border-surface-container hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    As Soon as Ready
                  </span>
                </div>
                <span className="text-sm font-extrabold text-primary">10–15 min</span>
                <span className="text-[10px] text-on-surface-variant">Estimated prep queue</span>
              </button>

              <button
                type="button"
                onClick={() => setTimePref('later')}
                className={`p-3 rounded-xl flex flex-col items-start gap-0.5 text-left transition-all cursor-pointer border ${
                  timePref === 'later'
                    ? 'bg-secondary-container/40 text-primary border-secondary/40 shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant border-surface-container hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Schedule Later
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">Pick a time</span>
                <span className="text-[10px] text-on-surface-variant">e.g., 11:30 AM today</span>
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-surface-container">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Sarah Jenkins</p>
                <p className="text-[11px] text-on-surface-variant">+1 (555) 234-5678</p>
              </div>
            </div>
            <button className="text-xs font-bold text-secondary hover:text-primary cursor-pointer px-2 py-1">
              Edit
            </button>
          </div>

          {/* Special Prep Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-primary flex items-center gap-1.5" htmlFor="prep-note">
              <span className="material-symbols-outlined text-[18px] text-secondary">local_cafe</span>
              <span>Note for the Barista</span>
            </label>
            <input
              id="prep-note"
              className="w-full bg-surface-container-low text-primary text-xs rounded-xl py-2.5 px-3 border border-surface-container focus:bg-surface-container-lowest focus:border-secondary outline-none transition-all"
              placeholder="Add prep notes (e.g., light ice, double cup)"
              type="text"
              value={baristaNote}
              onChange={(e) => setBaristaNote(e.target.value)}
            />
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-primary">Payment Method</h3>
              <span className="material-symbols-outlined text-[18px] text-secondary">lock</span>
            </div>
            <span className="text-xs text-secondary font-semibold">Safe &amp; Encrypted</span>
          </div>

          {/* Academic Demo Sandbox Notice */}
          <div className="bg-secondary-container/40 text-on-secondary-container rounded-xl p-3 flex items-start gap-2.5 border border-secondary/20">
            <span className="material-symbols-outlined text-[20px] text-secondary flex-shrink-0 mt-0.5">
              verified_user
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-wide uppercase">
                Academic Demo Sandbox
              </span>
              <span className="text-xs text-on-surface-variant leading-relaxed">
                Safe simulated checkout. No real financial charges or credit deductions occur.
              </span>
            </div>
          </div>

          {/* Radio Options */}
          <div className="flex flex-col gap-2 mt-1">
            {/* Apple Pay */}
            <label
              onClick={() => setPaymentMethod('apple')}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                paymentMethod === 'apple'
                  ? 'bg-surface-container-low border-secondary/40 shadow-xs'
                  : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    paymentMethod === 'apple' ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      paymentMethod === 'apple' ? 'bg-on-primary' : 'bg-transparent'
                    }`}
                  ></span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">Apple Pay</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">
                    1-Tap Fast
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[22px] text-primary">contactless</span>
            </label>

            {/* Credit Card */}
            <label
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                paymentMethod === 'card'
                  ? 'bg-surface-container-low border-secondary/40 shadow-xs'
                  : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    paymentMethod === 'card' ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      paymentMethod === 'card' ? 'bg-on-primary' : 'bg-transparent'
                    }`}
                  ></span>
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">Demo Card (•••• 4022)</span>
                    <span className="text-[10px] text-secondary font-bold">VISA</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">Exp 09/28 • Academic sandbox</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                credit_card
              </span>
            </label>

            {/* Pay at Counter */}
            <label
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                paymentMethod === 'cash'
                  ? 'bg-surface-container-low border-secondary/40 shadow-xs'
                  : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    paymentMethod === 'cash' ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      paymentMethod === 'cash' ? 'bg-on-primary' : 'bg-transparent'
                    }`}
                  ></span>
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary">Pay at Counter</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Cash or physical card upon handoff
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                payments
              </span>
            </label>

            {/* Loyalty Balance */}
            <label
              onClick={() => setPaymentMethod('loyalty')}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                paymentMethod === 'loyalty'
                  ? 'bg-surface-container-low border-secondary/40 shadow-xs'
                  : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    paymentMethod === 'loyalty' ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      paymentMethod === 'loyalty' ? 'bg-on-primary' : 'bg-transparent'
                    }`}
                  ></span>
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">BUN &amp; BREW Balance</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                      Rewards
                    </span>
                  </div>
                  <span className="text-[11px] text-secondary font-bold">
                    $14.50 available credits
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-secondary">wallet</span>
            </label>
          </div>
        </section>

        {/* Order Review Card */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-primary">Order Summary</h3>
            <span className="text-xs text-on-surface-variant">
              {cartItems.length} items in bag
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt={item.product.name}
                    src={item.product.image}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-primary truncate">
                      {item.quantity}x {item.product.name}
                    </h4>
                    <span className="text-xs font-bold text-primary">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {item.customization.size.toUpperCase()} • {item.customization.milk.toUpperCase()} • {item.customization.temperature.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Promo code badge */}
          <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                local_activity
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-primary">BREWSTUDENT20</span>
                <span className="text-[10px] text-secondary font-semibold">
                  Campus Roastery Discount (20%)
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-secondary">-${discount.toFixed(2)}</span>
          </div>

          {/* Total Due */}
          <div className="flex justify-between items-baseline pt-2 border-t border-surface-container">
            <span className="text-base font-bold text-primary">Total Amount Due</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-primary">${total.toFixed(2)}</span>
              <span className="text-xs text-on-surface-variant">USD</span>
            </div>
          </div>
        </section>

        {/* Terms Checkbox */}
        <div className="px-1 flex items-start gap-3">
          <input
            id="terms-check"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded accent-primary-container cursor-pointer"
          />
          <label htmlFor="terms-check" className="text-xs text-on-surface-variant cursor-pointer leading-tight">
            I agree to the <span className="text-secondary font-semibold underline">pickup conditions</span>, temperature disclaimer, and BUN &amp; BREW campus café terms.
          </label>
        </div>

        {/* Sticky Confirm Button */}
        <div className="sticky bottom-0 left-0 right-0 pt-2 pb-6 bg-surface/95 backdrop-blur-md flex flex-col gap-2 z-30">
          <button
            onClick={handleConfirm}
            className="w-full h-[54px] rounded-full bg-primary text-on-primary font-bold text-base flex items-center justify-between px-6 shadow-lg active:scale-[0.98] transition-all hover:bg-primary-container cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">coffee</span>
              <span>Confirm Order</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>${total.toFixed(2)}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </button>
          <div className="flex items-center justify-center gap-1.5 text-on-surface-variant text-center">
            <span className="material-symbols-outlined text-[15px] text-secondary">
              notifications_active
            </span>
            <span className="text-[11px]">Instant ticket sent to barista queue &amp; live app tracker.</span>
          </div>
        </div>
      </div>

      {/* Order Celebration Dialog Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center gap-3 border border-surface-container">
            <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-primary mb-1 animate-bounce">
              <span
                className="material-symbols-outlined text-[36px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h2 className="text-2xl font-black text-primary">Order Received! ☕</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Barista Alex is preparing your freshly customized drink order at the Downtown Roastery.
            </p>

            <div className="bg-surface-container-low rounded-xl p-3 w-full flex items-center justify-between text-left my-1 border border-surface-container">
              <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                  Pickup Ticket
                </p>
                <p className="text-lg font-black text-primary">{assignedTicket}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-on-surface-variant font-medium">Estimated Ready</p>
                <p className="text-base font-bold text-secondary">10–14 mins</p>
              </div>
            </div>

            <button
              onClick={handleGoToTracking}
              className="w-full h-12 rounded-full bg-primary text-on-primary text-xs font-bold active:scale-95 transition-transform cursor-pointer hover:bg-primary-container"
              type="button"
            >
              Track Live Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
