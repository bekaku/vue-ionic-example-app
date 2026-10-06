// Chart colours come from the app design tokens (variables.scss/color.scss),
// read at render time so light/dark and re-themed brand colours just work.
// Charts cannot paint `var()` themselves, so every colour is resolved here.
import { modifyAlpha } from '@/libs/echarts';
import type { ChartThemePalete } from '@/types/chart';

// Data palettes (palette hues are for data — COMPONENTS.md §6). The names
// keep the old ApexCharts `palette1…10` prop values working.
export const chartPalettes: Record<ChartThemePalete, string[]> = {
  palette1: ['--ion-color-primary', '--color-emerald-500', '--color-amber-500', '--color-rose-500', '--color-violet-500', '--color-cyan-500', '--color-orange-500', '--color-lime-500', '--color-fuchsia-500'],
  palette2: ['--color-blue-500', '--color-teal-500', '--color-yellow-500', '--color-pink-500', '--color-indigo-500', '--color-lime-600'],
  palette3: ['--color-indigo-500', '--color-sky-400', '--color-emerald-400', '--color-amber-400', '--color-rose-400'],
  palette4: ['--color-teal-600', '--color-cyan-500', '--color-sky-400', '--color-blue-300'],
  palette5: ['--color-rose-500', '--color-orange-500', '--color-amber-400', '--color-lime-500', '--color-emerald-500', '--color-sky-500', '--color-violet-500'],
  palette6: ['--color-violet-500', '--color-purple-400', '--color-fuchsia-400', '--color-pink-400'],
  palette7: ['--color-slate-600', '--color-sky-600', '--color-teal-500', '--color-amber-500'],
  palette8: ['--color-emerald-600', '--color-lime-500', '--color-yellow-400', '--color-orange-400'],
  palette9: ['--color-orange-500', '--color-red-500', '--color-rose-400', '--color-pink-300'],
  palette10: ['--color-stone-600', '--color-amber-600', '--color-lime-700', '--color-teal-700'],
};
// Used when the stylesheet is not loaded (unit tests).
const fallbackPalette = ['#3880ff', '#00bc7d', '#fe9a00', '#ff2056', '#8e51ff', '#00b8db', '#ff6900', '#7ccf00', '#e12afb'];

export const readToken = (name: string, fallback = '') => {
  if (typeof document === 'undefined' || !document.body) {
    return fallback;
  }
  // Read from body: dark values are set on body[color-theme='dark'].
  const value = getComputedStyle(document.body).getPropertyValue(name).trim();
  return value || fallback;
};

// Accepts a raw CSS colour, a token name (`--color-sky-500`) or `var(--…)`.
export const resolveColor = (value: string, fallback = '') => {
  const token = value.match(/^var\((--[\w-]+)\)$/)?.[1] ?? (value.startsWith('--') ? value : undefined);
  return token ? readToken(token, fallback) : value;
};

// Series colours: explicit `colors` win, else the named palette.
export const resolvePalette = (name: ChartThemePalete = 'palette1', colors?: string[]) => {
  if (colors && colors.length > 0) {
    return colors.map(c => resolveColor(c, c));
  }
  return chartPalettes[name].map((token, i) =>
    readToken(token, fallbackPalette[i % fallbackPalette.length]),
  );
};

export interface ChartThemeContext {
  dark: boolean
  /** Series colours: explicit `colors` win, else the named palette. */
  palette: (name?: ChartThemePalete, colors?: string[]) => string[]
  text: string
  textMuted: string
  line: string
  track: string
  /** Card background — slice/marker borders blend into it. */
  background: string
  /** Floating layers (tooltip). */
  surface: string
  alpha: (value: string, alpha: number) => string
}

export const createChartThemeContext = (dark: boolean): ChartThemeContext => {
  const textMuted = readToken('--app-text-muted', dark ? '#90a1b9' : '#62748e');
  return {
    dark,
    palette: resolvePalette,
    text: readToken('--app-text-strong', dark ? '#ffffff' : '#020618'),
    textMuted,
    // Hex tokens only: `color-mix()` tokens (--app-hairline) cannot be parsed.
    line: modifyAlpha(textMuted, dark ? 0.22 : 0.16),
    track: modifyAlpha(textMuted, dark ? 0.24 : 0.14),
    background: readToken('--app-bg-surface', dark ? '#0f172b' : '#ffffff'),
    surface: readToken('--app-bg-elevated', dark ? '#1d293d' : '#ffffff'),
    alpha: modifyAlpha,
  };
};

// ECharts theme: shared look for every chart (axes, legend, tooltip, font).
export const buildChartTheme = (ctx: ChartThemeContext) => {
  const axis = {
    axisLine: { show: false, lineStyle: { color: ctx.line } },
    axisTick: { show: false },
    axisLabel: { color: ctx.textMuted, fontSize: 11 },
    splitLine: { lineStyle: { color: ctx.line, type: 'dashed' } },
    splitArea: { show: false },
  };
  return {
    color: ctx.palette(),
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: readToken('--app-font-family', 'sans-serif'),
      color: ctx.text,
    },
    title: {
      textStyle: { color: ctx.text },
      subtextStyle: { color: ctx.textMuted },
    },
    legend: {
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 14,
      textStyle: { color: ctx.textMuted, fontSize: 12 },
      pageTextStyle: { color: ctx.textMuted },
      pageIconColor: ctx.text,
      pageIconInactiveColor: ctx.line,
    },
    tooltip: {
      backgroundColor: ctx.surface,
      borderColor: ctx.line,
      borderWidth: 1,
      textStyle: { color: ctx.text, fontSize: 12 },
      extraCssText: 'border-radius: 12px; box-shadow: 0 8px 24px rgba(15, 23, 43, 0.14);',
      axisPointer: {
        lineStyle: { color: ctx.textMuted, type: 'dashed' },
        shadowStyle: { color: ctx.alpha(ctx.textMuted, 0.08) },
      },
    },
    categoryAxis: axis,
    valueAxis: axis,
    radar: {
      axisName: { color: ctx.textMuted, fontSize: 11 },
      axisLine: { lineStyle: { color: ctx.line } },
      splitLine: { lineStyle: { color: ctx.line } },
      splitArea: { show: false },
    },
  };
};
