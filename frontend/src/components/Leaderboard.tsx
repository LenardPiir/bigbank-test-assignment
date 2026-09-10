import { useEffect, useState } from 'react';

export interface LeaderboardEntry {
  score: number;
  gold: number;
  level: number;
  turn: number;
  date: string;
}

const STORAGE_KEY = 'mugloar-leaderboard';
const MAX_ENTRIES = 10;

function loadEntries(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function saveEntry(entry: Omit<LeaderboardEntry, 'date'>) {
  const entries = loadEntries();
  entries.push({ ...entry, date: new Date().toISOString() });
  entries.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

export function getRank(score: number): number {
  const entries = loadEntries();
  return entries.filter((e) => e.score > score).length + 1;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  if (entries.length === 0) {
    return (
      <p className="text-[var(--parchment-dark)] text-base italic">
        No adventures recorded yet. Complete a game to see thy rankings.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[2rem_1fr_4rem_4rem] gap-x-3 text-sm font-bold text-[var(--gold)] border-b border-[var(--border-ornate)] pb-2">
        <span>#</span>
        <span>Date</span>
        <span className="text-right">Score</span>
        <span className="text-right">Turns</span>
      </div>
      {entries.map((entry, i) => (
        <div
          key={i}
          className={`grid grid-cols-[2rem_1fr_4rem_4rem] gap-x-3 text-base items-center ${
            i === 0 ? 'text-[var(--gold)]' : 'text-[var(--parchment)]'
          }`}
        >
          <span className="font-bold">{i + 1}</span>
          <span className="text-[var(--parchment-dark)]">{formatDate(entry.date)}</span>
          <span className="text-right font-semibold">{entry.score}</span>
          <span className="text-right text-[var(--parchment-dark)]">{entry.turn}</span>
        </div>
      ))}
    </div>
  );
}
