import { useGameStore } from '../store';

const TIPS = [
  'Focus on high-reward quests early to build your gold reserves.',
  'Keep enough gold for a Healing Potion when your lives are low.',
  'Quests with "Sure thing" probability are nearly guaranteed success.',
  'The risk-adjusted score accounts for both reward and danger.',
  'Avoid "Suicide mission" quests unless the reward is extraordinary.',
  'Buy upgrades from the Merchant to improve your odds in later rounds.',
  'Expiring quests should be prioritized if their reward is decent.',
  'A wise adventurer knows when to retreat from a losing battle.',
  'Gold is power — but only if you survive to spend it.',
  'The higher your level, the tougher the quests become.',
  'Healing Potions cost 50 gold and restore one life.',
  'Watch for encrypted quests — they often hide valuable rewards.',
];

function DragonIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <radialGradient id="glow-d" cx="50%" cy="60%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill="url(#glow-d)" />
      <g transform="translate(50, 20)" fill="#c9a227" opacity="0.8">
        <path d="M50 10 L60 30 L80 35 L70 50 L85 80 L65 70 L50 90 L35 70 L15 80 L30 50 L20 35 L40 30 Z" />
        <path d="M30 80 Q20 100 10 110 L25 105 Q30 95 35 85Z" />
        <path d="M70 80 Q80 100 90 110 L75 105 Q70 95 65 85Z" />
        <ellipse cx="40" cy="35" rx="3" ry="2" fill="#1a1410" />
        <ellipse cx="60" cy="35" rx="3" ry="2" fill="#1a1410" />
        <path d="M20 25 L30 15 L35 28" fill="none" stroke="#c9a227" strokeWidth="2" />
        <path d="M80 25 L70 15 L65 28" fill="none" stroke="#c9a227" strokeWidth="2" />
      </g>
      <text x="100" y="145" textAnchor="middle" fill="#c9a227" opacity="0.4" fontSize="10" fontFamily="Cinzel, serif">Draco Mugloaris</text>
    </svg>
  );
}

function SwordsIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <radialGradient id="glow-s" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill="url(#glow-s)" />
      <g stroke="#c9a227" strokeWidth="2.5" fill="none" opacity="0.8">
        <line x1="60" y1="120" x2="120" y2="20" />
        <line x1="115" y1="18" x2="130" y2="25" />
        <line x1="140" y1="120" x2="80" y2="20" />
        <line x1="85" y1="18" x2="70" y2="25" />
        <rect x="55" y="105" width="10" height="20" rx="2" fill="#c9a227" opacity="0.6" />
        <rect x="135" y="105" width="10" height="20" rx="2" fill="#c9a227" opacity="0.6" />
        <line x1="48" y1="105" x2="72" y2="105" strokeWidth="3" />
        <line x1="128" y1="105" x2="152" y2="105" strokeWidth="3" />
      </g>
      <text x="100" y="150" textAnchor="middle" fill="#c9a227" opacity="0.4" fontSize="10" fontFamily="Cinzel, serif">Steel &amp; Valor</text>
    </svg>
  );
}

function ShieldIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <radialGradient id="glow-sh" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill="url(#glow-sh)" />
      <g transform="translate(60, 10)" fill="none" stroke="#c9a227" strokeWidth="2.5" opacity="0.8">
        <path d="M40 5 L75 15 L75 65 Q75 105 40 130 Q5 105 5 65 L5 15 Z" />
        <path d="M40 25 L55 30 L55 65 Q55 90 40 105 Q25 90 25 65 L25 30 Z" fill="#c9a227" opacity="0.15" />
        <line x1="40" y1="40" x2="40" y2="95" strokeWidth="2" />
        <line x1="25" y1="60" x2="55" y2="60" strokeWidth="2" />
      </g>
      <text x="100" y="150" textAnchor="middle" fill="#c9a227" opacity="0.4" fontSize="10" fontFamily="Cinzel, serif">Fortis et Fidelis</text>
    </svg>
  );
}

function PotionIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <radialGradient id="glow-p" cx="50%" cy="60%">
          <stop offset="0%" stopColor="#2d5a27" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill="url(#glow-p)" />
      <g transform="translate(70, 10)" fill="none" stroke="#c9a227" strokeWidth="2.5" opacity="0.8">
        <rect x="22" y="5" width="16" height="15" rx="2" />
        <path d="M20 20 L10 55 Q5 80 10 100 L15 110 Q30 120 45 110 L50 100 Q55 80 50 55 L40 20" />
        <path d="M15 70 Q30 60 45 70 Q30 80 15 70Z" fill="#2d5a27" opacity="0.4" />
        <circle cx="25" cy="85" r="3" fill="#2d5a27" opacity="0.3" />
        <circle cx="35" cy="90" r="2" fill="#2d5a27" opacity="0.3" />
        <circle cx="30" cy="50" r="2" fill="#c9a227" opacity="0.3" />
      </g>
      <text x="100" y="148" textAnchor="middle" fill="#c9a227" opacity="0.4" fontSize="10" fontFamily="Cinzel, serif">Elixir of Life</text>
    </svg>
  );
}

function CastleIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <radialGradient id="glow-c" cx="50%" cy="70%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill="url(#glow-c)" />
      <g stroke="#c9a227" strokeWidth="2" fill="none" opacity="0.8">
        <rect x="35" y="50" width="25" height="70" />
        <rect x="140" y="50" width="25" height="70" />
        <rect x="70" y="35" width="60" height="85" />
        <path d="M35 50 L37 40 L43 50 L47 40 L53 50 L57 40 L60 50" />
        <path d="M140 50 L142 40 L148 50 L152 40 L158 50 L162 40 L165 50" />
        <path d="M70 35 L73 25 L79 35 L85 25 L91 35 L97 25 L103 35 L109 25 L115 35 L121 25 L127 35 L130 25" />
        <path d="M85 120 L85 90 Q100 75 115 90 L115 120" fill="#c9a227" opacity="0.15" />
        <rect x="88" y="55" width="10" height="12" fill="#c9a227" opacity="0.2" />
        <rect x="108" y="55" width="10" height="12" fill="#c9a227" opacity="0.2" />
        <line x1="35" y1="120" x2="165" y2="120" strokeWidth="2.5" />
      </g>
      <text x="100" y="145" textAnchor="middle" fill="#c9a227" opacity="0.4" fontSize="10" fontFamily="Cinzel, serif">Fortress of Mugloar</text>
    </svg>
  );
}

function TreasureIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <radialGradient id="glow-t" cx="50%" cy="60%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill="url(#glow-t)" />
      <g transform="translate(45, 25)" fill="none" stroke="#c9a227" strokeWidth="2.5" opacity="0.8">
        <path d="M10 50 L0 100 L110 100 L100 50Z" />
        <path d="M10 50 Q55 10 100 50" />
        <line x1="55" y1="50" x2="55" y2="30" />
        <circle cx="55" cy="55" r="8" fill="#c9a227" opacity="0.3" />
        <rect x="51" y="51" width="8" height="8" rx="1" />
        <circle cx="30" cy="35" r="4" fill="#c9a227" opacity="0.4" />
        <circle cx="75" cy="38" r="3" fill="#c9a227" opacity="0.4" />
        <circle cx="50" cy="22" r="3" fill="#c9a227" opacity="0.3" />
        <circle cx="65" cy="25" r="2" fill="#c9a227" opacity="0.3" />
        <line x1="0" y1="100" x2="110" y2="100" strokeWidth="3" />
      </g>
      <text x="100" y="148" textAnchor="middle" fill="#c9a227" opacity="0.4" fontSize="10" fontFamily="Cinzel, serif">Spoils of War</text>
    </svg>
  );
}

const ILLUSTRATIONS = [
  DragonIllustration,
  SwordsIllustration,
  ShieldIllustration,
  PotionIllustration,
  CastleIllustration,
  TreasureIllustration,
];

export default function QuestModal() {
  const questModal = useGameStore((s) => s.questModal);
  const dismissQuestModal = useGameStore((gameStore) => gameStore.dismissQuestModal);

  if (!questModal) return null;

  const { phase, ad, result, imageIndex, tipIndex } = questModal;
  const Illustration = ILLUSTRATIONS[imageIndex % ILLUSTRATIONS.length];
  const tip = TIPS[tipIndex % TIPS.length];

  if (phase === 'loading') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
        <div className="parchment rounded-lg p-6 max-w-md w-full text-center"
             style={{ background: 'linear-gradient(180deg, #1a1410 0%, #2a2018 50%, #1a1410 100%)', border: '2px solid var(--border-ornate)' }}>
          <div className="w-48 h-36 mx-auto mb-4 rounded overflow-hidden" style={{ border: '1px solid var(--border-ornate)' }}>
            <Illustration />
          </div>
          <h3 className="text-lg font-bold text-[var(--gold)] tracking-wide mb-2">
            Embarking on Quest...
          </h3>
          <p className="text-[var(--parchment)] text-sm italic mb-4 truncate">
            &ldquo;{ad.message}&rdquo;
          </p>
          <div className="ornate-divider my-4" />
          <p className="text-[var(--parchment-dark)] text-xs">
            {tip}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const success = result?.success ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="parchment rounded-lg p-6 max-w-md w-full text-center"
           style={{
             background: success
               ? 'linear-gradient(180deg, #1a2a15 0%, #2a3a20 50%, #1a2a15 100%)'
               : 'linear-gradient(180deg, #2a1515 0%, #3a2020 50%, #2a1515 100%)',
             border: `2px solid ${success ? '#3a7a33' : '#8b1a1a'}`,
           }}>
        <div className="w-48 h-36 mx-auto mb-4 rounded overflow-hidden" style={{ border: '1px solid var(--border-ornate)' }}>
          <Illustration />
        </div>
        <h3 className="text-2xl font-bold tracking-wide mb-1"
            style={{ color: success ? '#4a9a40' : '#b33a3a', fontFamily: 'Cinzel, serif' }}>
          {success ? 'Quest Complete!' : 'Quest Failed'}
        </h3>
        <p className="text-[var(--parchment)] text-sm italic mb-3 truncate">
          &ldquo;{ad.message}&rdquo;
        </p>
        <div className="ornate-divider my-3" />
        {success ? (
          <div className="space-y-1 mb-4">
            <p className="text-[var(--gold-light)] text-lg font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
              +{ad.reward} Gold
            </p>
            <p className="text-[var(--parchment-dark)] text-sm">
              Score: {result?.score} | Lives: {result?.lives}
            </p>
          </div>
        ) : (
          <div className="space-y-1 mb-4">
            <p className="text-red-400 text-sm font-semibold">
              {result?.message || 'The quest proved too dangerous.'}
            </p>
            <p className="text-[var(--parchment-dark)] text-sm">
              Lives remaining: {result?.lives}
            </p>
          </div>
        )}
        <button
          onClick={dismissQuestModal}
          className={`px-8 py-2.5 rounded-lg cursor-pointer text-base ${success ? 'btn-start' : 'btn-quest'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
