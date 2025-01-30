<template>
  <ion-modal
    :is-open="modelValue"
    @will-dismiss="onClose"
    :class="{ 'full-modal': isTablet }"
  >
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
                <base-icon
                  v-if="icon"
                  slot="start"
                  :ionic-icon="ionicIcon"
                  :icon="icon"
                  :color="iconColor"
                  :size="24"
                />
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
<script setup lang="ts">
/*
    <base-dialog
    v-if="showMarkdownHelp"
    :model-value="showMarkdownHelp"
    @on-close="showMarkdownHelp = false"
    content-padding
    :title="t('base.photo')"
  >
    showMarkdownHelp

  </base-dialog>
 */
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
import { defineAsyncComponent } from 'vue';

defineProps({
  dialog: {
    type: Boolean,
    default: false
  },
  headerNoBorder: {
    type: Boolean,
    default: false
  },
  persistent: {
    type: Boolean,
    default: true
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  maximized: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  contentPadding: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: 'text-primary'
  },
  ionicIcon: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  dialogStyle: {
    type: String,
    default: 'max-width: 480px'
  },
  dialogClass: {
    type: String,
    default: ''
  },
  transitionShow: {
    type: String,
    default: 'slide-up'
  },
  transitionHide: {
    type: String,
    default: 'slide-down'
  },
  isTablet: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['on-close']);
const BaseIcon = defineAsyncComponent(
  () => import('@/components/base/Icon.vue')
);
const BaseToolbar = defineAsyncComponent(
  () => import('@/components/base/Toolbar.vue')
);
const modelValue = defineModel<boolean>();
// const show = computed({
//   get: () => props.modelValue,
//   set: (val) => emit('update:modelValue', val),
// });

const onClose = () => {
  emit('on-close');
  modelValue.value = false;
};
</script>
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
