<template>
  <ion-card
    v-if="item && (item.image || item.domain || item.title || item.desc)"
    class="ion-no-margin ion-no-padding no-shadow no-border-radius"
    :href="item.url"
    target="_blank"
  >
    <base-image v-if="item.image" :src="item.image" ratio="16/9"></base-image>
    <ion-item lines="none">
      <ion-label>
        <ion-text class="ion-text-uppercase">
          {{ item.domain }}
          <!-- <h2 class="ion-text-uppercase">{{ item.domain }}</h2> -->
          <!-- <h3 class="q-text-max-1-line">{{ item.title }}</h3> -->
        </ion-text>
        <br />
        <ion-text class="q-text-max-1-line">
          {{ item.title }}
        </ion-text>
        <ion-text class="text-muted q-text-max-1-line">
          <p>
            {{ item.desc }}
          </p>
        </ion-text>
      </ion-label>
      <base-icon :icon="returnUpForward" icon-set="ion" slot="end" />
    </ion-item>
  </ion-card>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { defineAsyncComponent } from 'vue';
import type { OgMeta } from '@/types/Models';
import { returnUpForward } from 'ionicons/icons';
import { IonItem, IonLabel, IonText, IonCard } from '@ionic/vue';
import BaseIcon from '@/components/base/Icon.vue';
const { item } = defineProps({
  item: {
    type: Object as PropType<OgMeta>,
    default: () => null,
  },
});
const BaseImage = defineAsyncComponent(
  () => import('@/components/base/Image.vue'),
);
</script>
<style scoped lang="scss">
ion-item {
  --background: var(--grey-2);
}
body[color-theme='dark'] {
  ion-item {
    --background: var(--app-bg-color-theme-dark);
  }
}
</style>
