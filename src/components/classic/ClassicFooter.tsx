import { loadProgress } from '../../lib/storage';

interface ClassicFooterProps {
  gameNumber: number;
}

export function ClassicFooter({ gameNumber }: ClassicFooterProps) {
  const stats = loadProgress();

  return (
    <footer className="classic-footer">
      <p className="classic-footer__puzzle">Jogo #{gameNumber}</p>
      <p className="classic-footer__stats">
        Total: <strong>{stats.totalWins} vitórias</strong> em {stats.totalGames} jogos
      </p>
    </footer>
  );
}
