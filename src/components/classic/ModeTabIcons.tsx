import type { GameMode } from '../../types/game';

type TabIconId = GameMode | 'memory';

interface ModeTabIconProps {
  id: TabIconId;
  className?: string;
}

export function ModeTabIcon({ id, className = '' }: ModeTabIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="22"
      height="22"
      className={`mode-tab-icon ${className}`.trim()}
      aria-hidden="true"
    >
      {id === 'classic' && <ClassicQuestionIcon />}
      {id === 'silhouette' && <SilhouettePersonIcon />}
      {id === 'quote' && <QuoteMarksIcon />}
      {id === 'memory' && <MemoryEyeIcon />}
    </svg>
  );
}

export function ModeCompleteBadge({ hud = false }: { hud?: boolean }) {
  return (
    <span className={`mode-tab-badge ${hud ? 'mode-tab-badge--hud' : ''}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 28 28" className="mode-tab-badge__svg">
        {hud ? (
          <>
            <circle cx="14" cy="14" r="12" className="mode-tab-badge__hud-fill" />
            <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <path
              d="M8.5 14.2l3.4 3.5 7.6-8.2"
              fill="none"
              stroke="#fff"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <>
            <defs>
              <linearGradient id="modeBadgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              <filter id="modeBadgeShadow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#14532d" floodOpacity="0.5" />
              </filter>
            </defs>
            <circle cx="14" cy="14" r="12" fill="url(#modeBadgeGrad)" filter="url(#modeBadgeShadow)" />
            <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
            <path
              d="M8.5 14.2l3.4 3.5 7.6-8.2"
              fill="none"
              stroke="#fff"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </span>
  );
}

function ClassicQuestionIcon() {
  return (
    <text
      x="16"
      y="22"
      textAnchor="middle"
      fontSize="20"
      fontWeight="900"
      fill="currentColor"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      ?
    </text>
  );
}

function SilhouettePersonIcon() {
  return (
    <>
      <circle cx="16" cy="11" r="4.5" fill="currentColor" />
      <path d="M7 27c0-5 4-9 9-9s9 4 9 9" fill="currentColor" />
    </>
  );
}

function QuoteMarksIcon() {
  return (
    <text
      x="16"
      y="22"
      textAnchor="middle"
      fontSize="22"
      fontWeight="900"
      fill="currentColor"
      fontFamily="Georgia, 'Times New Roman', serif"
    >
      "
    </text>
  );
}

function MemoryEyeIcon() {
  return (
    <>
      <path
        d="M4 16s4.5-8 12-8 12 8 12 8-4.5 8-12 8-12-8-12-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
      <circle cx="16" cy="16" r="1.2" fill="#fff" opacity="0.85" />
    </>
  );
}
