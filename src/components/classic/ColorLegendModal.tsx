import { COLOR_LEGEND_ITEMS } from './colorLegendItems';

interface ColorLegendModalProps {
  onClose: () => void;
}

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
          {COLOR_LEGEND_ITEMS.map((item) => (
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
