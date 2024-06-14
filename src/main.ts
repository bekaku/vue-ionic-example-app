import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import appAxios from './plugins/Axios';
import { AxiosKey } from './plugins/AxiosSymbols';
import i18n from './plugins/I18n';
import ionicConfig from './plugins/IonicConfig';
import router from './router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/display.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';

/* Theme variables */
import { useAuthenStore } from '@/stores/AuthenStore';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import './assets/css/color.scss';
import './assets/css/elevation.sass';
import './assets/css/positioning.sass';
import './assets/css/size.sass';
import './assets/css/typography.sass';
import './theme/variables.scss';

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
    const authenStore = useAuthenStore();
    try {
      const status = await authenStore.initialAuthData();
      if (status == 403) {
        await router.replace('/auth/login');
      }
    } catch {
    }
    app.mount('#app');
  });
}