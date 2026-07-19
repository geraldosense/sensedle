import type { FamilyMember, FreePlaySession, GameState, StoredProgress } from '../types/game';
import { getTodayDateString } from './daily';
import { pickRandomMember } from './freePlay';

const STORAGE_KEY = 'familia-sense-progress';
const SESSION_KEY = 'familia-sense-session';

const DEFAULT_PROGRESS: StoredProgress = {
  streak: 0,
  maxStreak: 0,
  lastPlayedDate: null,
  lastWonDate: null,
  games: {},
  dailyAnswers: {},
  totalWins: 0,
  totalGames: 0,
};

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: StoredProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function createEmptyGame(): GameState {
  return {
    date: getTodayDateString(),
    guesses: [],
    won: false,
    revealed: false,
  };
}

export function loadFreePlaySession(): FreePlaySession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FreePlaySession;
  } catch {
    return null;
  }
}

export function saveFreePlaySession(session: FreePlaySession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function createNewFreePlaySession(
  members: FamilyMember[],
  excludeMemberId?: string,
): FreePlaySession {
  const progress = loadProgress();
  const member = pickRandomMember(members, excludeMemberId);

  return {
    secretMemberId: member?.id ?? '',
    gameNumber: progress.totalGames + 1,
    game: createEmptyGame(),
  };
}

export function recordFreePlayCompletion(
  game: GameState,
  wasFinished: boolean,
): StoredProgress {
  const progress = loadProgress();
  if (wasFinished) return progress;

  if (game.won) {
    progress.streak += 1;
    progress.maxStreak = Math.max(progress.maxStreak, progress.streak);
    progress.totalWins += 1;
    progress.totalGames += 1;
  } else if (game.revealed) {
    progress.streak = 0;
    progress.totalGames += 1;
  }

  saveProgress(progress);
  return progress;
}

export function initFreePlaySession(
  members: FamilyMember[],
): FreePlaySession {
  const saved = loadFreePlaySession();
  const inProgress = saved && !saved.game.won && !saved.game.revealed;

  if (inProgress) {
    return saved;
  }

  const fresh = createNewFreePlaySession(members, saved?.secretMemberId);
  saveFreePlaySession(fresh);
  return fresh;
}

export function resetAllProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SESSION_KEY);
}
