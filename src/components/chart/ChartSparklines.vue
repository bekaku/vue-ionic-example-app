<script setup lang="ts">
// Sparkline: a small area/line/bar trend with no axes, grid or legend.
import ChartBase from '@/components/chart/ChartBase.vue';
import type { ChartThemeContext } from '@/libs/chartTheme';
import { formatNumber, lineShape } from '@/libs/chartOptions';
import type { ChartOption } from '@/libs/echarts';
import type { ChartThemePalete, IChartSeries, Strokestyle } from '@/types/chart';

const {
  chartId,
  height = 160,
  width = '100%',
  labelunit = '',
  palette = 'palette1',
  series,
  colors,
  categories,
  strokeWidth = 1.5,
  opacity = 0.3,
  tooltipEnable = true,
  type = 'area',
  strokestyle = 'straight',
} = defineProps<{
  chartId?: string
  height?: string | number
  width?: string
  /** Appended to values in the tooltip. */
  labelunit?: string
  palette?: ChartThemePalete
  series: IChartSeries[]
  colors?: string[]
  tooltipEnable?: boolean
  /** Point labels for the tooltip (index is shown when missing). */
  categories: string[]
  strokeWidth?: number
  strokestyle?: Strokestyle
  /** Fill opacity (area gradient strength, bar opacity). */
  opacity?: number
  type?: 'area' | 'line' | 'bar'
}>();

const buildOption = (theme: ChartThemeContext): ChartOption => {
  const seriesColors = theme.palette(palette, colors);
  const length = Math.max(0, ...series.map(item => item.data.length));
  const labels = Array.from({ length }, (_, index) => categories[index] ?? String(index + 1));
  return {
    color: seriesColors,
    grid: { top: 2, right: 0, bottom: 0, left: 0 },
    tooltip: {
      show: tooltipEnable,
      trigger: 'axis',
      confine: true,
      axisPointer: { type: type === 'bar' ? 'shadow' : 'line' },
      valueFormatter: value => `${formatNumber(value)}${labelunit}`,
    },
    xAxis: { type: 'category', data: labels, show: false, boundaryGap: type === 'bar' },
    yAxis: { type: 'value', show: false, min: 0 },
    series: series.map((item, index) => {
      const color = seriesColors[index % seriesColors.length] ?? theme.textMuted;
      if (type === 'bar') {
        return {
          type: 'bar',
          name: item.name,
          data: item.data,
          barCategoryGap: '30%',
          itemStyle: { opacity: Math.max(opacity, 0.6), borderRadius: [2, 2, 0, 0] },
        };
      }
      return {
        type: 'line',
        name: item.name,
        data: item.data,
        ...lineShape(strokestyle),
        showSymbol: false,
        lineStyle: { width: strokeWidth },
        areaStyle: type === 'area'
          ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: theme.alpha(color, opacity) },
                  { offset: 1, color: theme.alpha(color, 0) },
                ],
              },
            }
          : undefined,
      };
    }),
  };
};
</script>
<template>
  <ChartBase :id="chartId" :option="buildOption" :height="height" :width="width" />
</template>
