<template>
  <base-layout page-title="Test Page" fullscreen  show-back-link>
    <IonicCard flat title="Avatar" subtitle="Avatart and Avatar group">
      <ion-card-content>
        <ion-row class="q-gutter-md">
          <base-avatar v-if="authenStore.auth?.avatar?.thumbnail" fetch-image :src="authenStore.auth?.avatar?.thumbnail"
            :size="42">
            <template #extra>
              <!-- <span class="q-absolute user-active-badge" style="top: 20px"></span> -->
              <ion-icon class="q-absolute" style="top: 20px;left: 50px" :icon="ellipse" color="success" />
            </template>
          </base-avatar>
          <base-avatar square src="https://cdn.quasar.dev/img/avatar2.jpg" :size="42" />
          <base-avatar rounded src="https://cdn.quasar.dev/img/avatar1.jpg" :size="42">
            <template #extra>
              <ion-icon class="q-relative-position" style="top: -48px;left:30px" :icon="trash" color="danger" />
            </template>
          </base-avatar>
          <base-avatar src="https://cdn.quasar.dev/img/avatar3.jpg" :size="42">
          </base-avatar>

          <base-avatar src="https://cdn.quasar.dev/img/avatar4.jpg" :size="42" />

          <base-avatar src="https://cdn.quasar.dev/img/avatar6.jpg" bordered bordered-color="#23d160" :size="42" />
        </ion-row>

        <base-avatar-group class="q-mt-md" :fetch="true" :items="items" :limitUser="5" :avatarSize="42" />
      </ion-card-content>
    </IonicCard>
  </base-layout>
</template>
<script setup lang="ts">
import { useLang } from '@/composables/UseLang';
import { useBase } from '@/composables/UseBase';
import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BaseBackButton.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import IonicCard from '@/components/ionic/IonicCard.vue';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonRow,
  IonIcon
} from '@ionic/vue';
import { checkmarkCircle, ellipse, trash } from 'ionicons/icons';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseAvatarGroup from '@/components/base/BaseAvatarGroup.vue';
import { ref } from 'vue';
import type { CacheDateAndKey } from '@/types/Common';
import { getDateNow } from '@/utils/DateUtil';
import UserService from '@/api/UserService';
import { useAuthenStore } from '@/stores/AuthenStore';
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
