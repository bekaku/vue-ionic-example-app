<template>
  <div
    class="v-notification"
    :class="type"
    v-show="show"
    :style="{
      padding: dense ? '5px' : '1rem 2.25rem 1rem 1.25rem',
      borderRadius: radius ? '5px' : '',
    }"
  >
    <a v-if="closeable" class="delete" @click="show = !show">
      <ion-icon :icon="close"></ion-icon>
    </a>
    <div class="padding">
      <strong>
        <ion-icon v-if="icon" :icon="icon" style="margin-right: 5px" />
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
<script setup lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';
import { close } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
defineProps({
  message: {
    type: String,
    required: false,
  },
  type: {
    type: String as PropType<
      | 'is-primary'
      | 'is-link'
      | 'is-info'
      | 'is-success'
      | 'is-warning'
      | 'is-danger'
      | 'is-light'
    >,
    default: 'is-light', // is-primary, is-link, is-info, is-success, is-warning, is-danger can add with is-light
  },
  icon: {
    type: String as PropType<string | undefined>,
    default: undefined,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  radius: {
    type: Boolean,
    default: false,
  },
  closeable: {
    type: Boolean,
    default: true,
  },
});
const show = ref(true);
</script>
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

.v-notification > .delete {
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
  color: #0a0a0a;
}

.v-notification.is-black {
  background-color: #0a0a0a;
  color: white;
}

.v-notification.is-light {
  background-color: whitesmoke;
  color: rgba(0, 0, 0, 0.7);
}

.v-notification.is-dark {
  background-color: #363636;
  color: #fff;
}

.v-notification.is-primary {
  background-color: #00d1b2;
  color: #fff;
}

.v-notification.is-primary.is-light {
  background-color: #ebfffc;
  color: #00947e;
}

.v-notification.is-link {
  background-color: #3273dc;
  color: #fff;
}

.v-notification.is-link.is-light {
  background-color: #eef3fc;
  color: #2160c4;
}

.v-notification.is-info {
  background-color: #3298dc;
  color: #fff;
}

.v-notification.is-info.is-light {
  background-color: #eef6fc;
  color: #1d72aa;
}

.v-notification.is-success {
  background-color: #48c774;
  color: #fff;
}

.v-notification.is-success.is-light {
  background-color: #effaf3;
  color: #257942;
}

.v-notification.is-warning {
  background-color: #ffdd57;
  color: rgba(0, 0, 0, 0.7);
}

.v-notification.is-warning.is-light {
  background-color: #fffbeb;
  color: #947600;
}

.v-notification.is-danger {
  background-color: #f14668;
  color: #fff;
}

.v-notification.is-danger.is-light {
  background-color: #feecf0;
  color: #cc0f35;
}
</style>
