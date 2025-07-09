<script setup lang="ts">
import type { AvatarProps } from '@/types/props';
import BaseAvatar from '../base/BaseAvatar.vue';
import { IonItem, IonLabel } from '@ionic/vue';
import type { ItemLines } from '@/types/common';
import BaseEllipsis from '../base/BaseEllipsis.vue';

const {
  showArrow = false,
  lines = 'none',
  nameBold = false,
  linesName = 0,
  linesDescription = 0,
} = defineProps<{
  avatar?: AvatarProps;
  avatarTop?: boolean;
  clickable?: boolean;
  showArrow?: boolean;
  description?: string | undefined;
  name?: string | undefined;
  nameBold?: boolean;
  to?: string;
  sideTop?: boolean;
  lines?: ItemLines;
  linesName?: number;
  linesDescription?: number;
}>();
</script>
<template>
  <IonItem
    :button="clickable || to != undefined"
    :router-link="to"
    :detail="showArrow"
    :lines
  >
    <div slot="start" :class="{ 'avatar-top': avatarTop }">
      <slot name="avatar">
        <BaseAvatar v-if="avatar" v-bind="avatar" />
      </slot>
    </div>
    <IonLabel>
      <slot name="name">
        <BaseEllipsis
          :lines="linesName"
          :class="{
            'q-text-weight-bold': nameBold,
            'q-text-weight-medium': !nameBold,
          }"
        >
          {{ name }}
        </BaseEllipsis>
      </slot>
      <slot name="description">
        <!-- <p> -->
        <BaseEllipsis :lines="linesDescription" class="text-muted q-text-caption">
          {{ description }}
        </BaseEllipsis>

        <!-- </p> -->
      </slot>
      <slot name="bottom" />
    </IonLabel>
    <div slot="end" :class="{ 'avatar-top': avatarTop }">
      <slot name="end" />
    </div>
  </IonItem>
</template>
