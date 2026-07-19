import type { CellResult, ColumnDef, FamilyMember } from '../types/game';
import { COLUMN_DEFS } from '../types/game';

const EXACT_ONLY_KEYS = new Set(['name', 'gender']);

const STOP_WORDS = new Set([
  'de',
  'da',
  'do',
  'das',
  'dos',
  'e',
  'ou',
  'com',
  'na',
  'no',
  'em',
  'a',
  'o',
  'as',
  'os',
  'um',
  'uma',
]);

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectTexts(value: string | string[]): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  return [String(value)].filter(Boolean);
}

function extractWords(texts: string[]): Set<string> {
  const words = new Set<string>();

  for (const text of texts) {
    for (const word of normalizeText(text).split(/[^a-z0-9]+/)) {
      if (word.length >= 2 && !STOP_WORDS.has(word)) {
        words.add(word);
      }
    }
  }

  return words;
}

function compareExact(guess: string, answer: string): CellResult['status'] {
  const normalizedGuess = normalizeText(guess);
  const normalizedAnswer = normalizeText(answer);

  if (!normalizedGuess && !normalizedAnswer) return 'neutral';
  if (normalizedGuess === normalizedAnswer) return 'correct';
  return 'wrong';
}

function compareCharacteristic(
  guess: string | string[],
  answer: string | string[],
): CellResult['status'] {
  const guessTexts = collectTexts(guess).map(normalizeText).filter(Boolean);
  const answerTexts = collectTexts(answer).map(normalizeText).filter(Boolean);

  if (guessTexts.length === 0 && answerTexts.length === 0) return 'neutral';
  if (guessTexts.length === 0 || answerTexts.length === 0) return 'wrong';

  const guessSet = new Set(guessTexts);
  const answerSet = new Set(answerTexts);

  const allGuessMatch = guessTexts.every((text) => answerSet.has(text));
  const allAnswerMatch = answerTexts.every((text) => guessSet.has(text));

  if (allGuessMatch && allAnswerMatch) {
    return 'correct';
  }

  const sharedPhrases = guessTexts.filter((text) => answerSet.has(text));
  if (sharedPhrases.length > 0) {
    return 'partial';
  }

  const guessWords = extractWords(guessTexts);
  const answerWords = extractWords(answerTexts);
  const hasSharedWord = [...guessWords].some((word) => answerWords.has(word));

  if (hasSharedWord) {
    return 'partial';
  }

  return 'wrong';
}

function compareOrdered(
  guess: number,
  answer: number,
): { status: CellResult['status']; arrow: CellResult['arrow'] } {
  if (guess === answer) return { status: 'correct', arrow: null };
  return {
    status: 'wrong',
    arrow: guess < answer ? 'up' : 'down',
  };
}

function formatValue(col: ColumnDef, value: string | string[] | number): string {
  if (col.format) return col.format(value);
  if (Array.isArray(value)) return value.join(', ') || '—';
  if (typeof value === 'number') return String(value);
  return value || '—';
}

function formatDisplay(col: ColumnDef, member: FamilyMember): string {
  if (col.key === 'age' && member.ageLabel) {
    return member.ageLabel;
  }

  const value = col.getValue(member);
  return formatValue(col, value);
}

export function compareGuess(guess: FamilyMember, answer: FamilyMember): CellResult[] {
  return COLUMN_DEFS.map((col) => {
    const guessVal = col.getValue(guess);
    const answerVal = col.getValue(answer);
    const display = formatDisplay(col, guess);

    if (col.type === 'single') {
      const status = EXACT_ONLY_KEYS.has(String(col.key))
        ? compareExact(String(guessVal), String(answerVal))
        : compareCharacteristic(String(guessVal), String(answerVal));
      return { status, display, arrow: null };
    }

    if (col.type === 'multi') {
      const status = compareCharacteristic(
        guessVal as string[],
        answerVal as string[],
      );
      return { status, display, arrow: null };
    }

    const { status, arrow } = compareOrdered(guessVal as number, answerVal as number);
    return { status, display, arrow };
  });
}

export function isWin(cells: CellResult[]): boolean {
  return cells.every((cell) => cell.status === 'correct' || cell.status === 'neutral');
}
