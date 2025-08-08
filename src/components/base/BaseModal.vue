<script setup lang="ts">
/*
    <base-modal
      v-if="show"
      v-model="show"
      :title="t('base.chooseFromFile')"
      :initial-breakpoint="0.25"
      :breakpoints="[0, 0.25, 0.5,0.7,1]"
      @on-close="show = false"
    >
    </base-modal>
  */
import BaseToolbar from '@/components/base/BaseToolbar.vue';
import { useLang } from '@/composables/useLang';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
} from '@ionic/vue';
import BaseButton from './BaseButton.vue';
import { useTemplateRef } from 'vue';
const {
  contentPadding = true,
  initialBreakpoint = 0.5,
  breakpoints = [0, 0.25, 0.5, 0.75, 1],
  autoClose = true,
  keepContentsMounted = false,
} = defineProps<{
  contentPadding?: boolean;
  autoClose?: boolean;
  initialBreakpoint?: number;
  breakpoints?: number[];
  title?: string;
  presentingElement?: any;
  keepContentsMounted?: boolean
}>();
const { t } = useLang();
const emit = defineEmits(['on-close', 'on-present']);
const modelValue = defineModel<boolean>();
const baseModalRef = useTemplateRef<any>('baseModalRef');
// const show = computed({
//   get: () => props.modelValue,
//   set: (val) => emit('update:modelValue', val),
// });
const onClose = () => {
  emit('on-close');
  if (autoClose) {
    modelValue.value = false;
    dismiss();
  }
};
const dismiss = () => {
  if (baseModalRef.value) {
    baseModalRef.value.$el.dismiss();
  }
};
const onShow = () => {
  emit('on-present');
};
defineExpose({
  dismiss
});
</script>
<template>
  <ion-modal
    ref="baseModalRef"
    :aria-hidden="true"
    :is-open="modelValue"
    :initial-breakpoint="initialBreakpoint"
    :breakpoints="breakpoints"
    :presenting-element="presentingElement"
    :keep-contents-mounted="keepContentsMounted"
    @will-dismiss="onClose"
    @ion-modal-did-dismiss="onClose"
    @did-present="onShow"
  >
    <slot name="header">
      <ion-header>
        <slot name="toolbar">
          <base-toolbar>
            <slot name="start"> </slot>
            <ion-title v-if="title">{{ title }}</ion-title>
            <slot name="end">
              <ion-buttons slot="end">
                <BaseButton clear :label="t('base.close')" @click="onClose" />
                <!-- <BaseButton clear :icon="close" :icon-size="24" @click="onClose" /> -->
              </ion-buttons>
            </slot>
          </base-toolbar>
        </slot>
      </ion-header>
    </slot>
    <ion-content>
      <div :class="{ 'ion-padding': contentPadding }">
        <slot />
      </div>
    </ion-content>
  </ion-modal>
</template>
