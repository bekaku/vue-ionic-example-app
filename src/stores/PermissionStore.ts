import { defineStore } from 'pinia';
import { ref } from 'vue';
export const usePermissionStore = defineStore('permissionStore', () => {
  const permissions = ref<string[]>([]);
  const setPermissions = (items: string[]) => {
    permissions.value = items;
  }
  const isHavePermission = (code: string) => {
    permissions.value.find((t: string) => t === code);
  }
  return {
    permissions,
    setPermissions,
    isHavePermission
  }
});
