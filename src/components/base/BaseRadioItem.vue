<script setup lang="ts" generic="T">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import type { IonicColor, ItemLines, LabelValue } from '@/types/common';
import { IonItem, IonRadio, IonRadioGroup } from '@ionic/vue';
interface CheckboxDetail {
  checked: boolean;
  value?: any;
}
const {
  justify = 'space-between',
  lines = 'none',
  color = 'primary',
} = defineProps<{
  items: LabelValue<T>[] | any;
  label?: string;
  justify?: 'start' | 'end' | 'space-between';
  lines?: ItemLines;
  color?: IonicColor;
  value?: any;
}>();
const modelValue = defineModel<T>();
const emit = defineEmits<{
  'on-change': [event: CheckboxDetail];
}>();
</script>
<template>
  <IonRadioGroup v-bind="$attrs" v-model="modelValue" :lines>
    <IonItem v-for="(item, i) in items" :key="`${i}-${item.value}`" :lines>
      <BaseAvatar
        v-if="item.avatar"
        slot="start"
        v-bind="{ ...item.avatar, size: item.avatar?.size || 24 }"
      />
      <BaseIcon
        v-else-if="item.icon"
        slot="start"
        v-bind="{ ...item.icon, color: item.color || color }"
      />
      <ion-radio :value="item.value" :justify :color>
        {{ item.label }}
      </ion-radio>
    </IonItem>
  </IonRadioGroup>
</template>
<style lang="scss" scoped>
ion-radio::part(container) {
  width: 24px;
  height: 24px;

  border-radius: 100%;
  border: 2px solid #ddd;
}

ion-radio::part(mark) {
  background: none;
  transition: none;
  transform: none;
  border-radius: 0;
}

ion-radio.radio-checked::part(container) {
  background: var(--ion-color-primary);
  border-color: transparent;
}

ion-radio.radio-checked::part(mark) {
  width: 6px;
  height: 10px;
  border-width: 0px 2px 2px 0px;
  border-style: solid;
  border-color: #fff;
  transform: rotate(45deg);
}
</style>
