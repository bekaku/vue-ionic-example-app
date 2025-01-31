<template>
  <ion-card :style="`max-width:${maxWidth}`">
    <div
      :style="`height: ${height}px;
            background: url(${
              coverImage ? coverImage : ''
            }), linear-gradient(to right, #000, #000);
            background-position: center;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;`"
    >
      <slot name="coverExtra"> </slot>
    </div>
    <div class="text-white q-absolute-top">
      <base-image
        :src="avatarImage"
        class="profile-avata"
        ratio="4/3"
        :style="{
          width: avatarSize + 'px',
          height: avatarSize + 'px',
          top: avatarTop + 'px',
          left: '35px',
          zIndex: 99,
        }"
      >
      </base-image>

      <slot name="avatarExtra"> </slot>
    </div>

    <ion-card-content>
      <slot name="description">
        <ion-item :detail="false" lines="none" :style="descriptionStyle">
          <ion-label class="ion-text-capitalize">
            <h2 class="q-text-weight-bold">{{ name }}</h2>
            <h3 v-if="description">{{ description }}</h3>
            <h3 v-if="description2" class="text-muted">{{ description2 }}</h3>
          </ion-label>
        </ion-item>
      </slot>

      <ion-button
        v-if="showChatButton"
        mode="ios"
        expand="block"
        class="text-white"
      >
        <ion-icon :icon="chatboxEllipsesOutline" slot="start" />
        {{ t('message') }}
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>
<script setup lang="ts">
import BaseImage from '@/components/base/Image.vue';
import { useLang } from '@/composables/useLang';
import { useTheme } from '@/composables/useTheme';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import { chatboxEllipsesOutline } from 'ionicons/icons';
import type { PropType } from 'vue';
defineProps({
  coverImage: {
    type: String,
    default: undefined,
  },
  avatarImage: {
    type: String,
    default: undefined,
  },
  maxWidth: {
    type: String,
    default: '450px',
  },
  showChatButton: {
    type: Boolean,
    default: false,
  },
  showChangePhoto: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 250,
  },
  avatarTop: {
    type: Number,
    default: 75,
  },
  avatarSize: {
    type: Number,
    default: 75,
  },
  descriptionStyle: {
    type: String,
    default: '',
  },
  name: {
    type: String as PropType<string | null | undefined>,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  description2: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['on-change-avatar', 'on-change-cover']);
const { isDark } = useTheme();
const { t } = useLang();
const onChangeAvatar = (event: any = undefined) => {
  emit('on-change-avatar');
  if (event) {
    event.stopImmediatePropagation();
  }
};
const onChangeCover = (event: any = undefined) => {
  emit('on-change-cover');
  if (event) {
    event.stopImmediatePropagation();
  }
};
</script>
<style scoped>
.profile-avata {
  border-radius: 100%;
  border: 3px solid #fff;
}
</style>
