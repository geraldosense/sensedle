export type CellStatus = 'correct' | 'partial' | 'wrong' | 'neutral';

export type ArrowDirection = 'up' | 'down' | null;

export interface FamilyMember {
  id: string;
  name: string;
  aliases?: string[];
  image?: string;
  gender: string;
  role: string;
  generation: number;
  education?: string;
  profession?: string;
  dream?: string;
  hobbies: string[];
  favoriteFood: string;
  personality: string[];
  age: number;
  ageLabel?: string;
  favoriteColor: string;
  favoriteRoom: string;
}

export interface ColumnDef {
  key: keyof FamilyMember | 'name';
  label: string;
  shortLabel: string;
  type: 'single' | 'multi' | 'ordered';
  getValue: (member: FamilyMember) => string | string[] | number;
  format?: (value: string | string[] | number) => string;
}

export interface CellResult {
  status: CellStatus;
  display: string;
  arrow: ArrowDirection;
}

export interface GuessResult {
  member: FamilyMember;
  cells: CellResult[];
}

export interface GameState {
  date: string;
  guesses: GuessResult[];
  won: boolean;
  revealed: boolean;
}

export interface FreePlaySession {
  secretMemberId: string;
  gameNumber: number;
  game: GameState;
}

export interface StoredProgress {
  streak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  lastWonDate: string | null;
  games: Record<string, GameState>;
  dailyAnswers: Record<string, string>;
  totalWins: number;
  totalGames: number;
}

export const ORDERED_RANKS: Record<string, number[]> = {
  generation: [1, 2, 3, 4, 5],
};

export const COLUMN_DEFS: ColumnDef[] = [
  {
    key: 'name',
    label: 'Membro',
    shortLabel: 'Membro',
    type: 'single',
    getValue: (m) => m.name,
  },
  {
    key: 'gender',
    label: 'Género',
    shortLabel: 'Género',
    type: 'single',
    getValue: (m) => m.gender,
  },
  {
    key: 'role',
    label: 'Papel',
    shortLabel: 'Papel',
    type: 'single',
    getValue: (m) => m.role,
  },
  {
    key: 'generation',
    label: 'Geração',
    shortLabel: 'Geração',
    type: 'ordered',
    getValue: (m) => m.generation,
    format: (v) => `${v}ª`,
  },
  {
    key: 'hobbies',
    label: 'Hobbies',
    shortLabel: 'Hobbies',
    type: 'multi',
    getValue: (m) => m.hobbies,
    format: (v) => (Array.isArray(v) ? v.join(', ') : String(v)),
  },
  {
    key: 'favoriteFood',
    label: 'Comida Favorita',
    shortLabel: 'Comida',
    type: 'single',
    getValue: (m) => m.favoriteFood,
  },
  {
    key: 'personality',
    label: 'Personalidade',
    shortLabel: 'Personalidade',
    type: 'multi',
    getValue: (m) => m.personality,
    format: (v) => (Array.isArray(v) ? v.join(', ') : String(v)),
  },
  {
    key: 'age',
    label: 'Idade',
    shortLabel: 'Idade',
    type: 'ordered',
    getValue: (m) => m.age,
    format: (v) => `${v}`,
  },
  {
    key: 'favoriteColor',
    label: 'Cor Favorita',
    shortLabel: 'Cor',
    type: 'single',
    getValue: (m) => m.favoriteColor,
  },
  {
    key: 'favoriteRoom',
    label: 'Cômodo Favorito',
    shortLabel: 'Cômodo',
    type: 'single',
    getValue: (m) => m.favoriteRoom,
  },
];

export const HINT_THRESHOLDS = {
  personality: 5,
  favoriteFood: 8,
  role: 12,
  reveal: 20,
} as const;
