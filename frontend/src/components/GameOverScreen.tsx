import { useGameStore } from '../store';
import { getRank } from './Leaderboard';

export default function GameOverScreen() {
  const game = useGameStore((s) => s.game);
  const reset = useGameStore((s) => s.reset);

  if (!game) return null;

  const rank = getRank(game.score);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="parchment rounded-lg p-10 sm:p-14 text-center max-w-lg w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-2 tracking-wide">
          Game Over
        </h1>
        <div className="ornate-divider my-4" />
        <p className="stat-value text-3xl mb-1 text-[var(--ink)]">
          {game.score} points
        </p>
        <p className="text-[var(--ink-light)] text-base mb-2">
          Rank <strong className="text-[var(--ink)]">#{rank}</strong> &middot; {game.turn} turns &middot; {game.gold} gold
        </p>
        <p className="text-[var(--ink-light)] text-lg mb-6 italic">
          Thy journey ends here, but glory awaits anew.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-start px-10 py-3 rounded-lg text-lg cursor-pointer"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
