// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BaseInputMoney from '@/components/base/BaseInputMoney.vue';

vi.mock('@ionic/vue', () => ({
  IonItem: {
    name: 'IonItem',
    props: ['lines'],
    template: '<div class="ion-item"><slot name="before" /><slot /><slot name="after" /></div>',
  },
  IonLabel: {
    name: 'IonLabel',
    template: '<div class="ion-label"><slot /></div>',
  },
}));

describe('BaseInputMoney', () => {
  it('renders stacked label and formatted money value', () => {
    const wrapper = mount(BaseInputMoney, {
      props: {
        modelValue: 5000,
        label: 'Money format',
      },
    });

    const label = wrapper.find('.base-input-money-label');
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Money format');

    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.element.value).toBe('5,000');
    wrapper.unmount();
  });

  it('renders required asterisk when required is true', () => {
    const wrapper = mount(BaseInputMoney, {
      props: {
        modelValue: 100,
        label: 'Price',
        required: true,
      },
    });

    const requiredSpan = wrapper.find('.text-danger');
    expect(requiredSpan.exists()).toBe(true);
    expect(requiredSpan.text()).toBe('*');
    wrapper.unmount();
  });

  it('applies bordered class by default and respects bordered=false', async () => {
    const wrapper = mount(BaseInputMoney, {
      props: { modelValue: 1000 },
    });
    expect(wrapper.find('.base-input-money').classes()).toContain('bordered');

    await wrapper.setProps({ bordered: false });
    expect(wrapper.find('.base-input-money').classes()).not.toContain('bordered');
    wrapper.unmount();
  });

  it('renders helperText when provided', () => {
    const wrapper = mount(BaseInputMoney, {
      props: {
        modelValue: 1000,
        helperText: 'Enter amount in THB',
      },
    });

    expect(wrapper.text()).toContain('Enter amount in THB');
    wrapper.unmount();
  });

  it('supports custom config with prefix or suffix', () => {
    const wrapper = mount(BaseInputMoney, {
      props: {
        modelValue: 2500,
        config: {
          prefix: '$ ',
          precision: 2,
        },
      },
    });

    const input = wrapper.find('input');
    expect(input.element.value).toContain('$');
    wrapper.unmount();
  });
});
