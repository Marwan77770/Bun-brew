import React, { useRef } from 'react';
import { RecommendationMatch, ExpertPreferences, Product } from '../types';
import { MASTER_BLUEPRINT_CR104, PRODUCTS } from '../data/mockData';

interface ExpertResultsScreenProps {
  preferences: ExpertPreferences;
  recommendations: RecommendationMatch[];
  onSelectProduct: (product: Product) => void;
  onAddToCartDirect: (product: Product) => void;
  onRetake: () => void;
  onEditFilters: () => void;
}

export const ExpertResultsScreen: React.FC<ExpertResultsScreenProps> = ({
  recommendations,
  onSelectProduct,
  onAddToCartDirect,
  onRetake,
  onEditFilters
}) => {
  const recipeRef = useRef<HTMLDivElement>(null);

  const scrollToRecipe = () => {
    recipeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    recipeRef.current?.classList.add('ring-2', 'ring-secondary');
    setTimeout(() => {
      recipeRef.current?.classList.remove('ring-2', 'ring-secondary');
    }, 1500);
  };

  const handleOrderTopRecipe = () => {
    // Add the top expert pick to the cart
    const item = PRODUCTS.find((p) => p.id === recommendations[0].id) || PRODUCTS[0];
    onAddToCartDirect(item);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto bg-surface">
      {/* Header Section & Preference Summary Pill */}
      <header className="px-4 pt-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
            <span className="text-[11px] uppercase tracking-wider font-bold text-secondary">
              Expert Match Engine
            </span>
          </div>
          <button
            onClick={onEditFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-variant active:scale-95 transition-all text-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Edit Filters</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">
            Your Coffee Matches
          </h1>
          <p className="text-xs text-on-surface-variant mt-1 leading-snug">
            Derived from your sensory profile:{' '}
            <span className="font-bold text-primary">
              Iced, Creamy, Medium Caffeine, Oat Milk, Light Sweetness.
            </span>
          </p>
        </div>

        {/* Active Inference Rules Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-secondary text-[11px] font-bold whitespace-nowrap">
            <span className="material-symbols-outlined text-[14px]">device_thermostat</span> Iced Prep
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-secondary text-[11px] font-bold whitespace-nowrap">
            <span className="material-symbols-outlined text-[14px]">eco</span> Oat Milk Base
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-secondary text-[11px] font-bold whitespace-nowrap">
            <span className="material-symbols-outlined text-[14px]">bolt</span> Medium Caff
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-secondary text-[11px] font-bold whitespace-nowrap">
            <span className="material-symbols-outlined text-[14px]">cookie</span> Light Sweet
          </span>
        </div>
      </header>

      {/* Top Ranked Curations */}
      <section className="px-4 mt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Top Ranked Curations</h2>
          <span className="text-xs font-bold text-secondary">
            {recommendations.length} Matches Found
          </span>
        </div>

        {/* 1. Top Match (Active Featured Card) */}
        {recommendations[0] && (
          <div className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-md border border-surface-container overflow-hidden">
            <div className="relative w-full h-44 bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt={recommendations[0].title}
                src={recommendations[0].image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-primary-fixed text-[11px] font-bold shadow-xs">
                <span
                  className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  stars
                </span>
                <span>{recommendations[0].badge}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-on-primary">
                <div>
                  <span className="text-[10px] tracking-wider uppercase font-bold opacity-90">
                    Recommendation #1
                  </span>
                  <h3 className="text-xl font-bold leading-tight">
                    {recommendations[0].title}
                  </h3>
                </div>
                <span className="text-xl font-extrabold text-tertiary-fixed">
                  ${recommendations[0].price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {/* Transparent Inference Explanation */}
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1.5 border border-surface-container">
                <div className="flex items-center gap-1 text-secondary text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[15px]">rule</span>
                  <span className="uppercase tracking-wide">Inference Logic</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">
                  {recommendations[0].inferenceReason}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recommendations[0].rulesFired.map((rule, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-surface-variant text-on-surface-variant text-[10px] font-bold"
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={scrollToRecipe}
                  className="h-11 px-3 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  <span>Recipe Open</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item = PRODUCTS.find((p) => p.id === recommendations[0].id) || PRODUCTS[0];
                    onSelectProduct(item);
                  }}
                  className="h-11 px-3 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer hover:bg-primary-container"
                >
                  <span>Customize</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Second Match Card */}
        {recommendations[1] && (
          <div className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-4 gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary text-[11px] font-bold">
                    {recommendations[1].badge}
                  </span>
                  <span className="text-[11px] text-outline font-semibold">Cold Steeped</span>
                </div>
                <h3 className="text-base font-bold text-primary mt-1">
                  {recommendations[1].title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                  {recommendations[1].description}
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl bg-surface-container flex-shrink-0 overflow-hidden shadow-inner">
                <img
                  className="w-full h-full object-cover"
                  alt={recommendations[1].title}
                  src={recommendations[1].image}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-container/40">
              <div className="flex flex-col">
                <span className="text-[10px] text-outline font-semibold">Rule #1 &amp; #6: Smooth Daily</span>
                <span className="text-base font-bold text-primary">
                  ${recommendations[1].price.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const item = PRODUCTS.find((p) => p.id === recommendations[1].id) || PRODUCTS[1];
                  onSelectProduct(item);
                }}
                className="h-10 px-4 rounded-full bg-surface-container-high text-primary text-xs font-bold hover:bg-surface-variant active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
              >
                <span>Customize</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Third Match Card */}
        {recommendations[2] && (
          <div className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-4 gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary text-[11px] font-bold">
                    {recommendations[2].badge}
                  </span>
                  <span className="text-[11px] text-outline font-semibold">Spanish Style</span>
                </div>
                <h3 className="text-base font-bold text-primary mt-1">
                  {recommendations[2].title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                  {recommendations[2].description}
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl bg-surface-container flex-shrink-0 overflow-hidden shadow-inner">
                <img
                  className="w-full h-full object-cover"
                  alt={recommendations[2].title}
                  src={recommendations[2].image}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-container/40">
              <div className="flex flex-col">
                <span className="text-[10px] text-outline font-semibold">Rule #3: Sweet Indulgence</span>
                <span className="text-base font-bold text-primary">
                  ${recommendations[2].price.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const item = PRODUCTS.find((p) => p.id === recommendations[2].id) || PRODUCTS[0];
                  onSelectProduct(item);
                }}
                className="h-10 px-4 rounded-full bg-surface-container-high text-primary text-xs font-bold hover:bg-surface-variant active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
              >
                <span>Customize</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Detailed Barista Recipe Card (HMI Transparency Spec) */}
      <section
        ref={recipeRef}
        className="mx-4 mt-6 flex flex-col bg-surface-container-lowest rounded-2xl shadow-md p-4 sm:p-5 gap-5 border border-surface-container transition-all"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-bold tracking-wider uppercase">
              BARISTA BLUEPRINT {MASTER_BLUEPRINT_CR104.blueprintId}
            </span>
            <span className="flex items-center gap-1 text-secondary text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">verified_user</span> Master Spec
            </span>
          </div>
          <h3 className="text-lg font-bold text-primary mt-1">
            {MASTER_BLUEPRINT_CR104.title}
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Complete operational metric card optimized for temperature, extraction, and tactile mouthfeel.
          </p>
        </div>

        {/* Recipe Quick Stats Row */}
        <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-3 rounded-xl border border-surface-container">
          <div className="flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-[20px] text-secondary">timer</span>
            <span className="text-base font-bold text-primary mt-0.5">
              {MASTER_BLUEPRINT_CR104.prepTime}
            </span>
            <span className="text-[10px] text-outline font-semibold">Prep Time</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-[20px] text-secondary">ac_unit</span>
            <span className="text-base font-bold text-primary mt-0.5">
              {MASTER_BLUEPRINT_CR104.temperatureTarget.split(' ')[0]}
            </span>
            <span className="text-[10px] text-outline font-semibold">Clear Cubes</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-[20px] text-secondary">local_cafe</span>
            <span className="text-base font-bold text-primary mt-0.5">
              {MASTER_BLUEPRINT_CR104.shotVolume.split(' ')[0]}
            </span>
            <span className="text-[10px] text-outline font-semibold">Double Shot</span>
          </div>
        </div>

        {/* Sensory Taste Profile Breakdown */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              Sensory Profile Balance
            </span>
            <span className="text-[11px] text-secondary font-semibold">
              {MASTER_BLUEPRINT_CR104.roastNotes}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3.5 rounded-xl border border-surface-container">
            {/* Sweetness */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface font-semibold">Sweetness</span>
                <span className="font-bold text-secondary">
                  {MASTER_BLUEPRINT_CR104.sensoryScores.sweetness} / 5
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{ width: `${(MASTER_BLUEPRINT_CR104.sensoryScores.sweetness / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            {/* Acidity */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface font-semibold">Acidity</span>
                <span className="font-bold text-secondary">
                  {MASTER_BLUEPRINT_CR104.sensoryScores.acidity} / 5
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{ width: `${(MASTER_BLUEPRINT_CR104.sensoryScores.acidity / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            {/* Body */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface font-semibold">Mouthfeel / Body</span>
                <span className="font-bold text-secondary">
                  {MASTER_BLUEPRINT_CR104.sensoryScores.mouthfeel} / 5
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{ width: `${(MASTER_BLUEPRINT_CR104.sensoryScores.mouthfeel / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            {/* Intensity */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface font-semibold">Caffeine Intensity</span>
                <span className="font-bold text-secondary">
                  {MASTER_BLUEPRINT_CR104.sensoryScores.caffeine} / 5
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{ width: `${(MASTER_BLUEPRINT_CR104.sensoryScores.caffeine / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Precision Ingredients */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              Precision Ingredients
            </span>
            <span className="text-[11px] text-outline font-semibold">12 oz (360 ml) Total</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {MASTER_BLUEPRINT_CR104.ingredients.map((ing, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: ing.dotColor }}
                  ></span>
                  <span className="text-primary font-semibold">{ing.name}</span>
                </div>
                <span className="text-secondary font-bold">{ing.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Barista Assembly Guide */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-primary uppercase tracking-wide">
            Barista Assembly Steps
          </span>
          <ol className="flex flex-col gap-2.5">
            {MASTER_BLUEPRINT_CR104.steps.map((st, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <p className="text-xs text-on-surface pt-0.5 leading-relaxed">{st}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Allergen & Dietary Badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container text-secondary text-xs font-bold">
          <span className="material-symbols-outlined text-[18px]">eco</span>
          <span>{MASTER_BLUEPRINT_CR104.dietaryLabel}</span>
        </div>
      </section>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-16 w-full p-4 bg-surface/90 backdrop-blur-md shadow-lg border-t border-surface-container flex flex-col gap-2 mt-6">
        <button
          onClick={handleOrderTopRecipe}
          className="w-full h-12 rounded-full bg-primary text-on-primary text-sm font-bold flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md cursor-pointer hover:bg-primary-container"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
          <span>Order This Recipe • $5.75</span>
        </button>
        <button
          onClick={onRetake}
          className="w-full h-10 rounded-full bg-surface-container text-primary text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all hover:bg-surface-variant cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          <span>Retake Sensory Matcher</span>
        </button>
      </div>
    </div>
  );
};
