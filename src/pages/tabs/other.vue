<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseMenuItem from '@/components/base/BaseMenuItem.vue';
import BaseMenuItems from '@/components/base/BaseMenuItems.vue';
import { useAuthen } from '@/composables/useAuthen';
import { useBase } from '@/composables/useBase';
import { useCache } from '@/composables/useCache';
import { useConfig } from '@/composables/useConfig';
import { useLang } from '@/composables/useLang';
import { useMenu } from '@/composables/useMenu';
import { useNotification } from '@/composables/useNotification';
import { useTheme } from '@/composables/useTheme';
import { CacheKey, TabsName } from '@/libs/constant';
import { additionalMenu } from '@/libs/navs';
import { useAuthenStore } from '@/stores/authenStore';
import { useTabStore } from '@/stores/tabStore';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
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
import { onMounted, ref, watch } from 'vue';

const { appNavs } = useMenu();
const { userSubscribeFcm, onUpdateFcmSetting } = useNotification();
const { getEnv } = useConfig();
const { destroyCache } = useCache();
const { signOut } = useAuthen();
const tabStore = useTabStore();
tabStore.setCurrentTab(TabsName.OTHER);
const authenStore = useAuthenStore();
const { appToast } = useBase();
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
  appToast({
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
<template>
  <BasePage :page-title="t('base.other')" fullscreen :show-back-link="false">
    <BaseMenuItems v-if="appNavs.length > 0" :items="appNavs">
      <template v-if="authenStore.auth" #top>
        <BaseMenuItem
          class="q-px-md q-pt-sm"
          :item="{
            avatar: { src: authenStore?.auth?.avatar?.thumbnail || '' },
          }"
        >
          <template #label>
            <ion-label>
              <h2 class="q-text-weight-bold">
                {{ authenStore.loginedDisplay }}
              </h2>
              <IonRow class="ion-align-items-center text-muted q-text-caption">
                <ion-icon :icon="mailOutline" class="q-mr-xs" />
                {{ authenStore.auth?.email }}
              </IonRow>
            </ion-label>
          </template>
          <template #end>
            <ion-button
              slot="end"
              fill="clear"
              router-link="/settings/account-settings"
            >
              {{ t('base.edit') }}
            </ion-button>
          </template>
        </BaseMenuItem>
      </template>
    </BaseMenuItems>
    <BaseMenuItems :items="additionalMenu" />

    <BaseCard :title="t('base.setting')">
      <ion-list>
        <BaseMenuItem
          :item="{
            label: 'base.appearance',
            to: '/settings/appearance',
            icon: { name: colorPaletteOutline, iconSet: 'ion' },
          }"
        >
          <template #end>
            <ion-text slot="end" class="text-muted text-caption">
              {{ t(`theme.${isDark ? 'darkTheme' : 'lightTheme'}`) }}
            </ion-text>
          </template>
        </BaseMenuItem>
        <BaseMenuItem
          :item="{
            label: 'base.language',
            description: t('base.translations'),
            to: '/settings/languge',
            icon: { name: globeOutline, iconSet: 'ion' },
          }"
        >
          <template #end>
            <ion-text slot="end" class="text-muted text-caption">
              {{ currenLocaleItem?.name }}
            </ion-text>
          </template>
        </BaseMenuItem>
        <ion-item button :detail="false" lines="none">
          <ion-icon
            slot="start"
            :icon="
              notification ? notificationsOutline : notificationsOffOutline
            "
          />
          <ion-toggle
            v-model="notification"
            justify="space-between"
            :aria-label="t('nav.notification')"
            :enable-on-off-labels="true"
          >
            {{ t('nav.notification') }}
          </ion-toggle>
        </ion-item>
        <BaseMenuItem
          :item="{
            label: 'base.deleteCache',
            icon: { name: trashOutline, iconSet: 'ion' },
            button: true,
          }"
          @on-select="onDeleteCache"
        />
        <BaseMenuItem
          :item="{
            label: 'base.about',
            description: t('app.appVersion', [userVersion]),
            translateDescription: false,
            to: '/about',
            icon: { name: informationCircleOutline, iconSet: 'ion' },
          }"
        />
        <BaseMenuItem
          :item="{
            label: 'base.logout',
            color: 'danger',
            button: true,
          }"
          @on-select="signOut"
        />
      </ion-list>
    </BaseCard>
  </BasePage>
</template>
<style scoped>
/* ion-content {
  --background: var(--v-color-white);
} */
</style>
