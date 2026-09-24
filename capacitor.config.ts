import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

// Plain-HTTP API (cleartext / mixed content) is dev-only. Enable it when syncing a
// dev build that talks to an http:// backend:  CAP_ALLOW_HTTP=true npx cap sync
// Release builds must be synced without it.
const allowHttp = process.env.CAP_ALLOW_HTTP === 'true';

const config: CapacitorConfig = {
  appId: 'com.bekaku.mobile.ion',
  appName: 'Vue Ionic',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // androidScheme: 'http',
    cleartext: allowHttp
  },
  android: {
    allowMixedContent: allowHttp
  },
  plugins: {
    // CapacitorHttp: {
    //   enabled: true,
    // },
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