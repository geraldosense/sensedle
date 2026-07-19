import type { FamilyMember } from '../types/game';

export function pickRandomMember(
  members: FamilyMember[],
  excludeId?: string,
): FamilyMember | null {
  if (members.length === 0) return null;

  const pool = excludeId && members.length > 1
    ? members.filter((member) => member.id !== excludeId)
    : members;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
