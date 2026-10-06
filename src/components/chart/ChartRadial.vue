<script setup lang="ts">
// Radial progress rings (ECharts polar bars), one ring per value; the first
// value is outermost and shown in the centre. Values are out of `max`.
import ChartBase from '@/components/chart/ChartBase.vue';
import type { ChartThemeContext } from '@/libs/chartTheme';
import { resolveColor, resolvePalette } from '@/libs/chartTheme';
import { formatNumber } from '@/libs/chartOptions';
import type { ChartOption } from '@/libs/echarts';
import type { ChartPosition, ChartThemePalete } from '@/types/chart';
import { computed } from 'vue';

const {
  chartId,
  height = 'auto',
  width = '100%',
  palette = 'palette1',
  series,
  colors,
  categories,
  max = 100,
  showLegend = true,
  legendPosition = 'bottom',
  showDataLabels = true,
  showDataLabelsName = true,
  showDataLabelsValue = true,
  dataLabelsSize = '13px',
  dataValueSize = '24px',
  startAngle = 0,
  endAngle = 360,
  stokeLineCap = 'round',
  semi = false,
  hollowSize = '55%',
  trackColor,
  valUnit = '',
} = defineProps<{
  chartId?: string
  height?: string | number
  width?: string
  palette?: ChartThemePalete
  series: number[]
  colors?: string[]
  categories: string[]
  /** Value of a full ring. */
  max?: number
  showLegend?: boolean
  /** `left`/`right` fall back to `bottom`. */
  legendPosition?: ChartPosition
  /** Centre label (first value). */
  showDataLabels?: boolean
  showDataLabelsName?: boolean
  showDataLabelsValue?: boolean
  dataLabelsSize?: string
  dataValueSize?: string
  /** Degrees clockwise from 12 o'clock (as ApexCharts). */
  startAngle?: number
  endAngle?: number
  stokeLineCap?: 'round' | 'square' | 'butt'
  /** Half ring (-90° → 90°) with the label under the arc. */
  semi?: boolean
  /** Inner hole as a share of the ring radius. */
  hollowSize?: string
  /** Ring background (CSS colour or token); default from the theme. */
  trackColor?: string
  valUnit?: string
}>();

const arc = computed(() => {
  const start = semi ? -90 : startAngle;
  const end = semi ? 90 : endAngle;
  // ECharts angles: 90 = 12 o'clock, counter-clockwise; clamp to one turn.
  const span = Math.min(360, Math.max(0, end - start));
  return { start: 90 - start, end: 90 - start - span };
});
const centerY = computed(() => (semi ? '68%' : '50%'));

const items = computed(() => {
  // Palette hues are the same in both themes, so the legend can read them here.
  const ringColors = resolvePalette(palette, colors);
  return series.map((value, index) => ({
    name: categories[index] ?? '',
    value,
    label: `${formatNumber(value)}${valUnit}`,
    color: ringColors[index % ringColors.length],
  }));
});
const first = computed(() => items.value[0]);

const buildOption = (theme: ChartThemeContext): ChartOption => {
  const ringColors = theme.palette(palette, colors);
  const outer = semi ? 96 : 90;
  const hollow = Math.min(95, Math.max(0, Number.parseFloat(hollowSize) || 0));
  const ring = {
    type: 'bar' as const,
    coordinateSystem: 'polar' as const,
    roundCap: stokeLineCap === 'round',
    barCategoryGap: series.length > 1 ? '30%' : '18%',
  };
  return {
    color: ringColors,
    tooltip: { trigger: 'item', confine: true, valueFormatter: value => `${formatNumber(value)}${valUnit}` },
    polar: {
      center: ['50%', centerY.value],
      radius: [`${(outer * hollow) / 100}%`, `${outer}%`],
    },
    angleAxis: {
      type: 'value',
      min: 0,
      max,
      startAngle: arc.value.start,
      endAngle: arc.value.end,
      clockwise: true,
      show: false,
    },
    radiusAxis: {
      type: 'category',
      data: items.value.map(item => item.name),
      inverse: true,
      show: false,
    },
    series: [
      // Track: a full-value ring under each value. (showBackground would
      // ignore start/end angles and always draw a full circle.)
      {
        ...ring,
        silent: true,
        tooltip: { show: false },
        animation: false,
        itemStyle: {
          color: trackColor ? resolveColor(trackColor, theme.track) : theme.track,
        },
        data: items.value.map(() => max),
      },
      {
        ...ring,
        barGap: '-100%',
        data: items.value.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: ringColors[index % ringColors.length] },
        })),
      },
    ],
  };
};
</script>
<template>
  <div class="chart-radial" :class="{ 'chart-radial-legend-top': legendPosition === 'top' }">
    <div class="chart-radial-plot">
      <ChartBase :id="chartId" :option="buildOption" :height="height" :width="width" />
      <div
        v-if="showDataLabels && first"
        class="chart-radial-center"
        :style="{ top: centerY }"
        aria-hidden="true"
      >
        <strong
          v-if="showDataLabelsValue"
          class="app-num"
          :style="{ fontSize: dataValueSize }"
        >{{ first.label }}</strong>
        <span v-if="showDataLabelsName" :style="{ fontSize: dataLabelsSize }">{{ first.name }}</span>
      </div>
    </div>
    <ul v-if="showLegend && items.length > 0" class="chart-radial-legend">
      <li v-for="item in items" :key="item.name">
        <i :style="{ background: item.color }" />
        <span>{{ item.name }}</span>
        <strong class="app-num">{{ item.label }}</strong>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss">
.chart-radial {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
}
.chart-radial-legend-top {
  flex-direction: column-reverse;
}
.chart-radial-plot {
  position: relative;
}
.chart-radial-center {
  position: absolute;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: none;
  text-align: center;

  strong {
    color: var(--app-text-strong);
    font-weight: 700;
    line-height: 1.1;
  }

  span {
    color: var(--app-text-muted);
  }
}
.chart-radial-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 16px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 12px;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--app-text-muted);
  }

  i {
    width: 8px;
    height: 8px;
    border-radius: var(--app-radius-full, 999px);
  }

  strong {
    color: var(--app-text-strong);
    font-weight: 600;
  }
}
</style>
