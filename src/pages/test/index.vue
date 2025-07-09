<script setup lang="ts">
import UserService from '@/api/UserService';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseAvatarGroup from '@/components/base/BaseAvatarGroup.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useAuthenStore } from '@/stores/authenStore';
import type { IMenuItem } from '@/types/models';
import { IonCardContent, IonIcon, IonRow, IonButtons } from '@ionic/vue';
import {
  addOutline,
  ellipse,
  funnelOutline,
  searchOutline,
  trash,
} from 'ionicons/icons';
import { ref } from 'vue';
const authenStore = useAuthenStore();
const { getUserSessionData } = UserService();
const test = async () => {
  await getUserSessionData();
};
</script>
<template>
  <BasePage page-title="Test Page" fullscreen show-back-link>
    <BaseCard title="Test Page" subtitle="Just test page">
      <ion-card-content>
        <ion-row class="q-gutter-md">
          <BaseButton label="Test Func" @click="test" />
        </ion-row>
      </ion-card-content>
    </BaseCard>
  </BasePage>
</template>
