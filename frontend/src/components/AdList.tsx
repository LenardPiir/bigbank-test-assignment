import { Ad } from '../types';
import { useGameStore } from '../store';
import { riskLevel, riskLevelColor, riskDescription } from '../utils';

const ROTATIONS = [-2.2, 1.5, -0.8, 2.1, -1.5, 0.7, -2.5, 1.8, -0.3, 2.8, -1.2, 0.5];
const PIN_OFFSETS = [42, 55, 48, 60, 38, 52, 45, 58, 50, 40, 56, 44];

function QuestPaper({ ad, index, onSolve, disabled }: {
  ad: Ad;
  index: number;
  onSolve: (adId: string) => void;
  disabled: boolean;
}) {
  const risk = riskLevel(ad.probability);
  const riskColor = riskLevelColor(ad.probability);
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const pinOffset = PIN_OFFSETS[index % PIN_OFFSETS.length];

  return (
    <div
      className="quest-paper"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="quest-pin" style={{ left: `${pinOffset}%` }} />

      <p className="font-semibold text-[var(--ink)] text-base leading-snug mb-3 line-clamp-3">
        {ad.message}
      </p>

      <div className="flex items-center justify-between text-sm mb-2.5">
        <span className="font-bold text-[var(--gold-dark)]">
          {ad.reward} gold
        </span>
        <span className="text-[var(--ink-light)] opacity-60">
          {ad.expiresIn} turns
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="risk-info">
          <svg viewBox="0 0 16 16" className="w-4 h-4" style={{ color: 'var(--ink-light)' }}>
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="8" y="11.5" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="bold">i</text>
          </svg>
          <span className={`text-sm font-bold ${riskColor}`}>{risk}</span>
          <div className="risk-tooltip">
            <p className="text-sm">{riskDescription(ad.probability)}</p>
          </div>
        </div>

        <button
          onClick={() => onSolve(ad.adId)}
          disabled={disabled}
          className="quest-accept-btn px-3 py-1 rounded cursor-pointer"
        >
          ACCEPT
        </button>
      </div>
    </div>
  );
}

export default function AdList() {
  const game = useGameStore((s) => s.game);
  const ads = useGameStore((s) => s.ads);
  const solveAd = useGameStore((s) => s.solveAd);
  const loading = useGameStore((s) => s.loading);

  if (!game) return null;

  return (
    <div className="bulletin-board">
      <div className="bulletin-header">
        <span className="bulletin-header-text">QUEST BOARD</span>
        <span className="bulletin-header-count">{ads.length} quests posted</span>
      </div>

      {ads.length === 0 ? (
        <p className="text-[var(--parchment-dark)] text-sm italic text-center py-8">
          The board is empty... return after your next venture.
        </p>
      ) : (
        <div className="bulletin-grid">
          {ads.map((ad, i) => (
            <QuestPaper
              key={ad.adId}
              ad={ad}
              index={i}
              onSolve={solveAd}
              disabled={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
