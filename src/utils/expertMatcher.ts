/**
 * Bun & Brew - Coffee Expert System (TypeScript port of expert-system/coffee_expert_system.py)
 *
 *  1. Knowledge base     -> DRINKS, PASTRIES, DERIVE_RULES, SCORE_RULES
 *  2. Inference engine   -> forward chaining to a fixed point, then weighted scoring + hard-constraint pruning
 *  3. Explanation module -> every recommendation lists the exact rules that fired
 */
import type { ExpertPreferences, RecommendationMatch } from '../types';
import { PRODUCTS } from '../data/mockData';

export type Temp = 'hot' | 'iced' | 'any';
export type Milk = 'dairy' | 'oat' | 'none';

export interface Facts {
  temp: Temp;
  taste: 'sweet' | 'bitter' | 'fruity' | 'nutty' | 'creamy';
  caffeine: 1 | 2 | 3;
  milk: 'any' | 'oat' | 'none';
  sweetness: 0 | 1 | 2 | 3;
  mood: 'energise' | 'relax' | 'treat';
  time: 'morning' | 'afternoon' | 'evening';
  // derived by forward chaining
  max_caffeine?: number;
  avoid_dairy?: boolean;
  warning?: string;
}

interface Item {
  id: string; // matches Product.id in mockData
  name: string;
  price: number;
  temp: Temp;
  caffeine: number;
  sweetness: number;
  milk: Milk;
  tags: string[];
}

const i = (id: string, name: string, price: number, temp: Temp, caffeine: number, sweetness: number, milk: Milk, tags: string): Item =>
  ({ id, name, price, temp, caffeine, sweetness, milk, tags: tags.split(' ') });

// ---------------------------------------------------------------- knowledge base
export const DRINKS: Item[] = [
  i('espresso', 'Espresso', 3.5, 'hot', 3, 0, 'none', 'bitter'),
  i('americano', 'Americano', 3.8, 'hot', 3, 0, 'none', 'bitter'),
  i('cappuccino', 'Cappuccino', 4.5, 'hot', 2, 1, 'dairy', 'creamy'),
  i('caffe-latte', 'Caffe Latte', 4.8, 'hot', 2, 1, 'dairy', 'creamy'),
  i('flat-white', 'Flat White', 4.75, 'hot', 3, 1, 'dairy', 'bitter creamy'),
  i('spanish-latte', 'Spanish Latte', 5.5, 'hot', 2, 3, 'dairy', 'sweet creamy'),
  i('caramel-macchiato', 'Caramel Macchiato', 5.25, 'hot', 2, 3, 'dairy', 'sweet creamy'),
  i('mocha', 'Mocha', 5.2, 'hot', 2, 3, 'dairy', 'sweet creamy'),
  i('iced-latte', 'Iced Latte', 4.95, 'iced', 2, 1, 'dairy', 'creamy'),
  i('cold-brew', 'Cold Brew', 4.85, 'iced', 3, 0, 'none', 'bitter fruity'),
  i('matcha-latte', 'Matcha Latte', 5.2, 'hot', 1, 2, 'oat', 'nutty creamy'),
  i('chocolate-frappe', 'Chocolate Frappe', 5.8, 'iced', 2, 3, 'dairy', 'sweet creamy'),
];
export const PASTRIES: Item[] = [
  i('butter-croissant', 'Butter Croissant', 3.75, 'any', 0, 1, 'dairy', 'sweet'),
  i('blueberry-muffin', 'Blueberry Muffin', 3.95, 'any', 0, 2, 'dairy', 'fruity sweet'),
  i('turkey-bagel', 'Smoked Turkey & Cheese Bagel', 6.5, 'any', 0, 0, 'dairy', 'savory'),
];

interface DeriveRule {
  id: string;
  text: string;
  cond: (m: Facts) => boolean;
  then: Record<string, unknown>;
}
interface ScoreRule {
  id: string;
  name: string;
  text: string;
  weight: number;
  cond: (m: Facts, d: Item) => boolean;
  applies?: (m: Facts) => boolean;
  hard?: boolean;
}

export const DERIVE_RULES: DeriveRule[] = [
  { id: 'D1', text: 'time = evening  =>  max_caffeine <= 1', cond: m => m.time === 'evening', then: { max_caffeine: 1 } },
  { id: 'D2', text: 'mood = relax  =>  max_caffeine <= 2', cond: m => m.mood === 'relax', then: { max_caffeine: 2 } },
  { id: 'D3', text: 'milk = none  =>  avoid_dairy', cond: m => m.milk === 'none', then: { avoid_dairy: true } },
  {
    id: 'D4',
    text: 'max_caffeine < wanted caffeine  =>  wanted caffeine lowered to the cap',
    cond: m => m.max_caffeine !== undefined && m.caffeine > m.max_caffeine,
    then: { caffeine: '@max_caffeine' }, // chained: depends on D1/D2
  },
  {
    id: 'D5',
    text: 'mood = energise AND time = evening  =>  warn about sleep',
    cond: m => m.mood === 'energise' && m.time === 'evening',
    then: { warning: 'Late-day caffeine can affect sleep; we capped the caffeine level.' },
  },
];

export const SCORE_RULES: ScoreRule[] = [
  { id: 'R1', name: 'Temperature conflict', text: 'preferred temp is set AND drink temp differs', weight: -100, hard: true,
    cond: (m, d) => m.temp !== 'any' && d.temp !== m.temp },
  { id: 'R2', name: 'Dairy-free conflict', text: 'avoid_dairy AND drink contains dairy', weight: -100, hard: true,
    cond: (m, d) => !!m.avoid_dairy && d.milk === 'dairy' },
  { id: 'R3', name: 'Caffeine over cap', text: 'drink caffeine > max_caffeine', weight: -100, hard: true,
    cond: (m, d) => d.caffeine > (m.max_caffeine ?? 3) },
  { id: 'R4', name: 'Temperature match', text: 'drink temp = preferred temp', weight: 30,
    cond: (m, d) => m.temp !== 'any' && d.temp === m.temp, applies: m => m.temp !== 'any' },
  { id: 'R5', name: 'Taste match', text: "preferred taste is in the drink's tags", weight: 25,
    cond: (m, d) => d.tags.includes(m.taste) },
  { id: 'R6', name: 'Caffeine match', text: 'drink caffeine = wanted caffeine', weight: 20,
    cond: (m, d) => d.caffeine === m.caffeine },
  { id: 'R7', name: 'Caffeine far off', text: 'caffeine differs by 2+ levels', weight: -25,
    cond: (m, d) => Math.abs(d.caffeine - m.caffeine) >= 2 },
  { id: 'R8', name: 'Oat milk preferred', text: 'milk = oat AND drink uses oat milk', weight: 20,
    cond: (m, d) => m.milk === 'oat' && d.milk === 'oat', applies: m => m.milk === 'oat' },
  { id: 'R9', name: 'Sweetness match', text: 'drink sweetness = preferred sweetness', weight: 20,
    cond: (m, d) => d.sweetness === m.sweetness },
  { id: 'R10', name: 'Sweetness far off', text: 'sweetness differs by 2+ levels', weight: -20,
    cond: (m, d) => Math.abs(d.sweetness - m.sweetness) >= 2 },
  { id: 'R11', name: 'Energise mood', text: 'mood = energise AND drink caffeine = 3', weight: 10,
    cond: (m, d) => m.mood === 'energise' && d.caffeine === 3,
    applies: m => m.mood === 'energise' && (m.max_caffeine ?? 3) >= 3 },
  { id: 'R12', name: 'Relax mood', text: 'mood = relax AND (caffeine <= 1 OR creamy)', weight: 10,
    cond: (m, d) => m.mood === 'relax' && (d.caffeine <= 1 || d.tags.includes('creamy')),
    applies: m => m.mood === 'relax' },
  { id: 'R13', name: 'Treat mood', text: 'mood = treat AND drink sweetness = 3', weight: 10,
    cond: (m, d) => m.mood === 'treat' && d.sweetness === 3, applies: m => m.mood === 'treat' },
];

// ---------------------------------------------------------------- inference engine
export interface Recommendation { item: Item; score: number; percent: number; fired: ScoreRule[] }
export interface Result {
  facts: Facts;
  derived: Record<string, unknown>;
  trace: string[];
  ranked: Recommendation[];
  excluded: Array<{ item: Item; why: string[] }>;
  pairing: Item | null;
}

const CHOICES: Record<string, unknown[]> = {
  temp: ['hot', 'iced', 'any'], taste: ['sweet', 'bitter', 'fruity', 'nutty', 'creamy'], caffeine: [1, 2, 3],
  milk: ['any', 'oat', 'none'], sweetness: [0, 1, 2, 3], mood: ['energise', 'relax', 'treat'],
  time: ['morning', 'afternoon', 'evening'],
};

export function validate(facts: Partial<Facts>): Facts {
  const raw = facts as Record<string, unknown>;
  const clean: Record<string, unknown> = {};
  for (const [key, allowed] of Object.entries(CHOICES)) {
    if (raw[key] === undefined) throw new Error(`missing fact: ${key}`);
    if (!allowed.includes(raw[key])) throw new Error(`invalid ${key}: ${String(raw[key])}; allowed: ${allowed.join(', ')}`);
    clean[key] = raw[key];
  }
  return clean as unknown as Facts;
}

export function forwardChain(memory: Facts, trace: string[]): Facts {
  const mem = memory as unknown as Record<string, unknown>;
  const firedOnce = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of DERIVE_RULES) {
      if (firedOnce.has(rule.id) || !rule.cond(memory)) continue;
      const updates: Record<string, unknown> = {};
      for (const [k, raw] of Object.entries(rule.then)) {
        let v = raw;
        if (typeof v === 'string' && v.startsWith('@')) v = mem[v.slice(1)];
        if (k === 'max_caffeine' && mem[k] !== undefined) v = Math.min(v as number, mem[k] as number); // caps only tighten
        if (mem[k] !== v) updates[k] = v;
      }
      if (Object.keys(updates).length) {
        Object.assign(mem, updates);
        firedOnce.add(rule.id);
        changed = true;
        trace.push(`${rule.id}: ${rule.text}  ->  ${JSON.stringify(updates)}`);
      }
    }
  }
  return memory;
}

export function pickPairing(top: Item): Item {
  if (top.sweetness >= 3) return PASTRIES[0]; // neutral croissant balances very sweet drinks
  if (top.tags.includes('bitter')) return PASTRIES[1]; // fruity muffin lifts bitter coffee
  return PASTRIES[2]; // savory bagel for light/creamy drinks
}

export function recommend(rawFacts: Partial<Facts>, top = 3): Result {
  const memory = validate({ ...rawFacts });
  const original = { ...memory } as Record<string, unknown>;
  const trace: string[] = [];
  forwardChain(memory, trace);
  const derived: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(memory)) if (original[k] !== v) derived[k] = v;

  const maxScore = SCORE_RULES.filter(r => r.weight > 0 && (r.applies ? r.applies(memory) : true))
    .reduce((a, r) => a + r.weight, 0) || 1;
  const ranked: Recommendation[] = [];
  const excluded: Result['excluded'] = [];
  for (const drink of DRINKS) {
    let score = 0;
    const fired: ScoreRule[] = [];
    const why: string[] = [];
    for (const rule of SCORE_RULES) {
      if (rule.cond(memory, drink)) {
        fired.push(rule);
        score += rule.weight;
        if (rule.hard) why.push(`${rule.id} ${rule.name}`);
      }
    }
    if (why.length) { excluded.push({ item: drink, why }); continue; }
    const percent = Math.max(0, Math.min(99, Math.round((score / maxScore) * 100)));
    ranked.push({ item: drink, score, percent, fired });
  }
  ranked.sort((a, b) => b.score - a.score || a.item.price - b.item.price || a.item.name.localeCompare(b.item.name));
  const best = ranked.slice(0, top);
  return { facts: memory, derived, trace, ranked: best, excluded, pairing: best.length ? pickPairing(best[0].item) : null };
}

// ---------------------------------------------------------------- app adapter (UI answers -> facts -> cards)
export function timeOfDay(d = new Date()): Facts['time'] {
  const h = d.getHours();
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
}

export function toFacts(p: ExpertPreferences, time: Facts['time'] = timeOfDay()): Facts {
  return {
    temp: p.temperature === 'both' ? 'any' : p.temperature,
    taste: ({ sweet: 'sweet', balanced: 'creamy', bold: 'bitter', creamy: 'creamy', refreshing: 'fruity' } as const)[p.tasteProfile],
    caffeine: ({ high: 3, medium: 2, low: 1, decaf: 1 } as const)[p.caffeineLevel],
    milk: p.milkPreference === 'oat' ? 'oat' : p.milkPreference === 'regular' ? 'any' : 'none', // almond / lactose-free / none => dairy-free
    sweetness: ({ zero: 0, light: 1, regular: 2, extra: 3 } as const)[p.sweetnessPreference],
    mood: ({ boost: 'energise', smooth: 'relax', lightclean: 'relax', coldtreat: 'treat', dessert: 'treat' } as const)[p.vibe],
    time,
  };
}

export function runExpertInference(prefs: ExpertPreferences, time: Facts['time'] = timeOfDay()): RecommendationMatch[] {
  const res = recommend(toFacts(prefs, time), 3);
  const sign = (w: number) => (w > 0 ? `+${w}` : `${w}`);
  return res.ranked.map((r, idx) => {
    const product = PRODUCTS.find(p => p.id === r.item.id);
    const reasons = [
      ...(idx === 0 ? res.trace : []),
      ...(idx === 0 && res.facts.warning ? [res.facts.warning] : []),
      `Fired: ${r.fired.map(x => x.name).join(', ')}.`,
      ...(idx === 0 && res.pairing ? [`Pairs well with a ${res.pairing.name}.`] : []),
    ];
    return {
      id: r.item.id,
      title: product?.name ?? r.item.name,
      compatibility: r.percent,
      badge: idx === 0 ? `${r.percent}% Compatibility • Best Fit` : `${r.percent}% Match`,
      price: product?.price ?? r.item.price,
      description: product?.description ?? '',
      image: product?.image ?? '',
      inferenceReason: reasons.join(' '),
      rulesFired: r.fired.map(x => `${x.id} ${x.name} (${sign(x.weight)})`),
    };
  });
}
