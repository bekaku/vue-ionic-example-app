<script setup lang="ts">
import type { IconSetType } from '@/types/common';
import { IonIcon } from '@ionic/vue';
import { close } from 'ionicons/icons';
import { computed, ref } from 'vue';
import BaseIcon from './BaseIcon.vue';
const {
  message,
  type = 'is-light',
  dense = false,
  radius = true,
  closeable = true,
  iconSet = 'ion',
  secondary = false,
} = defineProps<{
  message?: string
  type?: | 'is-primary'
    | 'is-link'
    | 'is-info'
    | 'is-success'
    | 'is-warning'
    | 'is-danger'
    | 'is-light'
  icon?: string
  iconSet?: IconSetType
  dense?: boolean
  radius?: boolean
  closeable?: boolean
  secondary?: boolean;
}>();
const show = ref(true);
const iconColor = computed(() => {
  if (secondary) {
    if (type === 'is-primary') {
      return 'primary';
    } else if (type === 'is-link') {
      return 'info';
    } else if (type === 'is-info') {
      return 'info';
    } else if (type === 'is-success') {
      return 'success';
    } else if (type === 'is-warning') {
      return 'black';
    } else if (type === 'is-danger') {
      return 'danger';
    } else if (type === 'is-light') {
      return 'black';
    }
  }
  if (type === 'is-warning' || type === 'is-light') {
    return 'black'
  }
  return 'white'
})
</script>
<template>
  <div v-show="show" class="v-notification" :class="`${type} ${secondary ? 'is-light' : ''}`" :style="{
    padding: dense ? '5px' : '1rem 2.25rem 1rem 1.25rem',
    borderRadius: radius ? '5px' : '',
  }">
    <a v-if="closeable" class="delete" @click="show = !show">
      <ion-icon :icon="close"></ion-icon>
    </a>
    <div class="padding">
      <strong>
        <!-- <ion-icon v-if="icon" :icon="icon" style="margin-right: 5px" /> -->
        <BaseIcon v-if="icon" :name="icon" :icon-set="iconSet" :color="iconColor" style="margin-right: 5px" />
      </strong>
      <slot>
        {{ message ? message : '' }}
      </slot>

      <div>
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.v-notification {
  background-color: whitesmoke;
  /* border-radius: 4px; */
  /* padding: 1rem 2.25rem 1rem 1.25rem; */
  /* padding: 1.25rem 2.5rem 1.25rem 1.5rem; */
  position: relative;
  /* margin: 5px 0; */
}

.v-notification a:not(.button):not(.dropdown-item) {
  color: currentColor;
  text-decoration: underline;
}

.v-notification strong {
  color: currentColor;
}

.v-notification code,
.v-notification pre {
  background: white;
}

.v-notification pre code {
  background: transparent;
}

.v-notification>.delete {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
}

.v-notification .title,
.v-notification .subtitle,
.v-notification .content {
  color: currentColor;
}

.v-notification.is-white {
  background-color: white;
  color: #0a0a0a !important;
}

.v-notification.is-black {
  background-color: #0a0a0a;
  color: white !important;
}

.v-notification.is-light {
  background-color: whitesmoke;
  color: rgba(0, 0, 0, 0.7) !important;
}

.v-notification.is-dark {
  background-color: #363636;
  color: #fff !important;
}

.v-notification.is-primary {
  background-color: var(--ion-color-primary);
  color: #fff !important;
}

.v-notification.is-primary.is-light {
  background-color: var(--color-primary-100);
  color: var(--ion-color-primary) !important;
}

.v-notification.is-link {
  background-color: #3273dc;
  color: #fff !important;
}

.v-notification.is-link.is-light {
  background-color: #eef3fc;
  color: #2160c4 !important;
}

.v-notification.is-info {
  background-color: #3298dc;
  color: #fff !important;
}

.v-notification.is-info.is-light {
  background-color: #eef6fc;
  color: #1d72aa !important;
}

.v-notification.is-success {
  background-color: #48c774;
  color: #fff !important;
}

.v-notification.is-success.is-light {
  background-color: #effaf3;
  color: #257942 !important;
}

.v-notification.is-warning {
  background-color: #ffdd57;
  color: rgba(0, 0, 0, 0.7) !important;
}

.v-notification.is-warning.is-light {
  background-color: #fffbeb;
  color: #947600 !important;
}

.v-notification.is-danger {
  background-color: #f14668;
  color: #fff !important;
}

.v-notification.is-danger.is-light {
  background-color: #feecf0;
  color: #cc0f35 !important;
}
</style>
