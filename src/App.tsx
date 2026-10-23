import { useState, useEffect } from 'react';
import { ViewMode, Product, CartItem, ExpertPreferences, RecommendationMatch } from './types';
import { PRODUCTS } from './data/mockData';
import { runExpertInference } from './utils/expertMatcher';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomeScreen } from './components/HomeScreen';
import { MenuScreen } from './components/MenuScreen';
import { ProductDetailsScreen } from './components/ProductDetailsScreen';
import { ExpertPreferencesScreen } from './components/ExpertPreferencesScreen';
import { ExpertResultsScreen } from './components/ExpertResultsScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { LiveTrackingScreen } from './components/LiveTrackingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ManagerDashboard } from './components/ManagerDashboard';
import { Toast } from './components/Toast';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[5]); // Spanish Latte default
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(['spanish-latte', 'cold-brew', 'butter-croissant'])
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<string>('#BB-8921');

  // Pre-seeded cart matching Image_8 ($11.45 subtotal with discount -> $9.99 total)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'seed-spanish-latte',
      product: PRODUCTS.find((p) => p.id === 'spanish-latte') || PRODUCTS[0],
      customization: {
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
          caramelDrizzle: true,
        },
        addonsPrice: 1.00,
        quantity: 1,
      },
      unitPrice: 7.25,
      totalPrice: 7.25,
      quantity: 1,
    },
    {
      id: 'seed-pistachio-brioche',
      product: PRODUCTS.find((p) => p.id === 'butter-croissant') || PRODUCTS[1],
      customization: {
        temperature: 'hot',
        size: 'small',
        sizePrice: 0,
        sweetness: '100%',
        shots: '2',
        shotsPrice: 0,
        milk: 'whole',
        milkPrice: 0,
        addons: {
          vanillaSyrup: false,
          caramelSyrup: false,
          whippedCream: false,
          caramelDrizzle: false,
        },
        addonsPrice: 0,
        quantity: 1,
      },
      unitPrice: 4.20,
      totalPrice: 4.20,
      quantity: 1,
    },
  ]);

  // Expert questionnaire state
  const [expertPrefs, setExpertPrefs] = useState<ExpertPreferences>({
    temperature: 'iced',
    tasteProfile: 'creamy',
    caffeineLevel: 'medium',
    milkPreference: 'oat',
    sweetnessPreference: 'light',
    vibe: 'smooth',
    budget: 'mid',
  });

  const [recommendations, setRecommendations] = useState<RecommendationMatch[]>(() =>
    runExpertInference({
      temperature: 'iced',
      tasteProfile: 'creamy',
      caffeineLevel: 'medium',
      milkPreference: 'oat',
      sweetnessPreference: 'light',
      vibe: 'smooth',
      budget: 'mid',
    })
  );

  // Check URL query parameters for ?autostart=1 or ?view=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as ViewMode | null;
    const autostart = params.get('autostart');

    if (viewParam) {
      setCurrentView(viewParam);
    } else if (autostart === '1') {
      setCurrentView('home');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        showToast('Removed from favorites');
      } else {
        next.add(productId);
        showToast('Added to favorites');
      }
      return next;
    });
  };

  const handleAddToCartQuick = (product: Product) => {
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      customization: {
        temperature: product.temperature === 'iced' ? 'iced' : 'hot',
        size: 'medium',
        sizePrice: 0.75,
        sweetness: '100%',
        shots: '2',
        shotsPrice: 0,
        milk: 'whole',
        milkPrice: 0,
        addons: {
          vanillaSyrup: false,
          caramelSyrup: false,
          whippedCream: false,
          caramelDrizzle: false,
        },
        addonsPrice: 0,
        quantity: 1,
      },
      unitPrice: product.price,
      totalPrice: product.price,
      quantity: 1,
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${product.name} to cart!`);
  };

  const handleAddToCartCustomized = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    setCurrentView('cart');
  };

  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: parseFloat((item.unitPrice * nextQty).toFixed(2)),
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from order bag');
  };

  const handleFindMatches = (prefs: ExpertPreferences) => {
    setExpertPrefs(prefs);
    const matches = runExpertInference(prefs);
    setRecommendations(matches);
    setCurrentView('expert-results');
    showToast(`Matching complete! ${matches.length} ${matches.length === 1 ? 'curation' : 'curations'} found.`);
  };

  const handleOrderConfirmed = (ticket: string) => {
    setConfirmedTicket(ticket);
    setCurrentView('tracking');
    showToast(`Order confirmed: ${ticket}`);
  };

  const handleSignOut = () => {
    setCurrentView('welcome');
    showToast('Signed out of Bun & Brew');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isTabScreen = ['home', 'menu', 'expert-preferences', 'expert-results', 'tracking', 'profile'].includes(currentView);
  const showGlobalHeader = isTabScreen;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* When in Manager Dashboard, show dedicated portal full-width */}
      {currentView === 'manager-dashboard' ? (
        <ManagerDashboard
          onShowToast={showToast}
          onExitManager={() => setCurrentView('home')}
        />
      ) : currentView === 'welcome' ? (
        <WelcomeScreen onStart={() => setCurrentView('home')} />
      ) : (
        <div className="flex-1 flex flex-col relative w-full">
          {/* Main Top Header (for tab screens) */}
          {showGlobalHeader && (
            <Header
              currentView={currentView}
              onNavigate={(v) => setCurrentView(v)}
              cartItemCount={totalCartCount}
              onToggleManager={() => setCurrentView('manager-dashboard')}
              isManagerView={false}
            />
          )}

          {/* Body Content */}
          <main className={`flex-1 flex flex-col relative w-full ${showGlobalHeader ? 'pt-16' : ''}`}>
            {currentView === 'home' && (
              <HomeScreen
                onNavigate={(v) => setCurrentView(v)}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-details');
                }}
                onAddToCart={handleAddToCartQuick}
              />
            )}

            {currentView === 'menu' && (
              <MenuScreen
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-details');
                }}
                onAddToCart={handleAddToCartQuick}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {currentView === 'product-details' && (
              <ProductDetailsScreen
                product={selectedProduct}
                onBack={() => setCurrentView('menu')}
                onAddToCartCustomized={handleAddToCartCustomized}
                isFavorite={favorites.has(selectedProduct.id)}
                onToggleFavorite={() => handleToggleFavorite(selectedProduct.id)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'expert-preferences' && (
              <ExpertPreferencesScreen onFindMatches={handleFindMatches} />
            )}

            {currentView === 'expert-results' && (
              <ExpertResultsScreen
                preferences={expertPrefs}
                recommendations={recommendations}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-details');
                }}
                onAddToCartDirect={handleAddToCartQuick}
                onRetake={() => setCurrentView('expert-preferences')}
                onEditFilters={() => setCurrentView('expert-preferences')}
              />
            )}

            {currentView === 'cart' && (
              <CartScreen
                cartItems={cartItems}
                onUpdateQty={handleUpdateCartQty}
                onRemoveItem={handleRemoveCartItem}
                onProceedToCheckout={() => setCurrentView('checkout')}
                onContinueShopping={() => setCurrentView('menu')}
                onEditItem={(item) => {
                  setSelectedProduct(item.product);
                  setCurrentView('product-details');
                }}
              />
            )}

            {currentView === 'checkout' && (
              <CheckoutScreen
                cartItems={cartItems}
                onBack={() => setCurrentView('cart')}
                onOrderConfirmed={handleOrderConfirmed}
              />
            )}

            {currentView === 'tracking' && (
              <LiveTrackingScreen
                orderNumber={confirmedTicket}
                onNavigate={(v) => setCurrentView(v)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'profile' && (
              <ProfileScreen
                onNavigate={(v) => setCurrentView(v)}
                onShowToast={showToast}
                onSignOut={handleSignOut}
              />
            )}
          </main>

          {/* Floating Bottom Nav (only on tabbed screens) */}
          {isTabScreen && (
            <BottomNav
              currentView={currentView}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}
        </div>
      )}
    </div>
  );
}
