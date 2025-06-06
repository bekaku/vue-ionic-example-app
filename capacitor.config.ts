import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.bekaku.mobile.ion',
  appName: 'Vue Ionic',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // androidScheme: 'http',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    Keyboard: {
      resize: KeyboardResize.Body,
      style: KeyboardStyle.Default,
      resizeOnFullScreen: true
    },
    PushNotifications: {
      // presentationOptions: ['badge', 'sound', 'alert']
      presentationOptions: []
    },
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;