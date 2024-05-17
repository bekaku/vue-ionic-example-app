import { defineStore } from 'pinia';
export const usePermissionStore = defineStore('permissionStore', {
  state: () => {
    return {
      permissions: [] as string[],
      frontendPermissions: [] as string[]
    };
  },
  getters: {},
  actions: {
    setPermissions(items: string[]) {
      this.permissions = items;
    },
    isHavePermission(code: string) {
      return this.permissions.find((t: string) => t === code);
    },
  }
});
