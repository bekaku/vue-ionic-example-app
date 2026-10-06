<script lang="ts" setup>
// Pie / donut chart: one value per category.
import ChartBase from '@/components/chart/ChartBase.vue';
import type { ChartThemeContext } from '@/libs/chartTheme';
import { formatNumber, legendOption } from '@/libs/chartOptions';
import type { ChartOption } from '@/libs/echarts';
import type { ChartPosition, ChartThemePalete } from '@/types/chart';

const {
  chartId,
  height = 'auto',
  width = '100%',
  labelunit = '',
  showLegend = true,
  legendPosition = 'bottom',
  type = 'pie',
  palette = 'palette1',
  series,
  colors,
  showDataLabels = true,
  categories,
} = defineProps<{
  chartId?: string
  height?: string | number
  width?: string
  /** Appended to values in the tooltip. */
  labelunit?: string
  showLegend?: boolean
  legendPosition?: ChartPosition
  type?: 'pie' | 'donut'
  palette?: ChartThemePalete
  series: number[]
  colors?: string[]
  /** Percentage on each slice. */
  showDataLabels?: boolean
  categories: string[]
}>();

// Move the pie away from the legend side.
const center = () => {
  if (!showLegend) {
    return ['50%', '50%'];
  }
  return {
    top: ['50%', '56%'],
    bottom: ['50%', '45%'],
    left: ['62%', '50%'],
    right: ['38%', '50%'],
  }[legendPosition];
};

const buildOption = (theme: ChartThemeContext): ChartOption => {
  const donut = type === 'donut';
  return {
    color: theme.palette(palette, colors),
    legend: legendOption(showLegend, legendPosition),
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter: (params) => {
        const item = Array.isArray(params) ? params[0] : params;
        return `${item?.marker ?? ''}${item?.name ?? ''}: <b>${formatNumber(item?.value)}${labelunit}</b> (${item?.percent ?? 0}%)`;
      },
    },
    series: [
      {
        type: 'pie',
        center: center(),
        radius: donut ? ['46%', '70%'] : [0, '70%'],
        minShowLabelAngle: 12,
        // Gap between slices in the card colour.
        itemStyle: {
          borderColor: theme.background,
          borderWidth: 2,
          borderRadius: donut ? 6 : 0,
        },
        label: {
          show: showDataLabels,
          position: 'inside',
          formatter: '{d}%',
          color: '#fff',
          fontSize: 11,
          fontWeight: 600,
        },
        labelLine: { show: false },
        emphasis: { scale: true, scaleSize: 6 },
        data: categories.map((name, index) => ({ name, value: series[index] ?? 0 })),
      },
    ],
  };
};
</script>
<template>
  <ChartBase :id="chartId" :option="buildOption" :height="height" :width="width" />
</template>
