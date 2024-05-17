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
              <base-avatar
                slot="start"
                :src="authenStore.auth?.avatar?.thumbnail"
                fetch-image
                rounded
                :size="36"
              >
              </base-avatar>
              <ion-label>
                <h2 class="q-text-weight-bold">
                  {{ authenStore.loginedDisplay }}
                </h2>
                <p>
                  <ion-icon :icon="mailOutline"></ion-icon>
                  {{ authenStore.auth?.email }}
                </p>
              </ion-label>
              <ion-button
                slot="end"
                fill="clear"
                router-link="/settings/account-settings"
              >
                {{ t('base.edit') }}
              </ion-button>
            </ion-item>
          </template>
          <menu-item
            v-for="(item, index) in myMenuItems"
            :key="index"
            :item="item"
          >
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
          <ion-item
            button
            router-link="/settings/appearance"
            :detail="true"
            lines="none"
          >
            <ion-icon :icon="colorPaletteOutline" slot="start"></ion-icon>
            <ion-label> {{ t('base.appearance') }}</ion-label>
            <ion-text slot="end" class="text-muted text-caption">
              {{
                langugeAndThemeStore && langugeAndThemeStore.theme
                  ? t(`theme.${langugeAndThemeStore.theme}`)
                  : ''
              }}
            </ion-text>
          </ion-item>
          <ion-item
            button
            @click="WeeGoTo('/settings/languge')"
            :detail="true"
            lines="none"
          >
            <ion-icon :icon="globeOutline" slot="start"></ion-icon>
            <ion-label>
              {{ t('base.language') }}
              <p class="ion-text-capitalize">
                {{ t('base.translations') }}
              </p>
            </ion-label>
            <ion-text slot="end" class="text-muted text-caption">
              {{ currenLocale?.name }}
            </ion-text>
          </ion-item>

          <ion-item button :detail="false" lines="none">
            <ion-icon
              :icon="
                notification ? notificationsOutline : notificationsOffOutline
              "
              slot="start"
            ></ion-icon>
            <ion-toggle
              justify="space-between"
              v-model="notification"
              :aria-label="t('nav.notification')"
              :enable-on-off-labels="true"
            >
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
                {{ t('app.appVersion', [getConfigPublic('appVersion')]) }}
              </p>
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
import { useAuthenStore } from '@/stores/AuthenStore';
import { useLangugeAndThemeStore } from '@/stores/LangugeAndThemeStore';
import { usePermissionStore } from '@/stores/PermissionStore';
import { useTabStore } from '@/stores/TabStore';
import { TabsName } from '@/utils/Constant';
import { availableLocales } from '@/utils/LangUtil';
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
} from 'ionicons/icons';
import { computed, ref, watch } from 'vue';
const { myMenuItems } = useConstant();
const { userSubscribeFcm, onUpdateFcmSetting } = useNotification();
const { getConfigPublic } = useConfig();
const { fcmSetting, destroyCache } = useCache();
const { signOut } = useAuthen();
const tabStore = useTabStore();
tabStore.setCurrentTab(TabsName.OTHER);
const authenStore = useAuthenStore();
const permissionStore = usePermissionStore();
const langugeAndThemeStore = useLangugeAndThemeStore();
const { WeeGoTo, WeeToast } = useBase();
const { t } = useLang();
const notification = ref(fcmSetting.value);

const currenLocale = computed(() =>
  availableLocales.find((t) => t.iso == langugeAndThemeStore.locale),
);
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
      fcmSetting.value = true;
    } else {
      // userUnSubscribeFcm(authenStore.auth.id, true, false);
      onUpdateFcmSetting(false);
      fcmSetting.value = false;
    }
  }
});
</script>
<style scoped>
/* ion-content {
  --background: var(--v-color-white);
} */
</style>
