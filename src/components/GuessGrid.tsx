import type { CellResult } from '../types/game';
import { COLUMN_DEFS } from '../types/game';

const STATUS_STYLES: Record<CellResult['status'], string> = {
  correct: 'bg-correct-bg border-correct text-green-300',
  partial: 'bg-partial-bg border-partial text-yellow-300',
  wrong: 'bg-wrong-bg border-wrong text-red-300',
  neutral: 'bg-sense-surface border-sense-border text-gray-400',
};

const STATUS_STYLES_CLASSIC: Record<CellResult['status'], string> = {
  correct: 'guess-cell--correct',
  partial: 'guess-cell--partial',
  wrong: 'guess-cell--wrong',
  neutral: 'guess-cell--neutral',
};

interface GuessCellProps {
  cell: CellResult;
  isName?: boolean;
  memberImage?: string;
  memberName?: string;
  theme?: 'default' | 'classic';
}

export function GuessCell({ cell, isName, memberImage, memberName, theme = 'default' }: GuessCellProps) {
  const styleClass = theme === 'classic'
    ? STATUS_STYLES_CLASSIC[cell.status]
    : STATUS_STYLES[cell.status];

  if (theme === 'classic' && isName && memberName) {
    return (
      <div
        className={`guess-cell guess-cell--classic guess-cell--portrait ${styleClass}`}
        title={memberName}
      >
        {memberImage ? (
          <img
            src={memberImage}
            alt={memberName}
            className="guess-cell__portrait-img"
          />
        ) : (
          <div className="guess-cell__portrait-fallback">
            {memberName.charAt(0)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`guess-cell ${styleClass} ${theme === 'classic' ? 'guess-cell--classic' : ''}`}
      title={cell.display}
    >
      {isName && memberName ? (
        <div className="guess-cell__name">
          {memberImage ? (
            <img src={memberImage} alt={memberName} className="guess-cell__avatar" />
          ) : (
            <div className="guess-cell__avatar guess-cell__avatar--fallback">
              {memberName.charAt(0)}
            </div>
          )}
          <span className="guess-cell__name-text">{memberName}</span>
        </div>
      ) : (
        <>
          <span className="guess-cell__value">{cell.display}</span>
          {theme === 'classic' && cell.arrow ? (
            <span className="guess-cell__arrow">
              {cell.arrow === 'up' ? '↑' : '↓'}
            </span>
          ) : (
            <span className="guess-cell__symbol">
              {cell.status === 'correct' && '✓'}
              {cell.status === 'partial' && '~'}
              {cell.status === 'wrong' && !cell.arrow && '✗'}
              {cell.arrow === 'up' && ' ↑'}
              {cell.arrow === 'down' && ' ↓'}
            </span>
          )}
        </>
      )}
    </div>
  );
}

interface GuessGridProps {
  children: React.ReactNode;
  theme?: 'default' | 'classic';
}

const CLASSIC_COLUMNS = '80px repeat(9, 86px)';

export function GuessGrid({ children, theme = 'default' }: GuessGridProps) {
  const gridCols = theme === 'classic'
    ? CLASSIC_COLUMNS
    : `repeat(${COLUMN_DEFS.length}, minmax(72px, 1fr))`;

  return (
    <div className={`guess-grid ${theme === 'classic' ? 'guess-grid--classic' : ''}`}>
      <div className="guess-grid__inner">
        <div
          className="guess-grid__headers"
          style={{ gridTemplateColumns: gridCols }}
        >
          {COLUMN_DEFS.map((col) => (
            <div
              key={col.key}
              className={`guess-grid__header ${col.key === 'name' ? 'guess-grid__header--portrait' : ''}`}
            >
              {col.key === 'name' ? 'Membro' : col.shortLabel}
            </div>
          ))}
        </div>
        <div className="guess-grid__rows">{children}</div>
      </div>
    </div>
  );
}

interface GuessRowProps {
  cells: CellResult[];
  memberName: string;
  memberImage?: string;
  animate?: boolean;
  isWin?: boolean;
  theme?: 'default' | 'classic';
}

export function GuessRow({
  cells,
  memberName,
  memberImage,
  animate,
  isWin = false,
  theme = 'default',
}: GuessRowProps) {
  const gridCols = theme === 'classic'
    ? CLASSIC_COLUMNS
    : `repeat(${COLUMN_DEFS.length}, minmax(72px, 1fr))`;

  const rowClass = [
    'guess-grid__row',
    animate ? 'guess-grid__row--enter' : '',
    isWin ? 'guess-grid__row--win' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={rowClass}
      style={{ gridTemplateColumns: gridCols }}
    >
      {cells.map((cell, i) => (
        <GuessCell
          key={COLUMN_DEFS[i].key}
          cell={cell}
          isName={i === 0}
          memberName={memberName}
          memberImage={memberImage}
          theme={theme}
        />
      ))}
    </div>
  );
}
