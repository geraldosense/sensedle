import type { ReactNode, CSSProperties } from 'react';
import { FamiliaSenseLogo } from '../home/FamiliaSenseLogo';

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

export function ClassicModeTabs() {
  const modes = [
    { id: 'classic', icon: '?', active: true, color: '#3b82c4' },
    { id: 'silhouette', icon: '👤', active: false, color: '#4ade80' },
    { id: 'quote', icon: '❝', active: false, color: '#eab308' },
    { id: 'memory', icon: '👁', active: false, color: '#ef4444' },
  ];

  return (
    <div className="classic-mode-tabs">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          disabled={!mode.active}
          className={`classic-mode-tabs__btn ${mode.active ? 'classic-mode-tabs__btn--active' : ''}`}
          style={{ '--tab-color': mode.color } as CSSProperties}
          aria-label={mode.id}
        >
          <span className="classic-mode-tabs__icon">{mode.icon}</span>
        </button>
      ))}
    </div>
  );
}

interface ClassicUtilityBarProps {
  streak: number;
  guessCount: number;
  won: boolean;
  onNewGame: () => void;
  onShowStats: () => void;
  onShowHowTo: () => void;
  onShowColorLegend: () => void;
}

export function ClassicUtilityBar({
  streak,
  guessCount,
  won,
  onNewGame,
  onShowStats,
  onShowHowTo,
  onShowColorLegend,
}: ClassicUtilityBarProps) {
  return (
    <div className="classic-utility-bar">
      <button type="button" className="classic-utility-bar__btn" onClick={onShowStats} aria-label="Estatísticas">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18M7 16l4-4 4 4 4-6" />
        </svg>
      </button>

      <UtilityIcon label="Sequência" title={`Sequência: ${streak}`}>
        <span className="text-base">🔥</span>
        <span className="classic-utility-bar__value">{streak}</span>
      </UtilityIcon>

      <UtilityIcon label="Tentativas" title={`${guessCount} tentativas`}>
        <span className="text-base">📋</span>
        {guessCount > 0 && <span className="classic-utility-bar__badge">{guessCount}</span>}
      </UtilityIcon>

      <UtilityIcon label="Estado" title={won ? 'Resolvido!' : 'Em jogo'}>
        <span className="text-base">{won ? '✅' : '❓'}</span>
      </UtilityIcon>

      <button
        type="button"
        className="classic-utility-bar__btn classic-utility-bar__btn--new-game"
        onClick={onNewGame}
        aria-label="Novo jogo"
        title="Novo jogo"
      >
        <span className="classic-utility-bar__new-game-label">Novo</span>
      </button>

      <button type="button" className="classic-utility-bar__btn" onClick={onShowColorLegend} aria-label="Indicadores de cor">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" fill="#538d4e" stroke="none" />
          <rect x="14" y="3" width="7" height="7" rx="1" fill="#b59f3b" stroke="none" />
          <rect x="3" y="14" width="7" height="7" rx="1" fill="#8b3a3a" stroke="none" />
          <rect x="14" y="14" width="7" height="7" rx="1" fill="#8b3a3a" stroke="none" />
        </svg>
      </button>

      <button type="button" className="classic-utility-bar__btn" onClick={onShowHowTo} aria-label="Como jogar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
      </button>
    </div>
  );
}

function UtilityIcon({
  children,
  label,
  title,
}: {
  children: ReactNode;
  label: string;
  title?: string;
}) {
  return (
    <div className="classic-utility-bar__btn" title={title} aria-label={label}>
      {children}
    </div>
  );
}

interface ClassicScrollProps {
  children: ReactNode;
  showIntro: boolean;
}

export function ClassicScroll({ children, showIntro }: ClassicScrollProps) {
  return (
    <div className="classic-scroll">
      <div className="classic-scroll__roller classic-scroll__roller--top" aria-hidden="true" />
      <div className="classic-scroll__paper">
        <div className="classic-scroll__intro">
          <h2 className="classic-scroll__title">
            ADIVINHA QUAL É O MEMBRO DA FAMÍLIA!
          </h2>
          {showIntro && (
            <p className="classic-scroll__subtitle">
              Escreve um membro qualquer para começar.
            </p>
          )}
          <p className="classic-scroll__note">
            Família Sense — todos os membros da casa.
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
      <div className="classic-sky-bg__clouds" />
      <div className="classic-sky-bg__rocks" />
    </div>
  );
}
