<script setup lang="ts" generic="T">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { useLang } from '@/composables/useLang';
import type { ItemLines, LabelValue } from '@/types/common';
import { IonItem, IonLabel, IonText } from '@ionic/vue';
const {
  item,
  lines = 'none',
  iconSize = 18,
  avatarSize = 42,
  detail = true,
} = defineProps<{
  item: LabelValue<T>;
  iconSize?: number;
  avatarSize?: number;
  lines?: ItemLines;
  detail?: boolean;
}>();
defineEmits<{
  'on-select': [item: LabelValue<T>];
}>();
const { t } = useLang();
</script>
<template>
  <ion-item
    v-if="item"
    v-bind="$attrs"
    class="app-menu-item"
    :button="item.button == true || item?.to != undefined"
    :detail="!detail ? false : item.button == true || item?.to != undefined"
    :lines="lines"
    :router-link="item?.to ? item.to : undefined"
    @click="$emit('on-select', item)"
  >
    <slot name="start">
      <BaseAvatar
        v-if="item.avatar"
        slot="start"
        v-bind="{ ...item.avatar, size: item.avatar?.size || avatarSize }"
      />
      <span
        v-if="item.icon"
        slot="start"
        class="app-menu-icon"
        :class="item.color ? `app-menu-icon-${item.color}` : undefined"
        aria-hidden="true"
      >
        <BaseIcon
          v-bind="{ ...item.icon, size: item.icon.size || iconSize }"
          style="top: 0"
        />
      </span>
    </slot>
    <slot name="label">
      <ion-label>
        <IonText :class="item.color ? 'text-' + item.color : undefined">
          {{ item?.translateLabel !== false ? t(`${item.label}`) : item.label }}
        </IonText>
        <p v-if="item?.description">
          {{
            item?.translateDescription == true
              ? t(`${item.description}`)
              : item.description
          }}
        </p>
      </ion-label>
    </slot>
    <slot name="end" v-bind="{ item }" />
  </ion-item>
</template>
