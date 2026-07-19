import type { FamilyMember, GuessResult } from '../../types/game';
import { RoundCycleProgress } from './RoundCooldown';
import { WinBanner, WinCelebration } from './WinCelebration';

export type SilhouetteRevealStatus = 'wrong' | 'correct' | 'revealed';

interface SilhouetteMemberCardProps {
  member: FamilyMember;
  status: SilhouetteRevealStatus;
  celebrate?: boolean;
  isNew?: boolean;
}

const STATUS_LABEL: Record<SilhouetteRevealStatus, string | null> = {
  wrong: null,
  correct: null,
  revealed: null,
};

export function SilhouetteMemberCard({
  member,
  status,
  celebrate = false,
  isNew = false,
}: SilhouetteMemberCardProps) {
  const statusLabel = STATUS_LABEL[status];
  const cardClass = [
    'silhouette-member-card',
    `silhouette-member-card--${status}`,
    celebrate ? 'silhouette-member-card--celebrate' : '',
    isNew && !celebrate ? 'silhouette-member-card--enter' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClass}>
      {celebrate && <WinCelebration className="win-celebration--card" />}
      <div className="silhouette-member-card__portrait">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="silhouette-member-card__photo"
            decoding="async"
          />
        ) : (
          <div className="silhouette-member-card__fallback">{member.name.charAt(0)}</div>
        )}
      </div>
      <p className="silhouette-member-card__name">{member.name}</p>
      {statusLabel && <p className="silhouette-member-card__status">{statusLabel}</p>}
    </article>
  );
}

interface SilhouetteGuessHistoryProps {
  guesses: GuessResult[];
  secretMember: FamilyMember;
  won: boolean;
  revealed: boolean;
  discoverCount?: number;
  onPlayAgain?: () => void;
  onShare?: () => void;
  shared?: boolean;
  showAnswerCard?: boolean;
  modesWonCount?: number;
  requiredModesCount?: number;
}

export function SilhouetteGuessHistory({
  guesses,
  secretMember,
  won,
  revealed,
  discoverCount,
  onPlayAgain,
  onShare,
  shared = false,
  showAnswerCard = true,
  modesWonCount = 0,
  requiredModesCount = 3,
}: SilhouetteGuessHistoryProps) {
  const showRevealAnswer = revealed && !won;
  const secretWasGuessed = guesses.some((guess) => guess.member.id === secretMember.id);
  const guessesNewestFirst = [...guesses].reverse();

  return (
    <section className="silhouette-guess-history" aria-label="Palpites na silhueta">
      {won && <WinBanner className="win-banner--silhouette" />}

      {guessesNewestFirst.map((guess, displayIndex) => {
        const originalIndex = guesses.length - 1 - displayIndex;
        const isWinningGuess = won && originalIndex === guesses.length - 1;
        const status: SilhouetteRevealStatus = isWinningGuess ? 'correct' : 'wrong';

        return (
          <SilhouetteMemberCard
            key={`${guess.member.id}-${originalIndex}`}
            member={guess.member}
            status={status}
            celebrate={isWinningGuess}
            isNew={displayIndex === 0}
          />
        );
      })}

      {showAnswerCard && showRevealAnswer && !secretWasGuessed && (
        <SilhouetteMemberCard member={secretMember} status="revealed" />
      )}

      {won && discoverCount !== undefined && discoverCount > 0 && (
        <p className="silhouette-guess-history__lead">
          {discoverCount.toLocaleString('pt-PT')} vitórias neste dispositivo!
        </p>
      )}

      {won && (onPlayAgain || onShare || (modesWonCount > 0 && modesWonCount < requiredModesCount)) && (
        <div className="silhouette-guess-history__actions silhouette-guess-history__actions--win">
          {onShare && (
            <button type="button" className="silhouette-guess-history__btn" onClick={onShare}>
              {shared ? 'Copiado!' : 'Partilhar'}
            </button>
          )}
          {modesWonCount > 0 && modesWonCount < requiredModesCount && (
            <RoundCycleProgress
              modesWonCount={modesWonCount}
              requiredModesCount={requiredModesCount}
              className="mode-cycle-status--silhouette"
            />
          )}
          {onPlayAgain && (
            <button
              type="button"
              className="silhouette-guess-history__btn silhouette-guess-history__btn--primary"
              onClick={onPlayAgain}
            >
              Jogar outra vez
            </button>
          )}
        </div>
      )}
    </section>
  );
}
