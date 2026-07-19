import type { FamilyMember } from '../types/game';

interface WinModalProps {
  member: FamilyMember;
  guessCount: number;
  streak: number;
  gameNumber: number;
  onShare: () => void;
  onClose: () => void;
  onPlayAgain: () => void;
  shared: boolean;
  revealed?: boolean;
}

export function WinModal({
  member,
  guessCount,
  streak,
  gameNumber,
  onShare,
  onClose,
  onPlayAgain,
  shared,
  revealed,
}: WinModalProps) {
  return (
    <div className="classic-modal-overlay" role="presentation">
      <div className="classic-modal classic-modal--win animate-fade-in" role="dialog">
        <div className="classic-modal__win-header">
          {revealed ? (
            <p className="classic-modal__win-badge">Resposta revelada</p>
          ) : (
            <p className="classic-modal__win-badge classic-modal__win-badge--success">
              Parabéns! 🎉
            </p>
          )}
          <p className="classic-modal__win-puzzle">Jogo #{gameNumber}</p>
        </div>

        <div className="classic-modal__portrait">
          {member.image ? (
            <img src={member.image} alt={member.name} className="classic-modal__portrait-img" />
          ) : (
            <div className="classic-modal__portrait-fallback">{member.name.charAt(0)}</div>
          )}
        </div>

        <h2 className="classic-modal__member-name">{member.name}</h2>
        <p className="classic-modal__member-role">{member.role}</p>

        {(member.education || member.profession || member.dream) && (
          <div className="classic-modal__member-bio">
            {member.education && (
              <p><strong>Formação:</strong> {member.education}</p>
            )}
            {member.profession && (
              <p><strong>Profissão:</strong> {member.profession}</p>
            )}
            {member.dream && (
              <p><strong>Maior sonho:</strong> {member.dream}</p>
            )}
          </div>
        )}

        <div className="classic-modal__stats-grid classic-modal__stats-grid--inline">
          <div className="classic-modal__stat">
            <p className="classic-modal__stat-value">{guessCount}</p>
            <p className="classic-modal__stat-label">Tentativas</p>
          </div>
          <div className="classic-modal__stat">
            <p className="classic-modal__stat-value">🔥 {streak}</p>
            <p className="classic-modal__stat-label">Sequência</p>
          </div>
        </div>

        <div className="classic-modal__actions">
          <button type="button" onClick={onShare} className="classic-modal__btn classic-modal__btn--primary">
            {shared ? '✓ Copiado!' : 'Partilhar resultado'}
          </button>
          <button type="button" onClick={onPlayAgain} className="classic-modal__btn classic-modal__btn--primary">
            Jogar outra vez
          </button>
          <button type="button" onClick={onClose} className="classic-modal__btn">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

interface HowToPlayProps {
  onClose: () => void;
}

export function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <div className="classic-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="classic-modal classic-modal--howto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <h2 className="classic-modal__title">Como jogar</h2>

        <div className="classic-modal__howto-body">
          <p>
            Adivinha o <strong>membro secreto da família</strong>.
            Escreve um nome e submete — cada coluna mostra o quão perto estás.
          </p>

          <div className="classic-modal__legend-list">
            <ColorLegendItem colorClass="guess-cell--correct" symbol="✓" label="Correto — atributo igual" />
            <ColorLegendItem colorClass="guess-cell--partial" symbol="~" label="Parcial — alguma sobreposição" />
            <ColorLegendItem colorClass="guess-cell--wrong" symbol="✗" label="Errado — sem correspondência" />
          </div>

          <p className="classic-modal__hint-note">
            Colunas ordenadas (Geração, Idade) mostram ↑ ou ↓ a apontar para a resposta.
          </p>

          <div>
            <p className="classic-modal__section-title">Dicas progressivas:</p>
            <ul className="classic-modal__list">
              <li>5 tentativas — personalidade</li>
              <li>8 tentativas — comida favorita</li>
              <li>12 tentativas — papel na família</li>
              <li>20 tentativas — revelar resposta</li>
            </ul>
          </div>

          <p className="classic-modal__hint-note">
            Podes jogar quantas vezes quiseres. Usa &quot;Jogar outra vez&quot; para
            recomeçar com um membro secreto aleatório novo.
          </p>
        </div>

        <button type="button" onClick={onClose} className="classic-modal__btn classic-modal__btn--primary">
          Entendido!
        </button>
      </div>
    </div>
  );
}

function ColorLegendItem({
  colorClass,
  symbol,
  label,
}: {
  colorClass: string;
  symbol: string;
  label: string;
}) {
  return (
    <div className="classic-modal__legend-item">
      <span className={`classic-modal__legend-swatch guess-cell guess-cell--classic ${colorClass}`}>
        {symbol}
      </span>
      <span>{label}</span>
    </div>
  );
}
