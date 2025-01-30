<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-title> {{ t('base.other') }}</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-card class="no-shadow">
        <ion-list>
          <template v-if="authenStore.auth">
            <ion-item>
              <base-avatar slot="start" v-if="authenStore?.auth?.avatar?.thumbnail" rounded
              :src="authenStore.auth.avatar.thumbnail" :size="42"/>
              <ion-label>
                <h2 class="q-text-weight-bold">
                  {{ authenStore.loginedDisplay }}
                </h2>
                <p>
                  <ion-icon :icon="mailOutline"></ion-icon>
                  {{ authenStore.auth?.email }}
                </p>
              </ion-label>
              <ion-button slot="end" fill="clear" router-link="/settings/account-settings">
                {{ t('base.edit') }}
              </ion-button>
            </ion-item>
          </template>
          <menu-item v-for="(item, index) in myMenuItems" :key="index" :item="item">
          </menu-item>
        </ion-list>
      </ion-card>

      <ion-card class="no-shadow">
        <ion-list>
          <ion-item :detail="false" lines="inset">
            <ion-label>
              <p>{{ t('base.setting') }}</p>
            </ion-label>
          </ion-item>
          <ion-item button router-link="/settings/appearance" :detail="true" lines="none">
            <ion-icon :icon="colorPaletteOutline" slot="start"></ion-icon>
            <ion-label> {{ t('base.appearance') }}</ion-label>
            <ion-text slot="end" class="text-muted text-caption">
              {{ t(`theme.${isDark ? 'darkTheme' : 'lightTheme'}`)
              }}
            </ion-text>
          </ion-item>
          <ion-item button @click="WeeGoTo('/settings/languge')" :detail="true" lines="none">
            <ion-icon :icon="globeOutline" slot="start"></ion-icon>
            <ion-label>
              {{ t('base.language') }}
              <p class="ion-text-capitalize">
                {{ t('base.translations') }}
              </p>
            </ion-label>
            <ion-text slot="end" class="text-muted text-caption">
              {{ currenLocaleItem?.name }}
            </ion-text>
          </ion-item>

          <ion-item button :detail="false" lines="none">
            <ion-icon :icon="notification ? notificationsOutline : notificationsOffOutline
              " slot="start"></ion-icon>
            <ion-toggle justify="space-between" v-model="notification" :aria-label="t('nav.notification')"
              :enable-on-off-labels="true">
              {{ t('nav.notification') }}
            </ion-toggle>
          </ion-item>
          <ion-item button @click="onDeleteCache" :detail="true" lines="none">
            <ion-icon :icon="trashOutline" slot="start"></ion-icon>
            <ion-label> {{ t('base.deleteCache') }}</ion-label>
          </ion-item>
          <ion-item button router-link="/about" :detail="true" lines="none">
            <ion-icon :icon="informationCircleOutline" slot="start"></ion-icon>
            <ion-label>
              {{ t('base.about') }}
              <p class="text-muted">
                {{ t('app.appVersion', [userVersion]) }}
              </p>
            </ion-label>
          </ion-item>
          <ion-item button router-link="/test" :detail="true" lines="none">
            <ion-icon :icon="bugOutline" slot="start"></ion-icon>
            <ion-label>
              Test page
            </ion-label>
          </ion-item>
          <ion-item lines="none" @click="signOut" :detail="true">
            <ion-label>
              <ion-text color="danger">
                {{ t('base.logout') }}
              </ion-text>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseToolbar from '@/components/base/Toolbar.vue';
import { useAuthen } from '@/composables/UseAuthen';
import { useBase } from '@/composables/UseBase';
import { useCache } from '@/composables/UseCache';
import { useConfig } from '@/composables/UseConfig';
import { useConstant } from '@/composables/UseConstant';
import { useLang } from '@/composables/UseLang';
import { useNotification } from '@/composables/UseNotification';
import { useTheme } from '@/composables/UseTheme';
import { useAuthenStore } from '@/stores/AuthenStore';
import { useTabStore } from '@/stores/TabStore';
import { CacheKey, TabsName } from '@/utils/Constant';
import { loadStorage, saveStorage } from '@/utils/StorageUtil';
import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToggle,
} from '@ionic/vue';
import {
  colorPaletteOutline,
  globeOutline,
  informationCircleOutline,
  mailOutline,
  notificationsOffOutline,
  notificationsOutline,
  trashOutline,
  bugOutline
} from 'ionicons/icons';
import { onMounted, ref, watch } from 'vue';
const { myMenuItems } = useConstant();
const { userSubscribeFcm, onUpdateFcmSetting } = useNotification();
const { getEnv } = useConfig();
const { destroyCache } = useCache();
const { signOut } = useAuthen();
const tabStore = useTabStore();
tabStore.setCurrentTab(TabsName.OTHER);
const authenStore = useAuthenStore();
const { WeeGoTo, WeeToast } = useBase();
const { t, currenLocaleItem } = useLang();
const { isDark } = useTheme();
const userVersion = ref(getEnv<string>('VITE_APP_VERSION'));
const notification = ref(true);

onMounted(async () => {
  const fcmSetting = await loadStorage<boolean>(CacheKey.FCM_SETTING, false);
  notification.value = fcmSetting != null ? fcmSetting : true;
});
const onDeleteCache = () => {
  destroyCache();
  WeeToast({
    text: t('success.success'),
  });
};
watch(notification, async (newVal) => {
  if (authenStore.auth && authenStore.auth.id) {
    if (newVal) {
      userSubscribeFcm(true, authenStore.auth.id);
      onUpdateFcmSetting(true);
      await saveStorage(CacheKey.FCM_SETTING, true);
    } else {
      // userUnSubscribeFcm(authenStore.auth.id, true, false);
      onUpdateFcmSetting(false);
      await saveStorage(CacheKey.FCM_SETTING, false);
    }
  }
});
</script>
<style scoped>
/* ion-content {
  --background: var(--v-color-white);
} */
</style>
