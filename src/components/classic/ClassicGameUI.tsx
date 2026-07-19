import type { ReactNode } from 'react';
import type { GameMode } from '../../types/game';
import { FamiliaSenseLogo } from '../home/FamiliaSenseLogo';
import { AnimatedStreakFlame } from './AnimatedStreakFlame';
import { GameModeTabBar } from '../game/GameModeVisuals';

interface ClassicTopBarProps {
  onBack: () => void;
  onShowHowTo: () => void;
}

export function ClassicTopBar({ onBack, onShowHowTo }: ClassicTopBarProps) {
  return (
    <div className="classic-top-bar">
      <button type="button" onClick={onBack} className="classic-top-bar__icon" aria-label="Voltar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="classic-top-bar__logo">
        <FamiliaSenseLogo size="compact" />
      </div>

      <button type="button" onClick={onShowHowTo} className="classic-top-bar__icon" aria-label="Definições">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>
    </div>
  );
}

type PlayableMode = Extract<GameMode, 'classic' | 'silhouette' | 'quote'>;

interface ClassicModeTabsProps {
  activeMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  disabled?: boolean;
  completedModes?: Partial<Record<PlayableMode, boolean>>;
}

export function ClassicModeTabs(props: ClassicModeTabsProps) {
  return (
    <div className="classic-mode-tabs">
      <GameModeTabBar {...props} />
    </div>
  );
}

interface ClassicUtilityBarProps {
  streak: number;
  guessCount: number;
  onShowStats: () => void;
  onShowHowTo: () => void;
}

export function ClassicUtilityBar({
  streak,
  guessCount,
  onShowStats,
  onShowHowTo,
}: ClassicUtilityBarProps) {
  return (
    <div className="classic-utility-bar">
      <button
        type="button"
        className="classic-utility-bar__item classic-utility-bar__item--action"
        onClick={onShowStats}
        aria-label="Estatísticas"
        title="Estatísticas"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="4" y="12" width="4" height="8" rx="1" />
          <rect x="10" y="8" width="4" height="12" rx="1" />
          <rect x="16" y="4" width="4" height="16" rx="1" />
        </svg>
      </button>

      <div className="classic-utility-bar__item classic-utility-bar__item--streak" title={`Sequência: ${streak}`} aria-label={`Sequência: ${streak}`}>
        <AnimatedStreakFlame />
        <span className="classic-utility-bar__flame-value">{streak}</span>
      </div>

      <div className="classic-utility-bar__item classic-utility-bar__item--clipboard" title={`${guessCount} tentativas`} aria-label={`${guessCount} tentativas`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h6" />
        </svg>
        {guessCount > 0 && (
          <span className="classic-utility-bar__badge">{guessCount}</span>
        )}
      </div>

      <button
        type="button"
        className="classic-utility-bar__item classic-utility-bar__item--action"
        onClick={onShowHowTo}
        aria-label="Como jogar"
        title="Como jogar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.6 2.6 0 1 1 4.2 2c-.8.6-1.2 1.1-1.2 2.1V15" />
          <circle cx="12" cy="18" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>
  );
}

interface ClassicScrollProps {
  children: ReactNode;
  showIntro: boolean;
  mode: GameMode;
}

const SCROLL_COPY: Record<GameMode, { title: string; intro: string; note: string }> = {
  classic: {
    title: 'ADIVINHA QUAL É O MEMBRO DA FAMÍLIA!',
    intro: 'Escreve um membro qualquer para começar.',
    note: 'Família Sense — todos os membros da casa.',
  },
  silhouette: {
    title: 'ADIVINHA QUEM É PELA IMAGEM!',
    intro: 'Escreve um membro para começar.',
    note: 'Família Sense — adivinha pela silhueta.',
  },
  quote: {
    title: 'QUEM DISSE ISTO?',
    intro: 'Escreve um membro qualquer para começar.',
    note: 'Família Sense — todos os membros da casa.',
  },
};

export function ClassicScroll({ children, showIntro, mode }: ClassicScrollProps) {
  const copy = SCROLL_COPY[mode];

  return (
    <div className="classic-scroll">
      <div className="classic-scroll__roller classic-scroll__roller--top" aria-hidden="true" />
      <div className="classic-scroll__paper">
        <div className="classic-scroll__intro">
          <h2 className="classic-scroll__title">
            {copy.title}
          </h2>
          {showIntro && (
            <p className="classic-scroll__subtitle">
              {copy.intro}
            </p>
          )}
          <p className="classic-scroll__note">
            {copy.note}
          </p>
        </div>
        <div className="classic-scroll__content">{children}</div>
      </div>
      <div className="classic-scroll__roller classic-scroll__roller--bottom" aria-hidden="true" />
    </div>
  );
}

export function ClassicSkyBackground() {
  return (
    <div className="classic-sky-bg" aria-hidden="true">
      <img
        src="/images/family-background.png"
        alt=""
        className="classic-sky-bg__photo"
        decoding="async"
      />
      <div className="classic-sky-bg__overlay" />
    </div>
  );
}
