import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './plugins/I18n';
import appAxios from './plugins/Axios';
import { AxiosKey } from './plugins/AxiosSymbols';
import ionicConfig from './plugins/IonicConfig';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.scss';
import './assets/css/color.scss';
import './assets/css/typography.sass';
import './assets/css/size.sass';
import './assets/css/positioning.sass';
import './assets/css/elevation.sass';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { useAuthenStore } from '@/stores/AuthenStore';

startApp();

// async start function to enable waiting for refresh token call
async function startApp() {
  const app = createApp(App).use(i18n())
    .use(createPinia())
    .use(IonicVue, ionicConfig)
    .use(router);
  // app.config.globalProperties.$appAxios = { ...appAxios };
  app.provide(AxiosKey, appAxios);
  router.isReady().then(async () => {
    // attempt to auto refresh token before startup
    try {
      const authenStore = useAuthenStore();
      const response = await authenStore.refreshToken();
      if (response && response.fourceLogout) {
        await router.replace('/auth/login');
      } else {
        await authenStore.initialAuthData();
      }
    } catch {
    }
    app.mount('#app');
  });
}