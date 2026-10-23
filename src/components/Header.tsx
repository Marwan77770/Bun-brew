import React from 'react';
import { ViewMode } from '../types';
import { USER_AVATAR } from '../data/mockData';
import { BunBrewLogo } from './BunBrewLogo';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  cartItemCount: number;
  onToggleManager?: () => void;
  isManagerView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  cartItemCount,
  onToggleManager,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(59,36,28,0.05)]">
      <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left active:scale-95 transition-transform cursor-pointer"
        >
          <BunBrewLogo size={34} />
          <div className="flex flex-col">
            <span className="text-[18px] font-bold text-primary tracking-tight leading-none">
              BUN &amp; BREW
            </span>
            <span className="text-[10px] text-secondary tracking-wider uppercase font-bold leading-none mt-0.5">
              Artisanal Roastery
            </span>
          </div>
        </button>

        {/* Right Actions: Manager quick badge, Cart icon, Profile */}
        <div className="flex items-center gap-2">
          {/* Subtle Manager Portal access button */}
          <button
            onClick={onToggleManager}
            className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Open Store Manager / Barista Portal"
          >
            <span className="material-symbols-outlined text-[19px]">dashboard</span>
          </button>

          {/* Cart Icon Button with active badge */}
          <button
            onClick={() => onNavigate('cart')}
            aria-label="View shopping bag"
            className="relative w-11 h-11 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:bg-surface-container active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">local_mall</span>
            {cartItemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-secondary text-on-secondary rounded-full text-[10px] leading-[18px] text-center font-bold">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Profile Avatar Button */}
          <button
            onClick={() => onNavigate('profile')}
            aria-label="View user profile"
            className="w-11 h-11 rounded-full p-0.5 bg-surface-container-high flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              src={USER_AVATAR}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
