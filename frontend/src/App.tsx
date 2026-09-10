import { useEffect, useState } from 'react';
import { useGameStore } from './store';
import PlayerStats from './components/PlayerStats';
import AdList from './components/AdList';
import Shop from './components/Shop';
import ReputationPanel from './components/ReputationPanel';
import GameLog from './components/GameLog';
import Guide from './components/Guide';
import Leaderboard from './components/Leaderboard';
import GamePanel from './components/GamePanel';
import QuestModal from './components/QuestModal';
import TownBackground from './components/TownBackground';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';

type PanelId = 'merchant' | 'reputation' | 'chronicle' | 'leaderboard' | 'guide' | null;

function MerchantIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <g fill="currentColor" opacity="0.9">
        <rect x="4" y="10" width="16" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 10 L7 4 L17 4 L20 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="14" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10" y1="16" x2="14" y2="16" stroke="currentColor" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function ReputationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9">
        <path d="M12 3 L14.5 8.5 L20.5 9.2 L16 13.5 L17 19.5 L12 16.8 L7 19.5 L8 13.5 L3.5 9.2 L9.5 8.5 Z" />
      </g>
    </svg>
  );
}

function ChronicleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9">
        <path d="M6 3 Q4 3 4 5 L4 19 Q4 21 6 21 L18 21 Q20 21 20 19 L20 5 Q20 3 18 3Z" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="14" y2="12" />
        <line x1="8" y1="16" x2="12" y2="16" />
      </g>
    </svg>
  );
}

function LeaderboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9">
        <path d="M6 21 L6 12 L10 12 L10 21" />
        <path d="M10 21 L10 8 L14 8 L14 21" />
        <path d="M14 21 L14 14 L18 14 L18 21" />
        <line x1="4" y1="21" x2="20" y2="21" />
      </g>
    </svg>
  );
}

const PANELS: { id: Exclude<PanelId, null>; label: string; icon: () => JSX.Element }[] = [
  { id: 'merchant', label: 'Merchant', icon: MerchantIcon },
  { id: 'reputation', label: 'Reputation', icon: ReputationIcon },
  { id: 'chronicle', label: 'Chronicle', icon: ChronicleIcon },
  { id: 'leaderboard', label: 'Leaderboard', icon: LeaderboardIcon },
];

const PANEL_TITLES: Record<string, string> = {
  merchant: 'Merchant',
  reputation: 'Reputation',
  chronicle: 'Chronicle',
  leaderboard: 'Leaderboard',
  guide: 'How to Play',
};

export default function App() {
  const game = useGameStore((s) => s.game);
  const error = useGameStore((s) => s.error);
  const questModal = useGameStore((s) => s.questModal);
  const clearError = useGameStore((s) => s.clearError);
  const [openPanel, setOpenPanel] = useState<PanelId>(null);

  useEffect(() => {
    if (!error) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(clearError, 5000);
    return () => clearTimeout(timer);
  }, [error, clearError]);

  const togglePanel = (id: PanelId) => setOpenPanel((prev) => (prev === id ? null : id));

  if (!game) return (
    <>
      <TownBackground />
      <StartScreen />
    </>
  );

  if (game.lives <= 0 && !questModal) return (
    <>
      <TownBackground />
      <GameOverScreen />
    </>
  );

  return (
    <div className="min-h-screen">
      <TownBackground />

      <header className="dark-panel relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-[var(--gold)] mb-3 tracking-wider">
            Dragons of Mugloar
          </h1>
          <PlayerStats />
        </div>
      </header>

      {error && (
        <div className="relative z-10 max-w-5xl mx-auto px-4 mt-4">
          <div className="parchment-flat rounded-lg p-3 flex items-center justify-between">
            <p className="text-[var(--blood)] text-sm font-semibold">{error}</p>
            <button onClick={clearError} className="text-[var(--ink-light)] text-sm cursor-pointer hover:text-[var(--ink)] ml-4">✕</button>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-end items-center mb-4">
          <div className="flex gap-2">
            {PANELS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => togglePanel(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  openPanel === id
                    ? 'bg-[var(--gold)] text-[var(--bg-dark)] font-bold'
                    : 'text-[var(--parchment-dark)] hover:text-[var(--gold)]'
                }`}
                style={openPanel !== id ? { background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-ornate)' } : {}}
              >
                <Icon />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
            <button
              onClick={() => togglePanel('guide')}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-colors shrink-0 ${
                openPanel === 'guide'
                  ? 'bg-[var(--gold)] text-[var(--bg-dark)]'
                  : 'text-[var(--parchment-dark)] hover:text-[var(--gold)]'
              }`}
              style={openPanel !== 'guide' ? { background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-ornate)' } : {}}
              title="How to Play"
            >
              ?
            </button>
          </div>
        </div>
        <AdList />
      </main>

      {openPanel && (
        <GamePanel title={PANEL_TITLES[openPanel]} onClose={() => setOpenPanel(null)}>
          {openPanel === 'merchant' && <Shop />}
          {openPanel === 'reputation' && <ReputationPanel />}
          {openPanel === 'chronicle' && <GameLog />}
          {openPanel === 'leaderboard' && <Leaderboard />}
          {openPanel === 'guide' && <Guide />}
        </GamePanel>
      )}

      <QuestModal />
    </div>
  );
}
