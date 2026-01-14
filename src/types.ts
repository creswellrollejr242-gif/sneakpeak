
export interface Sneaker {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  dropDate: string; // ISO string
  hypeScore: number; // 0-100
  description: string;
  isRaffle: boolean;
  resalePrice?: number;
  preorderAvailable?: boolean;
  raffles?: Raffle[];
}

export interface Raffle {
  id: string;
  store: string;
  url: string;
  closesAt: string; // ISO string
  status: 'open' | 'closed' | 'coming_soon';
  type: 'In-App' | 'Online' | 'Instagram';
}

export interface Badge {
  id: string;
  icon: string;
  label: string;
  description: string;
  color: string;
}

export interface PortfolioItem {
  id: string;
  sneakerId: string;
  size: string;
  purchasePrice: number;
  condition: 'DS' | 'VNDS' | 'Used';
  purchaseDate: string;
}

export interface UserPreferences {
  size: string;
  brands: string[];
}

export interface LegitCheckResult {
  id: string;
  date: string;
  imageUrl: string;
  verdict: 'PASS' | 'FAIL' | 'UNCERTAIN' | 'ERROR';
  confidence: number;
  reasoning: string;
}

export interface UserProfile {
  username: string;
  level: number;
  xp: number;
  owned: PortfolioItem[];
  wishlist: string[]; // Sneaker IDs
  savedScans?: LegitCheckResult[];
  avatar: string;
  isAdmin?: boolean;
  isPremium?: boolean;
  badges: Badge[];
  preferences?: UserPreferences;
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  sources?: { title: string; uri: string }[];
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  portfolioValue: number;
  change: number; // percent change
}

// MESSENGER & TRADING TYPES
export interface TradeDetails {
  offeredItem: PortfolioItem;
  requestedItem?: string; // Optional: could be specific ID or general cash
  cashTopUp?: number;
}

export interface Message {
  id: string;
  sender: string; // 'me' or 'other'
  text?: string;
  timestamp: string;
  type: 'text' | 'trade_offer';
  tradeDetails?: TradeDetails;
  tradeStatus?: 'pending' | 'accepted' | 'declined';
}

export interface Conversation {
  id: string;
  withUser: string;
  userAvatar: string;
  lastMessage: string;
  unread: number;
  messages: Message[];
}

export interface Story {
  id: string;
  user: string;
  avatar: string;
  image: string;
  title: string;
  viewed: boolean;
}

export interface Retailer {
  id: string;
  name: string;
  baseUrl: string;
  affiliateParam: string;
  color: string;
  bg: string;
  abbr: string;
}

export type View = 'home' | 'drops' | 'swipe' | 'legit' | 'chat' | 'community' | 'profile' | 'admin' | 'creator' | 'messages';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}