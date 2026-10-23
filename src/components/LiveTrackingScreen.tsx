import React, { useState } from 'react';
import { ViewMode } from '../types';

interface LiveTrackingScreenProps {
  orderNumber?: string;
  onNavigate: (view: ViewMode) => void;
  onShowToast: (msg: string) => void;
}

export const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  orderNumber = '#BB-8921',
  onNavigate,
  onShowToast
}) => {
  const [summaryOpen, setSummaryOpen] = useState(true);

  const handleReorder = () => {
    onShowToast('Reorder combo added to your cart!');
    onNavigate('cart');
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto bg-surface px-4 space-y-4 pt-3">
      {/* Status Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container p-4 shadow-[0_4px_16px_rgba(59,36,28,0.06)] border border-surface-container">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span>Order {orderNumber}</span>
            </div>
            <p className="text-xs text-on-surface-variant">Placed today at 10:24 AM</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-secondary uppercase tracking-wider font-bold">
              Estimated Time
            </span>
            <span className="text-xl font-bold text-primary">10:35 AM</span>
          </div>
        </div>

        <div className="mt-3 bg-surface-container-low rounded-xl p-3 flex items-center gap-3 border border-surface-container/60">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary text-on-primary shrink-0">
            <span className="material-symbols-outlined text-[20px] animate-spin" style={{ animationDuration: '4s' }}>
              hourglass_top
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-primary">Ready in ~8 minutes</p>
            <p className="text-xs text-on-surface-variant">
              Barista Alex is preparing your order with care
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Visual Progress Stepper */}
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <h2 className="text-base font-bold text-primary">Live Preparation</h2>
          <span className="text-xs font-bold text-secondary">Step 2 of 4</span>
        </div>

        <div className="relative mt-4 space-y-5">
          {/* Vertical progress track */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-surface-container-high -z-0">
            <div className="w-full bg-secondary" style={{ height: '42%' }}></div>
          </div>

          {/* Step 1: Confirmed */}
          <div className="relative z-10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-primary">Order Confirmed</p>
                <span className="text-[11px] text-on-surface-variant">10:24 AM</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Your ticket reached Barista Station 2.
              </p>
            </div>
          </div>

          {/* Step 2: Brewing & Handcrafting (Active Stage) */}
          <div className="relative z-10 flex items-start gap-3">
            <div className="relative w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md shrink-0">
              <span className="material-symbols-outlined text-[18px] animate-pulse">local_cafe</span>
              <span className="absolute -inset-1 rounded-full bg-primary/20 animate-ping pointer-events-none"></span>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-primary">Brewing &amp; Handcrafting</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed-dim text-on-secondary-fixed-variant text-[10px] font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Barista Alex is grinding single-origin beans and steaming fresh oat milk.
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-secondary text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[15px]">heat</span>
                <span>Espresso temp: 92.4°C optimal extraction</span>
              </div>
            </div>
          </div>

          {/* Step 3: Counter Pickup (Pending) */}
          <div className="relative z-10 flex items-start gap-3 opacity-75">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">countertops</span>
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-on-surface">Ready for Counter Pickup</p>
                <span className="text-[11px] text-on-surface-variant">Est. 10:34 AM</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Pick up at Counter Bay 3 with your QR code.
              </p>
            </div>
          </div>

          {/* Step 4: Enjoy */}
          <div className="relative z-10 flex items-start gap-3 opacity-50">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">sentiment_satisfied</span>
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-xs font-bold text-on-surface">Enjoy Your Brew</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Freshly handcrafted artisanal delight.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup QR Code Pass Card */}
      <div className="rounded-2xl bg-surface-container p-4 text-center shadow-xs border border-surface-container space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-secondary text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
          <span>Express Pickup Pass</span>
        </div>

        {/* QR Matrix graphic matching screenshot */}
        <div className="inline-flex p-3 rounded-2xl bg-surface-container-lowest shadow-inner mx-auto border border-surface-container">
          <div className="w-36 h-36 flex flex-col justify-between p-2.5 bg-primary rounded-xl">
            <div className="flex justify-between w-full">
              <div className="w-8 h-8 bg-surface-container-lowest p-1 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-xs"></div>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-surface-container-lowest rounded-xs"></div>
                <div className="w-2 h-2 bg-surface-container-lowest rounded-xs"></div>
              </div>
              <div className="w-8 h-8 bg-surface-container-lowest p-1 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-xs"></div>
              </div>
            </div>

            <div className="flex items-center justify-around w-full py-1">
              <div className="w-3 h-3 bg-surface-container-lowest rounded-xs"></div>
              <div className="w-5 h-5 bg-surface-container-lowest flex items-center justify-center rounded-xs">
                <div className="w-2 h-2 bg-primary rounded-xs"></div>
              </div>
              <div className="w-3 h-3 bg-surface-container-lowest rounded-xs"></div>
            </div>

            <div className="flex justify-between w-full">
              <div className="w-8 h-8 bg-surface-container-lowest p-1 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-xs"></div>
              </div>
              <div className="flex gap-1 items-end">
                <div className="w-3 h-3 bg-surface-container-lowest rounded-xs"></div>
                <div className="w-2 h-2 bg-surface-container-lowest rounded-xs"></div>
              </div>
              <div className="w-6 h-6 bg-surface-container-lowest rounded-xs"></div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-base font-bold text-primary">Pickup for: Sarah</p>
          <p className="text-xs text-on-surface-variant">Show this code or tell your name at Bay 3</p>
        </div>
      </div>

      {/* Fulfillment Location Card */}
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs border border-surface-container space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[20px]">store</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-primary">Downtown Roastery Branch</p>
            <p className="text-xs text-on-surface-variant">442 Campus Way, Ground Floor</p>
            <p className="text-xs text-secondary font-semibold mt-0.5">
              Counter Bay 3 (Left of Roasting Machine)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            className="h-11 flex items-center justify-center gap-1.5 rounded-full bg-surface-container text-primary text-xs font-bold active:scale-95 transition-transform"
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
          >
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            <span>Directions</span>
          </a>
          <a
            className="h-11 flex items-center justify-center gap-1.5 rounded-full bg-surface-container text-primary text-xs font-bold active:scale-95 transition-transform"
            href="tel:5550192834"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>Call Café</span>
          </a>
        </div>
      </div>

      {/* Expandable Order Summary */}
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs border border-surface-container">
        <button
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-primary">Order Summary</span>
            <span className="text-xs text-on-surface-variant font-medium">(2 items)</span>
          </div>
          <span
            className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${
              summaryOpen ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </button>

        {summaryOpen && (
          <div className="mt-3 pt-3 border-t border-surface-container space-y-2 text-xs">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <p className="font-bold text-primary">1x Signature Spanish Latte</p>
                <p className="text-[11px] text-on-surface-variant">
                  Medium • Iced • Oat Milk • 3 Espresso Shots
                </p>
              </div>
              <span className="font-bold text-primary">$5.79</span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <p className="font-bold text-primary">1x Pistachio Brioche Bun</p>
                <p className="text-[11px] text-on-surface-variant">
                  Warm toasted • Crushed Bronte pistachio topping
                </p>
              </div>
              <span className="font-bold text-primary">$4.20</span>
            </div>

            <div className="mt-2 p-2.5 rounded-xl bg-surface-container-low space-y-1 border border-surface-container">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  <span>Paid via Apple Pay</span>
                </span>
                <span className="font-bold text-primary">$9.99</span>
              </div>
              <div className="flex items-center justify-between text-secondary text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">stars</span>
                  <span>Loyalty Points Added</span>
                </span>
                <span>+10 Points ⭐</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Call-to-Actions */}
      <div className="pt-2 flex flex-col space-y-2.5">
        <button
          onClick={handleReorder}
          className="w-full h-[52px] rounded-full bg-primary text-on-primary text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer hover:bg-primary-container"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">autorenew</span>
          <span>Reorder This Combo</span>
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="w-full h-[52px] rounded-full bg-surface-container text-primary text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-surface-variant cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">cottage</span>
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};
