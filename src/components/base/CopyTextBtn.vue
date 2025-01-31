<template>
  <ion-button
    @click="onCopy($event)"
    size="small"
    fill="clear"
    class="ion-no-margin ion-no-padding"
  >
    <ion-icon
      slot="icon-only"
      class="text-muted icon-size"
      :icon="copyOutline"
    />
  </ion-button>
</template>
<script setup lang="ts">
import { useBase } from '@/composables/useBase';
import { copyOutline } from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/vue';
const props = defineProps({
  modelValue: {
    type: String,
  },
});
const { writeToClipboard } = useBase();
const onCopy = (event: any) => {
  if (!props.modelValue) {
    return;
  }
  writeToClipboard(props.modelValue);
  if (event) {
    event.stopImmediatePropagation();
  }
};
</script>
<style scoped>
ion-button {
  --padding-top: 0px;
  /* --padding-bottom: 10px; */
  --padding-end: 0px;
  --padding-start: 0px;
}
.icon-size {
  font-size: 1.3em;
}
</style>
