<script setup lang="ts">
import type { AvatarProps } from '@/types/props';
import BaseAvatar from '../base/BaseAvatar.vue';
import { IonItem, IonLabel } from '@ionic/vue';
import type { ItemLines } from '@/types/common';

const { showArrow = false } = defineProps<{
  avatar?: AvatarProps;
  avatarTop?: boolean;
  clickable?: boolean;
  showArrow?: boolean;
  description?: string | undefined;
  name?: string | undefined;
  to?: string;
  sideTop?: boolean;
  lines?: ItemLines;
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
        <h3 class="q-text-weight-medium">
          {{ name }}
        </h3>
      </slot>
      <slot name="description">
        <p>
          {{ description }}
        </p>
      </slot>
      <slot name="bottom" />
    </IonLabel>
    <div slot="end" :class="{ 'avatar-top': avatarTop }">
      <slot name="end" />
    </div>
  </IonItem>
</template>
