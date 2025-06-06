<script setup lang="ts" generic="T">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import type { AppColor, ItemLines, LabelValue } from '@/types/common';
import { IonItem, IonLabel, IonRow, IonText } from '@ionic/vue';

const {
  item,
  iconSize = 24,
  avatarSize = 32,
  detail = false,
  lines = 'none',
} = defineProps<{
  item: LabelValue<T>;
  iconSize?: number;
  avatarSize?: number;
  fetchImage?: boolean;
  detail?: boolean;
  clickable?: boolean;
  color?: AppColor | undefined;
  lines?: ItemLines;
}>();
const emit = defineEmits<{
  'on-select': [val: LabelValue<T> | undefined];
}>();
const onClick = () => {
  if (!item?.children || item.children.length == 0) {
    emit('on-select', item);
  }
};
</script>
<template>
  <ion-item
    v-if="item"
    :button="item?.value != undefined"
    :detail
    :lines="lines"
    :router-link="item?.to ? item.to : undefined"
    @click="onClick"
  >
    <IonRow slot="start">
      <slot name="start">
        <BaseAvatar
          v-if="item.avatar"
          v-bind="{ ...item.avatar, size: item.avatar?.size || avatarSize }"
        />
        <template v-else-if="item.icon">
           <BaseIcon
            v-bind="{ ...item.icon, size: item.icon.size || iconSize, color: item.color || color }"
          />
        </template>
      </slot>
    </IonRow>
    <slot name="label">
      <ion-label>
        <IonText
          :class="
            color ? 'text-' + color : item.color ? 'text-' + item.color : ''
          "
        >
          {{ item.label }}
        </IonText>
        <p v-if="item?.description">
          {{ item.description }}
        </p>
      </ion-label>
    </slot>
    <IonRow slot="end">
      <slot name="end" />
    </IonRow>
  </ion-item>
</template>
