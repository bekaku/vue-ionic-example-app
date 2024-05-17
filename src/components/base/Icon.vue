<template>
  <template v-if="ionicIcon || iconSet == 'ion'">
    <ion-icon
      v-bind="$attrs"
      class="q-relative-position"
      style="top: 3px"
      :class="color"
      :icon="icon"
      :style="{ fontSize: size + 'px' }"
    />
  </template>
  <template v-else>
    <svg
      v-bind="$attrs"
      v-if="!ionicIcon"
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      fill="currentColor"
      :viewBox="getViewBox"
      :class="color"
    >
      <path :d="getIcon" />
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
import { computed, PropType } from 'vue';
import { IonIcon } from '@ionic/vue';
import { IconSetType } from '@/types/Common';
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
    default: 'text-primary', //#2196f3
  },
  additionalReplce: {
    type: String,
    default: '',
  },
});
const getIcon = computed(() => {
  if (props.iconSet == 'bootstrap-icons') {
    return props.icon
      .replace('|0 0 16 16', '')
      .replace('@@fill-rule:evenodd;', '')
      .replace(props.additionalReplce, '');
  } else if (props.iconSet == 'line-awesome') {
    return props.icon
      .replace('|0 0 32 32', '')
      .replace(props.additionalReplce, '');
  } else if (props.iconSet == 'material-icons') {
    return props.icon
      .replace('M0 0 H24 V24 H0 V0 z@@fill:none;&&', '')
      .replace(props.additionalReplce, '');
  } else {
    return props.icon;
  }
});
const getViewBox = computed(() => {
  if (props.iconSet == 'bootstrap-icons') {
    return '0 0 16 16';
  } else if (props.iconSet == 'line-awesome') {
    return '0 0 32 32';
  } else if (props.iconSet == 'material-icons') {
    return '0 0 24 24';
  } else {
    return props.icon;
  }
});
</script>
