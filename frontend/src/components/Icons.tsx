const ICON_COLOR = '#c9a227';

function PotionIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="18" y="6" width="12" height="8" rx="2" fill="none" stroke={ICON_COLOR} strokeWidth="1.5" />
      <path d="M16 14 L10 28 Q7 38 12 42 L16 44 Q24 47 32 44 L36 42 Q41 38 38 28 L32 14" fill="none" stroke={ICON_COLOR} strokeWidth="1.5" />
      <path d="M14 32 Q24 28 34 32 Q24 36 14 32Z" fill="#2d5a27" opacity="0.5" />
      <circle cx="20" cy="38" r="2" fill="#2d5a27" opacity="0.4" />
      <circle cx="28" cy="36" r="1.5" fill="#2d5a27" opacity="0.4" />
    </svg>
  );
}

function ClawIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.8" fill="none" strokeLinecap="round">
        <path d="M12 36 Q16 20 22 10" />
        <path d="M18 38 Q22 22 26 14" />
        <path d="M24 36 Q26 22 30 12" />
        <path d="M30 38 Q30 26 34 16" />
      </g>
      <path d="M10 40 Q22 34 36 40 Q22 44 10 40Z" fill={ICON_COLOR} opacity="0.3" />
    </svg>
  );
}

function FuelIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M24 6 Q28 14 32 20 Q38 28 32 36 Q28 42 24 42 Q20 42 16 36 Q10 28 16 20 Q20 14 24 6Z" fill={ICON_COLOR} opacity="0.2" stroke={ICON_COLOR} strokeWidth="1.5" />
      <path d="M24 18 Q26 22 28 26 Q30 30 28 34 Q26 36 24 36 Q22 36 20 34 Q18 30 20 26 Q22 22 24 18Z" fill="#b33a3a" opacity="0.5" />
      <path d="M24 28 Q25 30 26 32 Q26 34 24 34 Q22 34 22 32 Q23 30 24 28Z" fill={ICON_COLOR} opacity="0.6" />
    </svg>
  );
}

function ArmorIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path d="M24 6 L38 12 L38 28 Q38 38 24 44 Q10 38 10 28 L10 12 Z" fill={ICON_COLOR} opacity="0.15" stroke={ICON_COLOR} strokeWidth="1.5" />
      <path d="M24 14 L32 18 L32 28 Q32 34 24 38 Q16 34 16 28 L16 18 Z" fill="none" stroke={ICON_COLOR} strokeWidth="1.2" opacity="0.6" />
      <line x1="24" y1="18" x2="24" y2="34" stroke={ICON_COLOR} strokeWidth="1.2" opacity="0.5" />
      <line x1="16" y1="24" x2="32" y2="24" stroke={ICON_COLOR} strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect x="10" y="8" width="28" height="34" rx="2" fill={ICON_COLOR} opacity="0.15" stroke={ICON_COLOR} strokeWidth="1.5" />
      <line x1="16" y1="8" x2="16" y2="42" stroke={ICON_COLOR} strokeWidth="1.5" />
      <line x1="20" y1="16" x2="34" y2="16" stroke={ICON_COLOR} strokeWidth="1" opacity="0.4" />
      <line x1="20" y1="20" x2="32" y2="20" stroke={ICON_COLOR} strokeWidth="1" opacity="0.4" />
      <line x1="20" y1="24" x2="30" y2="24" stroke={ICON_COLOR} strokeWidth="1" opacity="0.4" />
      <path d="M22 30 L26 28 L30 30 L26 32Z" fill={ICON_COLOR} opacity="0.5" />
    </svg>
  );
}

function WingsIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.5" fill="none">
        <path d="M24 24 Q16 16 6 14 Q8 22 14 28 Q18 32 24 32" fill={ICON_COLOR} opacity="0.15" />
        <path d="M24 24 Q32 16 42 14 Q40 22 34 28 Q30 32 24 32" fill={ICON_COLOR} opacity="0.15" />
        <path d="M24 24 Q18 18 10 18" opacity="0.5" />
        <path d="M24 24 Q30 18 38 18" opacity="0.5" />
        <path d="M24 24 Q17 20 8 22" opacity="0.5" />
        <path d="M24 24 Q31 20 40 22" opacity="0.5" />
      </g>
      <circle cx="24" cy="28" r="3" fill={ICON_COLOR} opacity="0.4" />
    </svg>
  );
}

function EscortIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.5" fill="none" opacity="0.8">
        <circle cx="18" cy="14" r="5" />
        <path d="M18 19 L18 30 M12 24 L24 24 M18 30 L12 40 M18 30 L24 40" />
        <path d="M28 20 L38 20 L38 30 L28 30Z" fill={ICON_COLOR} opacity="0.15" />
        <line x1="30" y1="24" x2="36" y2="24" opacity="0.5" />
        <line x1="30" y1="27" x2="34" y2="27" opacity="0.5" />
        <path d="M32 34 L36 30 L40 34" />
      </g>
    </svg>
  );
}

function StealIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.5" fill="none" opacity="0.8">
        <path d="M24 6 L28 22 L24 20 L20 22Z" fill={ICON_COLOR} opacity="0.3" />
        <line x1="24" y1="22" x2="24" y2="38" />
        <line x1="18" y1="26" x2="30" y2="26" strokeWidth="2" />
        <circle cx="24" cy="40" r="3" fill={ICON_COLOR} opacity="0.2" />
      </g>
    </svg>
  );
}

function CleanIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.5" fill="none" opacity="0.8">
        <line x1="24" y1="6" x2="24" y2="28" strokeWidth="2" />
        <path d="M18 28 L16 42 L32 42 L30 28Z" fill={ICON_COLOR} opacity="0.15" />
        <line x1="20" y1="34" x2="28" y2="34" opacity="0.5" />
        <line x1="19" y1="38" x2="29" y2="38" opacity="0.5" />
      </g>
    </svg>
  );
}

function FixIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.5" fill="none" opacity="0.8">
        <path d="M14 8 L20 8 L20 24 L14 24Z" fill={ICON_COLOR} opacity="0.2" />
        <line x1="17" y1="24" x2="17" y2="42" strokeWidth="3" />
        <path d="M30 14 L42 26" strokeWidth="2" />
        <path d="M28 10 Q34 8 38 12 Q40 16 38 20 L34 16 L30 18 L28 14Z" fill={ICON_COLOR} opacity="0.3" />
      </g>
    </svg>
  );
}

function TransportIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.5" fill="none" opacity="0.8">
        <rect x="10" y="16" width="22" height="16" rx="2" fill={ICON_COLOR} opacity="0.15" />
        <circle cx="16" cy="36" r="4" />
        <circle cx="28" cy="36" r="4" />
        <line x1="32" y1="24" x2="40" y2="24" />
        <line x1="40" y1="20" x2="40" y2="28" />
      </g>
    </svg>
  );
}

function ScrollIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.5" fill="none" opacity="0.8">
        <path d="M14 8 Q10 8 10 12 L10 36 Q10 40 14 40 L34 40 Q38 40 38 36 L38 12 Q38 8 34 8Z" fill={ICON_COLOR} opacity="0.1" />
        <path d="M10 12 Q10 8 14 8" strokeWidth="2" />
        <path d="M38 36 Q38 40 34 40" strokeWidth="2" />
        <line x1="16" y1="16" x2="32" y2="16" opacity="0.5" />
        <line x1="16" y1="21" x2="30" y2="21" opacity="0.5" />
        <line x1="16" y1="26" x2="28" y2="26" opacity="0.5" />
        <line x1="16" y1="31" x2="26" y2="31" opacity="0.5" />
      </g>
    </svg>
  );
}

function AgreementIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.5" fill="none" opacity="0.8">
        <path d="M8 28 L14 22 L18 26 L22 24" />
        <path d="M40 28 L34 22 L30 26 L26 24" />
        <path d="M22 24 Q24 22 26 24" />
        <rect x="12" y="8" width="24" height="14" rx="2" fill={ICON_COLOR} opacity="0.1" />
        <line x1="18" y1="12" x2="30" y2="12" opacity="0.5" />
        <line x1="18" y1="16" x2="28" y2="16" opacity="0.5" />
        <path d="M20 36 L24 32 L28 36 L24 42Z" fill={ICON_COLOR} opacity="0.3" />
      </g>
    </svg>
  );
}

function QuestIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <g stroke={ICON_COLOR} strokeWidth="1.5" fill="none" opacity="0.8">
        <line x1="24" y1="4" x2="24" y2="32" strokeWidth="2" />
        <path d="M24 4 L40 12 L40 22 L24 16Z" fill={ICON_COLOR} opacity="0.25" />
        <line x1="18" y1="32" x2="30" y2="32" strokeWidth="2" />
        <line x1="20" y1="36" x2="28" y2="36" strokeWidth="1.5" />
        <circle cx="24" cy="42" r="3" fill={ICON_COLOR} opacity="0.3" />
      </g>
    </svg>
  );
}

export function getShopIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('potion') && !lower.includes('wing')) return PotionIcon;
  if (lower.includes('claw')) return ClawIcon;
  if (lower.includes('gasoline') || lower.includes('fuel') || lower.includes('rocket')) return FuelIcon;
  if (lower.includes('plating') || lower.includes('iron') || lower.includes('copper')) return ArmorIcon;
  if (lower.includes('book') || lower.includes('trick')) return BookIcon;
  if (lower.includes('wing')) return WingsIcon;
  return PotionIcon;
}

export function getQuestIcon(message: string) {
  const lower = message.toLowerCase();
  if (lower.startsWith('escort')) return EscortIcon;
  if (lower.startsWith('steal')) return StealIcon;
  if (lower.includes('clean')) return CleanIcon;
  if (lower.includes('fix')) return FixIcon;
  if (lower.includes('transport')) return TransportIcon;
  if (lower.includes('write') || lower.includes('novel')) return ScrollIcon;
  if (lower.includes('agreement')) return AgreementIcon;
  if (lower.includes('advertisement') || lower.includes('campaign')) return ScrollIcon;
  return QuestIcon;
}
