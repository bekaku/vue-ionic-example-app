// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BaseAvatar from '@/components/base/BaseAvatar.vue';

const fethCdnData = vi.hoisted(() => vi.fn(async (src: string) => `blob:mock/${src}`));

vi.mock('@/api/FileManagerService', () => ({ default: () => ({ fethCdnData }) }));
vi.mock('@ionic/vue', () => ({
  IonAvatar: { template: '<div><slot /><slot name="extra" /><slot name="badge" /></div>' },
  IonSkeletonText: { template: '<span />' },
}));

describe('BaseAvatar', () => {
  it('fetches once on mount, then once more only when src changes', async () => {
    URL.revokeObjectURL = vi.fn();
    fethCdnData.mockClear();

    const wrapper = mount(BaseAvatar, { props: { src: '/a.jpg', fetchImage: true } });
    await flushPromises();

    expect(fethCdnData).toHaveBeenCalledTimes(1);
    // fetched blob is what the <img> shows (not overwritten by the plain src)
    expect(wrapper.find('img').attributes('src')).toBe('blob:mock//a.jpg');

    await wrapper.setProps({ src: '/b.jpg' });
    await flushPromises();

    expect(fethCdnData).toHaveBeenCalledTimes(2);
    expect(fethCdnData).toHaveBeenLastCalledWith('/b.jpg');
    expect(wrapper.find('img').attributes('src')).toBe('blob:mock//b.jpg');
    // previous blob released when src changed
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock//a.jpg');
  });
});
