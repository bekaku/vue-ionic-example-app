import type { NotificationCount } from '@/types/models';
import { NotifyKey } from '@/libs/constant';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notificationStore', () => {
  const notify = ref<NotificationCount>({
    lastestId: 0,
    totalNotify: 199
  });
  const setNotify = (n: NotificationCount) => {
    notify.value.totalNotify = n.totalNotify;
    notify.value.lastestId = n.lastestId;
  };
  const setLastNotify = async (n: number) => {
    const cacheNotifyCount = await loadStorage<NotificationCount>(NotifyKey);
    if (cacheNotifyCount) {
      cacheNotifyCount.lastestId = n;
    } else {
      await saveStorage(NotifyKey, { lastestId: 0, totalNotify: 0, totalNewMessage: 0 });
    }
  };
  return {
    notify,
    setNotify,
    setLastNotify
  };
});
