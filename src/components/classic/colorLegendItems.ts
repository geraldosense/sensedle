export interface ColorLegendItemDef {
  status: 'correct' | 'partial' | 'wrong';
  label: string;
  arrow: 'up' | 'down' | null;
}

export const COLOR_LEGEND_ITEMS: ColorLegendItemDef[] = [
  { status: 'correct', label: 'Correto', arrow: null },
  { status: 'partial', label: 'Parcial', arrow: null },
  { status: 'wrong', label: 'Incorreto', arrow: null },
  { status: 'wrong', label: 'Depois de', arrow: 'up' },
  { status: 'wrong', label: 'Antes de', arrow: 'down' },
];
