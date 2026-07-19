import { useEffect, useState } from 'react';
import {
  BackgroundScene,
  HomeFooter,
  HomeLogo,
} from '../components/home/HomeLayout';
import { GameModeButtonList } from '../components/game/GameModeVisuals';
import { RoundCompleteCooldown } from '../components/classic/RoundCooldown';
import { HowToPlay } from '../components/WinModal';
import { getModeCycleProgress } from '../lib/storage';
import { normalizeModeCycle } from '../lib/cooldown';
import { useGlobalCooldown } from '../lib/useWinCooldown';
import type { GameMode, ModeCycleProgress } from '../types/game';

interface HomePageProps {
  onPlayClassic: () => void;
  onPlaySilhouette: () => void;
  onPlayQuote: () => void;
  onShowHowTo?: () => void;
}

export function HomePage({ onPlayClassic, onPlaySilhouette, onPlayQuote, onShowHowTo }: HomePageProps) {
  return (
    <HomePageContent
      onPlayClassic={onPlayClassic}
      onPlaySilhouette={onPlaySilhouette}
      onPlayQuote={onPlayQuote}
      onShowHowTo={onShowHowTo}
    />
  );
}

const MODE_HANDLERS: Record<'classic' | 'silhouette' | 'quote', (props: HomePageProps) => void> = {
  classic: (p) => p.onPlayClassic(),
  silhouette: (p) => p.onPlaySilhouette(),
  quote: (p) => p.onPlayQuote(),
};

function HomePageContent(props: HomePageProps) {
  const [modeCycle, setModeCycle] = useState<ModeCycleProgress>(() => getModeCycleProgress());
  const globalCooldownRemainingMs = useGlobalCooldown(modeCycle);
  const globalCooldownActive = globalCooldownRemainingMs > 0;

  useEffect(() => {
    if (!modeCycle.cooldownUntil) return;

    const normalized = normalizeModeCycle(modeCycle);
    if (!normalized.cooldownUntil) {
      setModeCycle(normalized);
    }
  }, [globalCooldownRemainingMs, modeCycle]);

  function handleSelectMode(mode: GameMode) {
    MODE_HANDLERS[mode](props);
  }

  return (
    <div className={`home-page ${globalCooldownActive ? 'home-page--round-locked' : ''}`}>
      <BackgroundScene />

      <div className="home-page__content">
        <header className="home-page__header">
          <HomeLogo onSettingsClick={props.onShowHowTo} />
          <h2 className="home-page__tagline">
            ADIVINHA OS MEMBROS DA <span className="text-sense-orange">FAMÍLIA</span>
          </h2>
        </header>

        <nav className="home-page__modes" aria-label="Modos de jogo">
          {globalCooldownActive && (
            <RoundCompleteCooldown
              remainingMs={globalCooldownRemainingMs}
              className="round-cooldown--home"
            />
          )}
          <GameModeButtonList
            onSelect={handleSelectMode}
            disabled={globalCooldownActive}
            completedModes={{
              classic: modeCycle.classic,
              silhouette: modeCycle.silhouette,
              quote: modeCycle.quote,
            }}
          />
        </nav>

        <HomeFooter />
      </div>
    </div>
  );
}

export function HomePageWithHowTo({
  onPlayClassic,
  onPlaySilhouette,
  onPlayQuote,
  onShowHowTo,
  showHowTo,
  onCloseHowTo,
}: HomePageProps & { showHowTo: boolean; onCloseHowTo: () => void }) {
  return (
    <>
      <HomePageContent
        onPlayClassic={onPlayClassic}
        onPlaySilhouette={onPlaySilhouette}
        onPlayQuote={onPlayQuote}
        onShowHowTo={onShowHowTo}
      />
      {showHowTo && <HowToPlay onClose={onCloseHowTo} />}
    </>
  );
}
