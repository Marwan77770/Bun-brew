import React, { useState } from 'react';
import { ExpertPreferences } from '../types';

interface ExpertPreferencesScreenProps {
  onFindMatches: (prefs: ExpertPreferences) => void;
}

export const ExpertPreferencesScreen: React.FC<ExpertPreferencesScreenProps> = ({
  onFindMatches
}) => {
  const [temperature, setTemperature] = useState<'hot' | 'iced' | 'both'>('iced');
  const [tasteProfile, setTasteProfile] = useState<'sweet' | 'balanced' | 'bold' | 'creamy' | 'refreshing'>('creamy');
  const [caffeineLevel, setCaffeineLevel] = useState<'high' | 'medium' | 'low' | 'decaf'>('medium');
  const [milkPreference, setMilkPreference] = useState<'regular' | 'oat' | 'almond' | 'lactose-free' | 'none'>('oat');
  const [sweetnessPreference, setSweetnessPreference] = useState<'zero' | 'light' | 'regular' | 'extra'>('light');
  const [vibe, setVibe] = useState<'boost' | 'smooth' | 'coldtreat' | 'dessert' | 'lightclean'>('smooth');
  const [budget, setBudget] = useState<'budget' | 'mid' | 'reserve'>('mid');

  const handleReset = () => {
    setTemperature('hot');
    setTasteProfile('balanced');
    setCaffeineLevel('medium');
    setMilkPreference('regular');
    setSweetnessPreference('regular');
    setVibe('smooth');
    setBudget('mid');
  };

  const handleSubmit = () => {
    onFindMatches({
      temperature,
      tasteProfile,
      caffeineLevel,
      milkPreference,
      sweetnessPreference,
      vibe,
      budget
    });
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto bg-surface">
      {/* Title Header */}
      <div className="px-4 pt-4 pb-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-secondary">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            psychology_alt
          </span>
          <span className="text-[11px] uppercase tracking-wider font-bold">
            HMI Expert Engine
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">
          Find Your Perfect Drink
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Tell us what you like, and our rule-based Coffee Expert will match you with tailored recipes.
        </p>
      </div>

      {/* Progress & Knowledge Base Card */}
      <div className="mx-4 mt-2 p-4 rounded-2xl bg-surface-container-low shadow-sm border border-surface-container flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">Step 1 of 2: Your Taste Profile</span>
          <span className="text-[11px] text-secondary bg-surface-container-high px-2 py-0.5 rounded-full font-bold">
            6 of 6 completed
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
          <div className="h-full bg-secondary rounded-full transition-all duration-300 w-full"></div>
        </div>
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs">Knowledge base loaded</span>
          <span className="text-xs text-secondary font-bold">18 Recipes mapped</span>
        </div>
      </div>

      {/* Questionnaire Form */}
      <div className="flex flex-col gap-4 px-4 mt-4">
        {/* 1. Temperature Preference */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">thermostat</span>
              1. Temperature Preference
            </label>
            <span className="text-[11px] text-secondary font-bold">Required</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hot' as const, label: 'Hot', icon: 'local_fire_department', color: 'text-error' },
              { id: 'iced' as const, label: 'Iced', icon: 'ac_unit', color: 'text-secondary-fixed' },
              { id: 'both' as const, label: 'Both / Any', icon: 'sync', color: 'text-secondary' },
            ].map((opt) => {
              const active = temperature === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setTemperature(opt.id)}
                  type="button"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl active:scale-95 transition-all text-center min-h-[58px] cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] mb-0.5 ${active ? 'text-secondary-fixed' : opt.color}`}>
                    {opt.icon}
                  </span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Preferred Taste Profile */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">restaurant</span>
              2. Preferred Taste Profile
            </label>
            <span className="text-[11px] text-secondary font-bold">Required</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'sweet' as const, label: 'Sweet', icon: 'cookie' },
              { id: 'balanced' as const, label: 'Balanced', icon: 'balance' },
              { id: 'bold' as const, label: 'Strong & Bold', icon: 'fitness_center' },
              { id: 'creamy' as const, label: 'Creamy', icon: 'water_drop' },
              { id: 'refreshing' as const, label: 'Refreshing', icon: 'spa' },
            ].map((opt) => {
              const active = tasteProfile === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setTasteProfile(opt.id)}
                  type="button"
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full active:scale-95 transition-all min-h-[44px] cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${active ? 'text-secondary-fixed' : 'text-secondary'}`}>
                    {opt.icon}
                  </span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Caffeine Level */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">bolt</span>
              3. Caffeine Level
            </label>
            <span className="text-[11px] text-secondary font-bold">Required</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'high' as const, label: 'High Boost', icon: 'offline_bolt' },
              { id: 'medium' as const, label: 'Medium Craft', icon: 'coffee' },
              { id: 'low' as const, label: 'Low Buzz', icon: 'eco' },
              { id: 'decaf' as const, label: 'Decaf', icon: 'bedtime' },
            ].map((opt) => {
              const active = caffeineLevel === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setCaffeineLevel(opt.id)}
                  type="button"
                  className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl active:scale-95 transition-all min-h-[48px] cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${active ? 'text-secondary-fixed' : 'text-secondary'}`}>
                    {opt.icon}
                  </span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Preferred Milk */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">grain</span>
              4. Preferred Milk
            </label>
            <span className="text-[11px] text-secondary font-bold">Required</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'regular' as const, label: 'Whole Milk', icon: 'water_drop' },
              { id: 'oat' as const, label: 'Oat Milk', icon: 'grain' },
              { id: 'almond' as const, label: 'Almond Milk', icon: 'nature' },
              { id: 'lactose-free' as const, label: 'Lactose-Free', icon: 'verified' },
              { id: 'none' as const, label: 'Black (No Milk)', icon: 'block' },
            ].map((opt) => {
              const active = milkPreference === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setMilkPreference(opt.id)}
                  type="button"
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full active:scale-95 transition-all min-h-[44px] cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${active ? 'text-secondary-fixed' : 'text-secondary'}`}>
                    {opt.icon}
                  </span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Preferred Sweetness */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">
                candlestick_chart
              </span>
              5. Preferred Sweetness
            </label>
            <span className="text-[11px] text-secondary font-bold">Required</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'zero' as const, label: 'No Added Sugar', icon: 'not_interested' },
              { id: 'light' as const, label: 'Light Sweet', icon: 'arrow_back_ios_new' },
              { id: 'regular' as const, label: 'Regular Sweet', icon: 'cookie' },
              { id: 'extra' as const, label: 'Indulgent Sweet', icon: 'cake' },
            ].map((opt) => {
              const active = sweetnessPreference === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSweetnessPreference(opt.id)}
                  type="button"
                  className={`flex items-center justify-start gap-2 px-3 py-3 rounded-xl active:scale-95 transition-all min-h-[48px] cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${active ? 'text-secondary-fixed' : 'text-secondary'}`}>
                    {opt.icon}
                  </span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Desired Experience / Vibe */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">mood</span>
              6. Desired Experience / Vibe
            </label>
            <span className="text-[11px] text-secondary font-bold">Required</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'boost' as const, label: 'Morning Boost', icon: 'electric_bolt' },
              { id: 'smooth' as const, label: 'Smooth Everyday', icon: 'waves' },
              { id: 'coldtreat' as const, label: 'Cold Treat', icon: 'icecream' },
              { id: 'dessert' as const, label: 'Dessert-like', icon: 'bakery_dining' },
              { id: 'lightclean' as const, label: 'Light & Clean', icon: 'nature_people' },
            ].map((opt) => {
              const active = vibe === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setVibe(opt.id)}
                  type="button"
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full active:scale-95 transition-all min-h-[44px] cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${active ? 'text-secondary-fixed' : 'text-secondary'}`}>
                    {opt.icon}
                  </span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Budget Range */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">payments</span>
              7. Budget Range
            </label>
            <span className="text-[11px] text-outline font-medium">Optional</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'budget' as const, label: 'Standard', sub: '$3 - $4.50' },
              { id: 'mid' as const, label: 'Artisanal', sub: '$4.50 - $6.00' },
              { id: 'reserve' as const, label: 'Reserve', sub: '$6.00+' },
            ].map((opt) => {
              const active = budget === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setBudget(opt.id)}
                  type="button"
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl active:scale-95 transition-all text-center min-h-[58px] cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${active ? 'text-secondary-fixed' : 'text-secondary'}`}>
                    {opt.label}
                  </span>
                  <span className="text-xs font-semibold mt-0.5">{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inference Telemetry Panel */}
        <div className="p-4 rounded-2xl bg-surface-container-high flex flex-col gap-1.5 border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary">
              <span
                className="material-symbols-outlined text-[20px] text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                neurology
              </span>
              <span className="text-xs font-bold">Rule-based Inference Active</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Evaluating temperature, roast profile, oat compatibility, and subtle sweet notes across 18 craft roastery recipes.
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-secondary">
            <span
              className="material-symbols-outlined text-[16px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="text-[11px] font-bold">
              Ready: 3 optimal matches identified in cache
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Dock */}
      <div className="sticky bottom-16 w-full p-4 bg-surface/90 backdrop-blur-md shadow-lg border-t border-surface-container flex flex-col gap-2 mt-6">
        <button
          onClick={handleSubmit}
          className="w-full h-[52px] px-6 rounded-full bg-primary text-on-primary text-sm font-bold flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-md cursor-pointer hover:bg-primary-container"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">auto_awesome</span>
          <span>Find My Drink</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <div className="flex items-center justify-center pt-0.5">
          <button
            onClick={handleReset}
            className="text-[11px] text-secondary uppercase tracking-wider font-bold hover:underline py-1 active:scale-95 transition-transform cursor-pointer"
            type="button"
          >
            Reset Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
