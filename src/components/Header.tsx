import { useEffect, useState } from 'react';
import { formatCountdown } from '../lib/daily';
import { Logo } from './Logo';

interface HeaderProps {
  streak: number;
  won: boolean;
  guessCount: number;
}

export function Header({ streak, won, guessCount }: HeaderProps) {
  return (
    <header className="border-b border-sense-border bg-sense-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Logo size="sm" />

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1.5 text-xs text-gray-400 sm:flex">
            <span className="opacity-60">Próximo em</span>
            <Countdown />
          </div>

          <div
            className="flex items-center gap-1.5 rounded-lg border border-sense-border bg-sense-bg px-3 py-1.5"
            title="Sequência de vitórias"
          >
            <span className="text-base" role="img" aria-label="fogo">🔥</span>
            <span className="text-sm font-bold text-sense-orange-light">{streak}</span>
          </div>

          {won && (
            <div className="rounded-lg bg-correct-bg px-3 py-1.5 text-xs font-semibold text-green-400">
              ✓ Resolvido em {guessCount}
            </div>
          )}
        </div>
      </div>

      <ModeTabs />
    </header>
  );
}

function Countdown() {
  const [time, setTime] = useState(formatCountdown());

  useEffect(() => {
    const id = setInterval(() => setTime(formatCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs font-semibold text-sense-orange-light">
      {time}
    </span>
  );
}

function ModeTabs() {
  const modes = [
    { id: 'classic', label: 'Classic', active: true, icon: '🏠' },
    { id: 'silhouette', label: 'Silhueta', active: false, icon: '👤', soon: true },
    { id: 'quote', label: 'Frase', active: false, icon: '💬', soon: true },
  ];

  return (
    <nav className="mx-auto flex max-w-5xl gap-1 px-4 pb-2">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          disabled={!mode.active}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            mode.active
              ? 'bg-sense-orange text-white shadow-md shadow-sense-orange/30'
              : 'cursor-not-allowed text-gray-500 opacity-60'
          }`}
        >
          <span>{mode.icon}</span>
          {mode.label}
          {mode.soon && (
            <span className="rounded bg-sense-border px-1.5 py-0.5 text-[10px] font-normal uppercase">
              Em breve
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
