import { RoundCycleProgress } from './RoundCooldown';

interface NextGameCooldownProps {
  remainingMs: number;
  onPlayAgain?: () => void;
  className?: string;
  modesWonCount?: number;
  requiredModesCount?: number;
}

export function NextGameCooldown({
  remainingMs,
  onPlayAgain,
  className = '',
  modesWonCount = 0,
  requiredModesCount = 3,
}: NextGameCooldownProps) {
  if (remainingMs > 0) {
    return null;
  }

  return (
    <div className={`next-game-cooldown-wrap ${className}`.trim()}>
      {modesWonCount > 0 && modesWonCount < requiredModesCount && (
        <RoundCycleProgress
          modesWonCount={modesWonCount}
          requiredModesCount={requiredModesCount}
        />
      )}
      {onPlayAgain && (
        <button type="button" className="next-game-cooldown__btn" onClick={onPlayAgain}>
          {modesWonCount >= requiredModesCount ? 'Iniciar nova ronda' : 'Próximo jogo'}
        </button>
      )}
    </div>
  );
}
