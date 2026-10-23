export type ViewMode = 
  | 'welcome'
  | 'home'
  | 'menu'
  | 'product-details'
  | 'expert-preferences'
  | 'expert-results'
  | 'cart'
  | 'checkout'
  | 'tracking'
  | 'profile'
  | 'manager-dashboard';

export interface Product {
  id: string;
  name: string;
  category: 'hot' | 'iced' | 'frappes' | 'bakery' | 'sandwiches';
  categoryDisplay: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
  badgeType?: 'hot' | 'iced' | 'popular' | 'special' | 'fresh';
  rating: number;
  reviewsCount: number;
  caffeine: 'high' | 'med' | 'low' | 'decaf';
  temperature: 'hot' | 'iced' | 'both';
  dietary: ('veg' | 'oat' | 'dairyfree')[];
  originNotes?: string;
  prepTimeMinutes?: number;
}

export interface CustomizationState {
  temperature: 'hot' | 'iced';
  size: 'small' | 'medium' | 'large';
  sizePrice: number;
  sweetness: '0%' | '50%' | '100%' | '120%';
  shots: '2' | '3' | 'decaf';
  shotsPrice: number;
  milk: 'whole' | 'skimmed' | 'oat' | 'almond' | 'lactose-free';
  milkPrice: number;
  addons: {
    vanillaSyrup: boolean;
    caramelSyrup: boolean;
    whippedCream: boolean;
    caramelDrizzle: boolean;
  };
  addonsPrice: number;
  quantity: number;
  baristaNote?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  customization: CustomizationState;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
}

export interface ExpertPreferences {
  temperature: 'hot' | 'iced' | 'both';
  tasteProfile: 'sweet' | 'balanced' | 'bold' | 'creamy' | 'refreshing';
  caffeineLevel: 'high' | 'medium' | 'low' | 'decaf';
  milkPreference: 'regular' | 'oat' | 'almond' | 'lactose-free' | 'none';
  sweetnessPreference: 'zero' | 'light' | 'regular' | 'extra';
  vibe: 'boost' | 'smooth' | 'coldtreat' | 'dessert' | 'lightclean';
  budget: 'budget' | 'mid' | 'reserve';
}

export interface RecommendationMatch {
  id: string;
  title: string;
  compatibility: number;
  badge: string;
  price: number;
  description: string;
  image: string;
  inferenceReason: string;
  rulesFired: string[];
  blueprintId?: string;
}

export interface BaristaBlueprint {
  blueprintId: string;
  title: string;
  prepTime: string;
  temperatureTarget: string;
  shotVolume: string;
  roastNotes: string;
  sensoryScores: {
    sweetness: number;
    acidity: number;
    mouthfeel: number;
    caffeine: number;
  };
  ingredients: {
    name: string;
    amount: string;
    dotColor: string;
    optional?: boolean;
  }[];
  steps: string[];
  dietaryLabel: string;
}

export interface LiveOrder {
  id: string;
  orderNumber: string;
  guestName: string;
  guestTier: string;
  configuredItems: string[];
  total: number;
  channel: string;
  elapsedTime: string;
  status: 'brewing' | 'pickup' | 'completed';
  timestamp: string;
}

export interface StockAlert {
  id: string;
  name: string;
  currentStock: string;
  threshold: string;
  note: string;
  percentage: number;
  actionText: string;
  severity: 'critical' | 'warning' | 'normal';
}
