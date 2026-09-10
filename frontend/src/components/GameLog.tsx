import { useEffect, useRef } from 'react';
import { useGameStore, LogEntry } from '../store';

const TYPE_COLORS: Record<LogEntry['type'], string> = {
  success: 'text-emerald-300',
  failure: 'text-red-400',
  purchase: 'text-[var(--gold)]',
  info: 'text-[var(--parchment-dark)]',
};

export default function GameLog() {
  const log = useGameStore((s) => s.log);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [log.length]);

  return (
    <div ref={containerRef} className="max-h-[60vh] overflow-y-auto">
      {log.length === 0 ? (
        <p className="text-[var(--parchment-dark)] text-base italic opacity-60">Thy deeds shall be recorded here.</p>
      ) : (
        <div className="space-y-1.5">
          {log.map((entry, i) => (
            <p key={i} className={`text-base ${TYPE_COLORS[entry.type]}`}>
              <span className="text-[var(--parchment-dark)] opacity-50 font-mono text-sm">[{entry.turn}]</span>{' '}
              {entry.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
