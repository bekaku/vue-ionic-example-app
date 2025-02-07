<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseAvatarGroup from '@/components/base/BaseAvatarGroup.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import { useAuthenStore } from '@/stores/authenStore';
import {
  IonCardContent,
  IonIcon,
  IonRow
} from '@ionic/vue';
import { ellipse, trash } from 'ionicons/icons';
import { ref } from 'vue';
const authenStore = useAuthenStore();
const items = ref<string[]>([
  'https://cdn.quasar.dev/img/avatar1.jpg',
  'https://cdn.quasar.dev/img/avatar2.jpg',
  'https://cdn.quasar.dev/img/avatar3.jpg',
  'https://cdn.quasar.dev/img/avatar4.jpg',
  'https://cdn.quasar.dev/img/avatar5.jpg',
  'https://cdn.quasar.dev/img/avatar6.jpg',
  'https://cdn.quasar.dev/img/avatar7.jpg',
  'https://cdn.quasar.dev/img/avatar8.jpg',
])
</script>
<template>
  <BaseLayout page-title="Avatar" fullscreen show-back-link>
    <BaseCard title="Avatar" subtitle="Avatart and Avatar group">
      <ion-card-content>
        <ion-row class="q-gutter-md">
          <BaseAvatar v-if="authenStore.auth?.avatar?.thumbnail" fetch-image :src="authenStore.auth?.avatar?.thumbnail"
            :size="42">
            <template #extra>
              <ion-icon class="q-absolute" style="top: 20px;left: 50px" :icon="ellipse" color="success" />
            </template>
          </BaseAvatar>
          <BaseAvatar square src="https://cdn.quasar.dev/img/avatar2.jpg" :size="42" />
          <BaseAvatar rounded src="https://cdn.quasar.dev/img/avatar1.jpg" :size="42">
            <template #extra>
              <ion-icon class="q-relative-position" style="top: -48px;left:30px" :icon="trash" color="danger" />
            </template>
          </BaseAvatar>
          <BaseAvatar src="https://cdn.quasar.dev/img/avatar3.jpg" :size="42">
          </BaseAvatar>

          <BaseAvatar src="https://cdn.quasar.dev/img/avatar4.jpg" :size="42" />

          <BaseAvatar src="https://cdn.quasar.dev/img/avatar6.jpg" bordered bordered-color="#23d160" :size="42" />
        </ion-row>

        <BaseAvatar-group class="q-mt-md" :items="items" :limitUser="5" :avatarSize="42" />
      </ion-card-content>
    </BaseCard>
  </BaseLayout>
</template>
