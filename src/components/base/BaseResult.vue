<script setup lang="ts">
/*
          <app-result
            text-color="text-muted"
            :description="t('commentNotFoundThisPost')"
            :show-icon="false"
          >
            <template #extra>
              <q-icon :icon="mdiAlert" :size="45" color="grey"></q-icon>
            </template>
          </app-result>
const AppResult = defineAsyncComponent(
  () => import('@/components/base/AppResult.vue')
);
*/
import { useTheme } from '@/composables/useTheme';
import type { IconSetType, IResult } from '@/types/common';
import { IonCol, IonGrid, IonRow } from '@ionic/vue';
import {
  mdiAlert,
  mdiAlertBoxOutline,
  mdiAllergy,
  mdiCheckBold,
  mdiInboxOutline,
  mdiInboxRemoveOutline,
  mdiInformationVariant,
  mdiPaperclip,
  mdiRobotConfused
} from '@quasar/extras/mdi-v7';
import { ref } from 'vue';
import BaseIcon from './BaseIcon.vue';
import BaseImage from './BaseImage.vue';
const {
  status = 'info',
  iconSize = 120,
  hideBg = false,
  showIcon = true,
  iconSet = 'ion',
  fullHeight = false
} = defineProps<{
  status?: IResult;
  title?: string;
  description?: string;
  icon?: string;
  iconSize?: number;
  iconSet?: IconSetType
  hideBg?: boolean;
  showIcon?: boolean;
  fullHeight?: boolean;
}>()
const { isDark } = useTheme();
const divSize = ref<string>(`${iconSize + 20}px`);
const getIcon = (): string => {
  let icon: string | undefined;

  // 404, 403, 500, 418, info, success, error, warning
  switch (status) {
    case '404':
      icon = mdiInboxRemoveOutline;
      break;
    case '403':
      icon = mdiAllergy;
      break;
    case '500':
    case '400':
      icon = mdiRobotConfused;
      break;
    case '418':
      icon = mdiPaperclip;
      break;
    case 'success':
      icon = mdiCheckBold;
      break;
    case 'warning':
      icon = mdiAlertBoxOutline;
      break;
    case 'error':
      icon = mdiAlert;
      break;
    case 'empty':
      icon = mdiInboxOutline;
      break;
    default:
      icon = mdiInformationVariant;
      break;
  }

  return icon;
};
const getIconColor = () => {
  let color = '';
  switch (status) {
    case '400':
    case '404':
    case '403':
    case '500':
    case '418':
      color = 'amber';
      break;
    case 'success':
      color = 'green';
      break;
    case 'warning':
      color = 'orange';
      break;
    case 'error':
      color = 'red';
      break;
    case 'empty':
      color = 'grey-5';
      break;
    default:
      color = 'blue';
      break;
  }
  return color;
};
const getBgColor = () => {
  let color = '';
  switch (status) {
    case '400':
    case '404':
    case '403':
    case '500':
    case '418':
      color = !isDark.value ? 'bg-amber-1' : 'bg-amber-2';
      break;
    case 'success':
      color = !isDark.value ? 'bg-green-1' : 'bg-green-2';
      break;
    case 'warning':
      color = !isDark.value ? 'bg-orange-1' : 'bg-orange-2';
      break;
    case 'error':
      color = !isDark.value ? 'bg-red-1' : 'bg-red-2';
      break;
    case 'empty':
      color = !isDark.value ? 'bg-grey-1' : 'bg-grey-8';
      break;
    default:
      color = !isDark.value ? 'bg-blue-1' : 'bg-blue-2';
      break;
  }
  return color;
};
</script>
<template>
  <ion-grid>
    <ion-row class="ion-align-items-center" :style="fullHeight ? 'height: 80vh; overflow-y: hidden' : undefined">
      <ion-col class="ion-text-center">
        <ion-row class="ion-justify-content-center">
          <div class="q-text-center icon-holder" :class="getBgColor()">
            <template v-if="status == '404'">
              <BaseImage src="/icons/sad_man.png" :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
                :image-bg="false" ratio="1" />
            </template>
            <BaseIcon v-else-if="showIcon" :size="iconSize" :color="!hideBg ? getIconColor() : undefined"
              :name="icon ? icon : getIcon()" :icon-set="icon ? iconSet : 'mdi'" />
          </div>
        </ion-row>
        <div class="q-mt-md q-text-center">
          <slot name="text">
            <div v-if="title" class="q-text-h5 q-text-weight-bold q-mb-sm"
              :class="status == 'empty' ? 'text-grey-6' : ''">
              {{ title }}
            </div>

            <div v-if="description" class="q-text-muted q-text-subtitle1">
              {{ description }}
            </div>
          </slot>
        </div>
        <div class="q-mt-sm">
          <slot name="extra" />
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
<style scoped>
ion-avatar {
  --border-radius: 4px;
}

.icon-holder {
  padding: 10px;
  height: v-bind(divSize);
  width: v-bind(divSize);
  border-radius: 100%;
}
</style>