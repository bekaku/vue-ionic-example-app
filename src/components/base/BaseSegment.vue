<script setup lang="ts" generic="T">
import type { IonicColor, LabelValue } from '@/types/common';
import { IonBadge, IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';
import BaseIcon from './BaseIcon.vue';
import { useRbac } from '@/composables/useRbac';
import { computed } from 'vue';

const {
  scrollable = true,
  layout = 'icon-top',
  items = [],
  filterAcl = false,
} = defineProps<{
  items?: LabelValue<any>[];
  height?: number;
  scrollable?: boolean;
  color?: IonicColor;
  badgeColor?: IonicColor;
  filterAcl?: boolean;
  layout?:
    | 'icon-bottom'
    | 'icon-end'
    | 'icon-hide'
    | 'icon-start'
    | 'icon-top'
    | 'label-hide'
    | undefined;
}>();

const emit = defineEmits(['on-change']);
const modelValue = defineModel<string>();
const { hasPermission } = useRbac();
const canShow = (item: LabelValue<any>) => {
  return item.rbac == undefined || hasPermission(item.rbac);
};
const getItems = computed<LabelValue<any>[]>(() => {
  return filterAcl ? items.filter(t => canShow(t) === true) : items;
});
const segmentChanged = (even: any) => {
  if (even.detail) {
    modelValue.value = even.detail.value;
    emit('on-change', even.detail.value);
  }
};
</script>

<template>
  <ion-segment
    v-if="getItems != undefined && getItems.length > 0"
    :value="modelValue"
    :color="color"
    :scrollable="scrollable"
    @ion-change="segmentChanged($event)"
  >
    <ion-segment-button
      v-for="(item, index) in getItems"
      :key="`segment-${index}-${item.value}`"
      :value="item.value"
      :layout="layout"
    >
      <slot name="description" v-bind="{ item, index }">
        <ion-badge v-if="item.description">
          {{ item.description }}
        </ion-badge>
      </slot>
      <ion-label>{{ item.label }}</ion-label>
      <!-- <ion-icon v-if="item.icon" :icon="item.icon" /> -->
      <BaseIcon v-if="item.icon" v-bind="item.icon" />
    </ion-segment-button>
  </ion-segment>
</template>

<style scoped lang="scss"></style>
