// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ChartArea from '@/components/chart/ChartArea.vue';
import ChartBase from '@/components/chart/ChartBase.vue';
import ChartRadial from '@/components/chart/ChartRadial.vue';

const chart = vi.hoisted(() => ({
  setOption: vi.fn(),
  setTheme: vi.fn(),
  resize: vi.fn(),
  dispose: vi.fn(),
}));
const initChart = vi.hoisted(() => vi.fn((_el: HTMLElement, _theme: object) => chart));
const isDark = vi.hoisted(() => ({ value: undefined as unknown }));

vi.mock('@/libs/echarts', () => ({
  initChart,
  modifyAlpha: (value: string, alpha: number) => `${value}/${alpha}`,
}));
vi.mock('@/composables/useTheme', () => ({ useTheme: () => ({ isDark: isDark.value }) }));

let width = 320;
let intersect: (() => void) | undefined;
const lastOption = () => chart.setOption.mock.calls.at(-1)?.[0];

beforeEach(() => {
  vi.clearAllMocks();
  isDark.value = ref(false);
  width = 320;
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => width);
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
      intersect = () => callback([{ isIntersecting: true }]);
    }

    observe() {}
    disconnect() {}
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('ChartBase', () => {
  it('creates the chart only once it is visible, then applies the option', async () => {
    const option = vi.fn(() => ({ series: [{ type: 'bar' as const, data: [1] }] }));
    const wrapper = mount(ChartBase, { props: { option, height: '120' } });
    expect(initChart).not.toHaveBeenCalled();

    intersect?.();
    expect(initChart).toHaveBeenCalledTimes(1);
    expect((wrapper.element as HTMLElement).style.height).toBe('120px');
    // option receives the theme context; aria + animation are added
    expect(option.mock.calls[0]).toHaveLength(1);
    expect(lastOption()).toMatchObject({ aria: { enabled: true }, animation: true, series: [{ type: 'bar' }] });

    wrapper.unmount();
    expect(chart.dispose).toHaveBeenCalled();
  });

  it('waits while a cached page is hidden (width 0)', () => {
    width = 0;
    mount(ChartBase, { props: { option: {} } });
    intersect?.();
    expect(initChart).not.toHaveBeenCalled();
  });

  it('re-themes and re-applies the option when dark mode changes', async () => {
    mount(ChartBase, { props: { option: theme => ({ legend: { show: theme.dark } }) } });
    intersect?.();
    expect(lastOption()).toMatchObject({ legend: { show: false } });

    (isDark.value as { value: boolean }).value = true;
    await flushPromises();
    expect(chart.setTheme).toHaveBeenCalledTimes(1);
    expect(lastOption()).toMatchObject({ legend: { show: true } });
  });
});

describe('chart components', () => {
  it('ChartArea maps horizontal bars to a top-down category y axis', () => {
    mount(ChartArea, {
      props: {
        type: 'bar',
        horizontal: true,
        categories: ['Jan', 'Feb'],
        series: [{ name: 'Access', data: [3, 5] }],
        colors: ['#123456'],
      },
    });
    intersect?.();
    expect(lastOption()).toMatchObject({
      color: ['#123456'],
      xAxis: { type: 'value' },
      yAxis: { type: 'category', inverse: true, data: ['Jan', 'Feb'] },
      series: [{ type: 'bar', name: 'Access', data: [3, 5] }],
    });
  });

  it('ChartRadial draws a track ring under each value and an HTML legend', () => {
    const wrapper = mount(ChartRadial, {
      props: { series: [40, 70], categories: ['A', 'B'], colors: ['#111111', '#222222'], valUnit: '%' },
    });
    intersect?.();
    const [track, values] = lastOption().series;
    expect(track).toMatchObject({ silent: true, data: [100, 100] });
    expect(values).toMatchObject({ barGap: '-100%', data: [{ name: 'A', value: 40 }, { name: 'B', value: 70 }] });
    expect(wrapper.find('.chart-radial-center').text()).toContain('40%');
    expect(wrapper.findAll('.chart-radial-legend li')).toHaveLength(2);
  });
});
