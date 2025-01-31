<template>
  <ion-toolbar v-bind="$attrs">
    <slot />
  </ion-toolbar>
  <!-- <ion-toolbar :class="{ 'q-pl-xs q-pr-xs': !isIosPlatform }">
    <slot />
  </ion-toolbar> -->
</template>
<script setup lang="ts">
import { IonToolbar } from '@ionic/vue';
import { useDevice } from '@/composables/useDevice';
import { onMounted, ref } from 'vue';
const { setPadding = true } = defineProps<{
  setPadding?: boolean
}>()
const { isIOS } = useDevice();
const isIosPlatform = ref(false);
onMounted(async () => {
  isIosPlatform.value = await isIOS();
});
</script>
<style scoped lang="scss">
// .ios {
//   ion-toolbar.ios-ion-toolbar {
//     padding-top: 48px !important;
//   }
// }

// .md {
// ion-toolbar {
//   --padding-start: 5px !important;
//   --padding-end: 5px !important;
// }
// }
</style>
