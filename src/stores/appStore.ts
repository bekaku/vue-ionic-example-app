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
        appNavs,
        setAppNavs,
        currentLocale,
        setCurrentLocale,
        currentTheme,
        setCurrentTheme,
    }
});
