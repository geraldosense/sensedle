import { useCallback, useEffect, useState } from 'react';
import type { FamilyMember, FreePlaySession, GameMode, GameState, GuessResult, ModeCycleProgress } from '../types/game';
import { GAME_MODE_LABELS } from '../types/game';
import { FAMILY_MEMBERS, getMemberById } from '../data/members';
import { getQuoteMemberCount } from '../data/quotes';
import { compareGuess, isWin } from '../lib/compare';
import { hasDuplicateFeedback } from '../lib/guessFeedback';
import {
  createNewFreePlaySession,
  getModeCycleProgress,
  initFreePlaySession,
  loadProgress,
  recordFreePlayCompletion,
  recordModeCycleWin,
  resetModeRotations,
  saveFreePlaySession,
  saveProgress,
} from '../lib/storage';
import {
  countModesWonInCycle,
  getObjectiveBadgeModes,
  getRequiredModesForCycle,
  normalizeModeCycle,
} from '../lib/cooldown';
import { useGlobalCooldown } from '../lib/useWinCooldown';
import { generateShareText, shareResult } from '../lib/share';
import {
  ClassicModeTabs,
  ClassicScroll,
  ClassicSkyBackground,
  ClassicTopBar,
  ClassicUtilityBar,
} from '../components/classic/ClassicGameUI';
import { ClassicHintTiles } from '../components/classic/ClassicHintTiles';
import { MemberSilhouette } from '../components/classic/MemberSilhouette';
import { QuoteDisplay } from '../components/classic/QuoteDisplay';
import { QuoteSpeakerPortrait } from '../components/classic/QuoteSpeakerPortrait';
import { NextGameCooldown } from '../components/classic/NextGameCooldown';
import { RoundCompleteCooldown } from '../components/classic/RoundCooldown';
import { SilhouetteGuessHistory } from '../components/classic/SilhouetteMemberReveal';
import { ClassicSearchBar } from '../components/classic/ClassicSearchBar';
import { ClassicFooter } from '../components/classic/ClassicFooter';
import { ClassicColorLegendBar } from '../components/classic/ClassicColorLegendBar';
import { StatsModal } from '../components/classic/StatsModal';
import { GuessGrid, GuessRow } from '../components/GuessGrid';
import { RevealButton } from '../components/HintBar';
import { WinModal, HowToPlay } from '../components/WinModal';

interface ClassicPageProps {
  mode: GameMode;
  onBack: () => void;
  onModeChange: (mode: GameMode) => void;
}

function resolveSession(mode: GameMode): FreePlaySession {
  return initFreePlaySession(FAMILY_MEMBERS, mode);
}

export function ClassicPage({ mode, onBack, onModeChange }: ClassicPageProps) {
  const [session, setSession] = useState<FreePlaySession>(() => resolveSession(mode));
  const [streak, setStreak] = useState(() => loadProgress().streak);
  const [showWin, setShowWin] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [shared, setShared] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [modeCycle, setModeCycle] = useState<ModeCycleProgress>(() => getModeCycleProgress());

  const game = session.game;
  const secretMember = getMemberById(session.secretMemberId);
  const hasMembers = FAMILY_MEMBERS.length > 0;
  const quoteMemberCount = getQuoteMemberCount(FAMILY_MEMBERS);
  const requiredModes = getRequiredModesForCycle(quoteMemberCount);
  const requiredModesCount = requiredModes.length;
  const hasQuoteContent = mode !== 'quote' || quoteMemberCount > 0;
  const secretHasQuote = Boolean(secretMember?.quote?.text?.trim());
  const isGameOver = game.won || game.revealed;
  const guessedIds = game.guesses.map((g) => g.member.id);
  const globalCooldownRemainingMs = useGlobalCooldown(modeCycle);
  const globalCooldownActive = globalCooldownRemainingMs > 0;
  const modesWonCount = countModesWonInCycle(modeCycle, requiredModes);
  const objectiveBadgeModes = getObjectiveBadgeModes(modeCycle, mode, game.won);
  const cooldownProps = {
    remainingMs: globalCooldownRemainingMs,
    modesWonCount,
    requiredModesCount,
  };

  useEffect(() => {
    if (!modeCycle.cooldownUntil) return;

    const normalized = normalizeModeCycle(modeCycle);
    if (!normalized.cooldownUntil) {
      setModeCycle(normalized);
      const progress = loadProgress();
      progress.modeCycle = normalized;
      resetModeRotations();
      saveProgress(progress);
    }
  }, [globalCooldownRemainingMs, modeCycle]);

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

    setSession(initFreePlaySession(FAMILY_MEMBERS, mode));
    setStreak(loadProgress().streak);
    setModeCycle(getModeCycleProgress());
    setShowWin(false);
    setShared(false);
    setDuplicateWarning(false);

    return () => {
      document.removeEventListener('wheel', blockPageHorizontalScroll);
    };
  }, [mode, quoteMemberCount]);

  const persistSession = useCallback(
    (nextSession: FreePlaySession, previousGame: GameState) => {
      const wasFinished = previousGame.won || previousGame.revealed;
      const isNowFinished = nextSession.game.won || nextSession.game.revealed;

      setSession(nextSession);
      saveFreePlaySession(nextSession);

      if (isNowFinished && !wasFinished) {
        const progress = recordFreePlayCompletion(nextSession.game, wasFinished);
        setStreak(progress.streak);

        if (nextSession.game.won) {
          const cycleProgress = recordModeCycleWin(nextSession.mode, quoteMemberCount);
          setModeCycle(normalizeModeCycle(cycleProgress.modeCycle));
        }
      }
    },
    [quoteMemberCount],
  );

  function handleGuess(member: FamilyMember) {
    if (globalCooldownActive || !secretMember || isGameOver) return;
    if (guessedIds.includes(member.id)) return;

    if (mode === 'quote') {
      const won = member.id === secretMember.id;
      const result: GuessResult = { member, cells: [] };
      const newGame: GameState = {
        ...game,
        guesses: [...game.guesses, result],
        won,
        revealed: false,
      };
      persistSession({ ...session, game: newGame }, game);
      return;
    }

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
    if (newGame.won && mode === 'classic') setShowWin(true);
  }

  function handleReveal() {
    if (globalCooldownActive || !secretMember) return;
    const newGame: GameState = { ...game, revealed: true, won: false };
    persistSession({ ...session, game: newGame }, game);
    if (mode === 'classic') setShowWin(true);
  }

  function handleNewGame() {
    if (globalCooldownActive) return;

    const nextSession = createNewFreePlaySession(FAMILY_MEMBERS, mode);
    setSession(nextSession);
    saveFreePlaySession(nextSession);
    setShowWin(false);
    setShared(false);
    setDuplicateWarning(false);
  }

  async function handleShare() {
    const text = generateShareText(game.guesses, game.won, streak, session.gameNumber, mode);
    const ok = await shareResult(text);
    if (ok) setShared(true);
  }

  const handleSearchOpenChange = useCallback((open: boolean) => {
    setSearchOpen(open);
  }, []);

  const progress = loadProgress();

  const duplicateMessage =
    mode === 'quote'
      ? 'Já tentaste este membro!'
      : 'Parece ser outro membro com as mesmas propriedades!';

  const searchZone = (
    <section className="classic-search-zone" aria-label="Pesquisar membro">
      {duplicateWarning && (
        <p className="classic-duplicate-warning" role="alert">
          {duplicateMessage}
        </p>
      )}
      <ClassicSearchBar
        onSubmit={handleGuess}
        disabled={globalCooldownActive || isGameOver || (mode === 'quote' && !secretHasQuote)}
        guessedIds={guessedIds}
        onOpenChange={handleSearchOpenChange}
      />
    </section>
  );

  return (
    <div
      className={`classic-page classic-page--${mode} ${searchOpen ? 'classic-page--search-open' : ''} ${globalCooldownActive ? 'classic-page--round-locked' : ''}`}
    >
      <ClassicSkyBackground />

      <div className="classic-page__shell">
        <ClassicTopBar onBack={onBack} onShowHowTo={() => setShowHowTo(true)} />
        <div className="classic-game-column">
          <ClassicModeTabs
            activeMode={mode}
            onModeChange={onModeChange}
            disabled={globalCooldownActive}
            completedModes={objectiveBadgeModes}
          />
          <ClassicUtilityBar
            streak={streak}
            guessCount={game.guesses.length}
            onShowStats={() => setShowStats(true)}
            onShowHowTo={() => setShowHowTo(true)}
          />

          {globalCooldownActive && (
            <RoundCompleteCooldown
              remainingMs={globalCooldownRemainingMs}
              className="round-cooldown--global"
              compact
            />
          )}

          {!hasMembers ? (
            <ClassicScroll mode={mode} showIntro>
              <p className="classic-scroll__empty">
                Ainda não há membros adicionados. Volta ao início e aguarda os dados da família.
              </p>
            </ClassicScroll>
          ) : mode === 'quote' && !hasQuoteContent ? (
            <ClassicScroll mode={mode} showIntro>
              <p className="classic-scroll__empty">
                Ainda não há frases da família neste modo. Só entram citações reais
                que a família fornecer — envia-as para as adicionarmos.
              </p>
            </ClassicScroll>
          ) : (
            <div className="classic-game-stack">
              <ClassicScroll mode={mode} showIntro={game.guesses.length === 0}>
                {secretMember && mode === 'classic' && (
                  <ClassicHintTiles guessCount={game.guesses.length} answer={secretMember} />
                )}
                {secretMember && mode === 'silhouette' && (
                  <MemberSilhouette
                    member={secretMember}
                    revealed={game.won}
                    celebrate={game.won}
                  />
                )}
                {secretMember && mode === 'quote' && secretHasQuote && (
                  game.won || game.revealed ? (
                    <>
                      <QuoteSpeakerPortrait member={secretMember} celebrate={game.won} />
                      {game.won && (
                        <NextGameCooldown
                          {...cooldownProps}
                          onPlayAgain={globalCooldownActive ? undefined : handleNewGame}
                          className="next-game-cooldown--quote"
                        />
                      )}
                    </>
                  ) : (
                    secretMember.quote && <QuoteDisplay quote={secretMember.quote} />
                  )
                )}
              </ClassicScroll>

              {!(mode === 'quote' && game.won) && !globalCooldownActive && searchZone}

              {mode === 'quote' && !secretHasQuote && hasQuoteContent && (
                <p className="classic-scroll__empty" role="alert">
                  Não foi possível carregar a frase deste jogo. Começa outra vez.
                </p>
              )}

              {mode === 'silhouette' && secretMember && !isGameOver && !globalCooldownActive && (
                <div className="classic-silhouette-giveup">
                  <button type="button" className="classic-silhouette-giveup__btn" onClick={handleReveal}>
                    Desistir e ver resposta
                  </button>
                </div>
              )}

              {mode === 'quote' && secretMember && !isGameOver && !globalCooldownActive && (
                <div className="classic-silhouette-giveup">
                  <button type="button" className="classic-silhouette-giveup__btn" onClick={handleReveal}>
                    Desistir e ver resposta
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <main className="classic-page__main">
          {hasMembers && (
            <>
              {mode === 'quote' && secretMember && game.guesses.length > 0 && !game.won && (
                <section
                  className="classic-results-zone classic-results-zone--quote"
                  aria-label="Palpites na frase"
                >
                  <SilhouetteGuessHistory
                    guesses={game.guesses}
                    secretMember={secretMember}
                    won={false}
                    revealed={game.revealed}
                    showAnswerCard={false}
                  />
                </section>
              )}

              {mode === 'silhouette' && secretMember && game.guesses.length > 0 && (
                <section
                  className="classic-results-zone classic-results-zone--silhouette"
                  aria-label="Palpites na silhueta"
                >
                  <SilhouetteGuessHistory
                    guesses={game.guesses}
                    secretMember={secretMember}
                    won={game.won}
                    revealed={game.revealed}
                    discoverCount={game.won ? progress.totalWins : undefined}
                    onPlayAgain={game.won && !globalCooldownActive ? handleNewGame : undefined}
                    onShare={game.won ? handleShare : undefined}
                    shared={shared}
                    modesWonCount={modesWonCount}
                    requiredModesCount={requiredModesCount}
                  />
                </section>
              )}

              {mode === 'classic' && game.guesses.length > 0 && (
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
                          isWin={game.won && i === game.guesses.length - 1}
                          theme="classic"
                        />
                      ))}
                    </GuessGrid>
                  </div>

                  {secretMember && !isGameOver && !globalCooldownActive && (
                    <div className="classic-hints">
                      <RevealButton
                        guessCount={game.guesses.length}
                        onReveal={handleReveal}
                        revealed={game.revealed}
                      />
                    </div>
                  )}

                  <ClassicColorLegendBar />

                  {game.won && (
                    <NextGameCooldown
                      {...cooldownProps}
                      onPlayAgain={globalCooldownActive ? undefined : handleNewGame}
                      className="next-game-cooldown--classic"
                    />
                  )}
                </section>
              )}

              <ClassicFooter gameNumber={session.gameNumber} />
            </>
          )}
        </main>
      </div>

      {showWin && secretMember && mode === 'classic' && (
        <WinModal
          member={secretMember}
          guessCount={game.guesses.length}
          streak={streak}
          gameNumber={session.gameNumber}
          onShare={handleShare}
          onClose={() => setShowWin(false)}
          onPlayAgain={globalCooldownActive ? undefined : handleNewGame}
          shared={shared}
          revealed={game.revealed}
          modeLabel={GAME_MODE_LABELS[mode]}
          cooldownRemainingMs={globalCooldownRemainingMs}
          modesWonCount={modesWonCount}
          requiredModesCount={requiredModesCount}
        />
      )}

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
    </div>
  );
}
