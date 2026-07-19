import type { CellResult, GuessResult } from '../types/game';

const STATUS_EMOJI: Record<CellResult['status'], string> = {
  correct: '🟩',
  partial: '🟨',
  wrong: '🟥',
  neutral: '⬜',
};

function rowToEmoji(cells: CellResult[]): string {
  return cells.slice(1).map((c) => STATUS_EMOJI[c.status]).join('');
}

export function generateShareText(
  guesses: GuessResult[],
  won: boolean,
  streak: number,
  gameNumber: number,
): string {
  const attemptLine = won ? `${guesses.length}` : 'X';

  const grid = guesses.map((g) => rowToEmoji(g.cells)).join('\n');

  return [
    `Família Sense #${gameNumber} ${won ? attemptLine : 'X'}`,
    streak > 0 ? `🔥 Sequência: ${streak}` : '',
    '',
    grid,
    '',
    `familiasense.pt/classic`,
  ].filter(Boolean).join('\n');
}

export async function shareResult(text: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      // user cancelled
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
