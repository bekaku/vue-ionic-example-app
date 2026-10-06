# Task: Migrate charts from ApexCharts to ECharts

## Metadata

- Task ID: 012
- Status: DONE
- Priority: Medium
- Created: 2026-10-06
- Updated: 2026-10-06

## Objective

Replace ApexCharts (`apexcharts` + `vue3-apexcharts`) with ECharts while keeping
the reusable chart-component pattern: pages render `ChartArea`, `ChartPie`,
`ChartRadar`, `ChartRadial`, `ChartSparklines` with the same data props.

## Background

VERIFIED before the change: five components in `src/components/chart/` each
wrapped `<apexchart>` with an IntersectionObserver visibility guard and an
`updateOptions` theme switch (`useTheme().isDark`). Callers:
`pages/example/charts.vue` (all five, 19 charts) and `pages/tabs/home.vue`
(`ChartArea` bar, `ChartSparklines` ×4). Test stub: `tests/unit/HomeDashboard.spec.ts`.
Types in `src/types/chart.ts`. Colours were raw hex / Apex `palette1…10`.

## Scope

- Dependencies: remove `apexcharts`, `vue3-apexcharts`; add `echarts@^6.1.0`.
- `src/libs/echarts.ts`: tree-shaken registration (bar, line, pie, radar;
  aria, inside dataZoom, grid, legend, markLine, polar, radar, tooltip; SVG
  renderer) + `ChartOption` type.
- `src/libs/chartTheme.ts`: token-driven ECharts theme + `palette1…10` mapped
  to colour tokens; `src/libs/chartOptions.ts`: shared option fragments.
- New `ChartBase.vue` (lifecycle, lazy init, resize, theme, reduced motion,
  aria, dispose); the five components rebuilt on top of it with compatible props.
- Callers: dropped Apex-only props (`mode`, `dark`, radial `grid-padding`).
- Docs: `skills/mobile/COMPONENTS.md` §1 Charts, mobile-components skill rule.
- Tests: `tests/unit/Charts.spec.ts`.

## Out of Scope

Backend/web repos, native projects, new chart types, `src/types/models.ts`
`Chart*Vo` API types (unchanged, unused by chart components).

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- mobile-core, mobile-testing, mobile-components entries + `skills/mobile/SKILL.md`,
  `TESTING.md`, `COMPONENTS.md`

## Required Skills

- [x] mobile-core
- [x] mobile-testing
- [x] mobile-components

## Existing Implementation to Inspect

`src/components/chart/*.vue`, `src/types/chart.ts`, `src/composables/useTheme.ts`,
`src/assets/css/variables.scss`/`color.scss`, `pages/example/charts.vue`,
`pages/tabs/home.vue`, `tests/unit/HomeDashboard.spec.ts`, task 009 chart follow-up.

## Implementation Plan

1. Swap dependencies; register ECharts parts.
2. Build `ChartBase` + token theme; port each component's option.
3. Update callers, tests, docs; verify web.

## Checkpoints

- [x] Discovery + classification recorded
- [x] Implementation complete
- [x] Impacts reviewed (Platform/Native/API/Data)
- [x] Verification recorded

## Implementation Checklist

- [x] Dependencies swapped (`package.json`, `pnpm-lock.yaml`)
- [x] `ChartBase` + five components on ECharts
- [x] Token theme, light/dark switch
- [x] Callers, unit tests, docs

## Platform Impact Assessment

- [x] Android
- [x] iOS
- [x] Web
- [x] Shared code
- [ ] Not applicable

## Native Plugin Impact

- [x] No native plugin changes
- [ ] Existing plugin modified
- [ ] New plugin required
- [ ] Android configuration required
- [ ] iOS configuration required
- [ ] Native permissions affected
- [ ] Capacitor sync required
- [ ] Native compatibility verification required

Details: JS charting library only; no Capacitor plugin. Web assets change, so
the next native build needs the usual `cap sync` of web assets (not run).

## API Contract Impact

- [x] No API changes
- [ ] Request contract changed
- [ ] Response contract changed
- [ ] Authentication changed
- [ ] Backend changes required
- [ ] Backend contract unknown

## Local Data Impact

- [x] No local data changes
- [ ] Schema change
- [ ] Data migration required
- [ ] Existing data preservation required
- [ ] Logout cleanup affected
- [ ] Offline synchronization affected

## Testing and Verification

- Static (`vue-tsc --noEmit`): PASSED (baseline also clean)
- Unit/component: PASSED — 33/33 (`vitest run`); new `Charts.spec.ts` covers
  lazy init, hidden width-0 guard, dark re-theme, dispose, horizontal bar axis,
  radial track/legend. `HomeDashboard.spec.ts` unchanged and passing.
- Web build (`vite build`): PASSED. Chart chunk 640 kB / 217 kB gzip vs
  ApexCharts 960 kB + 509 kB / 412 kB gzip before.
- Web visual (dev server, 400×860): PASSED — all 19 charts on `/example/charts`
  render (19/19 SVGs after scrolling); Home analytics bar + 4 sparklines;
  dark-mode switch while Home is cached re-themes charts; no console errors or
  ECharts warnings.
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator test: NOT_RUN
- Physical device test: NOT_RUN

## Risks

- Visual differences from ApexCharts (ECharts layout, radial rings now polar
  bars with an HTML centre label/legend; donut/pie slice gaps).
- Removed props: `mode`, `dark`, `legendUseSeriesColors`, `showToolbar`,
  radial `gridPadding`/`fillType`/`hollowBg`/`trackBackgroud(Dark)` (use
  `trackColor`), pie `strokestyle`/`strokeWidth`; annotations are now typed
  `ChartAnnotation[]`. No other callers exist in `src/`.
- WebView rendering/performance on devices is unverified (NOT_RUN).

## Evidence

`src/components/chart/ChartBase.vue` › `tryInit`, `apply`; `src/libs/chartTheme.ts`
› `createChartThemeContext`, `buildChartTheme`; `src/libs/echarts.ts` › `use`.

## Completion Criteria

Implementation complete, applicable build/platform checks performed, impacts
reviewed, API dependencies resolved or excluded, checkpoints done,
limitations disclosed.

## Final Summary

ApexCharts replaced by tree-shaken ECharts 6.1 behind the same chart
components plus a new `ChartBase`; colours follow design tokens in both
themes. Web: typecheck, 33 unit tests, build and visual check PASSED.
Android/iOS: NOT_RUN. Status: DONE.
