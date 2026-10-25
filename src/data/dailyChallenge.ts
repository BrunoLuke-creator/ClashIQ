import { questions, type Question, type CategoryId } from './questions';

// Simple deterministic PRNG (mulberry32) so every player gets the same
// question set on a given date.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateSeed(dateStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < dateStr.length; i++) {
    h ^= dateStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Use a fixed UTC date string so the same challenge is served globally
// regardless of the player's local timezone.
export function challengeDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export const DAILY_CHALLENGE_COUNT = 8;

export function getDailyChallengeQuestions(dateStr: string = challengeDate()): Question[] {
  const seed = dateSeed(dateStr);
  const rand = mulberry32(seed);
  const pool = [...questions];
  // Fisher-Yates shuffle with deterministic PRNG
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, DAILY_CHALLENGE_COUNT);
}

// Persistence helpers — stored in localStorage so a completed attempt
// survives page refreshes. This is a client-side record only; it does
// not provide server-side protection against replaying the challenge.
const CHALLENGE_KEY = 'clashiq-daily-challenge';

type ChallengeRecord = {
  date: string;
  score: number;
  correct: number;
  total: number;
  completed: boolean;
};

export function getDailyChallengeResult(dateStr: string = challengeDate()): ChallengeRecord | null {
  try {
    const raw = localStorage.getItem(CHALLENGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChallengeRecord;
    if (parsed.date !== dateStr) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDailyChallengeResult(result: Omit<ChallengeRecord, 'date'>, dateStr: string = challengeDate()): void {
  const existing = getDailyChallengeResult(dateStr);
  // Don't overwrite a better score — keep the first/best attempt
  if (existing && existing.completed) return;
  const record: ChallengeRecord = { date: dateStr, ...result, completed: true };
  localStorage.setItem(CHALLENGE_KEY, JSON.stringify(record));
}

export function isDailyChallengeCompleted(dateStr: string = challengeDate()): boolean {
  return getDailyChallengeResult(dateStr)?.completed ?? false;
}

export type { ChallengeRecord };
export type { CategoryId };
