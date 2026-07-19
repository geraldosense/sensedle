import type { FamilyMember } from '../types/game';

const MS_PER_DAY = 86_400_000;
const LAUNCH_DATE = '2026-07-17';

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export function getPuzzleNumber(dateStr?: string): number {
  const date = dateStr ?? getTodayDateString();
  const start = Date.parse(`${LAUNCH_DATE}T00:00:00Z`);
  const current = Date.parse(`${date}T00:00:00Z`);
  const diff = Math.floor((current - start) / MS_PER_DAY);
  return Math.max(1, diff + 1);
}

export function getDailyMember(members: FamilyMember[], dateStr?: string): FamilyMember | null {
  if (members.length === 0) return null;
  const date = dateStr ?? getTodayDateString();
  const seed = hashString(date);
  const index = seed % members.length;
  return members[index];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTimeUntilMidnightUTC(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0,
  ));
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (MS_PER_DAY / 24));
  const minutes = Math.floor((diff % (MS_PER_DAY / 24)) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { hours, minutes, seconds };
}

export function formatCountdown(): string {
  const { hours, minutes, seconds } = getTimeUntilMidnightUTC();
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** @deprecated alias */
export function getSecretMember(members: FamilyMember[], dateStr?: string): FamilyMember | null {
  return getDailyMember(members, dateStr);
}
