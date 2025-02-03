<template>
  <template v-if="iconSet == 'ion'">
    <ion-icon v-bind="$attrs" class="q-relative-position" style="top: 3px" :class="color" :icon="icon"
      :style="{ fontSize: size + 'px' }" />
  </template>
  <template v-else>
    <svg v-bind="$attrs" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" fill="currentColor"
      :viewBox="getViewBox" :class="color">
      <template v-if="paths.length > 0">
        <path v-for="(ic, index) in paths" :key="`${index}-${ic}`" :d="ic" />
      </template>
    </svg>
  </template>
</template>
<script setup lang="ts">
/*
  <base-icon
                    :icon="gift"
                    icon-set="ion"
                    color="text-primary"
                    :size="24"
                  />
   */
import type { IconSetType } from '@/types/common';
import { IonIcon } from '@ionic/vue';
import { computed, onMounted, ref } from 'vue';
const {
  additionalReplce = '',
  icon,
  iconSet = 'ion',
  size = 20,
  color = 'text-black',
} = defineProps<{
  icon: string
  iconSet?: IconSetType
  size?: number
  color?: string
  additionalReplce?: string
}>();
const paths = ref<string[]>([])
onMounted(() => {
  setIcons();
})
const setIcons = () => {
  if (iconSet == 'bootstrap-icons') { // https://icons.getbootstrap.com/icons
    paths.value = icon.split('&&').map(t => t.replaceAll('|0 0 16 16', '').replaceAll('@@fill:currentColor;', '').replaceAll('fill-rule:evenodd;', ''))
  } else if (iconSet == 'line-awesome') { // https://icons8.com/line-awesome
    const laIcon = icon
      .replaceAll('|0 0 32 32', '')
      .replaceAll(additionalReplce, '');
    if (laIcon) {
      paths.value.push(laIcon);
    }
  } else if (iconSet == 'mdi') { // https://pictogrammers.com/library/mdi/
    paths.value.push(icon);
  } else if (iconSet == 'material-icons') { // https://fonts.google.com/icons
    const maIcon = icon
      .replaceAll('M0,0h24v24H0V0z@@fill:none;&&', '')
      .replaceAll(additionalReplce, '');
    if (maIcon) {
      paths.value.push(maIcon);
    }
  }
}
// const getIcon = computed(() => {
//   if (iconSet == 'bootstrap-icons') {

//     return icon
//       .replace('|0 0 16 16', '')
//       .replace('@@fill-rule:evenodd;', '')
//       .replace(additionalReplce, '');

//   } else if (iconSet == 'line-awesome') {
//     return icon
//       .replace('|0 0 32 32', '')
//       .replace(additionalReplce, '');
//   } else if (iconSet == 'material-icons') {//https://pictogrammers.com/library/mdi/
//     return icon
//       .replace('M0 0 H24 V24 H0 V0 z@@fill:none;&&', '')
//       .replace(additionalReplce, '');
//   } else {
//     return icon;
//   }
// });
const getViewBox = computed(() => {
  if (iconSet == 'bootstrap-icons') {
    return '0 0 16 16';
  } else if (iconSet == 'line-awesome') {
    return '0 0 32 32';
  } else if (iconSet == 'material-icons') {
    return '0 0 24 24';
  } else {
    return '0 0 16 16';
  }
});
</script>
