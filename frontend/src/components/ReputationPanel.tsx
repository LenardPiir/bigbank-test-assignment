import { useGameStore } from '../store';

const FACTIONS: { key: 'people' | 'state' | 'underworld'; label: string; icon: string }[] = [
  { key: 'people', label: 'People', icon: '\u{1F465}' },
  { key: 'state', label: 'State', icon: '\u{1F3DB}' },
  { key: 'underworld', label: 'Underworld', icon: '\u{1F5E1}' },
];

function reputationLabel(value: number): { text: string; color: string } {
  if (value >= 3) return { text: 'Revered', color: 'text-emerald-400' };
  if (value >= 1) return { text: 'Friendly', color: 'text-emerald-300' };
  if (value >= 0) return { text: 'Neutral', color: 'text-[var(--parchment-dark)]' };
  if (value >= -2) return { text: 'Unfriendly', color: 'text-orange-400' };
  return { text: 'Hostile', color: 'text-red-400' };
}

export default function ReputationPanel() {
  const reputation = useGameStore((s) => s.reputation);

  if (!reputation) {
    return <p className="text-[var(--parchment-dark)] text-base italic">Gathering intelligence...</p>;
  }

  return (
    <div className="space-y-5">
      {FACTIONS.map(({ key, label, icon }) => {
        const value = reputation[key];
        const { text, color } = reputationLabel(value);
        const rounded = Math.round(value * 10) / 10;
        return (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[var(--parchment)] text-base">
              {icon} {label}
            </span>
            <span className={`text-base font-semibold ${color}`}>
              {text} ({rounded >= 0 ? '+' : ''}{rounded})
            </span>
          </div>
        );
      })}
    </div>
  );
}
