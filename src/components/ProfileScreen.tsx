import React, { useState } from 'react';
import { ViewMode } from '../types';
import { USER_AVATAR } from '../data/mockData';

interface ProfileScreenProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (msg: string) => void;
  onSignOut: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  onShowToast,
  onSignOut
}) => {
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [accessibilityComfort, setAccessibilityComfort] = useState(true);

  const handleLangToggle = (lang: 'en' | 'ar') => {
    setCurrentLang(lang);
    onShowToast(`Language switched to ${lang === 'en' ? 'English' : 'العربية'}`);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto bg-surface space-y-4 pt-3">
      {/* Profile Header Hero Card */}
      <section className="px-4">
        <div className="relative bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-xs border border-surface-container overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none"></div>
          <div className="flex items-start gap-4 relative z-10">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full p-1 bg-surface-container-high shadow-inner">
                <img
                  alt="Sarah Jenkins profile"
                  className="w-full h-full rounded-full object-cover"
                  src={USER_AVATAR}
                />
              </div>
              <button
                aria-label="Edit Profile Photo"
                onClick={() => onShowToast('Photo edit opened')}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">photo_camera</span>
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container mb-1 shadow-xs">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  stars
                </span>
                <span className="text-[11px] font-bold">Gold Brew Member</span>
              </div>
              <h1 className="text-xl font-bold text-primary tracking-tight truncate">
                Sarah Jenkins
              </h1>
              <p className="text-xs text-on-surface-variant truncate mt-0.5">
                sarah.jenkins@university.edu
              </p>
              <button
                onClick={() => onShowToast('Profile edit sheet opened')}
                className="inline-flex items-center gap-1 mt-2 text-secondary text-xs font-bold active:opacity-75 cursor-pointer"
                type="button"
              >
                <span>Edit Profile</span>
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty & Rewards Card */}
      <section className="px-4">
        <div className="relative bg-primary-container text-on-primary rounded-2xl p-5 shadow-md overflow-hidden border border-primary/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary-fixed-dim text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_cafe
                </span>
                <span className="text-xs font-bold tracking-wide uppercase text-on-primary-container">
                  Bean Rewards
                </span>
              </div>
              <span className="text-xl font-black text-on-primary tracking-tight">
                140 <span className="text-xs font-normal text-on-primary-container">/ 200 pts</span>
              </span>
            </div>

            {/* Gauge */}
            <div className="mt-3">
              <div className="w-full h-3 bg-surface-container/20 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-secondary-fixed-dim rounded-full transition-all duration-500"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-on-primary-container text-xs font-medium">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed-dim">
                redeem
              </span>
              <p>60 points until your next Free Signature Beverage!</p>
            </div>

            <div className="mt-4 pt-1 flex items-center justify-between">
              <button
                onClick={() => onShowToast('Rewards catalog opened! 2 drinks eligible.')}
                className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-full bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold shadow-xs active:scale-[0.98] transition-transform cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">card_giftcard</span>
                <span>Redeem Rewards (2 available)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Your Favorites */}
      <section className="pt-1">
        <div className="px-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-secondary text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <h2 className="text-base font-bold text-primary">Your Favorites</h2>
          </div>
          <span className="text-xs text-on-surface-variant font-bold">3 saved</span>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-2">
          {/* Favorite 1 */}
          <div className="w-64 flex-shrink-0 bg-surface-container-low rounded-2xl p-3 shadow-xs border border-surface-container flex flex-col justify-between">
            <div>
              <div className="relative w-full h-28 rounded-xl overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt="Iced Spanish Latte"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAifurbK0S_e2gf2NPnX7dFWSP7NC7_MvmHqezWH8eLW8oEnu71-MBZlrFz4q0S-jCh4eDRZbSzDzmzNiVUKPaHx3eInPbsKPtIBo7z0W3GS7MVWnsgIKiqlQOx2v-U2npcRT25aJqzOgyh-B9BA3cncaLA_qZCoLWZDXIsJqG0xji5kYLmyHlyGVHCu3n-R-JNc70W4Pt2jNJ9-g-n5bDgBOGQhuOaV0woxPS7f53dX6en_bKE-aPu"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-[10px] text-primary font-bold backdrop-blur-sm">
                  Iced
                </span>
              </div>
              <div className="mt-2.5">
                <h3 className="text-xs font-bold text-primary truncate">Spanish Latte</h3>
                <p className="text-[11px] text-on-surface-variant truncate">Iced · Oat Milk · Medium</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-container/40">
              <span className="text-xs font-bold text-primary">$5.50</span>
              <button
                onClick={() => onShowToast('Spanish Latte added to cart!')}
                className="h-8 px-3.5 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">replay</span>
                <span>Reorder</span>
              </button>
            </div>
          </div>

          {/* Favorite 2 */}
          <div className="w-64 flex-shrink-0 bg-surface-container-low rounded-2xl p-3 shadow-xs border border-surface-container flex flex-col justify-between">
            <div>
              <div className="relative w-full h-28 rounded-xl overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt="Cold Brew Reserve"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3D_Sp1FzBsznSUJpGP-RUICLUopIEeD59hUvTy9YPapdJDXF7GFvoxx4zMqUCGKp-CcbQ45PMjxGXi4nT36bo5or91_V7rG2M3fCBkswKhOtWAqz5nk84D_kPRG8VME9vtB-in-ftTkHXPgdZO70lRGv9ZamBT1D8smYk1m-PRdeG_vCCd1LS0STzJn7NguwweEjnbZz9moErphOVyEbJxXTE7Wz2YMnKMCjdVOMkMCqxmFGCEE7g"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-[10px] text-secondary font-bold backdrop-blur-sm">
                  Reserve
                </span>
              </div>
              <div className="mt-2.5">
                <h3 className="text-xs font-bold text-primary truncate">Cold Brew Reserve</h3>
                <p className="text-[11px] text-on-surface-variant truncate">Steeped 18h · Ethiopia Yirgacheffe</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-container/40">
              <span className="text-xs font-bold text-primary">$4.75</span>
              <button
                onClick={() => onShowToast('Cold Brew Reserve added to cart!')}
                className="h-8 px-3.5 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">replay</span>
                <span>Reorder</span>
              </button>
            </div>
          </div>

          {/* Favorite 3 */}
          <div className="w-64 flex-shrink-0 bg-surface-container-low rounded-2xl p-3 shadow-xs border border-surface-container flex flex-col justify-between">
            <div>
              <div className="relative w-full h-28 rounded-xl overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt="Pistachio Brioche Bun"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLnh3AWFlJQdE4tMnCJqtsCQcJgOxuyFwnUXWXhTDSDLBMMTdfCFmiZ8oYjJ5PKukefUweWMoy6XfkNk703ucWUDELUcA4uDSFvy5kOLQMAgFjEPwuyhZzVZqmbzaagYqfrGHLZFGxfLSay4hM_leXqQOcFsjo11E7Xc5bJh4R8DZzh_TeQ6Rdo7ElVfuTGH77_0LvIaJG5ytcH_sb4ytX0Ysac-5JyCG6SsNc3RBRcReHoDOSLh1y"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-secondary-container text-[10px] text-on-secondary-container font-bold">
                  Bakery
                </span>
              </div>
              <div className="mt-2.5">
                <h3 className="text-xs font-bold text-primary truncate">Pistachio Brioche Bun</h3>
                <p className="text-[11px] text-on-surface-variant truncate">Warm · House Cream Filling</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-container/40">
              <span className="text-xs font-bold text-primary">$4.25</span>
              <button
                onClick={() => onShowToast('Pistachio Brioche added to cart!')}
                className="h-8 px-3.5 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">replay</span>
                <span>Reorder</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">history</span>
            <h2 className="text-base font-bold text-primary">Recent Orders</h2>
          </div>
          <button
            onClick={() => onNavigate('tracking')}
            className="text-xs text-secondary font-bold hover:underline cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Active Order Card */}
          <div className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-[20px] animate-spin" style={{ animationDuration: '4s' }}>
                    autorenew
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-primary">#BB-8921</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                      In Prep
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Today, 10:24 AM · Campus Roastery
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-primary">$9.99</span>
            </div>

            <div className="mt-3 pt-2 bg-surface-container/60 rounded-xl p-2.5 flex items-center justify-between border border-surface-container">
              <span className="text-xs text-on-surface truncate">
                Spanish Latte, Pistachio Bun
              </span>
              <button
                onClick={() => onNavigate('tracking')}
                className="flex-shrink-0 h-8 px-3 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">my_location</span>
                <span>Track Live</span>
              </button>
            </div>
          </div>

          {/* Completed Order */}
          <div className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">#BB-7842</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                      Completed
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Yesterday · Spanish Latte</p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary">$5.50</span>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => onShowToast('Digital receipt opened for #BB-7842')}
                className="h-8 px-3 rounded-full bg-surface-container-high text-primary text-xs font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">receipt</span>
                <span>Receipt</span>
              </button>
              <button
                onClick={() => onShowToast('Items added to cart!')}
                className="h-8 px-3 rounded-full bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">replay</span>
                <span>Reorder</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preferences & Account Section */}
      <section className="px-4">
        <h2 className="text-base font-bold text-primary mb-2">Preferences &amp; Account</h2>
        <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-xs border border-surface-container divide-y divide-surface-container">
          {/* Saved Addresses */}
          <div
            onClick={() => onShowToast('Branches & addresses view')}
            className="flex items-center justify-between p-3.5 hover:bg-surface-container active:bg-surface-container transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">
                  Saved Branches &amp; Addresses
                </span>
                <span className="text-[11px] text-on-surface-variant">Campus Roastery, Home Dorm</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
          </div>

          {/* Payment Methods */}
          <div
            onClick={() => onShowToast('Payment methods view')}
            className="flex items-center justify-between p-3.5 hover:bg-surface-container active:bg-surface-container transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">Payment Methods</span>
                <span className="text-[11px] text-on-surface-variant">Apple Pay, Visa •••• 4022</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
          </div>

          {/* Language Preference */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">language</span>
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">Language Preference</span>
                <span className="text-[11px] text-on-surface-variant">English / العربية</span>
              </div>
            </div>
            <div className="bg-surface-container p-1 rounded-full flex items-center gap-1 shadow-inner border border-surface-container">
              <button
                type="button"
                onClick={() => handleLangToggle('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLangToggle('ar')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentLang === 'ar'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                عربي
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">Notifications</span>
                <span className="text-[11px] text-on-surface-variant">Brew status &amp; fresh drops</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setNotificationsEnabled(!notificationsEnabled);
                onShowToast(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                notificationsEnabled ? 'bg-secondary' : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>

          {/* Accessibility Comfort */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">accessibility_new</span>
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">Accessibility Comfort</span>
                <span className="text-[11px] text-on-surface-variant">Enhanced touch targets</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setAccessibilityComfort(!accessibilityComfort);
                onShowToast(`Comfort mode ${!accessibilityComfort ? 'activated' : 'deactivated'}`);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                accessibilityComfort ? 'bg-secondary' : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  accessibilityComfort ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>

          {/* Help & Barista Support */}
          <div
            onClick={() => onShowToast('Connecting to Downtown Roastery barista chat...')}
            className="flex items-center justify-between p-3.5 hover:bg-surface-container active:bg-surface-container transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">Help &amp; Barista Support</span>
                <span className="text-[11px] text-on-surface-variant">Live chat &amp; FAQ</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
          </div>
        </div>
      </section>

      {/* Sign Out CTA Action */}
      <section className="px-4 pt-2">
        <button
          onClick={onSignOut}
          className="w-full h-12 rounded-full bg-surface-container-high text-error flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-transform shadow-xs cursor-pointer hover:bg-error-container"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Sign Out</span>
        </button>
        <div className="text-center mt-3">
          <span className="text-[10px] text-outline font-semibold">
            BUN &amp; BREW App v2.4.0 (Batch Roasting 2025)
          </span>
        </div>
      </section>
    </div>
  );
};
