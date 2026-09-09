export interface GameState {
  gameId: string;
  lives: number;
  gold: number;
  level: number;
  score: number;
  highScore: number;
  turn: number;
}

export interface Ad {
  adId: string;
  message: string;
  reward: number;
  expiresIn: number;
  encrypted: string | number | null;
  probability: string;
}

export interface SolveResult {
  success: boolean;
  lives: number;
  gold: number;
  score: number;
  highScore: number;
  turn: number;
  message: string;
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
}

export interface PurchaseResult {
  shoppingSuccess: boolean;
  gold: number;
  lives: number;
  level: number;
  turn: number;
}

export interface Reputation {
  people: number;
  state: number;
  underworld: number;
}
