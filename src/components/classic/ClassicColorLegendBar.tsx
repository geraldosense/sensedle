import { COLOR_LEGEND_ITEMS } from './colorLegendItems';

export function ClassicColorLegendBar() {
  return (
    <div className="classic-color-legend-bar" aria-label="Indicadores de cor">
      <p className="classic-color-legend-bar__title">Indicadores de cor</p>
      <ul className="classic-color-legend-bar__list">
        {COLOR_LEGEND_ITEMS.map((item) => (
          <li key={`${item.label}-${item.arrow ?? 'none'}`} className="classic-color-legend-bar__item">
            <span
              className={`classic-color-legend-bar__swatch guess-cell guess-cell--classic guess-cell--${item.status}`}
            >
              {item.arrow === 'up' && <span className="guess-cell__arrow">↑</span>}
              {item.arrow === 'down' && <span className="guess-cell__arrow">↓</span>}
            </span>
            <span className="classic-color-legend-bar__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
