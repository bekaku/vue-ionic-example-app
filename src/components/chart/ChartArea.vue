<script setup lang="ts">
// Area / line / bar chart (vertical or horizontal) on a category axis.
import ChartBase from '@/components/chart/ChartBase.vue';
import type { ChartThemeContext } from '@/libs/chartTheme';
import { resolveColor } from '@/libs/chartTheme';
import {
  formatNumber,
  gridOption,
  labelInterval,
  legendOption,
  lineShape,
} from '@/libs/chartOptions';
import type { ChartOption } from '@/libs/echarts';
import type {
  ChartAnnotation,
  ChartPosition,
  ChartThemePalete,
  IChartSeries,
  Strokestyle,
} from '@/types/chart';

const {
  chartId,
  height = 'auto',
  width = '100%',
  labelunit = '',
  showLegend = true,
  legendPosition = 'bottom',
  type = 'area',
  palette = 'palette1',
  series = [],
  colors = [],
  showDataLabels = false,
  labelRotate = 0,
  yaxisShow = true,
  yaxisTickamount = 5,
  xaxisTickamount = 0,
  xaxisDecimalsInFloat = 0,
  yaxisDecimalsInFloat = 0,
  categories,
  strokestyle = 'smooth',
  strokeWidth = 2,
  sparkline = false,
  annotationsYaxis = [],
  annotationsXaxis = [],
  minYVal = 0,
  maxYVal,
  zoom = false,
  horizontal = false,
  opacity = 1,
} = defineProps<{
  chartId?: string
  height?: string | number
  width?: string
  /** Appended to values in the tooltip and data labels. */
  labelunit?: string
  showLegend?: boolean
  legendPosition?: ChartPosition
  type?: 'area' | 'bar' | 'line'
  palette?: ChartThemePalete
  series?: IChartSeries[]
  colors?: string[]
  showDataLabels?: boolean
  /** Category label angle in degrees (negative = slanted down, as before). */
  labelRotate?: number
  yaxisShow?: boolean
  /** Number of value-axis intervals. */
  yaxisTickamount?: number
  /** About how many category labels to show (0 = auto). */
  xaxisTickamount?: number
  /** Value-axis decimals when `horizontal`. */
  xaxisDecimalsInFloat?: number
  /** Value-axis decimals. */
  yaxisDecimalsInFloat?: number
  categories: string[]
  strokestyle?: Strokestyle
  strokeWidth?: number
  /** Hide axes, grid and legend. */
  sparkline?: boolean
  /** Reference lines on the vertical axis. */
  annotationsYaxis?: ChartAnnotation[]
  /** Reference lines on the horizontal axis. */
  annotationsXaxis?: ChartAnnotation[]
  minYVal?: number
  maxYVal?: number
  /** Pinch / drag to zoom the category axis. */
  zoom?: boolean
  /** Bars along the vertical axis (type `bar` only). */
  horizontal?: boolean
  /** Fill opacity (area gradient strength, bar opacity). */
  opacity?: number
}>();

const markLine = (theme: ChartThemeContext) => {
  const line = (axis: 'xAxis' | 'yAxis', item: ChartAnnotation) => {
    const color = item.color ? resolveColor(item.color, theme.textMuted) : theme.textMuted;
    return {
      [axis]: item.value,
      name: item.label,
      lineStyle: { color, type: 'dashed' as const },
      label: { show: !!item.label, formatter: item.label ?? '', color },
    };
  };
  const data = [
    ...annotationsYaxis.map(item => line('yAxis', item)),
    ...annotationsXaxis.map(item => line('xAxis', item)),
  ];
  return data.length > 0
    ? { symbol: 'none', silent: true, label: { position: 'insideEndTop' as const }, data }
    : undefined;
};

const buildOption = (theme: ChartThemeContext): ChartOption => {
  const seriesColors = theme.palette(palette, colors);
  const isBar = type === 'bar';
  const isHorizontal = isBar && horizontal;
  const decimals = isHorizontal ? xaxisDecimalsInFloat : yaxisDecimalsInFloat;
  const legend = showLegend && !sparkline;
  const format = (value: unknown) => `${formatNumber(value, decimals)}${labelunit}`;

  const categoryAxis = {
    type: 'category' as const,
    data: categories,
    show: !sparkline,
    boundaryGap: isBar,
    axisLine: { show: true },
    axisLabel: {
      rotate: -labelRotate,
      interval: labelInterval(categories.length, xaxisTickamount),
      hideOverlap: xaxisTickamount === 0,
    },
  };
  const valueAxis = {
    type: 'value' as const,
    show: yaxisShow && !sparkline,
    splitNumber: yaxisTickamount,
    min: minYVal,
    max: maxYVal,
    minInterval: decimals > 0 ? undefined : 1,
    axisLabel: { formatter: (value: number) => formatNumber(value, decimals) },
  };

  return {
    color: seriesColors,
    legend: legendOption(legend, legendPosition),
    grid: sparkline ? { top: 2, right: 0, bottom: 0, left: 0 } : gridOption(legend, legendPosition),
    tooltip: {
      trigger: 'axis',
      confine: true,
      axisPointer: { type: isBar ? 'shadow' : 'line' },
      valueFormatter: format,
    },
    xAxis: isHorizontal ? valueAxis : categoryAxis,
    // Horizontal: first category on top, labels unrotated.
    yAxis: isHorizontal
      ? { ...categoryAxis, inverse: true, axisLabel: { ...categoryAxis.axisLabel, rotate: 0 } }
      : valueAxis,
    dataZoom: zoom ? [{ type: 'inside', [isHorizontal ? 'yAxisIndex' : 'xAxisIndex']: 0 }] : [],
    series: series.map((item, index) => {
      const color = seriesColors[index % seriesColors.length] ?? theme.textMuted;
      const label = {
        show: showDataLabels,
        position: isHorizontal ? ('right' as const) : ('top' as const),
        color: theme.textMuted,
        fontSize: 10,
        formatter: (params: { value: unknown }) => format(params.value),
      };
      const extra = index === 0 ? { markLine: markLine(theme) } : {};
      if (isBar) {
        return {
          ...extra,
          type: 'bar',
          name: item.name,
          data: item.data,
          label,
          barMaxWidth: 18,
          itemStyle: {
            opacity,
            borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
          },
        };
      }
      return {
        ...extra,
        type: 'line',
        name: item.name,
        data: item.data,
        label,
        ...lineShape(strokestyle),
        showSymbol: false,
        symbolSize: 6,
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
                  { offset: 0, color: theme.alpha(color, 0.32 * opacity) },
                  { offset: 1, color: theme.alpha(color, 0.02) },
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
