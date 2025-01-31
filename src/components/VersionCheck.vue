<template>
  <ion-row v-if="showIcon" class="ion-justify-content-center">
    <ion-img src="/icon.png" style="width: 130px; height: auto"> </ion-img>
  </ion-row>
  <template v-if="item">
    <ion-row>
      <ion-col class="ion-text-center q-my-md">
        <div class="q-text-h6 q-text-weight-bold">
          {{ t('base.appVersionUpdateFound') }}
        </div>
        <div class="q-text-subtitle1 q-my-md">
          {{
            $t('base.appVersionChanged', {
              userVersion,
              storeVersion:
                platForm == 'IOS' ? item.appVersionIos : item.appVersionAndroid,
            })
          }}
        </div>
        <ion-button
          v-if="item.appVersionAndroid && item.appVersionIos"
          expand="block"
          class="text-white"
          :href="platForm == 'ANDROID' ? androidStoreLink : iOSStoreLink"
          target="_blank"
        >
          <ion-icon :icon="cloudDownloadOutline" slot="start"> </ion-icon>
          {{ t('base.clickHereFor', { for: t('base.updateApp') }) }}
        </ion-button>

        <ion-button
          v-if="platForm == 'ANDROID'"
          expand="block"
          fill="clear"
          :href="apkLink"
          target="_blank"
        >
          <ion-icon :icon="cloudDownloadOutline" slot="start"> </ion-icon>
          {{ t('helper.huaweiAppDownLoadHelp') }}
        </ion-button>

        <ion-button
          v-if="!item.fourceUpdate && showLater"
          expand="block"
          fill="clear"
          class="text-primary"
          @click="$emit('update-later')"
        >
          {{ t('base.updateLater') }}
        </ion-button>
      </ion-col>
      <ion-col v-if="showHelp" size="12">
        <p class="ion-text-justify text-muted">
          {{ t('base.versionUpdateHelp') }}
        </p>
      </ion-col>
    </ion-row>
  </template>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';
import type { AppVersionDto, PlatformType } from '@/types/models';
import { cloudDownloadOutline } from 'ionicons/icons';
import { useLang } from '@/composables/useLang';
import { useConfig } from '@/composables/useConfig';
import { IonRow, IonCol, IonButton, IonIcon, IonImg } from '@ionic/vue';
defineProps({
  userVersion: {
    type: String as PropType<string | undefined>,
  },
  item: {
    type: Object as PropType<AppVersionDto>,
    default: () => null,
  },
  platForm: {
    type: String as PropType<PlatformType>,
    default: 'IOS',
  },
  showHelp: {
    type: Boolean,
    default: true,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  showLater: {
    type: Boolean,
    default: true,
  },
});
defineEmits(['update-later']);
const { getEnv } = useConfig();
const androidStoreLink = ref<any>(getEnv('VITE_ANDROID_STORE'));
const iOSStoreLink = ref<any>(getEnv('VITE_IOS_STORE'));
const apkLink = ref<any>(getEnv('VITE_APK_STORE'));
const { t } = useLang();
</script>
