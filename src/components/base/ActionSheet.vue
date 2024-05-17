<template>
  <ion-action-sheet
    :is-open="modelValue"
    :header="header"
    :sub-header="subHeader"
    :buttons="buttons"
    @didDismiss="logResult($event)"
  ></ion-action-sheet>
</template>

<script setup lang="ts" generic="T">
import { IonActionSheet, ActionSheetButton } from '@ionic/vue';
defineProps<{
  header: string;
  subHeader?: string;
  buttons: ActionSheetButton<T>[];
}>();
const emit = defineEmits<{
  update: [value: T];
}>();
const modelValue = defineModel<boolean>();
const logResult = (ev: CustomEvent) => {
  if (ev.detail && ev.detail.data) {
    emit('update', ev.detail.data);
  }
  modelValue.value = false;
};
</script>

<style scoped></style>
