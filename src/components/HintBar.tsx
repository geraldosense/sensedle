import type { FamilyMember } from '../types/game';
import { HINT_THRESHOLDS } from '../types/game';

interface HintBarProps {
  guessCount: number;
  answer: FamilyMember;
}

export function HintBar({ guessCount, answer }: HintBarProps) {
  const hints = [
    {
      threshold: HINT_THRESHOLDS.personality,
      label: 'Personalidade',
      value: answer.personality.join(', ') || '—',
      icon: '🎭',
    },
    {
      threshold: HINT_THRESHOLDS.favoriteFood,
      label: 'Comida Favorita',
      value: answer.favoriteFood,
      icon: '🍽️',
    },
    {
      threshold: HINT_THRESHOLDS.role,
      label: 'Papel na Família',
      value: answer.role,
      icon: '👨‍👩‍👧‍👦',
    },
  ];

  const unlockedHints = hints.filter((h) => guessCount >= h.threshold);

  if (unlockedHints.length === 0) return null;

  return (
    <div className="classic-hints-bar animate-fade-in">
      <p className="classic-hints-bar__label">Dicas desbloqueadas</p>
      <div className="classic-hints-bar__list">
        {unlockedHints.map((hint) => (
          <div key={hint.label} className="classic-hints-bar__item">
            <span>{hint.icon}</span>
            <div>
              <p className="classic-hints-bar__item-label">{hint.label}</p>
              <p className="classic-hints-bar__item-value">{hint.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RevealButtonProps {
  guessCount: number;
  onReveal: () => void;
  revealed: boolean;
}

export function RevealButton({ guessCount, onReveal, revealed }: RevealButtonProps) {
  if (revealed || guessCount < HINT_THRESHOLDS.reveal) return null;

  return (
    <button
      type="button"
      onClick={onReveal}
      className="classic-reveal-btn"
    >
      Revelar resposta (conta como derrota)
    </button>
  );
}
