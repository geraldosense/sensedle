import type { ReactNode } from 'react';
import { SOCIAL_LABELS, SOCIAL_LINKS, type SocialPlatform } from '../../data/social';
import { FamiliaSenseLogo } from './FamiliaSenseLogo';

interface ModeButtonProps {
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ModeButton({
  icon,
  iconBg,
  title,
  description,
  onClick,
  disabled,
}: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mode-button group w-full max-w-[520px] ${disabled ? 'mode-button--disabled' : ''}`}
    >
      <span className="mode-button__left">
        <span className="mode-button__inner">
          <span className={`mode-button__icon ${iconBg}`}>{icon}</span>
          <span className="mode-button__title">{title}</span>
        </span>
      </span>
      <span className="mode-button__right">
        <span className="mode-button__inner">{description}</span>
      </span>
    </button>
  );
}

interface HomeLogoProps {
  onSettingsClick?: () => void;
}

export function HomeLogo({ onSettingsClick }: HomeLogoProps) {
  return (
    <div className="home-logo-bar">
      <button
        type="button"
        onClick={onSettingsClick}
        className="home-logo-bar__icon home-logo-bar__icon--left"
        aria-label="Definições"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>

      <div className="home-logo-wrap">
        <FamiliaSenseLogo size="hero" />
      </div>

      <div
        className="home-logo-bar__icon home-logo-bar__icon--right text-2xl"
        title="Português"
        role="img"
        aria-label="Português"
      >
        🇵🇹
      </div>
    </div>
  );
}

export function BackgroundScene() {
  return (
    <div className="background-scene" aria-hidden="true">
      <img
        src="/images/family-background.png"
        alt=""
        className="background-scene__photo"
      />
      <div className="background-scene__overlay" />
    </div>
  );
}

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer__games-box">
        <p className="home-footer__games-title">Modos disponíveis em breve:</p>
        <div className="home-footer__games-list">
          <MiniGameBadge label="Silhueta" emoji="👤" />
          <MiniGameBadge label="Frases" emoji="💬" />
          <MiniGameBadge label="Memória" emoji="📸" />
        </div>
      </div>

      <div className="home-footer__social">
        <SocialLink platform="instagram" />
        <SocialLink platform="facebook" />
        <SocialLink platform="tiktok" />
      </div>

      <p className="home-footer__copy">familiasense — {new Date().getFullYear()}</p>
    </footer>
  );
}

function MiniGameBadge({ label, emoji }: { label: string; emoji: string }) {
  return (
    <div className="home-footer__game-badge">
      <span className="text-xl">{emoji}</span>
      <span className="text-[11px] font-bold text-gray-700">{label}</span>
    </div>
  );
}

function SocialLink({ platform }: { platform: SocialPlatform }) {
  return (
    <a
      href={SOCIAL_LINKS[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className={`home-footer__social-btn home-footer__social-btn--${platform}`}
      aria-label={SOCIAL_LABELS[platform]}
    >
      <SocialIcon platform={platform} />
    </a>
  );
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'instagram') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0 1.622c-3.16 0-3.532.012-4.77.069-1.036.047-1.6.218-1.974.363-.496.193-.85.424-1.222.796-.372.372-.603.726-.796 1.222-.145.374-.316.938-.363 1.974-.057 1.238-.069 1.61-.069 4.77s.012 3.532.069 4.77c.047 1.036.218 1.6.363 1.974.193.496.424.85.796 1.222.372.372.726.603 1.222.796.374.145.938.316 1.974.363 1.238.057 1.61.069 4.77.069s3.532-.012 4.77-.069c1.036-.047 1.6-.218 1.974-.363.496-.193.85-.424 1.222-.796.372-.372.603-.726.796-1.222.145-.374.316-.938.363-1.974.057-1.238.069-1.61.069-4.77s-.012-3.532-.069-4.77c-.047-1.036-.218-1.6-.363-1.974-.193-.496-.424-.85-.796-1.222-.372-.372-.726-.603-1.222-.796-.374-.145-.938-.316-1.974-.363-1.238-.057-1.61-.069-4.77-.069zm0 3.351a5.864 5.864 0 1 0 0 11.728 5.864 5.864 0 0 0 0-11.728zm0 1.622a4.242 4.242 0 1 1 0 8.484 4.242 4.242 0 0 1 0-8.484zm5.919-4.405a1.371 1.371 0 1 0 0 2.742 1.371 1.371 0 0 0 0-2.742z" />
      </svg>
    );
  }

  if (platform === 'facebook') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.08-2.97.74-.63.66-.98 1.57-.94 2.5.04 1.02.52 1.98 1.33 2.58.96.72 2.22.94 3.38.75.96-.16 1.84-.68 2.44-1.43.73-.92 1.08-2.08 1.06-3.24-.03-2.74-.01-5.48-.02-8.22z" />
    </svg>
  );
}
