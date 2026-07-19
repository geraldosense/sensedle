import type { FamilyMember } from '../types/game';

/**
 * Membros da Família Sense — foto de grupo (esquerda → direita).
 * Atualiza os nomes e personalidades quando tiveres os dados finais.
 */
export const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'braulio',
    name: 'Bráulio António Simba Sense',
    aliases: [
      'Bráulio',
      'Braulio',
      'António',
      'Simba',
      'Bráulio António',
      'Farmacêutico',
      'Enfermeiro',
    ],
    image: '/images/members/sense-01.png',
    gender: 'masculino',
    role: 'filho',
    generation: 2,
    education: 'Enfermagem geral',
    profession: 'Farmacêutico',
    dream: 'Ser independente e ser o seu próprio chefe',
    hobbies: ['dançar', 'inglês', 'oratório online', 'apostas'],
    favoriteFood: 'Mufete (feijão de óleo de palma, carapau grelhado e batata doce)',
    personality: [
      'polivalente',
      'criativo',
      'fluente em inglês',
      'ambicioso',
      'independente',
      'empreendedor',
    ],
    age: 23,
    favoriteColor: 'Preto',
    favoriteRoom: 'Quarto',
  },
  {
    id: 'sense-02',
    name: 'Francis Simba Sense',
    aliases: ['Francis', 'Fran', 'Simba', 'Boné Preto'],
    image: '/images/members/sense-02.png',
    gender: 'masculino',
    role: 'filho',
    generation: 2,
    hobbies: ['desporto', 'redes sociais', ],
    favoriteFood: 'Pizza',
    personality: ['confiante', 'descontraído'],
    age: 28,
    favoriteColor: 'Preto, Vermelho, Branco, Cinzento, Castanho',
    favoriteRoom: 'Festas',
  },
  {
    id: 'jose-ramiro',
    name: 'José Ramiro Simba Sense',
    aliases: ['José Ramiro', 'Ramiro', 'Simba', 'José'],
    image: '/images/members/jose-ramiro.png',
    gender: 'masculino',
    role: 'filho',
    generation: 3,
    hobbies: ['tocar flauta', 'jogar bola', 'jogos'],
    favoriteFood: 'Saca folha com Feijão',
    personality: ['um pouco orgulhoso', 'gosta de lutar'],
    age: 17,
    favoriteColor: 'Branco,', 'Vermelho','Preto', 
    favoriteRoom: 'Quarto',
  },
  {
    id: 'sense-04',
    name: 'Petlanea Simba Sense',
    aliases: ['Petlanea', 'Minnie', 'Petlanea Simba'],
    image: '/images/members/sense-04.png',
    gender: 'feminino',
    role: 'filha',
    generation: 3,
    hobbies: ['desenhos', 'dança'],
    favoriteFood: 'Massa',
    personality: ['alegre', 'curiosa'],
    age: 9,
    favoriteColor: 'Amarelo',
    favoriteRoom: 'Quarto',
  },
  {
    id: 'sense-05',
    name: 'Maria Dos Santos',
    aliases: ['Maria', 'Mãe', 'Dos Santos'],
    image: '/images/members/sense-05.png',
    gender: 'feminino',
    role: 'mãe',
    generation: 2,
    hobbies: ['cozinhar', 'família'],
    favoriteFood: 'Peixe grelhado',
    personality: ['carinhosa', 'organizada'],
    age: 48,
    favoriteColor: 'Laranja',
    favoriteRoom: 'Cozinha',
  },
  {
    id: 'sense-06',
    name: 'Membro 6',
    aliases: ['Sorriso', 'Sense 6'],
    image: '/images/members/sense-06.png',
    gender: 'masculino',
    role: 'filho',
    generation: 2,
    hobbies: ['tecnologia', 'música'],
    favoriteFood: 'Hambúrguer',
    personality: ['simpático', 'calmo'],
    age: 22,
    favoriteColor: 'Azul claro',
    favoriteRoom: 'Varanda',
  },
  {
    id: 'sense-07',
    name: 'Vovó Perpétua Simba',
    aliases: ['Perpétua', 'Perpetua', 'Vovó', 'Avó'],
    image: '/images/members/sense-07.png',
    gender: 'feminino',
    role: 'avó',
    generation: 1,
    hobbies: ['cozinhar', 'televisão'],
    favoriteFood: 'Canja',
    personality: ['sábia', 'tradicional'],
    age: 65,
    favoriteColor: 'Azul',
    favoriteRoom: 'Sala',
  },
  {
    id: 'genildo',
    name: 'Genildo',
    aliases: ['Genil', 'Nildo', 'Genildo Sense', 'Avô'],
    image: '/images/members/genildo.png',
    gender: 'masculino',
    role: 'bebé',
    generation: 4,
    hobbies: ['dormir no colo da mãe'],
    favoriteFood: 'Leite materno',
    personality: ['zangado'],
    age: 0,
    ageLabel: '6 meses',
    favoriteColor: 'Preto e Branco',
    favoriteRoom: 'Sofá e encosta',
  },
];

export function getMemberById(id: string): FamilyMember | undefined {
  return FAMILY_MEMBERS.find((m) => m.id === id);
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim();
}

function getSearchLabels(member: FamilyMember): string[] {
  return [
    member.name,
    ...(member.aliases ?? []),
    member.role,
    member.gender,
    member.education ?? '',
    member.profession ?? '',
    member.dream ?? '',
    ...member.hobbies,
    ...member.personality,
    member.favoriteFood,
    member.favoriteColor,
    member.favoriteRoom,
  ].filter(Boolean);
}

function scoreMemberMatch(member: FamilyMember, query: string): number {
  const labels = getSearchLabels(member);
  let bestScore = 0;

  for (const label of labels) {
    const normalizedLabel = normalizeSearchText(label);
    if (!normalizedLabel.includes(query)) continue;

    const isPrimaryName = normalizeSearchText(member.name) === normalizedLabel;
    const words = normalizedLabel.split(/\s+/).filter(Boolean);

    if (normalizedLabel === query) {
      bestScore = Math.max(bestScore, isPrimaryName ? 1000 : 950);
      continue;
    }

    if (normalizedLabel.startsWith(query)) {
      bestScore = Math.max(
        bestScore,
        (isPrimaryName ? 900 : 860) - Math.min(normalizedLabel.length - query.length, 40),
      );
      continue;
    }

    if (words.some((word) => word.startsWith(query))) {
      bestScore = Math.max(
        bestScore,
        (isPrimaryName ? 780 : 740) - Math.min(normalizedLabel.length - query.length, 30),
      );
      continue;
    }

    if (isPrimaryName) {
      bestScore = Math.max(bestScore, 520);
    } else if (member.aliases?.some((alias) => normalizeSearchText(alias) === normalizedLabel)) {
      bestScore = Math.max(bestScore, 480);
    } else {
      bestScore = Math.max(bestScore, 360);
    }
  }

  return bestScore;
}

export function searchMembers(query: string, excludeIds: string[] = []): FamilyMember[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  return FAMILY_MEMBERS
    .filter((member) => !excludeIds.includes(member.id))
    .map((member) => ({
      member,
      score: scoreMemberMatch(member, normalizedQuery),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return normalizeSearchText(a.member.name).localeCompare(
        normalizeSearchText(b.member.name),
        'pt',
      );
    })
    .map(({ member }) => member)
    .slice(0, 8);
}
