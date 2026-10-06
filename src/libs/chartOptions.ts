// Option fragments shared by the chart components (src/components/chart).
import type { ChartPosition, Strokestyle } from '@/types/chart';

const legendSpace = { top: 32, bottom: 32, left: 96, right: 96 };

export const legendOption = (show: boolean, position: ChartPosition = 'bottom') => {
  const vertical = position === 'left' || position === 'right';
  return {
    show,
    type: 'scroll' as const,
    orient: vertical ? ('vertical' as const) : ('horizontal' as const),
    [position]: 0,
    ...(vertical ? { top: 'middle' } : { left: 'center' }),
    // Plain dots: series borders (e.g. pie slice gaps) must not ring the icon.
    itemStyle: { borderWidth: 0 },
  };
};

// Cartesian grid that keeps axis labels inside the box (old `containLabel`).
export const gridOption = (showLegend: boolean, position: ChartPosition = 'bottom') => {
  const grid = { top: 16, right: 12, bottom: 8, left: 4 };
  if (showLegend) {
    grid[position] += legendSpace[position];
  }
  return {
    ...grid,
    outerBoundsMode: 'same' as const,
    outerBoundsContain: 'axisLabel' as const,
  };
};

export const lineShape = (style: Strokestyle): {
  smooth: number | false
  smoothMonotone?: 'x'
  step: 'end' | false
} => ({
  smooth: style === 'smooth' ? 0.4 : false,
  // Keep smoothed curves from overshooting the data (e.g. below 0).
  smoothMonotone: style === 'smooth' ? 'x' : undefined,
  step: style === 'stepline' ? 'end' : false,
});

// Show about `ticks` category labels (ApexCharts `tickAmount` on categories).
export const labelInterval = (count: number, ticks: number): number | 'auto' =>
  ticks > 0 ? Math.max(0, Math.ceil(count / ticks) - 1) : 'auto';

export const formatNumber = (value: unknown, decimals?: number) => {
  if (typeof value !== 'number') {
    return value == null ? '-' : String(value);
  }
  return decimals != null && decimals > 0
    ? value.toFixed(decimals)
    : value.toLocaleString();
};

// Round up to a readable scale max (radar axes need one shared max).
export const niceMax = (value: number) => {
  if (value <= 0) {
    return 1;
  }
  const step = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / step) * step;
};
