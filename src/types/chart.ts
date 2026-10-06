export type Strokestyle = 'smooth' | 'straight' | 'stepline';
export type ChartPosition = 'top' | 'bottom' | 'left' | 'right';
// Named data palettes, resolved from colour tokens in src/libs/chartTheme.ts.
export type ChartThemePalete =
  | 'palette1'
  | 'palette2'
  | 'palette3'
  | 'palette4'
  | 'palette5'
  | 'palette6'
  | 'palette7'
  | 'palette8'
  | 'palette9'
  | 'palette10';
export interface IChartSeries {
  name: string
  data: number[]
  type?: string | null
  year?: string | null
  group?: string | null
}
export interface ISeriresCategories {
  series: IChartSeries[]
  categories: string[]
  colors?: string[] | undefined | null
  max?: number | undefined
}
export interface ISimpleChartSeries {
  series: number[]
  categories: string[]
  colors?: string[]
}
// Reference line on a value (ECharts markLine); `color` accepts a CSS colour
// or a token (`--color-red-500`).
export interface ChartAnnotation {
  value: number | string
  label?: string
  color?: string
}
