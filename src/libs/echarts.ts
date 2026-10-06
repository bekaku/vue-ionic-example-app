// Tree-shaken ECharts: register only what the chart components use.
// Add a chart/component here before using it in an option.
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
} from 'echarts/charts';
import {
  AriaComponent,
  DataZoomInsideComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  PolarComponent,
  RadarComponent,
  TooltipComponent,
} from 'echarts/components';
import type {
  AriaComponentOption,
  DataZoomComponentOption,
  GridComponentOption,
  LegendComponentOption,
  MarkLineComponentOption,
  PolarComponentOption,
  RadarComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { color, init, use } from 'echarts/core';
import type { ComposeOption, EChartsType } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';

use([
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  AriaComponent,
  DataZoomInsideComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  PolarComponent,
  RadarComponent,
  TooltipComponent,
  // SVG: crisp at any DPR and lighter on memory than canvas in WebViews.
  SVGRenderer,
]);

export type ChartOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | RadarSeriesOption
  | AriaComponentOption
  | DataZoomComponentOption
  | GridComponentOption
  | LegendComponentOption
  | MarkLineComponentOption
  | PolarComponentOption
  | RadarComponentOption
  | TooltipComponentOption
>;
export type ChartInstance = EChartsType;

export const initChart = (el: HTMLElement, theme: object) =>
  init(el, theme, { renderer: 'svg' });

export const modifyAlpha = (value: string, alpha: number) =>
  color.modifyAlpha(value, alpha) || value;
