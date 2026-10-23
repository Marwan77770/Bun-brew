import React from 'react';
import { Product, ViewMode } from '../types';
import { PRODUCTS } from '../data/mockData';

interface HomeScreenProps {
  onNavigate: (view: ViewMode) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart
}) => {
  const bestSellers = PRODUCTS.filter((p) =>
    ['spanish-latte', 'cold-brew', 'butter-croissant', 'flat-white'].includes(p.id)
  );

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg mx-auto">
      {/* Greeting & Search Area */}
      <section className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                Good morning, Sarah!
              </h1>
              <span className="text-xl inline-block animate-bounce">☕</span>
            </div>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Ready for your morning brew?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center text-primary shadow-xs">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
            </div>
          </div>
        </div>

        {/* Tactile Search Bar with Filter Icon */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-4 flex items-center pointer-events-none text-secondary">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            onClick={() => onNavigate('menu')}
            className="w-full h-12 pl-11 pr-12 rounded-full bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline shadow-[0_2px_8px_rgba(59,36,28,0.04)] focus:outline-none focus:ring-1 focus:ring-secondary transition-all cursor-pointer"
            placeholder="What are you craving today?"
            type="text"
            readOnly
          />
          <button
            onClick={() => onNavigate('menu')}
            aria-label="Filter menu"
            className="absolute right-1.5 w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </section>

      {/* Hero Promotional Banner */}
      <section className="px-4 my-2.5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container via-primary to-tertiary text-on-primary p-5 shadow-[0_8px_24px_rgba(59,36,28,0.16)] flex flex-col justify-between min-h-[170px]">
          <div className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none"></div>
          <div className="absolute right-0 bottom-0 w-36 h-36 opacity-35 rounded-full overflow-hidden pointer-events-none">
            <img
              className="w-full h-full object-cover"
              alt="Honey Cinnamon Spanish Latte and almond croissant"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsQkqB8qVy9aZis3wLvqolssu-bCGzCHrnQ28stQAU-IBDjZLwari0b9fu6MvONCMkybFARjakFJQFPEMPbz14g2mFqnAkXKnrkKQ9jOYXh2lPuCqjzsvUigcqERvDQRpoZtbEDlpJwIxpuVZODF5f7D1fhx3LLYFUvpTjzsN5YsHrRGW5BElx9wKyj4opHnXYOD3pGDSFZZQGyj8NIbply0d0TYjEHZl9_gTilJmKkR7vdAYHkVMu"
            />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/25 backdrop-blur-sm text-secondary-fixed text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span>Spring Roaster Special</span>
            </div>
            <h2 className="text-xl font-bold text-on-primary leading-tight max-w-[240px]">
              Honey Cinnamon Latte &amp; Croissant
            </h2>
            <p className="text-xs text-on-primary-container mt-1 max-w-[220px]">
              Signature blend paired with flaky pastry at 20% off.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-3 mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-secondary-fixed">$7.40</span>
              <span className="text-xs text-on-primary-container line-through opacity-70">
                $9.25
              </span>
            </div>
            <button
              onClick={() => {
                const item = PRODUCTS.find((p) => p.id === 'spanish-latte');
                if (item) onAddToCart(item);
              }}
              className="h-9 px-4 rounded-full bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <span>Order Now</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Coffee Expert Hero Card */}
      <section className="px-4 my-2.5">
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-4 shadow-[0_4px_16px_rgba(59,36,28,0.04)] border border-surface-container">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex-shrink-0 flex items-center justify-center text-on-secondary-container shadow-inner">
              <span className="material-symbols-outlined text-[26px]">psychology</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase text-secondary tracking-wider">
                  Taste Concierge
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/80 text-on-secondary-container text-[11px] font-bold">
                  30s quiz
                </span>
              </div>
              <h3 className="text-base font-bold text-primary mt-0.5 leading-snug">
                Not sure what to order?
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                Take our quick taste quiz powered by roast profiles and sweet-note rules to unlock your exact match.
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3 flex items-center justify-between bg-surface-container/60 -mx-4 -mb-4 px-4 py-2.5 rounded-b-2xl">
            <div className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span className="text-[11px] font-semibold text-secondary">
                Barista rule-based matching
              </span>
            </div>
            <button
              onClick={() => onNavigate('expert-preferences')}
              className="h-9 px-4 rounded-full bg-primary text-on-primary text-xs font-bold inline-flex items-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer"
            >
              <span>Take Taste Quiz</span>
              <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Category Horizontal Strip */}
      <section className="my-3">
        <div className="px-4 flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-primary">Shop by Category</h3>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-semibold text-secondary hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View all</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar scroll-smooth py-1">
          <button
            onClick={() => onNavigate('menu')}
            className="flex-shrink-0 h-9 px-4 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <span>All</span>
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className="flex-shrink-0 h-9 px-4 rounded-full bg-surface-container-lowest text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(59,36,28,0.04)] border border-surface-container cursor-pointer active:scale-95"
          >
            <span>☕</span>
            <span>Hot Coffee</span>
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className="flex-shrink-0 h-9 px-4 rounded-full bg-surface-container-lowest text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(59,36,28,0.04)] border border-surface-container cursor-pointer active:scale-95"
          >
            <span>🧊</span>
            <span>Iced Drinks</span>
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className="flex-shrink-0 h-9 px-4 rounded-full bg-surface-container-lowest text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(59,36,28,0.04)] border border-surface-container cursor-pointer active:scale-95"
          >
            <span>🥤</span>
            <span>Frappes</span>
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className="flex-shrink-0 h-9 px-4 rounded-full bg-surface-container-lowest text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(59,36,28,0.04)] border border-surface-container cursor-pointer active:scale-95"
          >
            <span>🥐</span>
            <span>Bakery &amp; Buns</span>
          </button>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="px-4 my-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-primary">Best Sellers</h3>
            <p className="text-xs text-on-surface-variant">Neighborhood favorites brewed fresh daily</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary text-[11px] font-bold uppercase">
            Popular
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {bestSellers.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-3 shadow-[0_4px_16px_rgba(59,36,28,0.04)] border border-surface-container hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-low mb-2.5">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={item.name}
                    src={item.image}
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-surface/90 backdrop-blur-sm text-primary text-[10px] font-bold flex items-center gap-0.5 shadow-xs">
                    <span
                      className="material-symbols-outlined text-[12px] text-secondary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span>{item.rating} ({item.reviewsCount})</span>
                  </div>
                  {item.badge && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-low/95 text-secondary text-[10px] font-bold">
                      {item.badge}
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-bold text-primary leading-tight line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-container/40">
                <span className="text-base font-bold text-primary">${item.price.toFixed(2)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  aria-label={`Add ${item.name} to cart`}
                  className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center active:scale-90 transition-transform shadow-xs hover:bg-primary cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Made for Sarah Strip */}
      <section className="px-4 my-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-secondary text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <h3 className="text-base font-bold text-primary">Made for Sarah</h3>
          </div>
          <span className="text-xs text-secondary font-medium">Based on your tastes</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-container-low shadow-[0_4px_16px_rgba(59,36,28,0.04)] border border-surface-container flex items-center justify-between gap-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
            <img
              className="w-full h-full object-cover"
              alt="Iced Oat Vanilla Cortado"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKZBe_aPwkdfHtxqu_yXOjpisndLe70-Q80M3FHjFfHHOijLstJn9lryGAYN6iPfM-nrqGvPsU4vyGeIu5O_r1VHpiGHuRrr6hrCeEehsbnfpvrPxFKb1J6hT1vgU0snY7dYMxBiCdUxvt8VpmCBPBcgpGuditZaWClYzw5W3KRAyuABnzl8N4cmKnpTmcFwkc0mO7lUTPCvXdJu2NT75JWN9BTfSTNvnJsiUwU2U1gedjcfvzR4wS"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/60 text-secondary text-[10px] font-bold uppercase">
                Smooth Everyday
              </span>
            </div>
            <h4 className="text-sm font-bold text-primary truncate mt-0.5">
              Iced Oat Vanilla Cortado
            </h4>
            <p className="text-xs text-on-surface-variant truncate">
              Your signature smooth oat preference
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-sm font-bold text-primary">$5.10</span>
            <button
              onClick={() => {
                const item = PRODUCTS.find((p) => p.id === 'spanish-latte') || PRODUCTS[0];
                onAddToCart(item);
              }}
              className="h-8 px-3 rounded-full bg-primary text-on-primary text-xs font-bold active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
            >
              <span>Reorder</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
