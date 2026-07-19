import type { GuessResult } from '../types/game';

export function hasDuplicateFeedback(guess: GuessResult, previous: GuessResult[]): boolean {
  return previous.some(
    (p) =>
      p.member.id !== guess.member.id &&
      p.cells.length === guess.cells.length &&
      p.cells.every(
        (cell, i) =>
          cell.status === guess.cells[i].status && cell.arrow === guess.cells[i].arrow,
      ),
  );
}
