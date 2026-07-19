import { useEffect, useState } from 'react';
import type { ModeCycleProgress } from '../types/game';
import { getRemainingGlobalCooldownMs, normalizeModeCycle } from './cooldown';

export function useGlobalCooldown(cycle: ModeCycleProgress | undefined): number {
  const [remainingMs, setRemainingMs] = useState(() =>
    getRemainingGlobalCooldownMs(normalizeModeCycle(cycle)),
  );

  useEffect(() => {
    function tick() {
      setRemainingMs(getRemainingGlobalCooldownMs(normalizeModeCycle(cycle)));
    }

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [cycle]);

  return remainingMs;
}
