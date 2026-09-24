<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import type {
  ChartMode,
  ChartPosition,
  ChartThemePalete,
  IChartSeries,
} from '@/types/chart';
import { onMounted, onUnmounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
import apexchart from 'vue3-apexcharts';
interface GridPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
const {
  chartId = 'chart-radar-id',
  height = '350',
  width = 'auto',
  showLegend = true,
  mode = 'light',
  palette = 'palette1',
  series,
  colors,
  showDataLabels = false,
  categories,
  yaxisShow = false,
  yaxisTickamount = 5,
  xaxisTickamount = 0,
  gridPadding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  labelRotate,
  gridColors,
  yaxisMax,
  yaxisMin,
  markers = 0,
  strokeWidth = 1,
  opacity = 0.2,
} = defineProps<{
  chartId?: string;
  height?: string;
  width?: string;
  labelunit?: string;
  showLegend?: boolean;
  legendUseSeriesColors?: boolean;
  legendPosition?: ChartPosition;
  mode?: ChartMode;
  palette?: ChartThemePalete;
  series: IChartSeries[];
  colors?: string[];
  showDataLabels?: boolean;
  labelRotate?: number;
  categories: string[];
  yaxisShow?: boolean;
  yaxisTickamount?: number;
  xaxisTickamount?: number;
  gridPadding?: GridPadding;
  yaxisMax?: number;
  yaxisMin?: number;
  markers?: number;
  strokeWidth?: number;
  gridColors?: string[];
  opacity?: number;
}>();
const chartSeries = ref(series);
const options = ref<any>();
const { isDark } = useTheme();

const chartRadarRef = useTemplateRef<any>('chartRadarRef');
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
  if (options.value) {
    if (chartRadarRef.value) {
      chartRadarRef.value.updateOptions({
        theme: {
          mode: dark ? 'dark' : 'light',
        },
        plotOptions: {
          radar: {
            polygons: {
              fill: {
                colors: gridColors,
              },
            },
          },
        },
      });
    }
  }
};
watch(isDark, (state) => {
  updateTheme(state);
});
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
        type: 'radar',
        parentHeightOffset: 0,
        toolbar: {
          show: false,
        },
      },
      theme: {
        mode,
        palette,
      },
      plotOptions: {
        radar: {
          polygons: {
            fill: {
              colors: gridColors,
            },
          },
        },
      },
      colors: colors && colors.length > 0 ? colors : undefined,
      xaxis: {
        labels: {
          rotate: labelRotate,
        },
        categories,
        tickAmount: xaxisTickamount > 0 ? xaxisTickamount : undefined,
      },
      yaxis: {
        show: yaxisShow,
        tickAmount: yaxisTickamount,
        max: yaxisMax,
        min: yaxisMin,
      },
      dataLabels: {
        enabled: showDataLabels,
      },
      stroke: {
        width: strokeWidth,
      },
      fill: {
        opacity,
      },
      markers: {
        size: markers,
      },
      legend: {
        show: showLegend,
      },
      grid: {
        padding: gridPadding,
      },
    };
  }
};
</script>
<template>
  <div ref="visibilityRef">
    <apexchart
      v-if="options && viewActive"
      v-bind="$attrs"
      ref="chartRadarRef"
      :height="height"
      type="radar"
      :options="options"
      :series="chartSeries"
    />
  </div>
</template>
