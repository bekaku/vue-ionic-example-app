<script lang="ts" setup>
import { useTheme } from '@/composables/useTheme';
import type {
  ChartMode,
  ChartPosition,
  ChartThemePalete,
  Strokestyle,
} from '@/types/chart';
import { onMounted, onUnmounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
import apexchart from 'vue3-apexcharts';
const {
  chartId = 'chart-pie-id',
  height = 'auto',
  width = 'auto',
  showLegend = true,
  legendUseSeriesColors = true,
  legendPosition = 'bottom',
  type = 'pie',
  mode = 'light',
  palette = 'palette1',
  series,
  colors,
  showDataLabels = true,
  categories,
  strokestyle = 'smooth',
  strokeWidth = 1,
} = defineProps<{
  chartId?: string;
  height?: string;
  width?: string;
  labelunit?: string;
  showLegend?: boolean;
  legendUseSeriesColors?: boolean;
  legendPosition?: ChartPosition;
  type?: 'pie' | 'donut';
  mode?: ChartMode;
  palette?: ChartThemePalete;
  series: number[];
  colors?: string[];
  dark?: boolean;
  showDataLabels?: boolean;
  labelRotate?: number;
  categories: string[];
  strokestyle?: Strokestyle;
  strokeWidth?: number;
}>();

const { isDark } = useTheme();
const chartSeries = ref(series);
const options = ref<any>();
const chartPieRef = useTemplateRef<any>('chartPieRef');
watchEffect(() => {
  if (series && series.length > 0) {
    chartSeries.value = series;
  }
});
onUnmounted(() => {
  options.value = undefined;
  chartSeries.value = [];
});

onMounted(() => {
  chartSetup();
  observeVisibility();
});
onUnmounted(() => {
  visibilityObserver?.disconnect();
});
// Render only while the container is visible with a real size: on cached
// Ionic pages the chart would otherwise draw while hidden (width 0) and
// ApexCharts measures NaN widths (SVG attribute errors on navigation).
const viewActive = ref(false);
const visibilityRef = useTemplateRef<any>('visibilityRef');
let visibilityObserver: IntersectionObserver | undefined;
const observeVisibility = () => {
  visibilityObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    const width = entry?.target instanceof Element ? entry.target.getBoundingClientRect().width : 0;
    viewActive.value = entry?.isIntersecting === true && width > 0;
  });
  if (visibilityRef.value) {
    visibilityObserver.observe(visibilityRef.value);
  }
};
const updateTheme = (dark: boolean) => {
  if (chartPieRef.value) {
    chartPieRef.value.updateOptions({
      theme: {
        mode: dark ? 'dark' : 'light',
      },
    });
  }
};

const chartSetup = () => {
  if (series.length > 0) {
    options.value = {
      // series: series.value,
      // series: series,
      chart: {
        id: chartId,
        background: 'transparent',
        width,
        height,
        type,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easein', // linear, easeout, easein, easeinout, swing, bounce, elastic
          speed: 800,
        },
      },
      theme: {
        mode,
        palette,
      },
      plotOptions: {},
      colors: colors && colors.length > 0 ? colors : undefined,
      labels: categories,
      stroke: {
        width: strokeWidth,
        curve: strokestyle,
      },
      fill: {
        opacity: 1,
        type: 'gradient',
      },
      legend: {
        show: showLegend,
        position: legendPosition, // whether to position legends in 1 of 4
        // direction - top, bottom, left, right
        horizontalAlign: 'center', // when position top/bottom, you can
        // specify whether to align legends
        // left, right or center
        verticalAlign: 'middle',
        labels: {
          colors: '#8E8E93',
          useSeriesColors: legendUseSeriesColors,
        },
      },
      dataLabels: {
        enabled: showDataLabels,
      },
      responsive: [],
    };
  }
};
watch(isDark, (state) => {
  updateTheme(state);
});
</script>
<template>
  <div ref="visibilityRef">
    <apexchart
      v-if="options && viewActive"
       v-bind="$attrs"
      ref="chartPieRef"
      :height="height"
      :type="type"
      :options="options"
      :series="chartSeries"
    />
  </div>
</template>
