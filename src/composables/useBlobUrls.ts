import { onBeforeUnmount } from 'vue';

// Tracks blob: object URLs a component creates (e.g. from FileManagerService.fethCdnData)
// and revokes them on unmount, otherwise every fetched image/PDF stays in memory.
export const useBlobUrls = () => {
  const urls = new Set<string>();

  const track = <T>(url: T): T => {
    if (typeof url === 'string' && url.startsWith('blob:')) {
      urls.add(url);
    }
    return url;
  };

  const revokeAll = () => {
    urls.forEach(url => URL.revokeObjectURL(url));
    urls.clear();
  };

  onBeforeUnmount(revokeAll);

  return { track, revokeAll };
};
