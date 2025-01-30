<template>
  <ion-modal
    :is-open="show"
    :initial-breakpoint="initialBreakpoint"
    :breakpoints="breakpoints"
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
                <ion-button @click="onClose">
                  <ion-icon :icon="close" slot="icon-only"></ion-icon>
                </ion-button>
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
<script setup lang="ts">
/*
    <base-modal
      v-if="show"
     v-model="show"
      :title="t('base.chooseFromFile')"
      :initial-breakpoint="0.25"
      :breakpoints="[0, 0.25, 0.5,0.7,1]"
      @update:modelValue="(newVal : boolean) => show=newVal"
      @on-close="show = false"
    >
    </base-modal>
  */
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
} from '@ionic/vue';
import { close } from 'ionicons/icons';
import type { PropType } from 'vue';
import { defineAsyncComponent } from 'vue';
 defineProps({
  initialBreakpoint: {
    type: Number,
    default: 0.5,
  },
  breakpoints: {
    type: Array as PropType<number[]>,
    default: () => [0, 0.25, 0.5, 0.75, 1],
  },
  contentPadding: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['on-close', 'update:modelValue', 'on-present']);
const BaseToolbar = defineAsyncComponent(
  () => import('@/components/base/Toolbar.vue'),
);
const show = defineModel<boolean>();
// const show = computed({
//   get: () => props.modelValue,
//   set: (val) => emit('update:modelValue', val),
// });
const onClose = () => {
  emit('on-close');
  show.value = false;
};
const onShow=() => {
  emit('on-present');
}
</script>
<style scoped lang="scss"></style>
