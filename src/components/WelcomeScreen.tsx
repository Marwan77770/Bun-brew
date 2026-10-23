import React, { useState } from 'react';
import { APP_LOGO } from '../data/mockData';
import { BunBrewLogo } from './BunBrewLogo';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onStart();
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-surface min-h-screen pt-4 pb-12 px-4 max-w-md mx-auto">
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container shadow-xs">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-[11px] font-bold text-secondary tracking-wide uppercase">
            Fresh Daily
          </span>
        </div>
        <button
          onClick={() => setIsArabic(!isArabic)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-[13px] font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">language</span>
          <span>{isArabic ? 'العربية | EN' : 'EN | العربية'}</span>
        </button>
      </div>

      {/* Brand Identity Lockup */}
      <div className="flex items-center gap-3.5 mb-4">
        <div className="relative w-14 h-14 rounded-full bg-surface-container-low shadow-sm flex items-center justify-center p-1 overflow-hidden shrink-0">
          <BunBrewLogo size={50} />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xl text-primary tracking-tight font-bold">
              BUN &amp; BREW
            </span>
            <span
              className="material-symbols-outlined text-secondary text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
          <p className="text-xs text-on-surface-variant truncate">
            Artisanal Coffee &amp; Fresh Bakes
          </p>
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-4 shadow-md bg-surface-container-low">
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="Velvety heart latte art next to fresh glistening cardamom brioche bun"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB5l9MJRmq9RuFmAkvIBKEZQzNFokyMhbQIE8_0mVIeXXttjQfeOGaidQwCgHNg23VytGjCxoancwLjup-CeGVEJ8-SxCPaBUFUgysHlBuqvSsAJ3_8omai1nfi4oFWrcsSgcXTJ-7wt-Kl6JLu0QOvp79PzAfiLvSFxWJHkqoNuUa83bMkP3H2q7RCUGtkoWtCW0Sv2YihuFCnfHHncoAQucAJRlgWsP5AXe8mABg1fxT8zSQRpNJ"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
          
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs">
            <span
              className="material-symbols-outlined text-[15px] text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_cafe
            </span>
            <span className="text-[11px] font-bold text-on-surface">Batch No. 04</span>
          </div>
          
          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs">
            <span
              className="material-symbols-outlined text-[15px] text-tertiary-fixed-dim"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bakery_dining
            </span>
            <span className="text-[11px] font-bold text-on-surface">Oven Warm</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-on-primary/20 backdrop-blur-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">temp_preferences_custom</span>
              </div>
              <span className="text-xs font-semibold tracking-wide">
                Single Origin Gesha &amp; Cardamom Brioche
              </span>
            </div>
            <div className="flex items-center gap-1 bg-on-primary/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-[11px] font-bold">4.9</span>
            </div>
          </div>
        </div>
      </div>

      {/* Powered by AI Badge */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container shadow-xs">
          <span className="material-symbols-outlined text-[16px] text-secondary">
            auto_awesome
          </span>
          <span className="text-[11px] font-bold tracking-wide">
            Powered by Coffee Expert System
          </span>
        </div>
      </div>

      {/* Headlines */}
      <div className="flex flex-col text-center mb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-1">
          Your Coffee, Your Way.
        </h1>
        <p className="text-sm text-on-surface-variant max-w-[320px] mx-auto leading-relaxed">
          Discover your next favorite cup with smart recommendations crafted precisely for your taste profile.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-2.5 w-full mb-2">
        <button
          onClick={onStart}
          className="w-full h-[52px] rounded-full bg-primary text-on-primary text-base font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
          type="button"
        >
          <span>Get Started</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <button
          onClick={() => setShowSignIn(!showSignIn)}
          className="w-full h-[52px] rounded-full bg-surface-container text-secondary text-base font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-surface-variant active:scale-[0.98] transition-all cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">login</span>
          <span>Sign In</span>
        </button>
      </div>

      {/* Sign In Sheet Modal */}
      {showSignIn && (
        <div className="flex flex-col w-full bg-surface-container-lowest p-4 rounded-2xl shadow-xl mb-3 border border-surface-container animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">waving_hand</span>
              <h3 className="text-base font-bold text-primary">Welcome Back</h3>
            </div>
            <button
              onClick={() => setShowSignIn(false)}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-95 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                Email or Phone
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                  alternate_email
                </span>
                <input
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-surface-container-low text-on-surface text-sm focus:bg-surface-container-lowest outline-none placeholder:text-outline/60 border border-transparent focus:border-secondary transition-all"
                  placeholder="barista@bunandbrew.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                  Password
                </label>
                <button className="text-[11px] text-secondary font-semibold hover:underline" type="button">
                  Forgot?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                  lock
                </span>
                <input
                  className="w-full h-11 pl-9 pr-10 rounded-xl bg-surface-container-low text-on-surface text-sm focus:bg-surface-container-lowest outline-none placeholder:text-outline/60 border border-transparent focus:border-secondary transition-all"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-outline hover:text-primary cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              className="w-full h-11 mt-1 rounded-full bg-primary text-on-primary text-sm font-bold flex items-center justify-center shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              type="submit"
            >
              Sign In to Account
            </button>
          </form>
        </div>
      )}

      {/* Continue as Guest */}
      <div className="flex items-center justify-center py-2">
        <button
          onClick={onStart}
          className="text-sm font-semibold text-secondary underline underline-offset-4 hover:text-primary active:opacity-75 transition-colors py-1 cursor-pointer"
          type="button"
        >
          Continue as Guest
        </button>
      </div>

      {/* Brand Reassurance Badges */}
      <div className="flex items-center justify-center gap-4 mt-auto pt-4 border-t border-surface-container/60">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-secondary">eco</span>
          <span className="text-xs">Ethically Sourced</span>
        </div>
        <span className="text-outline-variant">•</span>
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
          <span className="text-xs">Curbside in 5m</span>
        </div>
      </div>
    </div>
  );
};
