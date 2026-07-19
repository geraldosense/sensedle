import type { GameMode, ModeCycleProgress } from '../types/game';

export const WIN_COOLDOWN_MS = 5 * 60 * 1000;

export const ALL_GAME_MODES: GameMode[] = ['classic', 'silhouette', 'quote'];

export const EMPTY_MODE_CYCLE: ModeCycleProgress = {
  classic: false,
  silhouette: false,
  quote: false,
  cooldownUntil: null,
};

export function normalizeModeCycle(
  cycle: Partial<ModeCycleProgress> | undefined,
  now = Date.now(),
): ModeCycleProgress {
  const merged: ModeCycleProgress = {
    ...EMPTY_MODE_CYCLE,
    ...cycle,
  };

  if (merged.cooldownUntil !== null && now >= merged.cooldownUntil) {
    return { ...EMPTY_MODE_CYCLE };
  }

  return merged;
}

export function getRequiredModesForCycle(quoteMemberCount: number): GameMode[] {
  const modes: GameMode[] = ['classic', 'silhouette'];
  if (quoteMemberCount > 0) modes.push('quote');
  return modes;
}

export function countModesWonInCycle(
  cycle: ModeCycleProgress,
  requiredModes: GameMode[] = ALL_GAME_MODES,
): number {
  return requiredModes.filter((mode) => cycle[mode]).length;
}

export function isModeCycleComplete(
  cycle: ModeCycleProgress,
  requiredModes: GameMode[] = ALL_GAME_MODES,
): boolean {
  return requiredModes.every((mode) => cycle[mode]);
}

export function getRemainingGlobalCooldownMs(
  cycle: ModeCycleProgress | undefined,
  now = Date.now(),
): number {
  const normalized = normalizeModeCycle(cycle, now);
  if (!normalized.cooldownUntil) return 0;
  return Math.max(0, normalized.cooldownUntil - now);
}

export function isGlobalCooldownActive(
  cycle: ModeCycleProgress | undefined,
  now = Date.now(),
): boolean {
  return getRemainingGlobalCooldownMs(cycle, now) > 0;
}

export function getObjectiveBadgeModes(
  cycle: ModeCycleProgress,
  activeMode: GameMode,
  activeGameWon: boolean,
): Partial<Record<GameMode, boolean>> {
  return {
    classic: cycle.classic && (activeMode !== 'classic' || activeGameWon),
    silhouette: cycle.silhouette && (activeMode !== 'silhouette' || activeGameWon),
    quote: cycle.quote && (activeMode !== 'quote' || activeGameWon),
  };
}

export function formatCooldownLabel(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
