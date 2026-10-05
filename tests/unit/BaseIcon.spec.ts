// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { Download, House } from '@lucide/vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseButton from '@/components/base/BaseButton.vue';

vi.mock('@ionic/vue', () => ({
  IonIcon: {
    name: 'IonIcon',
    props: ['icon'],
    template: '<span :data-icon="icon" />',
  },
  IonButton: { template: '<button><slot /></button>' },
}));

describe('BaseIcon', () => {
  it('renders Lucide components with size, themed colour and stroke width', async () => {
    const wrapper = mount(BaseIcon, {
      props: {
        name: House,
        iconSet: 'lucide',
        size: 32,
        color: 'primary',
        strokeWidth: 1.5,
      },
    });
    const svg = wrapper.get('svg');
    expect(svg.attributes('width')).toBe('32');
    expect(svg.attributes('height')).toBe('32');
    expect(svg.attributes('stroke-width')).toBe('1.5');
    expect(svg.attributes('stroke')).toBe('currentColor');
    expect(svg.attributes('fill')).toBe('none');
    expect(svg.classes()).toContain('text-primary');
    expect(svg.findAll('path').length).toBeGreaterThan(0);
    await wrapper.setProps({ name: Download, size: 24, strokeWidth: 3 });
    expect(wrapper.get('svg').attributes('width')).toBe('24');
    expect(wrapper.get('svg').attributes('stroke-width')).toBe('3');
    wrapper.unmount();
  });

  it('forwards accessibility attributes, styles and click events to Lucide SVG', async () => {
    const onClick = vi.fn();
    const wrapper = mount(BaseIcon, {
      props: { name: House, iconSet: 'lucide' },
      attrs: {
        'aria-label': 'Home',
        'aria-hidden': 'false',
        style: 'color: red',
        onClick,
      },
    });
    const svg = wrapper.get('svg');
    expect(svg.attributes('aria-label')).toBe('Home');
    expect(svg.attributes('aria-hidden')).toBe('false');
    expect(svg.attributes('stroke-width')).toBe('2');
    expect(svg.attributes('style')).toContain('color: red');
    expect(svg.classes()).not.toContain('text-undefined');
    await svg.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
    wrapper.unmount();
  });

  it('retains default Ionicons string names and colour/size behavior', () => {
    const wrapper = mount(BaseIcon, {
      props: { name: '<svg>ionic-icon</svg>', size: 28, color: 'danger' },
    });
    expect(wrapper.get('[data-icon]').attributes('data-icon')).toBe(
      '<svg>ionic-icon</svg>',
    );
    expect(wrapper.get('[data-icon]').attributes('style')).toContain(
      'font-size: 28px',
    );
    expect(wrapper.classes()).toContain('text-danger');
    wrapper.unmount();
  });

  it('retains Quasar multi-path and custom viewBox rendering', () => {
    const wrapper = mount(BaseIcon, {
      props: {
        name: 'M0 0h10@@fill:none;&&M1 1h5|0 0 32 32',
        iconSet: 'mdi',
        size: 30,
      },
    });
    expect(wrapper.get('svg').attributes('viewBox')).toBe('0 0 32 32');
    expect(wrapper.findAll('path').map((p) => p.attributes('d'))).toEqual([
      'M0 0h10',
      'M1 1h5',
    ]);
    expect(wrapper.findAll('path')[0].attributes('style')).toContain(
      'fill: none',
    );
    expect(wrapper.get('svg').attributes('width')).toBe('30');
    wrapper.unmount();
  });

  it('renders Lucide in both button icon positions', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Download',
        icon: { name: Download, iconSet: 'lucide' },
        iconRight: { name: House, iconSet: 'lucide' },
      },
    });
    expect(wrapper.get('button').text()).toBe('Download');
    expect(wrapper.get('svg[slot="start"]').exists()).toBe(true);
    expect(wrapper.get('svg[slot="end"]').exists()).toBe(true);
    wrapper.unmount();
  });
});
