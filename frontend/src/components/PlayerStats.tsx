import { useGameStore } from '../store';

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-wider text-[var(--parchment-dark)]">{label}</p>
      <p className={`stat-value text-2xl ${color ?? 'text-[var(--parchment)]'}`}>{value}</p>
    </div>
  );
}

export default function PlayerStats() {
  const game = useGameStore((s) => s.game);
  if (!game) return null;

  const livesColor = game.lives <= 1
    ? 'text-red-400'
    : game.lives <= 3
      ? 'text-yellow-400'
      : 'text-emerald-400';

  return (
    <div className="flex gap-8 justify-center rounded-lg px-6 py-3"
         style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-ornate)' }}>
      <Stat label="Score" value={game.score} color="text-[var(--gold-light)]" />
      <Stat label="Gold" value={game.gold} color="text-[var(--gold)]" />
      <Stat label="Lives" value={game.lives} color={livesColor} />
      <Stat label="Level" value={game.level} />
      <Stat label="Turn" value={game.turn} />
    </div>
  );
}
