<script setup lang="ts">
// Radar chart: each series is a polygon over the category axes.
import ChartBase from '@/components/chart/ChartBase.vue';
import type { ChartThemeContext } from '@/libs/chartTheme';
import { resolveColor } from '@/libs/chartTheme';
import { formatNumber, legendOption, niceMax } from '@/libs/chartOptions';
import type { ChartOption } from '@/libs/echarts';
import type { ChartPosition, ChartThemePalete, IChartSeries } from '@/types/chart';

const {
  chartId,
  height = 350,
  width = '100%',
  labelunit = '',
  showLegend = true,
  legendPosition = 'bottom',
  palette = 'palette1',
  series,
  colors,
  showDataLabels = false,
  categories,
  yaxisShow = false,
  yaxisTickamount = 5,
  yaxisMax,
  yaxisMin = 0,
  markers = 0,
  strokeWidth = 2,
  gridColors,
  opacity = 0.2,
} = defineProps<{
  chartId?: string
  height?: string | number
  width?: string
  /** Appended to values in the tooltip. */
  labelunit?: string
  showLegend?: boolean
  legendPosition?: ChartPosition
  palette?: ChartThemePalete
  series: IChartSeries[]
  colors?: string[]
  showDataLabels?: boolean
  categories: string[]
  /** Scale labels on the first axis. */
  yaxisShow?: boolean
  /** Number of rings. */
  yaxisTickamount?: number
  /** Shared axis max (default: rounded-up data max). */
  yaxisMax?: number
  yaxisMin?: number
  /** Point size; 0 hides the points. */
  markers?: number
  strokeWidth?: number
  /** Alternating ring fills (CSS colours or tokens). */
  gridColors?: string[]
  /** Polygon fill opacity. */
  opacity?: number
}>();

const buildOption = (theme: ChartThemeContext): ChartOption => {
  const max = yaxisMax ?? niceMax(Math.max(0, ...series.flatMap(item => item.data)));
  const legend = showLegend && series.length > 0;
  return {
    color: theme.palette(palette, colors),
    legend: legendOption(legend, legendPosition),
    tooltip: { trigger: 'item', confine: true },
    radar: {
      radius: '68%',
      center: ['50%', legend && legendPosition === 'bottom' ? '46%' : '50%'],
      splitNumber: yaxisTickamount,
      indicator: categories.map(name => ({ name, max, min: yaxisMin })),
      axisLabel: {
        show: yaxisShow,
        color: theme.textMuted,
        fontSize: 10,
        showMinLabel: false,
      },
      splitArea: gridColors && gridColors.length > 0
        ? { show: true, areaStyle: { color: gridColors.map(c => resolveColor(c, c)) } }
        : { show: false },
    },
    series: [
      {
        type: 'radar',
        symbol: markers > 0 ? 'circle' : 'none',
        symbolSize: markers * 2,
        lineStyle: { width: strokeWidth },
        areaStyle: { opacity },
        label: {
          show: showDataLabels,
          color: theme.textMuted,
          fontSize: 10,
          formatter: (params: { value: unknown }) => `${formatNumber(params.value)}${labelunit}`,
        },
        data: series.map(item => ({ name: item.name, value: item.data })),
      },
    ],
  };
};
</script>
<template>
  <ChartBase :id="chartId" :option="buildOption" :height="height" :width="width" />
</template>
