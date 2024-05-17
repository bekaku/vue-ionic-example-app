import { StatusBar, Style } from '@capacitor/status-bar';
import { useBase } from '@/composables/UseBase';
import { useDevice } from '@/composables/UseDevice';
export const useTheme = () => {
  const { isDark } = useBase();
  const { isWeb } = useDevice();
  const setStatusBarColor = async (color: string, style: Style = Style.Light) => {
    console.log('setStatusBarColor', color, style);
    const web = await isWeb();
    if (web) {
      return;
    }
    await StatusBar.setStyle({
      style: style
    });
    await StatusBar.setBackgroundColor({
      color: color
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
  return {
    setStatusBarColor,
    setDefaultStatusBar,
    Style
  };
};
