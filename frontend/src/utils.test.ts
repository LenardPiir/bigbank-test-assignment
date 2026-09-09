import { describe, it, expect } from 'vitest';
import { successRate, riskAdjustedScore, riskBadgeColor, riskLevel, riskLevelColor, decodeAd } from './utils';
import { Ad } from './types';

const DEFAULT_LIVES = 3;

function anAd(overrides: Partial<Ad> = {}): Ad {
  return {
    adId: 'ad1',
    message: 'Do a thing',
    reward: 50,
    expiresIn: 5,
    encrypted: null,
    probability: 'Sure thing',
    ...overrides,
  };
}

describe('successRate', () => {
  it('returns known rate for Sure thing', () => {
    expect(successRate('Sure thing')).toBe(0.92);
  });

  it('returns known rate for Suicide mission', () => {
    expect(successRate('Suicide mission')).toBe(0.03);
  });

  it('returns 0.5 for unknown probability', () => {
    expect(successRate('Unknown')).toBe(0.5);
  });
});

describe('riskAdjustedScore', () => {
  it('scores safe high-reward ads positively', () => {
    const ad = anAd({ reward: 100, probability: 'Sure thing', expiresIn: 5 });
    expect(riskAdjustedScore(ad, DEFAULT_LIVES)).toBeGreaterThan(0);
  });

  it('scores dangerous low-reward ads negatively', () => {
    const ad = anAd({ reward: 5, probability: 'Suicide mission', expiresIn: 5 });
    expect(riskAdjustedScore(ad, DEFAULT_LIVES)).toBeLessThan(0);
  });

  it('treats zero expiresIn as urgency 1', () => {
    const ad = anAd({ expiresIn: 0 });
    const score = riskAdjustedScore(ad, DEFAULT_LIVES);
    const adWithOne = anAd({ expiresIn: 1 });
    expect(score).toBe(riskAdjustedScore(adWithOne, DEFAULT_LIVES));
  });

  it('increases life cost when lives are low', () => {
    const ad = anAd({ reward: 30, probability: 'Risky' });
    const scoreHighLives = riskAdjustedScore(ad, 4);
    const scoreLowLives = riskAdjustedScore(ad, 1);
    expect(scoreLowLives).toBeLessThan(scoreHighLives);
  });
});

describe('riskBadgeColor', () => {
  it('returns green for safe probabilities', () => {
    expect(riskBadgeColor('Sure thing')).toContain('emerald');
  });

  it('returns yellow for medium probabilities', () => {
    expect(riskBadgeColor('Hmmm....')).toContain('yellow');
  });

  it('returns orange for risky probabilities', () => {
    expect(riskBadgeColor('Playing with fire')).toContain('orange');
  });

  it('returns red for dangerous probabilities', () => {
    expect(riskBadgeColor('Suicide mission')).toContain('red');
  });
});

describe('riskLevel', () => {
  it('returns Safe for high probability', () => {
    expect(riskLevel('Sure thing')).toBe('Safe');
  });

  it('returns Safe for Quite likely', () => {
    expect(riskLevel('Quite likely')).toBe('Safe');
  });

  it('returns Moderate risk for medium probability', () => {
    expect(riskLevel('Hmmm....')).toBe('Moderate risk');
  });

  it('returns Dangerous for low probability', () => {
    expect(riskLevel('Playing with fire')).toBe('Dangerous');
  });

  it('returns Deadly for very low probability', () => {
    expect(riskLevel('Suicide mission')).toBe('Deadly');
  });
});

describe('riskLevelColor', () => {
  it('returns emerald for safe quests', () => {
    expect(riskLevelColor('Sure thing')).toContain('emerald');
  });

  it('returns yellow for moderate risk', () => {
    expect(riskLevelColor('Hmmm....')).toContain('yellow');
  });

  it('returns orange for dangerous quests', () => {
    expect(riskLevelColor('Playing with fire')).toContain('orange');
  });

  it('returns red for deadly quests', () => {
    expect(riskLevelColor('Suicide mission')).toContain('red');
  });
});

describe('decodeAd', () => {
  it('returns unencrypted ads unchanged', () => {
    const ad = anAd();
    expect(decodeAd(ad)).toEqual(ad);
  });

  it('decodes base64 encrypted ads but preserves adId', () => {
    const encodedId = btoa('secret-id');
    const ad = anAd({
      adId: encodedId,
      message: btoa('secret message'),
      probability: btoa('Sure thing'),
      encrypted: '1',
    });
    const decoded = decodeAd(ad);
    expect(decoded.adId).toBe(encodedId);
    expect(decoded.message).toBe('secret message');
    expect(decoded.probability).toBe('Sure thing');
  });

  it('decodes ROT13 encrypted ads but preserves adId', () => {
    const ad = anAd({
      adId: 'dEegahRU',
      message: 'Xvyy Lhhan Znggurjfba jvgu ohpxrg',
      probability: 'Vzcbffvoyr',
      encrypted: '2',
    });
    const decoded = decodeAd(ad);
    expect(decoded.adId).toBe('dEegahRU');
    expect(decoded.message).toBe('Kill Yuuna Matthewson with bucket');
    expect(decoded.probability).toBe('Impossible');
  });
});
