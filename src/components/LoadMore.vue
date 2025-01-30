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
        <base-link-text
          v-else
          @click="$emit('on-next-page')"
          :label="label"
          :color="color"
        ></base-link-text>
      </template>
    </ion-col>
  </ion-row>
</template>
<script setup lang="ts">
import BaseLinkText from '@/components/base/BaseLinkText.vue';
import { useTheme } from '@/composables/UseTheme';
import { IonButton, IonCol, IonIcon, IonRow, IonSpinner } from '@ionic/vue';
import { chevronDownOutline } from 'ionicons/icons';
import type { PropType } from 'vue';
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
defineEmits(['on-next-page']);
const { isDark } = useTheme();
</script>
