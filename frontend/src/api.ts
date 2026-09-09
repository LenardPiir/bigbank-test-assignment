import { GameState, Ad, SolveResult, ShopItem, PurchaseResult, Reputation } from './types';

const BASE_URL = '/api/v2';

async function request<T>(url: string, method: 'GET' | 'POST' = 'GET'): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, { method });
  if (!response.ok) {
    throw new Error('Something unexpected went wrong. Please try again.');
  }
  return response.json();
}

async function solveFetch(gameId: string, adId: string): Promise<SolveResult> {
  const response = await fetch(`${BASE_URL}/${gameId}/solve/${adId}`, { method: 'POST' });
  const data = await response.json().catch(() => null);
  if (data && typeof data.success === 'boolean') return data;
  throw new Error('Quest is no longer available.');
}

export const api = {
  startGame: () => request<GameState>('/game/start', 'POST'),
  getAds: (gameId: string) => request<Ad[]>(`/${gameId}/messages`),
  solve: solveFetch,
  getShop: (gameId: string) => request<ShopItem[]>(`/${gameId}/shop`),
  buyItem: (gameId: string, itemId: string) => request<PurchaseResult>(`/${gameId}/shop/buy/${itemId}`, 'POST'),
  getReputation: (gameId: string) => request<Reputation>(`/${gameId}/investigate/reputation`, 'POST'),
};
