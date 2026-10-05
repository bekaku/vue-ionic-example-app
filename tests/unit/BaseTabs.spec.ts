// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BaseTabs from '@/components/base/BaseTabs.vue';
vi.mock('@/composables/useRBAC', () => ({
  useRbac: () => ({
    hasPermission: (rbac: { condition?: string }) => rbac.condition !== 'not',
  }),
}));
vi.mock('@ionic/vue', () => ({
  IonTabs: { name: 'IonTabs', template: '<div><slot /></div>' },
  IonTab: { template: '<section><slot /></section>' },
  IonTabBar: { template: '<nav><slot /></nav>' },
  IonTabButton: {
    props: ['disabled'],
    template: '<button :disabled="disabled"><slot /></button>',
  },
  IonRouterOutlet: { template: '<main />' },
  IonLabel: { template: '<span><slot /></span>' },
}));
const items = [
  { label: 'Home', value: 'home' },
  { label: 'Videos', value: 'videos', disable: true },
];
describe('BaseTabs', () => {
  it('preserves disabled items and change events', async () => {
    const wrapper = mount(BaseTabs, {
      props: { items },
      global: { stubs: { BaseIcon: true } },
    });
    expect(wrapper.findAll('button')[1].attributes('disabled')).toBeDefined();
    const ionic = wrapper.getComponent({ name: 'IonTabs' });
    ionic.vm.$emit('ion-tabs-will-change', { tab: 'home' });
    ionic.vm.$emit('ion-tabs-did-change', { tab: 'home' });
    expect(wrapper.emitted('on-will-change')).toEqual([['home']]);
    expect(wrapper.emitted('on-change')).toEqual([['home']]);
    wrapper.unmount();
  });
  it('renders nothing for an empty list and filters denied items', () => {
    const empty = mount(BaseTabs, { props: { items: [] } });
    expect(empty.find('nav').exists()).toBe(false);
    empty.unmount();
    const wrapper = mount(BaseTabs, {
      props: {
        items: [
          ...items,
          { label: 'Denied', value: 'denied', rbac: { condition: 'not' } },
        ],
      },
    });
    expect(wrapper.findAll('button')).toHaveLength(2);
    wrapper.unmount();
  });
});
