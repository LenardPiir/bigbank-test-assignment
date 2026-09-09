import { Ad } from './types';

const SUCCESS_RATES: Record<string, number> = {
  'Sure thing': 0.92,
  'Piece of cake': 0.87,
  'Walk in the park': 0.80,
  'Quite likely': 0.70,
  'Hmmm....': 0.55,
  'Risky': 0.40,
  'Gamble': 0.25,
  'Playing with fire': 0.15,
  'Rather detrimental': 0.08,
  'Suicide mission': 0.03,
  'Impossible': 0.01,
};

const HEALING_POTION_COST = 50;
const HEALTHY_LIVES = 4;

export function successRate(probability: string): number {
  return SUCCESS_RATES[probability] ?? 0.5;
}

export function riskAdjustedScore(ad: Ad, lives: number): number {
  const rate = successRate(ad.probability);
  const urgency = ad.expiresIn <= 0 ? 1 : ad.expiresIn;
  const lifeCost = (HEALING_POTION_COST * HEALTHY_LIVES) / Math.max(1, lives);
  return (ad.reward * rate - lifeCost * (1 - rate)) / urgency;
}

export function riskBadgeColor(probability: string): string {
  const rate = successRate(probability);
  if (rate >= 0.7) return 'bg-emerald-800 text-emerald-100 border-emerald-900';
  if (rate >= 0.4) return 'bg-yellow-700 text-yellow-100 border-yellow-900';
  if (rate >= 0.15) return 'bg-orange-800 text-orange-100 border-orange-900';
  return 'bg-red-900 text-red-100 border-red-950';
}

export function riskLevel(probability: string): string {
  const rate = successRate(probability);
  if (rate >= 0.7) return 'Safe';
  if (rate >= 0.4) return 'Moderate risk';
  if (rate >= 0.15) return 'Dangerous';
  return 'Deadly';
}

export function riskDescription(probability: string): string {
  const rate = successRate(probability);
  if (rate >= 0.7) return 'Good odds of completing this quest.';
  if (rate >= 0.4) return 'Could go either way — proceed with caution.';
  if (rate >= 0.15) return 'More likely to fail than succeed.';
  return 'Almost certain to fail — expect to lose a life.';
}

export function riskLevelColor(probability: string): string {
  const rate = successRate(probability);
  if (rate >= 0.7) return 'text-emerald-800';
  if (rate >= 0.4) return 'text-yellow-700';
  if (rate >= 0.15) return 'text-orange-700';
  return 'text-red-800';
}

function decodeBase64(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeRot13(value: string): string {
  return value.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export function decodeAd(ad: Ad): Ad {
  if (!ad.encrypted) return ad;
  const enc = String(ad.encrypted);
  let decode: (v: string) => string;
  if (enc === '1') {
    decode = decodeBase64;
  } else {
    decode = decodeRot13;
  }
  return {
    ...ad,
    message: decode(ad.message),
    probability: decode(ad.probability),
  };
}
