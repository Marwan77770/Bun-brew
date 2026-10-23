import React, { useState } from 'react';
import { LiveOrder } from '../types';
import { INITIAL_ORDERS, STOCK_ALERTS, APP_LOGO } from '../data/mockData';

interface ManagerDashboardProps {
  onShowToast: (msg: string) => void;
  onExitManager: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  onShowToast,
  onExitManager
}) => {
  const [dateFilter, setDateFilter] = useState<'Today' | '7D' | 'MTD'>('Today');
  const [chartMode, setChartMode] = useState<'rev' | 'bev' | 'pass'>('rev');
  const [orderStatusTab, setOrderStatusTab] = useState<'all' | 'brewing' | 'pickup' | 'completed'>('all');
  const [orderQuery, setOrderQuery] = useState('');
  const [orders, setOrders] = useState<LiveOrder[]>(INITIAL_ORDERS);
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [quickCust, setQuickCust] = useState('');
  const [quickItem, setQuickItem] = useState('Signature Spanish Latte ($6.50)');
  const [activeSidebarNav, setActiveSidebarNav] = useState('dashboard');

  const handleAdvanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (ord.status === 'brewing') {
            onShowToast(`Order ${ord.orderNumber} advanced: Ready for Pickup!`);
            return { ...ord, status: 'pickup' };
          }
          if (ord.status === 'pickup') {
            onShowToast(`Order ${ord.orderNumber} handed off to customer!`);
            return { ...ord, status: 'completed' };
          }
        }
        return ord;
      })
    );
  };

  const handlePrint = (orderNumber: string) => {
    onShowToast(`Thermal ticket printed for ${orderNumber} to Barista Line 1`);
  };

  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guest = quickCust.trim() || 'Express Guest';
    const newOrd: LiveOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `#BB-${Math.floor(8922 + Math.random() * 100)}`,
      guestName: guest,
      guestTier: 'Walk-in Express',
      configuredItems: [quickItem],
      total: 6.50,
      channel: 'Bay 1',
      elapsedTime: 'Just now',
      status: 'brewing',
      timestamp: 'Just now'
    };
    setOrders([newOrd, ...orders]);
    setQuickOrderOpen(false);
    setQuickCust('');
    onShowToast(`Dispatched ${newOrd.orderNumber} to barista queue!`);
  };

  const filteredOrders = orders.filter((ord) => {
    if (orderStatusTab !== 'all' && ord.status !== orderStatusTab) return false;
    if (orderQuery.trim()) {
      const q = orderQuery.toLowerCase();
      const matchName = ord.guestName.toLowerCase().includes(q);
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchItem = ord.configuredItems.some((i) => i.toLowerCase().includes(q));
      if (!matchName && !matchNum && !matchItem) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-64 lg:w-72 bg-surface-container-low border-r border-surface-container flex flex-col justify-between shrink-0">
        <div className="flex flex-col">
          {/* Logo & Roastery Name */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-surface-container">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs">
                <img src={APP_LOGO} alt="Bun & Brew" className="w-7 h-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-primary tracking-tight">
                  BUN &amp; BREW
                </span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                  Artisanal Roastery
                </span>
              </div>
            </div>

            <button
              onClick={onExitManager}
              className="md:hidden text-xs font-bold text-secondary px-2 py-1 rounded bg-surface-container"
            >
              Close
            </button>
          </div>

          {/* Active Branch Indicator */}
          <div className="p-3">
            <div className="bg-surface-container rounded-xl p-3 flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">store</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                    Active Location
                  </span>
                  <span className="text-xs font-bold text-on-surface">Downtown Flagship</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                unfold_more
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-3 mt-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              { id: 'products', label: 'Products & Menu', icon: 'menu_book' },
              { id: 'categories', label: 'Categories', icon: 'category' },
              { id: 'orders', label: 'Orders', icon: 'receipt_long', badge: `${orders.filter(o => o.status !== 'completed').length} Active`, badgeClass: 'bg-secondary-container text-on-secondary-container' },
              { id: 'customers', label: 'Customers', icon: 'group' },
              { id: 'offers', label: 'Offers & Discounts', icon: 'loyalty' },
              { id: 'expert', label: 'Coffee Expert System', icon: 'psychology', badge: 'AI Rules', badgeClass: 'bg-surface-container-highest text-on-surface-variant' },
              { id: 'recipes', label: 'Recipes & Ingredients', icon: 'skillet', badge: 'Low', badgeClass: 'bg-error-container text-on-error-container' },
              { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
              { id: 'settings', label: 'Settings', icon: 'settings' },
            ].map((item) => {
              const active = activeSidebarNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSidebarNav(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-primary-container text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Manager User Footer Card */}
        <div className="p-3 border-t border-surface-container">
          <div className="bg-surface-container rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
                <span className="material-symbols-outlined text-[16px]">person</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Sarah Jenkins</span>
                <span className="text-[11px] text-on-surface-variant">Store Manager</span>
              </div>
            </div>
            <button
              onClick={onExitManager}
              className="text-xs font-bold text-secondary hover:underline cursor-pointer"
              title="Return to Customer App"
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* Main Barista Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 px-4 lg:px-6 bg-surface/90 backdrop-blur-xl border-b border-surface-container flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                className="w-full h-10 pl-9 pr-3 bg-surface-container-lowest rounded-full text-xs text-on-surface placeholder:text-on-surface-variant border border-surface-container focus:outline-none focus:border-secondary"
                placeholder="Search orders, products, baristas, recipes..."
                type="text"
              />
            </div>
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>Downtown Roastery • Live Sync Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onShowToast('Add Product modal triggered')}
              className="h-9 px-3.5 rounded-full bg-surface-container text-primary text-xs font-bold flex items-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span className="hidden sm:inline">Add Product</span>
            </button>
            <button
              onClick={() => setQuickOrderOpen(true)}
              className="h-9 px-3.5 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center gap-1 hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
              <span>New Order</span>
            </button>
            <button
              onClick={() => onShowToast('2 unread roastery notifications')}
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-1 ring-surface"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Body */}
        <main className="p-4 lg:p-6 flex flex-col gap-5 overflow-y-auto">
          {/* Top Greeting & Live Store Banner */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-container-low p-4 sm:p-5 rounded-2xl shadow-xs border border-surface-container">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                  Good morning, Manager Sarah!
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                  Rush Hour (8:00 AM – 11:30 AM)
                </span>
              </div>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">pin_drop</span>
                Downtown Roastery Branch (Bldg B) • Live Barista Line Active (Station 1–4)
              </p>
            </div>

            {/* Filter Pills & Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex p-1 bg-surface-container rounded-full border border-surface-container">
                {(['Today', '7D', 'MTD'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setDateFilter(r);
                      onShowToast(`Metrics refreshed for ${r}`);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      dateFilter === r
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {r === 'Today' ? 'Today' : r === '7D' ? 'Last 7 Days' : 'Month to Date'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onShowToast('Exported audit report (PDF/CSV) to downloads')}
                className="h-8 px-3 rounded-full bg-surface-container-lowest text-on-surface text-xs font-bold flex items-center gap-1 border border-surface-container shadow-xs cursor-pointer hover:bg-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export Report</span>
              </button>

              <button
                onClick={() => setQuickOrderOpen(true)}
                className="h-8 px-3 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Quick Order</span>
              </button>
            </div>
          </div>

          {/* KPI Cards Row (5 cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {/* Sales */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Total Sales Today
                </span>
                <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                </div>
              </div>
              <div className="my-2">
                <span className="text-xl font-black text-primary tracking-tight">$4,892.50</span>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[15px]">trending_up</span>
                  <span>+14.2%</span>
                  <span className="text-on-surface-variant font-normal">vs yesterday</span>
                </div>
              </div>
              <div className="h-7 w-full">
                <svg className="w-full h-full text-secondary" fill="none" viewBox="0 0 100 28">
                  <path d="M0 24 Q 15 22, 28 15 T 50 16 T 72 7 T 100 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                  <path d="M0 24 Q 15 22, 28 15 T 50 16 T 72 7 T 100 3 L 100 28 L 0 28 Z" fill="currentColor" fillOpacity="0.12" />
                </svg>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                </div>
              </div>
              <div className="my-2">
                <span className="text-xl font-black text-primary tracking-tight">418 Orders</span>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[15px]">trending_up</span>
                  <span>+8.5%</span>
                  <span className="text-on-surface-variant font-normal">avg $11.70</span>
                </div>
              </div>
              <div className="h-7 w-full">
                <svg className="w-full h-full text-on-secondary-container" fill="none" viewBox="0 0 100 28">
                  <path d="M0 22 Q 20 20, 35 12 T 65 14 T 85 8 T 100 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                  <path d="M0 22 Q 20 20, 35 12 T 65 14 T 85 8 T 100 4 L 100 28 L 0 28 Z" fill="currentColor" fillOpacity="0.12" />
                </svg>
              </div>
            </div>

            {/* Live Queue */}
            <div className="bg-primary-container text-on-primary p-4 rounded-2xl shadow-xs border border-primary/30 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider">
                  Live Queue
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-bright animate-ping"></span>
                  Live
                </div>
              </div>
              <div className="my-2">
                <span className="text-xl font-black tracking-tight">14 In-Progress</span>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-surface-variant font-medium">
                  <span>6 Brewing</span> • <span>5 Warming</span> • <span>3 Ready</span>
                </div>
              </div>
              <div className="w-full bg-primary rounded-full h-2 flex overflow-hidden">
                <div className="bg-secondary-container h-full" style={{ width: '43%' }}></div>
                <div className="bg-secondary h-full" style={{ width: '36%' }}></div>
                <div className="bg-surface-bright h-full" style={{ width: '21%' }}></div>
              </div>
            </div>

            {/* Total Guests */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Total Customers
                </span>
                <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[16px]">group</span>
                </div>
              </div>
              <div className="my-2">
                <span className="text-xl font-black text-primary tracking-tight">1,280 Guests</span>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[15px]">loyalty</span>
                  <span>64%</span>
                  <span className="text-on-surface-variant font-normal">Loyalty Repeat</span>
                </div>
              </div>
              <div className="h-7 w-full">
                <svg className="w-full h-full text-secondary" fill="none" viewBox="0 0 100 28">
                  <path d="M0 26 Q 25 18, 45 20 T 75 10 T 100 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                  <path d="M0 26 Q 25 18, 45 20 T 75 10 T 100 6 L 100 28 L 0 28 Z" fill="currentColor" fillOpacity="0.12" />
                </svg>
              </div>
            </div>

            {/* Net Margin */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Net Roastery Margin
                </span>
                <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[16px]">pie_chart</span>
                </div>
              </div>
              <div className="my-2">
                <span className="text-xl font-black text-primary tracking-tight">$3,620.10</span>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[15px]">coffee_maker</span>
                  <span>74.0%</span>
                  <span className="text-on-surface-variant font-normal">Single-Origin Roast</span>
                </div>
              </div>
              <div className="h-7 w-full">
                <svg className="w-full h-full text-secondary" fill="none" viewBox="0 0 100 28">
                  <path d="M0 20 Q 30 18, 55 12 T 80 8 T 100 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                  <path d="M0 20 Q 30 18, 55 12 T 80 8 T 100 3 L 100 28 L 0 28 Z" fill="currentColor" fillOpacity="0.12" />
                </svg>
              </div>
            </div>
          </div>

          {/* Analytical 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Rush Chart & Live Orders Table */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {/* Hourly Sales & Rush Velocity Chart */}
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-xs border border-surface-container flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-primary tracking-tight">
                      Hourly Sales &amp; Rush Velocity
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Real-time revenue curve compared to yesterday's espresso throughput
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container self-start sm:self-auto">
                    {[
                      { id: 'rev' as const, label: 'Hourly Revenue' },
                      { id: 'bev' as const, label: 'Drink vs Bakery' },
                      { id: 'pass' as const, label: 'Dine-in vs Pickup' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setChartMode(m.id);
                          onShowToast(`Switched view to ${m.label}`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          chartMode === m.id
                            ? 'bg-surface-container-lowest text-primary shadow-xs'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Callout Chips */}
                <div className="flex items-center gap-3 flex-wrap py-1.5 bg-surface-container-low px-3 rounded-xl border border-surface-container text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="text-on-surface-variant">Today's Peak:</span>
                    <span className="font-bold text-primary">10:15 AM ($640/hr)</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                    <span className="text-on-surface-variant">Yesterday Parallel:</span>
                    <span className="font-bold text-on-surface">8:45 AM ($512/hr)</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1 text-secondary font-bold">
                    <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
                    <span>Top Pour: Spanish Latte (142 cups)</span>
                  </div>
                </div>

                {/* SVG Curve */}
                <div className="w-full h-56 relative flex flex-col justify-end pt-2">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 220">
                    <defs>
                      <linearGradient id="todayGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3B241C" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#3B241C" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>
                    <line stroke="#E7E2D9" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="180" y2="180" />
                    <line stroke="#E7E2D9" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="120" y2="120" />
                    <line stroke="#E7E2D9" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="60" y2="60" />

                    <path
                      d="M 20 180 C 80 170, 110 130, 160 85 C 210 40, 240 100, 300 110 C 360 120, 420 70, 480 90 C 540 110, 600 140, 680 150"
                      fill="none"
                      stroke="#D4C3BE"
                      strokeDasharray="6 6"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 20 180 C 70 160, 110 90, 160 50 C 210 10, 250 80, 310 95 C 370 110, 410 40, 470 25 C 530 10, 580 85, 680 110 L 680 190 L 20 190 Z"
                      fill="url(#todayGrad)"
                    />
                    <path
                      d="M 20 180 C 70 160, 110 90, 160 50 C 210 10, 250 80, 310 95 C 370 110, 410 40, 470 25 C 530 10, 580 85, 680 110"
                      fill="none"
                      stroke="#3B241C"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                    <circle cx="160" cy="50" fill="#3B241C" r="5" stroke="#FEF9F0" strokeWidth="2" />
                    <circle cx="470" cy="25" fill="#79573f" r="6" stroke="#FEF9F0" strokeWidth="2.5" />
                  </svg>
                  <div className="flex justify-between text-on-surface-variant text-[11px] font-semibold pt-2 border-t border-surface-container">
                    <span>6:00 AM</span>
                    <span>7:30 AM</span>
                    <span className="font-bold text-primary">8:30 AM (Rush)</span>
                    <span>9:30 AM</span>
                    <span className="font-bold text-secondary">10:15 AM (Peak $640)</span>
                    <span>11:30 AM</span>
                    <span>1:00 PM</span>
                    <span>3:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Active Live Orders Table */}
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-xs border border-surface-container flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-primary tracking-tight">
                        Active Live Orders
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                        {orders.length} Active
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Live baristamatic fulfillment queue &amp; handcraft dispatch
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                      search
                    </span>
                    <input
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 rounded-full bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant border border-surface-container focus:outline-none focus:border-secondary"
                      placeholder="Filter by ID, guest..."
                      type="text"
                    />
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'all' as const, label: `All Orders (${orders.length})` },
                    { id: 'brewing' as const, label: `Brewing & Handcraft (${orders.filter(o => o.status === 'brewing').length})` },
                    { id: 'pickup' as const, label: `Ready for Pickup (${orders.filter(o => o.status === 'pickup').length})` },
                    { id: 'completed' as const, label: `Completed (${orders.filter(o => o.status === 'completed').length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderStatusTab(tab.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        orderStatusTab === tab.id
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-on-surface-variant font-bold bg-surface-container-low rounded-xl">
                        <th className="py-2.5 px-3 rounded-l-xl">Order ID</th>
                        <th className="py-2.5 px-3">Guest &amp; Tier</th>
                        <th className="py-2.5 px-3">Configured Items</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Channel</th>
                        <th className="py-2.5 px-3">Elapsed</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right rounded-r-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {filteredOrders.map((ord) => (
                        <tr
                          key={ord.id}
                          className="hover:bg-surface-container-low/60 transition-colors"
                        >
                          <td className="py-3 px-3 font-bold text-primary">{ord.orderNumber}</td>
                          <td className="py-3 px-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-on-surface">{ord.guestName}</span>
                              <span className="text-[11px] text-secondary font-semibold">
                                {ord.guestTier}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex flex-col">
                              {ord.configuredItems.map((ci, idx) => (
                                <span
                                  key={idx}
                                  className={idx === 0 ? 'text-on-surface font-semibold' : 'text-on-surface-variant text-[11px]'}
                                >
                                  {ci}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold text-primary">${ord.total.toFixed(2)}</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 text-on-surface-variant font-medium">
                              <span className="material-symbols-outlined text-[15px] text-secondary">
                                takeout_dining
                              </span>
                              {ord.channel}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-on-surface-variant">{ord.elapsedTime}</td>
                          <td className="py-3 px-3">
                            {ord.status === 'brewing' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                Brewing
                              </span>
                            )}
                            {ord.status === 'pickup' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-primary text-[11px] font-bold">
                                <span className="material-symbols-outlined text-[14px] text-secondary">
                                  check_circle
                                </span>
                                Ready for Pickup
                              </span>
                            )}
                            {ord.status === 'completed' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold">
                                Completed
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              {ord.status !== 'completed' && (
                                <button
                                  onClick={() => handleAdvanceStatus(ord.id)}
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                    ord.status === 'brewing'
                                      ? 'bg-primary text-on-primary hover:bg-primary-container'
                                      : 'bg-secondary text-on-secondary hover:bg-secondary/90'
                                  }`}
                                >
                                  {ord.status === 'brewing' ? 'Ready' : 'Hand Off'}
                                </button>
                              )}
                              <button
                                onClick={() => handlePrint(ord.orderNumber)}
                                title="Print Barista Ticket"
                                className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">print</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Best-sellers, Inventory Alerts, Expert Telemetry */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Best-Selling Today */}
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-xs border border-surface-container flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-primary tracking-tight">Best-Selling Today</h3>
                    <p className="text-xs text-on-surface-variant">Top artisanal roasts &amp; bakery draws</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    { rank: '#1 Spanish Latte', orders: '142 orders • $1,242.50', tag: '+18%', sub: 'Hot / Iced', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCniIkLOIODjM8R_usIB2TcNa7SevUGVhcTM3aGTOp8AUTDulN39Tb3y9A1tKMPKWc_7inVUKUFKpuhFUOfevIMX9MFZ6F7FWVn5g4pakNVPg7OAReEVWWcgdiE_RorSsE69PbGr9zxROO6JyTKOBI3HzNdETQAQVBZm9n7y01Zk325bmJkQXKHmWBHcG4gysYMehb9mpdbfQklm8GYNC86Z5vCwRK9TlvSmgbIlvMVq4CEb4pqeH1z' },
                    { rank: '#2 Pistachio Brioche', orders: '98 orders • $411.60', tag: 'Fresh Bake', sub: 'Batch #4', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeflF9wggW5Hs1Z063a_Qqbh61DGwmE97KxaRRAGN4pOD-RckX53QCsNkxSi05T9-gcRNrRMEeIhKdm5o_LZ_BcDpMBzGrJmFIC9xuonihILiu5nS-ECPyM4AgVcJghqmYMt1eEewuuIachbTLQyOOq_CD2DGT8KRQzErAzYB7ZGWeL9Dhk77xJXzI6acY7QyURfOBNd-KZKBxcLKoVgSLcZQ9y2DKyTydmCayXrsljXxQG3LRLLEK' },
                    { rank: '#3 Cold Brew Reserve', orders: '74 orders • $355.20', tag: '18h Steep', sub: 'Single Origin', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNocO-hPicoXTCUkIJuUYO5ROAqWtHFqxQTeG8rfvV02BfoBm9mEpLZsm2GADA9gbHD8L2RX9EtiFZy3folkcIU5UIZeUWcIpm7xl-JDZP9qFDxBaDFl8Yw58oOZ4Uv6TldxeumNd-1Gp_X1s0IGfJRPoLRdDCZdEOWTMShBA--ycJS8UEugD4ScnOb0C56coKWDdj2cWZ9lpXOnjJmaQ-7qv4BsAqt4dXDhmTMMcuswc3aWsLavhN' },
                  ].map((bs, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-container"
                    >
                      <div className="flex items-center gap-2.5">
                        <img className="w-11 h-11 rounded-xl object-cover" alt={bs.rank} src={bs.img} />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-primary">{bs.rank}</span>
                          <span className="text-[11px] text-on-surface-variant">{bs.orders}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-secondary">{bs.tag}</span>
                        <span className="text-[10px] text-on-surface-variant">{bs.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock & Batch Alerts */}
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-xs border-l-4 border-l-secondary border border-surface-container flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">
                      inventory_2
                    </span>
                    <h3 className="text-base font-bold text-primary tracking-tight">
                      Stock &amp; Batch Alerts
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                    3 Critical
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {STOCK_ALERTS.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">{alert.name}</span>
                        <span className={`text-xs font-bold ${alert.severity === 'critical' ? 'text-error' : 'text-secondary'}`}>
                          {alert.currentStock}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        {alert.threshold}
                      </p>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-surface-container/60">
                        <div className="w-28 bg-surface-variant rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${alert.severity === 'critical' ? 'bg-error' : 'bg-secondary'}`}
                            style={{ width: `${alert.percentage}%` }}
                          ></div>
                        </div>
                        <button
                          onClick={() => onShowToast(`Inventory action triggered: ${alert.actionText}`)}
                          className="text-xs font-bold text-primary hover:text-secondary underline cursor-pointer"
                        >
                          {alert.actionText}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coffee Expert System Telemetry */}
              <div className="bg-primary text-on-primary p-4 sm:p-5 rounded-2xl shadow-md border border-primary/20 flex flex-col gap-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center text-tertiary-fixed">
                      <span className="material-symbols-outlined text-[18px]">psychology</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-primary tracking-tight">
                        Coffee Expert System
                      </h3>
                      <p className="text-[10px] text-primary-fixed-dim">Decision Tree Inference Engine</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/15 text-primary-fixed text-[10px] font-bold">
                    v2.4 Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-primary-container border border-primary/40 flex flex-col">
                    <span className="text-[10px] text-on-primary-container font-semibold">Concierge Runs</span>
                    <span className="text-base font-black text-on-primary mt-0.5">184 Today</span>
                    <span className="text-[10px] text-tertiary-fixed-dim mt-0.5">+31% vs avg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary-container border border-primary/40 flex flex-col">
                    <span className="text-[10px] text-on-primary-container font-semibold">Conversion to Cart</span>
                    <span className="text-base font-black text-on-primary mt-0.5">78.4%</span>
                    <span className="text-[10px] text-tertiary-fixed-dim mt-0.5">High precision</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-lowest/10 flex flex-col gap-1 border border-white/10 text-xs">
                  <span className="text-[10px] text-tertiary-fixed uppercase font-bold tracking-wider">
                    Top Fired Rule:
                  </span>
                  <p className="text-on-primary leading-snug">
                    <span className="font-bold text-secondary-fixed">Rule #1:</span> [Iced] &amp; [Oat Milk] &amp; [Smooth/Sweet] → <span className="underline decoration-secondary-fixed">Spanish Latte / Iced Vanilla</span>
                  </p>
                  <span className="text-[10px] text-on-primary-container">
                    Captured 42% of automated customer queries today
                  </span>
                </div>

                <button
                  onClick={() => onShowToast('Decision tree weights editor opened!')}
                  className="w-full py-2 rounded-xl bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-xs font-bold text-on-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Tune Decision Weights</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Quick Order Modal */}
      {quickOrderOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg p-5 flex flex-col gap-4 border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary">Rapid Barista Quick Order</h3>
                  <p className="text-xs text-on-surface-variant">Direct express POS insertion for counter rush</p>
                </div>
              </div>
              <button
                onClick={() => setQuickOrderOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleQuickOrderSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                  Customer / Guest Identifier
                </label>
                <input
                  value={quickCust}
                  onChange={(e) => setQuickCust(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-secondary"
                  placeholder="e.g. David Ross (Walk-in)"
                  type="text"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                  Select Preset Item
                </label>
                <select
                  value={quickItem}
                  onChange={(e) => setQuickItem(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-secondary"
                >
                  <option value="Signature Spanish Latte ($6.50)">Signature Spanish Latte • $6.50</option>
                  <option value="Single-Origin Cold Brew ($5.50)">Single-Origin Cold Brew • $5.50</option>
                  <option value="Flat White Ristretto ($5.25)">Flat White Ristretto • $5.25</option>
                  <option value="Pistachio Brioche ($4.75)">Pistachio Brioche • $4.75</option>
                  <option value="V60 Single Pour ($6.00)">V60 Single Pour Over • $6.00</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                    Milk Prep
                  </label>
                  <select className="w-full h-9 px-3 bg-surface-container-low rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-secondary">
                    <option>Barista Oat Milk</option>
                    <option>Whole Milk Organic</option>
                    <option>Almond Milk</option>
                    <option>None (Black)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                    Fulfillment Spot
                  </label>
                  <select className="w-full h-9 px-3 bg-surface-container-low rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-secondary">
                    <option>Express Pickup Bay 1</option>
                    <option>Counter Pickup</option>
                    <option>Dine-in Floor</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container mt-2">
                <button
                  type="button"
                  onClick={() => setQuickOrderOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_task</span>
                  <span>Dispatch to Barista Queue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
