<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import type { ButtonProps } from '@/types/props';
import { IonButton } from '@ionic/vue';
import BaseRbac from './BaseRbac.vue';
const {
  clear = false,
  disabled = false,
  type = 'button',
  iconOnly = false,
  round = false,
  outline = false,
  full = false,
  rbac,
} = defineProps<ButtonProps>();
</script>
<template>
  <BaseRbac :rbac>
    <ion-button
      v-bind="$attrs"
      :color
      :disabled
      :fill="clear ? 'clear' : outline ? 'outline' : 'solid'"
      :expand="full ? 'block' : undefined"
      :href
      :target
      :type
      :shape="round ? 'round' : undefined"
      :size
      :router-link="to || undefined"
    >
      <slot>
        <template v-if="avatar">
          <base-avatar slot="start" class="q-mr-xs" v-bind="avatar" />
        </template>
        <template v-else-if="!iconOnly && icon">
          <base-icon
            slot="start"
            class="q-pb-xs"
            :class="{ 'q-mr-xs': icon.iconSet != 'ion' }"
            v-bind="icon"
          />
        </template>
        <template v-if="iconOnly && icon">
          <base-icon
            slot="icon-only"
            class="q-pb-xs"
            v-bind="icon"
          />
        </template>

        <template v-if="label">{{ label }}</template>
        <template v-if="iconRight">
          <base-icon slot="end" class="q-pb-xs" v-bind="iconRight" />
        </template>
      </slot>
    </ion-button>
  </BaseRbac>
</template>
