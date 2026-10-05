<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue';
import { useAppStorage } from '@/composables/useAppStorage';
import { useLang } from '@/composables/useLang';
import { useAuthenStore } from '@/stores/authenStore';
import { IonBadge, IonCardContent } from '@ionic/vue';
import { chevronDownOutline } from 'ionicons/icons';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import BaseIcon from '../base/BaseIcon.vue';
import BaseCard from '../base/BaseCard.vue';
import UserItem from './UserItem.vue';
import { useBase } from '@/composables/useBase';
import { useAuthen } from '@/composables/useAuthen';
const UserLoginedItems = defineAsyncComponent(
  () => import('@/components/user/UserLoginedItems.vue'),
);
const authenStore = useAuthenStore();
const { auth } = authenStore;
const { getAllJwtTokens } = useAppStorage();
const { onSwithUser } = useAuthen();
const { t } = useLang();
const { appNavigateTo } = useBase();
const dialogOpen = ref<boolean>(false);
const totalProfiles = ref<number>(0);
onMounted(async () => {
  const jwtCookies = await getAllJwtTokens();
  if (jwtCookies) {
    totalProfiles.value = jwtCookies.length;
  }
});
const openDialog = () => {
  dialogOpen.value = true;
};
const onGoToAddProfilePage = () => {
  dialogOpen.value = false;
  appNavigateTo('/auth/add-account');
};
const onSwithUserProcess = async (userId: number | string) => {
  dialogOpen.value = false;
  if (userId) {
    onSwithUser(userId);
  }
};
</script>
<template>
  <h2 v-if="auth" class="app-section-label">{{ t('authen.allProfiles') }}</h2>
  <BaseCard v-if="auth" class="profile-card">
    <IonCardContent class="ion-no-padding">
      <UserItem
        :lines-name="1"
        :name="auth.username || ''"
        :lines-description="1"
        :description="auth.email|| ''"
        :avatar="{
          src: auth.avatar?.thumbnail || '',
        }"
        clickable
         @click="openDialog"
      >
        <template #end>
          <span class="profile-switch" aria-hidden="true">
            <BaseIcon
              :name="chevronDownOutline"
              icon-set="ion"
              :size="18"
              style="top: 0"
            />
            <IonBadge v-if="totalProfiles > 1" color="danger" class="profile-count">
              {{ totalProfiles }}
            </IonBadge>
          </span>
        </template>
      </UserItem>
    </IonCardContent>
  </BaseCard>
  <BaseModal
    v-model="dialogOpen"
    :title="t('authen.allProfiles')"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    :content-padding="false"
  >
    <UserLoginedItems
      v-if="dialogOpen"
      @on-open-add-profile="onGoToAddProfilePage"
      @on-switch-profile="onSwithUserProcess"
    />
  </BaseModal>
</template>
<style scoped>
.profile-card :deep(ion-item) {
  --min-height: 76px;
}

.profile-switch {
  position: relative;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--app-bg-sunken);
  color: var(--app-text-muted);
}

.profile-count {
  position: absolute;
  top: -6px;
  right: -8px;
}
</style>
