<template>
  <template v-if="ionicIcon || iconSet == 'ion'">
    <ion-icon v-bind="$attrs" class="q-relative-position" style="top: 3px" :class="color" :icon="icon"
      :style="{ fontSize: size + 'px' }" />
  </template>
  <template v-else>
    <svg v-bind="$attrs" v-if="!ionicIcon" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size"
      fill="currentColor" :viewBox="getViewBox" :class="color">
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
import type { PropType } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import type { IconSetType } from '@/types/Common';
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  iconSet: {
    type: String as PropType<IconSetType>,
    default: 'bootstrap-icons',
  },
  ionicIcon: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 20,
  },
  color: {
    type: String,
    default: 'text-black', // #2196f3
  },
  additionalReplce: {
    type: String,
    default: '',
  },
});

const paths = ref<string[]>([])
onMounted(() => {
  setIcons();
})
const setIcons = () => {
  if (props.iconSet == 'bootstrap-icons') { // https://icons.getbootstrap.com/icons
    paths.value = props.icon.split('&&').map(t => t.replaceAll('|0 0 16 16', '').replaceAll('@@fill:currentColor;', '').replaceAll('fill-rule:evenodd;', ''))
  } else if (props.iconSet == 'line-awesome') { // https://icons8.com/line-awesome
    const laIcon = props.icon
      .replaceAll('|0 0 32 32', '')
      .replaceAll(props.additionalReplce, '');
    if (laIcon) {
      paths.value.push(laIcon);
    }
  } else if (props.iconSet == 'mdi') { // https://pictogrammers.com/library/mdi/
    paths.value.push(props.icon);
  } else if (props.iconSet == 'material-icons') { // https://fonts.google.com/icons
    const maIcon = props.icon
      .replaceAll('M0,0h24v24H0V0z@@fill:none;&&', '')
      .replaceAll(props.additionalReplce, '');
    if (maIcon) {
      paths.value.push(maIcon);
    }
  }
}
// const getIcon = computed(() => {
//   if (props.iconSet == 'bootstrap-icons') {

//     return props.icon
//       .replace('|0 0 16 16', '')
//       .replace('@@fill-rule:evenodd;', '')
//       .replace(props.additionalReplce, '');

//   } else if (props.iconSet == 'line-awesome') {
//     return props.icon
//       .replace('|0 0 32 32', '')
//       .replace(props.additionalReplce, '');
//   } else if (props.iconSet == 'material-icons') {//https://pictogrammers.com/library/mdi/
//     return props.icon
//       .replace('M0 0 H24 V24 H0 V0 z@@fill:none;&&', '')
//       .replace(props.additionalReplce, '');
//   } else {
//     return props.icon;
//   }
// });
const getViewBox = computed(() => {
  if (props.iconSet == 'bootstrap-icons') {
    return '0 0 16 16';
  } else if (props.iconSet == 'line-awesome') {
    return '0 0 32 32';
  } else if (props.iconSet == 'material-icons') {
    return '0 0 24 24';
  } else {
    return '0 0 16 16';
  }
});
</script>
