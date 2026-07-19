import { useCallback, useEffect, useState } from 'react';
import type { FamilyMember, FreePlaySession, GameState, GuessResult } from '../types/game';
import { FAMILY_MEMBERS, getMemberById } from '../data/members';
import { compareGuess, isWin } from '../lib/compare';
import { hasDuplicateFeedback } from '../lib/guessFeedback';
import {
  createNewFreePlaySession,
  initFreePlaySession,
  loadProgress,
  recordFreePlayCompletion,
  saveFreePlaySession,
} from '../lib/storage';
import { generateShareText, shareResult } from '../lib/share';
import {
  ClassicModeTabs,
  ClassicScroll,
  ClassicSkyBackground,
  ClassicTopBar,
  ClassicUtilityBar,
} from '../components/classic/ClassicGameUI';
import { ClassicHintTiles } from '../components/classic/ClassicHintTiles';
import { ClassicSearchBar } from '../components/classic/ClassicSearchBar';
import { ClassicFooter } from '../components/classic/ClassicFooter';
import { ColorLegendModal } from '../components/classic/ColorLegendModal';
import { StatsModal } from '../components/classic/StatsModal';
import { GuessGrid, GuessRow } from '../components/GuessGrid';
import { RevealButton } from '../components/HintBar';
import { WinModal, HowToPlay } from '../components/WinModal';

interface ClassicPageProps {
  onBack: () => void;
}

function resolveSession(): FreePlaySession {
  return initFreePlaySession(FAMILY_MEMBERS);
}

export function ClassicPage({ onBack }: ClassicPageProps) {
  const [session, setSession] = useState<FreePlaySession>(resolveSession);
  const [streak, setStreak] = useState(() => loadProgress().streak);
  const [showWin, setShowWin] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showColorLegend, setShowColorLegend] = useState(false);
  const [shared, setShared] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  const game = session.game;
  const secretMember = getMemberById(session.secretMemberId);
  const hasMembers = FAMILY_MEMBERS.length > 0;
  const isGameOver = game.won || game.revealed;
  const guessedIds = game.guesses.map((g) => g.member.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;

    function blockPageHorizontalScroll(event: WheelEvent) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      const insideGrid = (event.target as Element | null)?.closest('.classic-grid-wrap');
      if (!insideGrid) {
        event.preventDefault();
      }
    }

    document.addEventListener('wheel', blockPageHorizontalScroll, { passive: false });

    setSession(initFreePlaySession(FAMILY_MEMBERS));
    setStreak(loadProgress().streak);

    return () => {
      document.removeEventListener('wheel', blockPageHorizontalScroll);
    };
  }, []);

  const persistSession = useCallback(
    (nextSession: FreePlaySession, previousGame: GameState) => {
      const wasFinished = previousGame.won || previousGame.revealed;
      const isNowFinished = nextSession.game.won || nextSession.game.revealed;

      setSession(nextSession);
      saveFreePlaySession(nextSession);

      if (isNowFinished && !wasFinished) {
        const progress = recordFreePlayCompletion(nextSession.game, wasFinished);
        setStreak(progress.streak);
      }
    },
    [],
  );

  function handleGuess(member: FamilyMember) {
    if (!secretMember || isGameOver) return;
    if (guessedIds.includes(member.id)) return;

    const cells = compareGuess(member, secretMember);
    const result: GuessResult = { member, cells };

    if (hasDuplicateFeedback(result, game.guesses)) {
      setDuplicateWarning(true);
      setTimeout(() => setDuplicateWarning(false), 4000);
    }

    const newGame: GameState = {
      ...game,
      guesses: [...game.guesses, result],
      won: isWin(cells),
      revealed: false,
    };

    persistSession({ ...session, game: newGame }, game);
    if (newGame.won) setShowWin(true);
  }

  function handleReveal() {
    if (!secretMember) return;
    const newGame: GameState = { ...game, revealed: true, won: false };
    persistSession({ ...session, game: newGame }, game);
    setShowWin(true);
  }

  function handleNewGame() {
    const nextSession = createNewFreePlaySession(FAMILY_MEMBERS, session.secretMemberId);
    setSession(nextSession);
    saveFreePlaySession(nextSession);
    setShowWin(false);
    setShared(false);
    setDuplicateWarning(false);
  }

  async function handleShare() {
    const text = generateShareText(game.guesses, game.won, streak, session.gameNumber);
    const ok = await shareResult(text);
    if (ok) setShared(true);
  }

  const handleSearchOpenChange = useCallback((open: boolean) => {
    setSearchOpen(open);
  }, []);

  return (
    <div className={`classic-page ${searchOpen ? 'classic-page--search-open' : ''}`}>
      <ClassicSkyBackground />

      <div className="classic-page__shell">
        <ClassicTopBar onBack={onBack} onShowHowTo={() => setShowHowTo(true)} />
        <ClassicModeTabs />
        <ClassicUtilityBar
          streak={streak}
          guessCount={game.guesses.length}
          won={game.won}
          onNewGame={handleNewGame}
          onShowStats={() => setShowStats(true)}
          onShowHowTo={() => setShowHowTo(true)}
          onShowColorLegend={() => setShowColorLegend(true)}
        />

        <main className="classic-page__main">
          {!hasMembers ? (
            <ClassicScroll showIntro>
              <p className="classic-scroll__empty">
                Ainda não há membros adicionados. Volta ao início e aguarda os dados da família.
              </p>
            </ClassicScroll>
          ) : (
            <>
              <div className="classic-game-stack">
                <ClassicScroll showIntro={game.guesses.length === 0}>
                  {secretMember && (
                    <ClassicHintTiles guessCount={game.guesses.length} answer={secretMember} />
                  )}
                </ClassicScroll>

                <section className="classic-search-zone" aria-label="Pesquisar membro">
                  {duplicateWarning && (
                    <p className="classic-duplicate-warning" role="alert">
                      Parece ser outro membro com as mesmas propriedades!
                    </p>
                  )}
                  {isGameOver && (
                    <div className="classic-play-again">
                      <button type="button" className="classic-play-again__btn" onClick={handleNewGame}>
                        Jogar outra vez
                      </button>
                    </div>
                  )}
                  <ClassicSearchBar
                    onSubmit={handleGuess}
                    disabled={isGameOver}
                    guessedIds={guessedIds}
                    onOpenChange={handleSearchOpenChange}
                  />
                </section>

                {game.guesses.length > 0 && (
                  <section className="classic-results-zone" aria-label="Palpites">
                    <div className="classic-grid-wrap">
                      <GuessGrid theme="classic">
                        {game.guesses.map((guess, i) => (
                          <GuessRow
                            key={`${guess.member.id}-${i}`}
                            cells={guess.cells}
                            memberName={guess.member.name}
                            memberImage={guess.member.image}
                            animate={i === game.guesses.length - 1}
                            theme="classic"
                          />
                        ))}
                      </GuessGrid>
                    </div>

                    {secretMember && !isGameOver && (
                      <div className="classic-hints">
                        <RevealButton
                          guessCount={game.guesses.length}
                          onReveal={handleReveal}
                          revealed={game.revealed}
                        />
                      </div>
                    )}
                  </section>
                )}
              </div>

              <ClassicFooter gameNumber={session.gameNumber} />
            </>
          )}
        </main>
      </div>

      {showWin && secretMember && (
        <WinModal
          member={secretMember}
          guessCount={game.guesses.length}
          streak={streak}
          gameNumber={session.gameNumber}
          onShare={handleShare}
          onClose={() => setShowWin(false)}
          onPlayAgain={handleNewGame}
          shared={shared}
          revealed={game.revealed}
        />
      )}

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      {showColorLegend && <ColorLegendModal onClose={() => setShowColorLegend(false)} />}
      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
    </div>
  );
}
