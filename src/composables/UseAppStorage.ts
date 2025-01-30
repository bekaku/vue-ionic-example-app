import { loadStorage, saveStorage } from '@/utils/StorageUtil';
import type { UnwrapRef } from 'vue';
import { onBeforeMount, ref, watch } from 'vue';

export const useAppStorage = <T>(key: string, defaults: T, isJson: boolean = true) => {
  const storage = ref<T>(defaults);
  const initialed = ref(false);
  onBeforeMount(async () => {
    const data = await loadStorage<T>(key, isJson) as UnwrapRef<T>;
    if (data) {
      storage.value = data;
    } else {
      storage.value = defaults as UnwrapRef<T>;
      await setVal(defaults);
    }
    initialed.value = true;
  });
  // onMounted(async () => {
  //
  // });
  const setVal = async (val: any) => {
    await saveStorage(key, val, isJson);
  };
  // watchEffect(() => {
  //   console.log('key', key, storage.value);
  // });
  // watch(storage, async (newVal, oldVal) => {
  //   if (initialed.value) {
  //     await setVal(newVal);
  //   }
  // });
  watch(() => storage.value,
    async (currentValue) => {
      if (initialed.value) {
        await setVal(currentValue);
      }
    },
    { deep: true }
  );
  return { storage };
};
