<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseAvatarGroup from '@/components/base/BaseAvatarGroup.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import { useAuthenStore } from '@/stores/authenStore';
import type { IMenuItem } from '@/types/models';
import {
  IonCardContent,
  IonIcon,
  IonRow,
  IonButtons
} from '@ionic/vue';
import { addOutline, ellipse, funnelOutline, searchOutline, trash } from 'ionicons/icons';
import { ref } from 'vue';
const authenStore = useAuthenStore();
</script>
<template>
  <base-layout page-title="Test Page" fullscreen show-back-link>
    <BaseCard title="Test Page" subtitle="Just test page">
      <ion-card-content>
      </ion-card-content>
    </BaseCard>
  </base-layout>
</template>
