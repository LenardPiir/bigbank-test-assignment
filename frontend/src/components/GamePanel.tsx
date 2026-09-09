import { ReactNode } from 'react';

export default function GamePanel({ title, onClose, children }: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4" onClick={onClose}>
      <div
        className="rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col"
        style={{ background: 'linear-gradient(180deg, #1a1410 0%, #2a2018 50%, #1a1410 100%)', border: '2px solid var(--border-ornate)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border-ornate)' }}>
          <h2 className="text-2xl font-bold text-[var(--gold)] tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
            {title}
          </h2>
          <button onClick={onClose} className="text-[var(--parchment-dark)] hover:text-[var(--gold)] text-xl cursor-pointer">✕</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
