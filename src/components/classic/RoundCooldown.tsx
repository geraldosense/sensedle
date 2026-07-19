import { formatCooldownLabel } from '../../lib/cooldown';

interface RoundCompleteCooldownProps {
  remainingMs: number;
  className?: string;
  compact?: boolean;
}

/** Mostrado quando Clássico, Silhueta e Frases foram acertados — espera de 5 min. */
export function RoundCompleteCooldown({
  remainingMs,
  className = '',
  compact = false,
}: RoundCompleteCooldownProps) {
  return (
    <div
      className={`round-cooldown ${compact ? 'round-cooldown--compact' : ''} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <p className="round-cooldown__title">Completaste todos os objetivos!</p>
      <p className="round-cooldown__message">
        Uma nova ronda estará disponível apenas daqui a 5 minutos.
      </p>
      <p className="round-cooldown__timer">
        Nova ronda em <strong>{formatCooldownLabel(remainingMs)}</strong>
      </p>
    </div>
  );
}

interface RoundCycleProgressProps {
  modesWonCount: number;
  requiredModesCount: number;
  className?: string;
}

export function RoundCycleProgress({
  modesWonCount,
  requiredModesCount,
  className = '',
}: RoundCycleProgressProps) {
  return (
    <p className={`mode-cycle-status ${className}`.trim()} role="status">
      Objetivos neste ciclo: {modesWonCount}/{requiredModesCount}
    </p>
  );
}
