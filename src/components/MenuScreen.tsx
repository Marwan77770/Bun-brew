import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/mockData';

interface MenuScreenProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  favorites: Set<string>;
  onToggleFavorite: (productId: string) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onSelectProduct,
  onAddToCart,
  favorites,
  onToggleFavorite
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilter, setTempFilter] = useState<'all' | 'hot' | 'iced'>('all');
  const [caffeineFilter, setCaffeineFilter] = useState<'all' | 'high' | 'med' | 'low' | 'decaf'>('all');
  const [dietaryFilters, setDietaryFilters] = useState<Set<'veg' | 'oat' | 'dairyfree'>>(new Set());

  const categories = [
    { id: 'all', label: 'All', count: 15 },
    { id: 'hot', label: 'Hot Coffee' },
    { id: 'iced', label: 'Iced Drinks' },
    { id: 'frappes', label: 'Frappes' },
    { id: 'bakery', label: 'Bakery' },
    { id: 'sandwiches', label: 'Sandwiches' },
  ];

  const toggleDiet = (diet: 'veg' | 'oat' | 'dairyfree') => {
    setDietaryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(diet)) {
        next.delete(diet);
      } else {
        next.add(diet);
      }
      return next;
    });
  };

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setTempFilter('all');
    setCaffeineFilter('all');
    setDietaryFilters(new Set());
    setSortBy('recommended');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (tempFilter !== 'all') count++;
    if (caffeineFilter !== 'all') count++;
    count += dietaryFilters.size;
    return count;
  }, [tempFilter, caffeineFilter, dietaryFilters]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'hot' && item.category !== 'hot' && item.temperature !== 'both') return false;
        if (selectedCategory === 'iced' && item.category !== 'iced' && item.temperature !== 'both') return false;
        if (selectedCategory === 'frappes' && item.category !== 'frappes') return false;
        if (selectedCategory === 'bakery' && item.category !== 'bakery') return false;
        if (selectedCategory === 'sandwiches' && item.category !== 'sandwiches') return false;
      }

      // Temperature filter
      if (tempFilter !== 'all') {
        if (item.temperature !== tempFilter && item.temperature !== 'both') return false;
      }

      // Caffeine filter
      if (caffeineFilter !== 'all') {
        if (item.caffeine !== caffeineFilter) return false;
      }

      // Dietary filter
      if (dietaryFilters.size > 0) {
        for (const d of dietaryFilters) {
          if (!item.dietary.includes(d)) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
      return 0; // recommended
    });
  }, [search, selectedCategory, tempFilter, caffeineFilter, dietaryFilters, sortBy]);

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg mx-auto">
      {/* Header Title Section */}
      <section className="px-4 pt-4 pb-2">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Our Menu</h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
            {filteredProducts.length} crafted items
          </span>
        </div>
        <p className="text-sm text-on-surface-variant mt-1 leading-snug">
          Handcrafted specialty drinks &amp; artisanal bakery freshly prepared to order.
        </p>
      </section>

      {/* Live Search & Filter Bar */}
      <section className="px-4 pt-2 pb-2">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none text-[22px]">
            search
          </span>
          <input
            className="w-full h-12 pl-12 pr-10 rounded-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 text-sm focus:bg-surface-container-lowest focus:shadow-md transition-all outline-none border border-transparent focus:border-secondary/40"
            placeholder="Search coffee, tea, bakery..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </section>

      {/* Quick Category Chips */}
      <section className="w-full overflow-x-auto no-scrollbar px-4 pb-2 pt-1">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 h-9 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count && <span className="text-[11px] opacity-80">({cat.count})</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Sort & Filter Toggles */}
      <section className="px-4 pb-3">
        <div className="flex items-center justify-between gap-2">
          {/* Sort Selector Dropdown */}
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-10 pl-3.5 pr-8 rounded-full bg-surface-container-low text-on-surface text-xs font-semibold appearance-none outline-none active:scale-[0.98] transition-all cursor-pointer border border-transparent focus:border-secondary/30"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          {/* Quick Filter Tray Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 h-10 px-4 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer ${
              showFilters || activeFilterCount > 0
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-primary hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-on-secondary text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Micro-Filter Panel */}
        {showFilters && (
          <div className="flex flex-col gap-3 mt-3 p-4 rounded-2xl bg-surface-container-low border border-surface-container animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wide">
                Preferences
              </span>
              <button
                onClick={resetAllFilters}
                className="text-secondary text-xs font-bold hover:underline cursor-pointer"
              >
                Reset all
              </button>
            </div>

            {/* Temperature Chips */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-on-surface-variant">
                Temperature
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'hot', 'iced'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTempFilter(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                      tempFilter === t
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {t === 'all' ? 'All' : t === 'hot' ? '🔥 Hot' : '❄️ Iced'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Chips */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-on-surface-variant">
                Dietary Preference
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'veg' as const, label: 'Vegetarian' },
                  { id: 'oat' as const, label: 'Oat Milk Ready' },
                  { id: 'dairyfree' as const, label: 'Dairy Free' },
                ].map((d) => {
                  const isChecked = dietaryFilters.has(d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleDiet(d.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caffeine Level */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-on-surface-variant">
                Caffeine Level
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'high', 'med', 'low', 'decaf'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCaffeineFilter(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                      caffeineFilter === c
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {c === 'all' ? 'Any' : c.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Product Grid */}
      <section className="px-4 pt-1">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-secondary mb-3">
              <span className="material-symbols-outlined text-[32px]">coffee_maker</span>
            </div>
            <h3 className="text-lg font-bold text-primary">No sips found</h3>
            <p className="text-xs text-on-surface-variant max-w-[240px] mt-1 mb-4 leading-relaxed">
              Try clearing your search terms or relaxing your active dietary filters.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-5 h-10 rounded-full bg-primary text-on-primary text-xs font-bold active:scale-95 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((item) => {
              const isFav = favorites.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct(item)}
                  className="flex flex-col justify-between p-3 rounded-2xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(59,36,28,0.04)] border border-surface-container hover:shadow-md transition-all relative cursor-pointer group"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-low mb-2.5">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={item.name}
                      src={item.image}
                    />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      aria-label={`Toggle favorite for ${item.name}`}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-primary active:scale-90 transition-transform cursor-pointer"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isFav ? 'text-error' : 'text-primary'
                        }`}
                        style={isFav ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        favorite
                      </span>
                    </button>

                    {item.badge && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-primary/70 backdrop-blur-sm text-on-primary text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <h2 className="text-sm font-bold text-primary leading-tight line-clamp-1">
                      {item.name}
                    </h2>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5 mb-2 leading-tight">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-surface-container/30">
                    <span className="text-base font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item);
                      }}
                      aria-label={`Add ${item.name} to cart`}
                      className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center active:scale-90 hover:bg-primary transition-all shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
