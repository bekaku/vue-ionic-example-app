<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import { IonRow } from '@ionic/vue';

const {
  avatarSize = 32,
  limitUser = 5,
  showIcon = true,
  fetchImage = false,
  forceShowMore = false,
  overrapSize = '-10px',
  boderColor = 'white',
} = defineProps<{
  items: string[];
  limitUser?: number;
  avatarSize?: number;
  showIcon?: boolean;
  fetchImage?: boolean;
  forceShowMore?: boolean;
  boderColor?: string;
  overrapSize?: string;
}>();
const emit = defineEmits(['on-click']);
const onClick = (event: any) => {
  emit('on-click', event);
};
</script>

<template>
  <div v-bind="$attrs" class="avatar-group" @click="onClick($event)">
    <ion-row class="ion-align-items-center">
      <base-avatar
        v-for="(img, index) in items.slice(0, limitUser)"
        :key="`${index}-${img}`"
        :src="img"
        :size="avatarSize"
        class="avatar"
        :style="{ zIndex: limitUser + index }"
        :fetch-image="fetchImage"
      />
      <slot name="moreNumber">
        <div
          v-if="items.length > limitUser"
          class="extra"
          :style="{
            width: avatarSize + 'px',
            height: avatarSize + 'px',
            zIndex: items.length + 1,
          }"
        >
          <slot name="moreNumberNo"> +{{ items.length - limitUser }} </slot>
        </div>
      </slot>
    </ion-row>
  </div>
</template>

<style scoped lang="scss">
.avatar-group {
  display: flex;
  align-items: center;
}

.avatar {
  border-radius: 50%;
  border: 2px solid v-bind(boderColor);
  margin-left: v-bind(overrapSize);
  object-fit: cover;
}

.extra {
  border-radius: 50%;
  background-color: var(--color-zinc-200);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-left: v-bind(overrapSize);
}

body[color-theme='dark'] {
  .extra {
    background-color: var(--color-zinc-600);
    color: white;
  }
}
</style>
