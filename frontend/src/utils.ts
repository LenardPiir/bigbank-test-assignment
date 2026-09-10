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

interface RiskTier {
  min: number;
  level: string;
  color: string;
  badge: string;
  description: string;
}

const RISK_TIERS: RiskTier[] = [
  { min: 0.7, level: 'Safe', color: 'text-emerald-800', badge: 'bg-emerald-800 text-emerald-100 border-emerald-900', description: 'Good odds of completing this quest.' },
  { min: 0.4, level: 'Moderate risk', color: 'text-yellow-700', badge: 'bg-yellow-700 text-yellow-100 border-yellow-900', description: 'Could go either way — proceed with caution.' },
  { min: 0.15, level: 'Dangerous', color: 'text-orange-700', badge: 'bg-orange-800 text-orange-100 border-orange-900', description: 'More likely to fail than succeed.' },
  { min: -Infinity, level: 'Deadly', color: 'text-red-800', badge: 'bg-red-900 text-red-100 border-red-950', description: 'Almost certain to fail — expect to lose a life.' },
];

function riskTier(probability: string): RiskTier {
  const rate = successRate(probability);
  return RISK_TIERS.find((t) => rate >= t.min)!;
}

export function riskBadgeColor(probability: string) { return riskTier(probability).badge; }
export function riskLevel(probability: string) { return riskTier(probability).level; }
export function riskDescription(probability: string) { return riskTier(probability).description; }
export function riskLevelColor(probability: string) { return riskTier(probability).color; }

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
  const encryptedAd = String(ad.encrypted);
  let decode: (value: string) => string;
  if (encryptedAd === '1') {
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
