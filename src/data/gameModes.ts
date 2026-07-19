import type { GameMode } from '../types/game';

export type GameModeId = GameMode | 'memory';

export interface GameModeConfig {
  id: GameModeId;
  label: string;
  description: string;
  enabled: boolean;
  color: string;
  accent: string;
  glow: string;
}

export const GAME_MODE_CONFIG: GameModeConfig[] = [
  {
    id: 'classic',
    label: 'Clássico',
    description: 'Consiga pistas a cada tentativa',
    enabled: true,
    color: '#3b82f6',
    accent: '#1d4ed8',
    glow: 'rgba(59, 130, 246, 0.55)',
  },
  {
    id: 'silhouette',
    label: 'Silhueta',
    description: 'Adivinha com a silhueta do membro',
    enabled: true,
    color: '#22c55e',
    accent: '#15803d',
    glow: 'rgba(34, 197, 94, 0.55)',
  },
  {
    id: 'quote',
    label: 'Frases',
    description: 'Adivinha quem disse a frase',
    enabled: true,
    color: '#facc15',
    accent: '#ca8a04',
    glow: 'rgba(250, 204, 21, 0.55)',
  },
  {
    id: 'memory',
    label: 'Memória',
    description: 'Adivinha com uma foto especial',
    enabled: false,
    color: '#ef4444',
    accent: '#b91c1c',
    glow: 'rgba(239, 68, 68, 0.45)',
  },
];

export function getGameModeConfig(id: GameModeId): GameModeConfig {
  return GAME_MODE_CONFIG.find((mode) => mode.id === id) ?? GAME_MODE_CONFIG[0];
}
