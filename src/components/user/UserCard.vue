<script setup lang="ts">
import type { AvatarProps } from '@/types/props';
import { IonCardContent } from '@ionic/vue';
import { biPatchCheckFill } from '@quasar/extras/bootstrap-icons';
import BaseAvatar from '../base/BaseAvatar.vue';
import BaseCard from '../base/BaseCard.vue';
import BaseIcon from '../base/BaseIcon.vue';
const { height = '200px', avatarTop = '75px' } = defineProps<{
  height?: string
  coverImage?: string
  avatar?: AvatarProps
  avatarTop?: string
  name?: string
  description?: string
  clear?: boolean
}>()
const emit = defineEmits<{
  'on-cover-tab': [event: any]
  'on-avatar-tab': [event: any]
}>()
const onViewCover = (event: any) => {
  emit('on-cover-tab', event)
}
const onViewAvatar = (event: any) => {
  emit('on-avatar-tab', event)
}
</script>
<template>
  <BaseCard :clear>
    <div
      style="z-index: 999"
      :style="`height: ${height};
              background-image:linear-gradient(to bottom, rgba(245, 246, 252, 0.1), rgba(0, 0, 0, 0.25)), url(${
                coverImage || '/cover.jpg'
              });
              background-position: center;
              -webkit-background-size: cover;
              -moz-background-size: cover;
              -o-background-size: cover;
              background-size: cover;`"
      @click="onViewCover"
    >
      <slot name="coverExtra" />
    </div>
    <slot name="avatar">
      <div
        v-if="avatar != undefined"
        class="text-white q-absolute q-centered-horizontal"
        :style="{ top: avatarTop, zIndex: 99 }"
      >
        <BaseAvatar v-bind="avatar" @click="onViewAvatar" />
        <slot name="avatarExtra" />
      </div>
    </slot>
    <slot name="description">
      <IonCardContent>
        <div class="ion-text-center">
          <h2 class="q-text-weight-bold">{{ name }} <BaseIcon :name="biPatchCheckFill" icon-set="bootstrap-icons" color="primary" /> </h2>
          <p class="text-muted">{{ description }}</p>
        </div>
      </IonCardContent>
    </slot>
  </BaseCard>
</template>
