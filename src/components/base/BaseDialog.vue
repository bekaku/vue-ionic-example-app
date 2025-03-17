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
  IonTitle,
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { computed, useTemplateRef } from 'vue';
import { useDevice } from '@/composables/useDevice';

const {
  autoClose = true,
  headerNoBorder = false,
  dark = false,
  contentPadding = true,
  iconColor = 'primary',
  iconSet = 'ion',
} = defineProps<{
  autoClose?: boolean;
  headerNoBorder?: boolean;
  dark?: boolean;
  contentPadding?: boolean;
  icon?: string;
  iconColor?: AppColor;
  iconSet?: IconSetType;
  title?: string;
  isTablet?: boolean;
  presentingElement?: any;
}>();
const { isAppPlatfrom } = useDevice();
const emit = defineEmits(['on-close', 'on-before-hide']);
const modelValue = defineModel<boolean>({ default: false });
const baseDialogRef = useTemplateRef<any>('baseDialogRef');
const fullMode = computed(() => isAppPlatfrom('tablet') || isAppPlatfrom('desktop'))
const onClose = () => {
  emit('on-close');
  if (autoClose) {
    modelValue.value = false;
    dismiss();
  }
};
const dismiss = () => {
  if (baseDialogRef.value) {
    baseDialogRef.value.$el.dismiss();
  }
};
defineExpose({
  dismiss,
});
</script>
<template>
  <ion-modal ref="baseDialogRef" :is-open="modelValue" :class="{ 'full-modal': fullMode }"
    :presenting-element="presentingElement" :aria-hidden="true" :show-backdrop="false" @will-dismiss="onClose">
    <ion-header :class="{ 'ion-no-border': headerNoBorder || dark }">
      <slot name="toolbar">
        <base-toolbar :class="{ dark }">
          <slot name="start">
            <ion-buttons slot="start">
              <ion-button :color="dark ? 'light' : undefined" @click="onClose">
                <ion-icon slot="icon-only" :class="dark ? 'light' : 'text-black'" :icon="arrowBack" />
              </ion-button>
            </ion-buttons>
            <slot name="actions-start" />
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
      <slot name="headerBottom" />
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
