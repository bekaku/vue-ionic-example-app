<script setup lang="ts">
// Renders any ECharts option. The typed chart components (ChartArea, ChartPie,
// …) build their option and render through this; use it directly for a
// custom chart. Pass the option as a function to get theme colours.
import { useTheme } from '@/composables/useTheme';
import {
  buildChartTheme,
  createChartThemeContext,
  type ChartThemeContext,
} from '@/libs/chartTheme';
import { initChart, type ChartInstance, type ChartOption } from '@/libs/echarts';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue';

const {
  option,
  height = 300,
  width = '100%',
  label,
} = defineProps<{
  option: ChartOption | ((theme: ChartThemeContext) => ChartOption)
  /** px number, numeric string (px) or any CSS size; `auto` = 300px. */
  height?: string | number
  width?: string
  /** Accessible description; ECharts generates one when omitted. */
  label?: string
}>();

const { isDark } = useTheme();
const chartRef = useTemplateRef<HTMLDivElement>('chartRef');
const chart = shallowRef<ChartInstance>();
const themeContext = shallowRef<ChartThemeContext>();

const cssSize = (value: string | number, fallback: string) => {
  if (value === 'auto' || value === '') {
    return fallback;
  }
  return typeof value === 'number' || /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
};
const style = computed(() => ({
  height: cssSize(height, '300px'),
  width: cssSize(width, '100%'),
}));

const resolvedOption = computed(() => {
  const theme = themeContext.value;
  if (!theme) {
    return undefined;
  }
  return typeof option === 'function' ? option(theme) : option;
});

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const apply = (value: ChartOption | undefined) => {
  if (!chart.value || !value) {
    return;
  }
  const next: ChartOption = {
    aria: { enabled: true, label: label ? { description: label } : undefined },
    ...value,
    animation: prefersReducedMotion() ? false : (value.animation ?? true),
  };
  chart.value.setOption(next, { notMerge: true });
};

// Create the chart on first view with a real size. A hidden cached Ionic page
// has width 0; drawing then gives a broken layout, so wait until it shows.
const tryInit = () => {
  const el = chartRef.value;
  if (chart.value || !el || el.clientWidth === 0 || !themeContext.value) {
    return;
  }
  chart.value = initChart(el, buildChartTheme(themeContext.value));
  apply(resolvedOption.value);
  intersectionObserver?.disconnect();
};

let intersectionObserver: IntersectionObserver | undefined;
let resizeObserver: ResizeObserver | undefined;
onMounted(() => {
  themeContext.value = createChartThemeContext(isDark.value);
  const el = chartRef.value;
  if (!el) {
    return;
  }
  if (typeof IntersectionObserver === 'undefined') {
    tryInit();
  } else {
    intersectionObserver = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        tryInit();
      }
    });
    intersectionObserver.observe(el);
  }
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      // Skip while hidden (width 0); resize again when the page returns.
      if (chart.value && el.clientWidth > 0) {
        chart.value.resize();
      }
    });
    resizeObserver.observe(el);
  }
});

watch(resolvedOption, apply);
watch(isDark, async (dark) => {
  // Wait for body[color-theme] to switch so the dark tokens are readable.
  await nextTick();
  const theme = createChartThemeContext(dark);
  chart.value?.setTheme(buildChartTheme(theme));
  themeContext.value = theme;
});

onBeforeUnmount(() => {
  intersectionObserver?.disconnect();
  resizeObserver?.disconnect();
  chart.value?.dispose();
  chart.value = undefined;
});

defineExpose({
  /** The ECharts instance (undefined until the chart is first visible). */
  getInstance: () => chart.value,
});
</script>
<template>
  <div ref="chartRef" class="chart-base" :style="style" />
</template>
<style scoped>
.chart-base {
  /* As a flex item (e.g. in IonRow) it must not shrink to 0px. */
  min-width: 0;
  max-width: 100%;
}
</style>
