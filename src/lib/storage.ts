const KEY = "ielts-vocab-v1";
const RESET_KEY = "ielts-vocab-reset-at";
export const RESET_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

export interface WordStat {
  seen: number;
  correct: number;
  lastSeen: number;
}

export interface Stats {
  words: Record<string, WordStat>;
}

const empty = (): Stats => ({ words: {} });

function autoResetIfStale(): void {
  if (typeof window === "undefined") return;
  const last = window.localStorage.getItem(RESET_KEY);
  const now = Date.now();
  if (!last) {
    window.localStorage.setItem(RESET_KEY, String(now));
    return;
  }
  if (now - Number(last) >= RESET_INTERVAL_MS) {
    window.localStorage.removeItem(KEY);
    window.localStorage.setItem(RESET_KEY, String(now));
  }
}

export function getNextResetTime(): number | null {
  if (typeof window === "undefined") return null;
  const last = window.localStorage.getItem(RESET_KEY);
  if (!last) return null;
  return Number(last) + RESET_INTERVAL_MS;
}

export function loadStats(): Stats {
  if (typeof window === "undefined") return empty();
  autoResetIfStale();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Stats;
    return { words: parsed.words ?? {} };
  } catch {
    return empty();
  }
}

function saveStats(stats: Stats): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(stats));
}

export function recordResult(text: string, correct: boolean): void {
  const stats = loadStats();
  const w = (stats.words[text] = stats.words[text] ?? { seen: 0, correct: 0, lastSeen: 0 });
  w.seen += 1;
  if (correct) w.correct += 1;
  w.lastSeen = Date.now();
  saveStats(stats);
}

export function getMissedWords(): string[] {
  const stats = loadStats();
  return Object.entries(stats.words)
    .filter(([, s]) => s.seen > 0 && s.correct < s.seen)
    .map(([text]) => text);
}

export function getOverallAccuracy(): { seen: number; correct: number; pct: number } {
  const stats = loadStats();
  let seen = 0;
  let correct = 0;
  for (const s of Object.values(stats.words)) {
    seen += s.seen;
    correct += s.correct;
  }
  return { seen, correct, pct: seen === 0 ? 0 : Math.round((correct / seen) * 100) };
}

export function clearStats(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.localStorage.setItem(RESET_KEY, String(Date.now()));
}
