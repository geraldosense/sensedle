import type { CellResult, ColumnDef, FamilyMember } from '../types/game';
import { COLUMN_DEFS } from '../types/game';

function compareSingle(guess: string, answer: string): CellResult['status'] {
  if (!guess && !answer) return 'neutral';
  if (guess.toLowerCase() === answer.toLowerCase()) return 'correct';
  return 'wrong';
}

function compareMulti(guess: string[], answer: string[]): CellResult['status'] {
  const gSet = new Set(guess.map((s) => s.toLowerCase()));
  const aSet = new Set(answer.map((s) => s.toLowerCase()));
  if (gSet.size === 0 && aSet.size === 0) return 'neutral';
  const intersection = [...gSet].filter((x) => aSet.has(x));
  if (intersection.length === gSet.size && intersection.length === aSet.size) return 'correct';
  if (intersection.length > 0) return 'partial';
  return 'wrong';
}

function compareOrdered(guess: number, answer: number): { status: CellResult['status']; arrow: CellResult['arrow'] } {
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
      const status = compareSingle(String(guessVal), String(answerVal));
      return { status, display, arrow: null };
    }

    if (col.type === 'multi') {
      const status = compareMulti(
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
  return cells.every((c) => c.status === 'correct' || c.status === 'neutral');
}
