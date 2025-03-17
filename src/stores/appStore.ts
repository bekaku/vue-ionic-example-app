import type { AppLocale, AppTheme, LabelValue } from '@/types/common';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('appStore', () => {
    const permissions = ref<string[]>([]);
    const appNavs = ref<LabelValue<any>[]>([]);
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

    const setAppNavs = (items: LabelValue<any>[]) => {
        appNavs.value = items;
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
        appNavs,
        setAppNavs,
        currentLocale,
        setCurrentLocale,
        currentTheme,
        setCurrentTheme
    }
});
