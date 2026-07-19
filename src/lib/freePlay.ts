import type { FamilyMember } from '../types/game';
import type { ModeRotationState } from '../types/game';

function shuffleIds(ids: string[]): string[] {
  const shuffled = [...ids];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildRotationQueue(validIds: string[], lastSecretId: string | null): string[] {
  if (validIds.length === 0) return [];

  const withoutImmediateRepeat =
    lastSecretId && validIds.length > 1
      ? validIds.filter((id) => id !== lastSecretId)
      : validIds;

  return shuffleIds(withoutImmediateRepeat.length > 0 ? withoutImmediateRepeat : validIds);
}

export function createEmptyModeRotation(): ModeRotationState {
  return { queue: [], lastSecretId: null };
}

/** Escolhe o próximo membro sem repetir até percorrer todo o baralho do modo. */
export function pickNextSecretMember(
  members: FamilyMember[],
  rotation: ModeRotationState = createEmptyModeRotation(),
): { member: FamilyMember | null; rotation: ModeRotationState } {
  if (members.length === 0) {
    return { member: null, rotation: createEmptyModeRotation() };
  }

  const validIds = members.map((member) => member.id);
  let queue = rotation.queue.filter((id) => validIds.includes(id));

  if (queue.length === 0) {
    queue = buildRotationQueue(validIds, rotation.lastSecretId);
  }

  const nextId = queue.shift();
  if (!nextId) {
    return { member: members[0], rotation: createEmptyModeRotation() };
  }

  const member = members.find((entry) => entry.id === nextId) ?? members[0];

  return {
    member,
    rotation: {
      queue,
      lastSecretId: member.id,
    },
  };
}

/** @deprecated Usar pickNextSecretMember — mantém compatibilidade interna. */
export function pickRandomMember(
  members: FamilyMember[],
  excludeId?: string,
): FamilyMember | null {
  const rotation: ModeRotationState = {
    queue: [],
    lastSecretId: excludeId ?? null,
  };
  return pickNextSecretMember(members, rotation).member;
}
