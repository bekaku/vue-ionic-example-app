<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue';
import { useAppStorage } from '@/composables/useAppStorage';
import { useLang } from '@/composables/useLang';
import { useTheme } from '@/composables/useTheme';
import { useAuthenStore } from '@/stores/authenStore';
import { IonBadge, IonCardContent, IonRow } from '@ionic/vue';
import { chevronDownOutline } from 'ionicons/icons';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import BaseButton from '../base/BaseButton.vue';
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
const { isDark } = useTheme();
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
  <BaseCard :subtitle="t('authen.allProfiles')">
    <IonCardContent class="q-pa-sm">
      <UserItem
        v-if="auth"
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
          <IonRow>
            <div
              :style="{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: !isDark
                  ? 'var(--color-zinc-100)'
                  : 'var(--color-zinc-700)',
              }"
            >
              <IonRow class="ion-align-items-center ion-justify-content-center">
                <BaseButton
                  class="q-mt-sm"
                  :icon="{
                    name: chevronDownOutline,
                  }"
                  color="light"
                  icon-only
                  clear
                  icon-set="ion"
                >
                </BaseButton>
                <IonBadge
                  color="danger"
                  class="q-relative-position"
                  :style="{ top: '-40px', right: '-20px' }"
                >
                  {{ totalProfiles }}
                </IonBadge>
              </IonRow>
            </div>
          </IonRow>
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
