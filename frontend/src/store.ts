import { create } from 'zustand';
import { GameState, Ad, ShopItem, SolveResult, Reputation } from './types';
import { api } from './api';
import { decodeAd, successRate } from './utils';
import { saveEntry } from './components/Leaderboard';
import { audioEngine } from './audio';

export interface LogEntry {
  turn: number;
  message: string;
  type: 'success' | 'failure' | 'purchase' | 'info';
}

export interface QuestModal {
  phase: 'loading' | 'result';
  ad: Ad;
  result?: SolveResult;
  imageIndex: number;
  tipIndex: number;
}

interface GameStore {
  game: GameState | null;
  ads: Ad[];
  shopItems: ShopItem[];
  reputation: Reputation | null;
  log: LogEntry[];
  loading: boolean;
  error: string | null;
  questModal: QuestModal | null;

  startGame: () => Promise<void>;
  fetchAds: () => Promise<void>;
  solveAd: (adId: string) => Promise<void>;
  fetchShop: () => Promise<void>;
  fetchReputation: () => Promise<void>;
  buyItem: (itemId: string) => Promise<void>;
  dismissQuestModal: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const ILLUSTRATION_COUNT = 6;
const TIP_COUNT = 12;

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  ads: [],
  shopItems: [],
  reputation: null,
  log: [],
  loading: false,
  error: null,
  questModal: null,

  startGame: async () => {
    set({ loading: true, error: null, log: [] });
    try {
      const game = await api.startGame();
      set({ game, loading: false });
      audioEngine.startAdventure();
      await get().fetchAds();
      await get().fetchShop();
      await get().fetchReputation();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchAds: async () => {
    const { game } = get();
    if (!game) return;
    try {
      const raw = await api.getAds(game.gameId);
      const decoded = raw.map(decodeAd);
      const sorted = [...decoded].sort((a, b) => {
        const rateDiff = successRate(b.probability) - successRate(a.probability);
        if (rateDiff !== 0) return rateDiff;
        return b.reward - a.reward;
      });
      set({ ads: sorted });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  solveAd: async (adId: string) => {
    const { game, ads } = get();
    if (!game) return;

    const ad = ads.find((a) => a.adId === adId);
    if (!ad) return;

    set({
      loading: true,
      error: null,
      questModal: {
        phase: 'loading',
        ad,
        imageIndex: Math.floor(Math.random() * ILLUSTRATION_COUNT),
        tipIndex: Math.floor(Math.random() * TIP_COUNT),
      },
    });
    audioEngine.startQuest();

    try {
      const result = await api.solve(game.gameId, adId);

      const updatedGame: GameState = {
        ...game,
        lives: result.lives,
        gold: result.gold,
        score: result.score,
        highScore: result.highScore,
        turn: result.turn,
      };

      const { log } = get();
      const entry: LogEntry = {
        turn: result.turn,
        message: result.success
          ? `Solved "${ad.message}" (+${ad.reward} gold)`
          : `Failed "${ad.message}" — ${result.message}`,
        type: result.success ? 'success' : 'failure',
      };

      if (updatedGame.lives <= 0) {
        audioEngine.stop();
        audioEngine.playGameOver();
        saveEntry({ score: updatedGame.score, gold: updatedGame.gold, level: updatedGame.level, turn: updatedGame.turn });
      } else {
        audioEngine.stopQuest();
        if (result.success) audioEngine.playSuccess();
        else audioEngine.playFailure();
        // ambient resumes on modal dismiss
      }

      set((state) => ({
        game: updatedGame,
        loading: false,
        log: [...log, entry],
        questModal: state.questModal
          ? { ...state.questModal, phase: 'result', result }
          : null,
      }));
    } catch {
      audioEngine.resumeAdventure();
      set({ error: 'That quest expired — the board has been refreshed.', loading: false, questModal: null });
      await get().fetchAds();
    }
  },

  dismissQuestModal: async () => {
    const { game } = get();
    set({ questModal: null });
    if (game && game.lives > 0) {
      audioEngine.resumeAdventure();
      await get().fetchAds();
      await get().fetchShop();
      await get().fetchReputation();
    } else {
      set({ ads: [], shopItems: [] });
    }
  },

  fetchReputation: async () => {
    const { game } = get();
    if (!game) return;
    try {
      const reputation = await api.getReputation(game.gameId);
      set({ reputation });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  fetchShop: async () => {
    const { game } = get();
    if (!game) return;
    try {
      const items = await api.getShop(game.gameId);
      set({ shopItems: items });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  buyItem: async (itemId: string) => {
    const { game, shopItems, log } = get();
    if (!game) return;
    set({ loading: true, error: null });
    try {
      const item = shopItems.find((i) => i.id === itemId);
      const result = await api.buyItem(game.gameId, itemId);
      const updatedGame: GameState = {
        ...game,
        gold: result.gold,
        lives: result.lives,
        level: result.level,
        turn: result.turn,
      };
      const entry: LogEntry = {
        turn: result.turn,
        message: `Bought "${item?.name ?? itemId}" (-${item?.cost ?? '?'} gold)`,
        type: 'purchase',
      };
      set({ game: updatedGame, loading: false, log: [...log, entry] });
      await get().fetchAds();
      await get().fetchShop();
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null }),

  reset: () => {
    audioEngine.stop();
    set({ game: null, ads: [], shopItems: [], reputation: null, log: [], loading: false, error: null, questModal: null });
  },
}));
