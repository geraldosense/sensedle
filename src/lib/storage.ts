import type { FamilyMember, FreePlaySession, GameState, GameMode, StoredProgress } from '../types/game';
import { getTodayDateString } from './daily';
import {
  WIN_COOLDOWN_MS,
  getRequiredModesForCycle,
  isGlobalCooldownActive,
  isModeCycleComplete,
  normalizeModeCycle,
} from './cooldown';
import { createEmptyModeRotation, pickNextSecretMember } from './freePlay';
import { getMembersWithQuotes } from '../data/quotes';
import type { ModeRotationState } from '../types/game';

const STORAGE_KEY = 'familia-sense-progress';
const LEGACY_SESSION_KEY = 'familia-sense-session';

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

function sessionKey(mode: GameMode): string {
  return `familia-sense-session-${mode}`;
}

function migrateLegacySession(): void {
  try {
    const legacy = localStorage.getItem(LEGACY_SESSION_KEY);
    if (!legacy || localStorage.getItem(sessionKey('classic'))) return;

    const parsed = JSON.parse(legacy) as Partial<FreePlaySession>;
    const migrated: FreePlaySession = {
      mode: 'classic',
      secretMemberId: parsed.secretMemberId ?? '',
      gameNumber: parsed.gameNumber ?? 1,
      game: parsed.game ?? createEmptyGame(),
    };

    localStorage.setItem(sessionKey('classic'), JSON.stringify(migrated));
    localStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    localStorage.removeItem(LEGACY_SESSION_KEY);
  }
}

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

export function loadFreePlaySession(mode: GameMode): FreePlaySession | null {
  migrateLegacySession();

  try {
    const raw = localStorage.getItem(sessionKey(mode));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<FreePlaySession>;
    return {
      mode,
      secretMemberId: parsed.secretMemberId ?? '',
      gameNumber: parsed.gameNumber ?? 1,
      game: parsed.game ?? createEmptyGame(),
    };
  } catch {
    return null;
  }
}

export function saveFreePlaySession(session: FreePlaySession): void {
  localStorage.setItem(sessionKey(session.mode), JSON.stringify(session));
}

export function getModeRotation(mode: GameMode): ModeRotationState {
  const progress = loadProgress();
  return progress.modeRotations?.[mode] ?? createEmptyModeRotation();
}

export function saveModeRotation(mode: GameMode, rotation: ModeRotationState): void {
  const progress = loadProgress();
  progress.modeRotations = {
    ...progress.modeRotations,
    [mode]: rotation,
  };
  saveProgress(progress);
}

export function resetModeRotations(): void {
  const progress = loadProgress();
  delete progress.modeRotations;
  saveProgress(progress);
}

export function createNewFreePlaySession(
  members: FamilyMember[],
  mode: GameMode,
): FreePlaySession {
  const progress = loadProgress();
  const pool = mode === 'quote' ? getMembersWithQuotes(members) : members;
  const currentRotation = progress.modeRotations?.[mode] ?? createEmptyModeRotation();
  const { member, rotation } = pickNextSecretMember(pool, currentRotation);

  saveModeRotation(mode, rotation);

  return {
    mode,
    secretMemberId: member?.id ?? '',
    gameNumber: progress.totalGames + 1,
    game: createEmptyGame(),
  };
}

export function recordModeCycleWin(
  mode: GameMode,
  quoteMemberCount: number,
): StoredProgress {
  const progress = loadProgress();
  const cycle = normalizeModeCycle(progress.modeCycle);
  const requiredModes = getRequiredModesForCycle(quoteMemberCount);

  if (!requiredModes.includes(mode)) {
    return progress;
  }

  cycle[mode] = true;

  if (isModeCycleComplete(cycle, requiredModes)) {
    cycle.cooldownUntil = Date.now() + WIN_COOLDOWN_MS;
  }

  progress.modeCycle = cycle;
  saveProgress(progress);
  return progress;
}

export function getModeCycleProgress(): ReturnType<typeof normalizeModeCycle> {
  const progress = loadProgress();
  return normalizeModeCycle(progress.modeCycle);
}

export function isPlayBlockedByGlobalCooldown(): boolean {
  const progress = loadProgress();
  return isGlobalCooldownActive(progress.modeCycle);
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
  mode: GameMode,
): FreePlaySession {
  const pool = mode === 'quote' ? getMembersWithQuotes(members) : members;
  const saved = loadFreePlaySession(mode);

  if (isPlayBlockedByGlobalCooldown()) {
    if (saved) return saved;
  }

  const inProgress = saved && !saved.game.won && !saved.game.revealed;

  if (inProgress && pool.some((member) => member.id === saved.secretMemberId)) {
    return saved;
  }

  const fresh = createNewFreePlaySession(members, mode);
  saveFreePlaySession(fresh);
  return fresh;
}

export function resetAllProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_SESSION_KEY);
  localStorage.removeItem(sessionKey('classic'));
  localStorage.removeItem(sessionKey('silhouette'));
  localStorage.removeItem(sessionKey('quote'));
}
