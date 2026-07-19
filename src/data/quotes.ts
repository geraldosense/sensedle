import type { FamilyMember, MemberQuote } from '../types/game';

/**
 * Frases fornecidas pela família — não inventar entradas aqui.
 * Só membros listados podem aparecer no modo Frases.
 */
export const MEMBER_QUOTES: Record<string, MemberQuote> = {
  'vanusa-carlota': {
    text: 'É bom, te merece, te mandei para ires me comprar cebola negaste, já viste já cortaste veia. Isso é para vc aprender a ir sempre quando te mandam',
  },
  'sense-05': {
    text: 'Fala com Teu Pai, Eu não Trabalho',
  },
  'jose-ramiro': {
    text: 'Wy, depois manda no telefone da Vanusa ou liga, yh',
  },
  'geraldo': {
    text: 'Wy vamos comer, Vão nos bater depois vai passar, e nós estaremos repleto',
  },
};

export function attachMemberQuotes<T extends { id: string }>(
  members: T[],
): (T & { quote?: MemberQuote })[] {
  return members.map((member) => {
    const quote = MEMBER_QUOTES[member.id];
    return quote ? { ...member, quote } : { ...member };
  });
}

export function memberHasQuote(
  member: FamilyMember,
): member is FamilyMember & { quote: MemberQuote } {
  return Boolean(member.quote?.text?.trim());
}

export function getMembersWithQuotes(members: FamilyMember[]): FamilyMember[] {
  return members.filter(memberHasQuote);
}

export function getQuoteMemberCount(members: FamilyMember[]): number {
  return getMembersWithQuotes(members).length;
}

export function getQuoteText(quote: MemberQuote): string {
  return quote.text.trim();
}
