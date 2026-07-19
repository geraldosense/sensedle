import type { CSSProperties } from 'react';
import type { GameMode } from '../../types/game';
import { GAME_MODE_CONFIG, getGameModeConfig, type GameModeConfig, type GameModeId } from '../../data/gameModes';
import { ModeCompleteBadge, ModeTabIcon } from '../classic/ModeTabIcons';

type PlayableMode = Extract<GameMode, 'classic' | 'silhouette' | 'quote'>;

interface ModeHexShellProps {
  modeId: GameModeId;
  size?: 'md' | 'sm' | 'compact' | 'hud';
  shape?: 'hex' | 'oct';
  variant?: 'filled' | 'outline';
  completed?: boolean;
  active?: boolean;
  inactive?: boolean;
  className?: string;
}

export function ModeHexShell({
  modeId,
  size = 'md',
  shape = 'hex',
  variant = 'filled',
  completed = false,
  active = false,
  inactive = false,
  className = '',
}: ModeHexShellProps) {
  const config = getGameModeConfig(modeId);

  return (
    <span
      className={[
        'mode-hex',
        `mode-hex--${modeId}`,
        `mode-hex--${size}`,
        `mode-hex--${shape}`,
        `mode-hex--${variant}`,
        active ? 'mode-hex--active' : '',
        completed ? 'mode-hex--completed' : '',
        inactive ? 'mode-hex--inactive' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={
        {
          '--mode-color': config.color,
          '--mode-accent': config.accent,
          '--mode-glow': config.glow,
        } as CSSProperties
      }
    >
      <span className="mode-hex__ring" aria-hidden="true" />
      <span className="mode-hex__face">
        <ModeTabIcon id={modeId} />
      </span>
      {completed && <ModeCompleteBadge hud />}
    </span>
  );
}

interface GameModeButtonProps {
  config: GameModeConfig;
  onClick?: () => void;
  disabled?: boolean;
  completed?: boolean;
}

export function GameModeButton({ config, onClick, disabled = false, completed = false }: GameModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'game-mode-btn',
        `game-mode-btn--${config.id}`,
        disabled ? 'game-mode-btn--disabled' : '',
        completed ? 'game-mode-btn--completed' : '',
      ].filter(Boolean).join(' ')}
      style={
        {
          '--mode-color': config.color,
          '--mode-accent': config.accent,
          '--mode-glow': config.glow,
        } as CSSProperties
      }
      aria-label={completed ? `${config.label} — objetivo completo` : config.label}
    >
      <span className="game-mode-btn__panel game-mode-btn__panel--main">
        <span className="game-mode-btn__unskew">
          <ModeHexShell modeId={config.id} completed={completed} />
          <span className="game-mode-btn__title">{config.label}</span>
        </span>
      </span>
      <span className="game-mode-btn__panel game-mode-btn__panel--desc">
        <span className="game-mode-btn__unskew">{config.description}</span>
      </span>
    </button>
  );
}

interface GameModeTabBarProps {
  activeMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  disabled?: boolean;
  completedModes?: Partial<Record<PlayableMode, boolean>>;
}

export function GameModeTabBar({
  activeMode,
  onModeChange,
  disabled = false,
  completedModes = {},
}: GameModeTabBarProps) {
  return (
    <div className="game-mode-tabbar game-mode-tabbar--hud" role="tablist" aria-label="Modos de jogo">
      {GAME_MODE_CONFIG.map((config, index) => {
        const isActive = config.id === activeMode;
        const isPlayable =
          !disabled &&
          config.enabled &&
          (config.id === 'classic' || config.id === 'silhouette' || config.id === 'quote');
        const isCompleted =
          config.id !== 'memory' && Boolean(completedModes[config.id as PlayableMode]);
        const isInactive = !isActive && !isCompleted && config.id !== 'memory';
        const isLast = index === GAME_MODE_CONFIG.length - 1;

        return (
          <button
            key={config.id}
            type="button"
            role="tab"
            disabled={!isPlayable}
            aria-selected={isActive}
            aria-label={
              isCompleted ? `${config.label} — objetivo completo` : config.label
            }
            title={
              isCompleted
                ? `${config.label} — objetivo completo ✓`
                : isPlayable
                  ? config.label
                  : `${config.label} — em breve`
            }
            onClick={() => {
              if (isPlayable && config.id !== activeMode && config.id !== 'memory') {
                onModeChange(config.id);
              }
            }}
            className={[
              'game-mode-tab',
              'game-mode-tab--hud',
              `game-mode-tab--${config.id}`,
              isActive ? 'game-mode-tab--active' : '',
              isCompleted ? 'game-mode-tab--completed' : '',
              isInactive ? 'game-mode-tab--inactive' : '',
              !isPlayable ? 'game-mode-tab--locked' : '',
            ].filter(Boolean).join(' ')}
            style={
              {
                '--mode-color': config.color,
                '--mode-accent': config.accent,
                '--mode-glow': config.glow,
              } as CSSProperties
            }
          >
            <span className="game-mode-tab__hud-content">
              <ModeHexShell
                modeId={config.id}
                size="hud"
                shape="hex"
                variant="outline"
                active={isActive}
                completed={isCompleted}
                inactive={isInactive}
              />
              <span className="game-mode-tab__hud-label">{config.label}</span>
            </span>
            {!isLast && <span className="game-mode-tab__hud-divider" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

export function GameModeButtonList({
  onSelect,
  disabled = false,
  completedModes = {},
}: {
  onSelect: (mode: GameMode) => void;
  disabled?: boolean;
  completedModes?: Partial<Record<PlayableMode, boolean>>;
}) {
  return (
    <>
      {GAME_MODE_CONFIG.map((config) => {
        const isPlayable =
          config.enabled &&
          (config.id === 'classic' || config.id === 'silhouette' || config.id === 'quote');
        const isCompleted =
          config.id !== 'memory' && Boolean(completedModes[config.id as PlayableMode]);

        return (
          <GameModeButton
            key={config.id}
            config={config}
            disabled={disabled || !isPlayable}
            completed={isCompleted}
            onClick={() => {
              if (isPlayable && !disabled && config.id !== 'memory') {
                onSelect(config.id);
              }
            }}
          />
        );
      })}
    </>
  );
}
