import { useGameStore } from '../store';

export default function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const loading = useGameStore((s) => s.loading);
  const error = useGameStore((s) => s.error);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="parchment rounded-lg p-10 sm:p-14 text-center max-w-lg w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-2 tracking-wide">
          Dragons of Mugloar
        </h1>
        <div className="ornate-divider my-4" />
        <p className="text-[var(--ink-light)] text-lg mb-8 italic">
          Brave the quests, slay the odds, and forge thy legend.
        </p>
        <button
          onClick={startGame}
          disabled={loading}
          className="btn-start px-10 py-3 rounded-lg text-lg cursor-pointer"
        >
          {loading ? 'Summoning...' : 'Begin Adventure'}
        </button>
        {error && <p className="text-[var(--blood)] mt-4 font-semibold">{error}</p>}
      </div>
    </div>
  );
}
