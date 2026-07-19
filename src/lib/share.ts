import type { CellResult, GuessResult, GameMode } from '../types/game';
import { GAME_MODE_LABELS } from '../types/game';

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
  mode: GameMode = 'classic',
): string {
  const attemptLine = won ? `${guesses.length}` : 'X';
  const modeLabel = GAME_MODE_LABELS[mode];

  if (mode === 'quote') {
    return [
      `Família Sense ${modeLabel} #${gameNumber} ${won ? attemptLine : 'X'}`,
      streak > 0 ? `🔥 Sequência: ${streak}` : '',
      '',
      `familiasense.pt/${mode}`,
    ].filter(Boolean).join('\n');
  }

  const grid = guesses.map((g) => rowToEmoji(g.cells)).join('\n');

  return [
    `Família Sense ${modeLabel} #${gameNumber} ${won ? attemptLine : 'X'}`,
    streak > 0 ? `🔥 Sequência: ${streak}` : '',
    '',
    grid,
    '',
    `familiasense.pt/${mode}`,
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
