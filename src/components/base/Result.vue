<template>
  <ion-grid>
    <ion-row
      class="ion-align-items-center"
      :style="fullHeight ? 'height: 80vh; overflow-y: hidden' : undefined"
    >
      <ion-col class="ion-text-center">
        <slot name="icon">
          <img
            v-if="status == 'empty'"
            src="/icons/empty-box2.png"
            :style="`width: ${iconSize} ; height: auto`"
          />
          <img
            v-else-if="status == 'error'"
            :style="`width: ${iconSize} ; height: auto`"
            src="/icons/sad_man.png"
          />
          <img
            v-else-if="status == 'warning'"
            src="/icons/warning.png"
            :style="`width: ${iconSize} ; height: auto`"
          />
          <!-- <img
            v-else-if="status == 'success'"
            :style="`width: ${iconSize} ; height: auto`"
            src="/icons/ss/tick.png"
          /> -->
          <ion-icon
            v-else-if="status == 'success'"
            :name="checkmarkOutline"
          ></ion-icon>
          <img
            v-else-if="status == '404'"
            style="width: 100%; height: auto"
            src="/icons/sad_man.png"
          />
          <base-icon
            v-else-if="showIcon"
            :icon-set="iconSet"
            :icon="icon ? icon : getIcon()"
            :color="textColor ? textColor : getIconColor()"
            :size="iconSizeAlt"
          />
        </slot>
        <ion-row>
          <ion-col class="ion-text-center">
            <slot name="text">
              <div
                v-if="title"
                class="q-text-h6 q-text-weight-bold q-mb-sm"
                :class="status == 'empty' ? 'text-grey-6' : ''"
                v-html="title"
              ></div>
              <div
                v-if="description"
                class="text-grey-6"
                v-html="description"
              ></div>
              <template v-else-if="status == 'empty'">
                <div class="text-grey-6">
                  {{ t('error.dataNotfound') }}
                </div>
              </template>
            </slot>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <slot name="extra"> </slot>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import type { IResult, IconSetType } from '@/types/common';
import {
  handRightOutline,
  informationCircleOutline,
  warningOutline,
  checkmarkOutline,
} from 'ionicons/icons';
import { useLang } from '@/composables/useLang';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { IonGrid, IonRow, IonCol, IonIcon } from '@ionic/vue';
const props = defineProps({
  status: {
    type: String as PropType<IResult>,
    default: 'info',
  },
  title: {
    type: String,
    default: '', // OH OH! You're lost.
  },
  description: {
    type: String,
    default: '', // The page you are looking for does not exist.
  },
  icon: {
    type: String,
    default: '',
  },
  textColor: {
    type: String,
    default: '',
  },
  iconSet: {
    type: String as PropType<IconSetType>,
    default: 'ion',
  },
  iconSizeAlt: {
    type: Number,
    default: 64,
  },
  iconSize: {
    type: String,
    default: '120px',
  },
  hideBg: {
    type: Boolean,
    default: true,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  fullHeight: {
    type: Boolean,
    default: false,
  },
});
const { t } = useLang();
const getIcon = (): string => {
  let icon;
  // 404, 403, 500, 418, info, success, error, warning
  switch (props.status) {
    case '403':
      icon = handRightOutline;
      break;
    case '500':
      icon = warningOutline;
      break;
    case '418':
      icon = warningOutline;
      break;
    default:
      icon = informationCircleOutline;
      break;
  }
  return icon;
};
const getIconColor = () => {
  let color = '';
  switch (props.status) {
    case '404':
    case '403':
    case '500':
    case '418':
      color = 'text-amber';
      break;
    case 'success':
      color = 'text-green';
      break;
    case 'warning':
      color = 'text-orange';
      break;
    case 'error':
      color = 'text-red';
      break;
    case 'empty':
      color = 'text-blue-grey-2';
      break;
    default:
      color = 'text-blue';
      break;
  }
  return color;
};
const getBgColor = () => {
  let color = '';
  switch (props.status) {
    case '404':
    case '403':
    case '500':
    case '418':
      color = 'amber-1';
      break;
    case 'success':
      color = 'green-1';
      break;
    case 'warning':
      color = 'orange-1';
      break;
    case 'error':
      color = 'red-1';
      break;
    case 'empty':
      color = 'grey-1';
      break;
    default:
      color = 'blue-1';
      break;
  }
  return color;
};
</script>
