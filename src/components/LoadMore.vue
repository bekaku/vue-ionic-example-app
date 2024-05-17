<template>
  <ion-row>
    <ion-col>
      <template v-if="button">
        <ion-button
          @click="$emit('on-next-page')"
          :color="!color ? (isDark ? 'dark' : 'light') : ''"
          :class="color ? color : ''"
          size="small"
          expand="block"
          mode="ios"
          :fill="fill"
        >
          <ion-spinner v-if="loading" color="primary" name="dots"></ion-spinner>
          <template v-else>
            {{ label }}
          </template>
          <ion-icon
            v-if="!loading"
            :icon="chevronDownOutline"
            slot="end"
          ></ion-icon>
        </ion-button>
      </template>
      <template v-else>
        <ion-spinner v-if="loading" color="primary" name="dots"></ion-spinner>
        <base-link
          v-else
          @click="$emit('on-next-page')"
          :label="label"
          :color="color"
        ></base-link>
      </template>
    </ion-col>
  </ion-row>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { chevronDownOutline } from 'ionicons/icons';
import { useBase } from '@/composables/UseBase';
import BaseLink from '@/components/base/Link.vue';
import { IonRow, IonCol, IonButton, IonIcon, IonSpinner } from '@ionic/vue';
defineProps({
  fristLoaded: {
    type: Boolean,
    default: false,
  },
  isInfiniteDisabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  button: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: undefined,
  },
  fill: {
    type: String as PropType<'default' | 'solid' | 'clear' | 'outline'>,
    default: 'solid',
  },
});
const { isDark } = useBase();
defineEmits(['on-next-page']);
</script>
