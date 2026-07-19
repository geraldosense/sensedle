import { loadProgress } from '../../lib/storage';

interface StatsModalProps {
  onClose: () => void;
}

export function StatsModal({ onClose }: StatsModalProps) {
  const stats = loadProgress();
  const winRate = stats.totalGames > 0
    ? Math.round((stats.totalWins / stats.totalGames) * 100)
    : 0;

  return (
    <div className="classic-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="classic-modal animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="stats-title"
      >
        <h2 id="stats-title" className="classic-modal__title">Estatísticas</h2>

        <div className="classic-modal__stats-grid">
          <StatItem label="Sequência" value={String(stats.streak)} icon="🔥" />
          <StatItem label="Máxima" value={String(stats.maxStreak)} icon="🏆" />
          <StatItem label="Vitórias" value={String(stats.totalWins)} icon="✅" />
          <StatItem label="Jogos" value={String(stats.totalGames)} icon="🎮" />
          <StatItem label="Taxa de acerto" value={`${winRate}%`} icon="📊" />
        </div>

        <button type="button" onClick={onClose} className="classic-modal__btn">
          Fechar
        </button>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="classic-modal__stat">
      <span className="classic-modal__stat-icon">{icon}</span>
      <p className="classic-modal__stat-value">{value}</p>
      <p className="classic-modal__stat-label">{label}</p>
    </div>
  );
}
