<script setup lang="ts">
/*
    <base-dialog
    v-if="showMarkdownHelp"
    v-model="showMarkdownHelp"
    @on-close="showMarkdownHelp = false"
    content-padding
    :title="t('base.photo')"
  >
    showMarkdownHelp

  </base-dialog>
 */
import BaseToolbar from '@/components/base/BaseToolbar.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import type { AppColor, IconSetType } from '@/types/common';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';

const {
  autoClose = true,
  headerNoBorder = false,
  dark = false,
  contentPadding = true,
  iconColor = 'primary',
  iconSet = 'ion',
  isTablet = false,
} = defineProps<{
  autoClose?: boolean
  headerNoBorder?: boolean
  dark?: boolean
  contentPadding?: boolean
  icon?: string
  iconColor?: AppColor
  iconSet?: IconSetType
  title?: string
  isTablet?: boolean
}>();

const emit = defineEmits(['on-close', 'on-before-hide']);
const modelValue = defineModel<boolean>({ default: false });
const onClose = () => {
  emit('on-close');
  if (autoClose) {
    modelValue.value = false;
  }
};
</script>
<template>
  <ion-modal :is-open="modelValue" @will-dismiss="onClose" :class="{ 'full-modal': isTablet }">
    <ion-header :class="{ 'ion-no-border': headerNoBorder || dark }">
      <slot name="toolbar">
        <base-toolbar :class="{ dark }">
          <slot name="start">
            <ion-buttons slot="start">
              <ion-button @click="onClose">
                <ion-icon slot="icon-only" class="text-black" :icon="arrowBack" />
              </ion-button>
            </ion-buttons>
            <slot name="actions-start"></slot>
          </slot>
          <slot name="title">
            <ion-title v-if="title">{{ title }}</ion-title>
          </slot>
          <div slot="end">
            <slot name="end">
              <slot name="avatar">
                <base-icon v-if="icon" slot="start" :icon-set="iconSet" :icon="icon" :color="iconColor" :size="24" />
              </slot>
            </slot>
          </div>
        </base-toolbar>
      </slot>
      <slot name="secondToolbar">
      </slot>
    </ion-header>
    <ion-content :class="{ dark }">
      <div :class="{ 'ion-padding': contentPadding }">
        <slot />
      </div>
    </ion-content>
  </ion-modal>
</template>
<style scoped lang="scss">
// ion-content {
//   --background: var(--app-bg-color);
// }
ion-content.dark {
  --background: var(--app-bg-color-theme-dark);
  --color: var(--v-main-text-body-theme-dark);
}

ion-toolbar.dark {
  --background: var(--second-bg-color-theme-dark);
  --color: var(--v-main-text-body-theme-dark);
}

ion-modal.full-modal {
  --height: -webkit-fill-available;
  --height: 90vh;
  --max-width: 90vw;
  --min-width: 90vw;
}
</style>
