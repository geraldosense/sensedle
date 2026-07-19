import type { FamilyMember } from '../../types/game';
import { HINT_THRESHOLDS } from '../../types/game';

interface ClassicHintTilesProps {
  guessCount: number;
  answer: FamilyMember;
}

const HINT_TILES = [
  {
    key: 'personality',
    threshold: HINT_THRESHOLDS.personality,
    lockedTitle: 'Personalidade',
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="#e85d04" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    getValue: (m: FamilyMember) => m.personality.join(', ') || '—',
  },
  {
    key: 'favoriteFood',
    threshold: HINT_THRESHOLDS.favoriteFood,
    lockedTitle: 'Comida Favorita',
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="#e85d04" aria-hidden="true">
        <path d="M10 2h4a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3V4a2 2 0 0 1 2-2zm0 3V4h4v1h-4zm-5 4v10h14V9H5z" />
      </svg>
    ),
    getValue: (m: FamilyMember) => m.favoriteFood,
  },
  {
    key: 'role',
    threshold: HINT_THRESHOLDS.role,
    lockedTitle: 'Papel na Família',
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="#e85d04" aria-hidden="true">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    getValue: (m: FamilyMember) => m.role,
  },
] as const;

export function ClassicHintTiles({ guessCount, answer }: ClassicHintTilesProps) {
  return (
    <div className="classic-hint-tiles classic-hint-tiles--three">
      {HINT_TILES.map((tile) => {
        const unlocked = guessCount >= tile.threshold;
        const remaining = tile.threshold - guessCount;

        return (
          <div
            key={tile.key}
            className={`classic-hint-tiles__card ${unlocked ? 'classic-hint-tiles__card--unlocked' : ''}`}
          >
            <div className="classic-hint-tiles__icon">{tile.icon}</div>
            {unlocked ? (
              <>
                <p className="classic-hint-tiles__label">{tile.lockedTitle}</p>
                <p className="classic-hint-tiles__value">{tile.getValue(answer)}</p>
              </>
            ) : (
              <>
                <p className="classic-hint-tiles__label">{tile.lockedTitle.toUpperCase()}</p>
                <p className="classic-hint-tiles__locked">
                  Pista em {remaining} {remaining === 1 ? 'tentativa' : 'tentativas'}
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
