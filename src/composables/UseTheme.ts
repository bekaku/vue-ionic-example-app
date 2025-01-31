import { useDevice } from '@/composables/useDevice';
import { useAppStore } from '@/stores/appStore';
import type { AppTheme } from '@/types/common';
import { ThemeKey } from '@/libs/constant';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import { StatusBar, Style } from '@capacitor/status-bar';
import { isPlatform } from '@ionic/vue';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
export const availableThemes: {
    key: AppTheme
    text: string
    icon: string
}[] = [
        // { key: 'synapse', text: 'theme.synapse', icon: brushOutline },
        { key: 'light', text: 'theme.lightTheme', icon: sunnyOutline },
        { key: 'dark', text: 'theme.darkTheme', icon: moonOutline }
        // { key: 'system', text: 'theme.systemTheme', icon: phonePortraitOutline },
        // { key: 'realtime', text: 'theme.realtimeTheme', icon: alarmOutline }
    ];

export const useTheme = () => {
    const { isWeb } = useDevice();
    const appStore = useAppStore();
    const { currentTheme } = storeToRefs(appStore)
    const { setCurrentTheme } = appStore

    const isDark = computed(() => currentTheme.value === 'dark')
    const setStatusBarColor = async (color: string, style: Style = Style.Light) => {
        const web = await isWeb();
        if (web) {
            return;
        }
        await StatusBar.setStyle({
            style
        });
        await StatusBar.setBackgroundColor({
            color
        });
        return new Promise((resolve) => {
            resolve(true);
        });
    }
    const setDefaultStatusBar = async () => {
        const web = await isWeb();
        if (web) {
            return;
        }
        // StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setStyle({
            style: !isDark.value ? Style.Light : Style.Dark
        });
        await StatusBar.setBackgroundColor({
            color: !isDark.value ? '#ffffff' : '#1c1c1c'
        });
        // await StatusBar.setBackgroundColor({
        //   color: !isdark ? '#ffffff' : '#000000'
        // });
    };

    const initTheme = async () => {
        const theme = await loadStorage<string>(ThemeKey) as AppTheme;
        if (theme) {
            await onSetTheme(theme);
        } else {
            await onSetTheme('light');
        }
    };
    const onSetTheme = async (t: AppTheme) => {
        setCurrentTheme(t);
        await saveStorage(ThemeKey, t);
        setDarkMode(t);
        return new Promise((resolve) => {
            resolve(true);
        });
    };
    const setDarkMode = (t: AppTheme) => {
        const isdark = t === 'dark';
        // document.body.setAttribute('color-theme', isdark ? 'dark' : 'light');
        document.body.setAttribute('color-theme', t);
        // add to appSetting store
        if (isPlatform('hybrid')) {
            setStatusBar(isdark);
        }
    };
    const setStatusBar = async (isdark: boolean) => {
        // StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setStyle({
            style: !isdark ? Style.Light : Style.Dark
        });
        await StatusBar.setBackgroundColor({
            // color: !isdark ? '#ffffff' : '#1c1c1c'
            color: !isdark ? '#ffffff' : '#242b34'
        });
    };
    return {
        setStatusBarColor,
        setDefaultStatusBar,
        Style,
        initTheme,
        onSetTheme,
        currentTheme,
        isDark
    };
};
