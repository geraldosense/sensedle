interface ColorLegendModalProps {
  onClose: () => void;
}

const LEGEND_ITEMS = [
  { status: 'correct', label: 'Correto', arrow: null },
  { status: 'partial', label: 'Parcial', arrow: null },
  { status: 'wrong', label: 'Incorreto', arrow: null },
  { status: 'wrong', label: 'Depois de', arrow: 'up' as const },
  { status: 'wrong', label: 'Antes de', arrow: 'down' as const },
];

export function ColorLegendModal({ onClose }: ColorLegendModalProps) {
  return (
    <div className="color-legend-overlay" onClick={onClose} role="presentation">
      <div
        className="color-legend-modal animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="color-legend-title"
      >
        <h2 id="color-legend-title" className="color-legend-modal__title">
          Indicadores de cor
        </h2>

        <ul className="color-legend-modal__list">
          {LEGEND_ITEMS.map((item) => (
            <li key={`${item.label}-${item.arrow ?? 'none'}`} className="color-legend-modal__item">
              <span
                className={`color-legend-modal__swatch guess-cell guess-cell--classic guess-cell--${item.status}`}
              >
                {item.arrow === 'up' && <span className="guess-cell__arrow">↑</span>}
                {item.arrow === 'down' && <span className="guess-cell__arrow">↓</span>}
              </span>
              <span className="color-legend-modal__label">{item.label}</span>
            </li>
          ))}
        </ul>

        <p className="color-legend-modal__hint">
          Verde = certo · Amarelo = parcial · Vermelho = errado.
          Setas aparecem em Idade e Geração.
        </p>

        <button type="button" onClick={onClose} className="color-legend-modal__close">
          Fechar
        </button>
      </div>
    </div>
  );
}
