// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, expect, it, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import Home from '@/pages/tabs/home.vue';
import en from '@/locales/en';
import th from '@/locales/th';

vi.mock('@/stores/authenStore', () => ({
  useAuthenStore: () => ({ loginedDisplay: 'Demo' }),
}));
vi.mock('@/composables/useTheme', () => ({
  useTheme: () => ({ isDark: false }),
}));
vi.mock('@ionic/vue', () => ({ IonList: { template: '<div><slot /></div>' } }));

const stubs = {
  BasePage: {
    template:
      '<div><slot name="start" /><slot name="actions-end" /><slot /></div>',
  },
  BaseCard: { template: '<div><slot /></div>' },
  BaseButton: {
    props: ['to'],
    template: '<button :data-to="to"><slot /></button>',
  },
  BaseSegment: {
    props: ['items', 'modelValue'],
    emits: ['update:modelValue'],
    template:
      '<div><button v-for="item in items" :key="item.value" @click="$emit(\'update:modelValue\', item.value)">{{ item.label }}</button></div>',
  },
  BaseIcon: true,
  BaseImage: true,
  ChartArea: {
    props: ['series', 'categories'],
    template:
      '<div data-chart="area">{{ series.map(s => s.name).join(",") }}</div>',
  },
  ChartSparklines: { template: '<div data-chart="sparkline" />' },
  UserItem: {
    props: ['name'],
    template: '<div data-sale>{{ name }}<slot name="end" /></div>',
  },
};
const renderHome = (locale = 'en') =>
  mount(Home, {
    global: {
      plugins: [
        createPinia(),
        createI18n({ legacy: false, locale, messages: { en, th } }),
      ],
      stubs,
    },
  });

describe('Home dashboard', () => {
  it('mounts with demo disclosure and shows three recent sales in overview', () => {
    const wrapper = renderHome();
    expect(wrapper.text()).toContain('Demo data');
    expect(wrapper.text()).toContain('Welcome back, Demo');
    expect(wrapper.find('[data-testid="overview-panel"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-sale]')).toHaveLength(3);
    expect(wrapper.findAll('[data-chart]')).toHaveLength(0);
    wrapper.unmount();
  });

  it('switches to analytics and then full activity without retaining overview', async () => {
    const wrapper = renderHome();
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'View analytics')!
      .trigger('click');
    expect(wrapper.find('[data-testid="analytics-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="overview-panel"]').exists()).toBe(false);
    expect(wrapper.findAll('[data-chart="sparkline"]')).toHaveLength(4);
    expect(wrapper.find('[data-chart="area"]').text()).toContain(
      'Comments,Reactions,Shares',
    );
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Activity')!
      .trigger('click');
    expect(wrapper.findAll('[data-sale]')).toHaveLength(5);
    expect(wrapper.find('[data-testid="analytics-panel"]').exists()).toBe(
      false,
    );
    wrapper.unmount();
  });

  it('localizes Thai headings and links shortcuts to existing routes', () => {
    const wrapper = renderHome('th');
    expect(wrapper.text()).toContain('ภาพรวมของคุณ');
    expect(wrapper.text()).toContain('ข้อมูลตัวอย่าง');
    const links = wrapper
      .findAll('[data-to]')
      .map((button) => button.attributes('data-to'));
    expect(links).toEqual([
      '/settings/appearance',
      '/tabs/chat',
      '/example/charts',
      '/tabs/other',
    ]);
    wrapper.unmount();
  });
});
