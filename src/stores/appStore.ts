import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AppLocale, AppTheme, IMenu } from '@/types/Common';

export const useAppStore = defineStore('appStore', () => {
    const permissions = ref<string[]>([]);
    const drawers = ref<IMenu[]>([]);
    const leftDrawerOpen = ref<boolean>(true);
    const currentLocale = ref<AppLocale>('th');
    const currentTheme = ref<AppTheme>('light');

    const setPermissions = (items: string[]) => {
        permissions.value = items;
    }
    const isPermited = (code: string): boolean => {
        return permissions.value.find((t: string) => t === code) != undefined;
    }
    const isHavePermission = (codes: string[] | undefined): boolean => {
        if (codes == undefined || codes.length == 0) {
            return true;
        }
        let isHave = false;
        for (const code of codes) {
            if (!isHave) {
                isHave = isPermited(code);
                if (isHave) {
                    break;
                }
            }
        }
        return isHave
    }
    const isHavePermissionLazy = (codes: string[] | undefined): Promise<boolean> => {
        return new Promise((resolve) => {
            const isHave = isHavePermission(codes)
            resolve(isHave);
        })
    }

    const setDrawers = (items: IMenu[]) => {
        drawers.value = items;
    }
    const setLeftDrawer = (open: boolean) => {
        leftDrawerOpen.value = open;
    }
    const setCurrentLocale = (l: AppLocale) => {
        currentLocale.value = l;
    }
    const setCurrentTheme = (t: AppTheme) => {
        currentTheme.value = t;
    }
    return {
        permissions,
        setPermissions,
        isHavePermission,
        isHavePermissionLazy,
        drawers,
        setDrawers,
        leftDrawerOpen,
        setLeftDrawer,
        currentLocale,
        setCurrentLocale,
        currentTheme,
        setCurrentTheme
    }
});
