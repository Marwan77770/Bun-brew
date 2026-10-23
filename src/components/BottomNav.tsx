import React from 'react';
import { ViewMode } from '../types';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { id: 'home' as ViewMode, label: 'Home', icon: 'cottage' },
    { id: 'menu' as ViewMode, label: 'Menu', icon: 'coffee' },
    { id: 'expert-preferences' as ViewMode, label: 'Expert', icon: 'psychology', hasBadge: true },
    { id: 'tracking' as ViewMode, label: 'Orders', icon: 'receipt_long' },
    { id: 'profile' as ViewMode, label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(59,36,28,0.06)] border-t border-surface-container">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const isActive =
            currentView === tab.id ||
            (tab.id === 'expert-preferences' && currentView === 'expert-results');

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-all cursor-pointer ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[23px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-secondary-fixed-dim ring-2 ring-surface"></span>
                )}
              </div>
              <span className="text-[11px] tracking-wide mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
