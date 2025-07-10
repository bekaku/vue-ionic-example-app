<script setup lang="ts">
import UserService from '@/api/UserService';
import { useAppStorage } from '@/composables/useAppStorage';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { useTheme } from '@/composables/useTheme';
import { useAuthenStore } from '@/stores/authenStore';
import type { LoginedProfileItem } from '@/types/common';
import { IonCardContent, IonIcon, IonRow } from '@ionic/vue';
import {
  addCircleOutline,
  checkmarkCircleOutline,
  ellipse,
  refreshCircleOutline,
} from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import BaseButton from '../base/BaseButton.vue';
import SkeletonItem from '../skeleton/SkeletonListItem.vue';
import UserItem from './UserItem.vue';
import BaseIcon from '../base/BaseIcon.vue';
const emit = defineEmits<{
  'on-open-add-profile': [void];
  'on-switch-profile': [userId: number | string];
}>();
const authenStore = useAuthenStore();
const { loginedItems, alreadyFetchLoginedProfile } = storeToRefs(authenStore);
const { auth, setLoginedItems, setFetchLoginedProfile } = authenStore;
const { appConfirm } = useBase();
const { isDark } = useTheme();
const { t } = useLang();
const loading = ref<boolean>(true);
const { getAllRefreshTokens } = useAppStorage();
const { findLoginedProfile, findAllLoginedProfile } = UserService();
onMounted(async () => {
  await fetchAllProfile();
  loading.value = false;
});
const fetchAllProfile = async () => {
  if (alreadyFetchLoginedProfile) {
    return new Promise((resolve) => resolve(true));
  }
  const res = await findAllLoginedProfile();
  setFetchLoginedProfile(true);
  if (res && res.length > 0) {
    setLoginedItems(res);
  }
  return new Promise((resolve) => resolve(true));
};
const onSetProfiles = async () => {
  if (loginedItems.value.length > 0 || !auth || !auth.id) {
    return new Promise((resolve) => resolve(false));
  }
  const jwtCookies = await getAllRefreshTokens();
  if (jwtCookies && jwtCookies.length > 0) {
    const finalItems: LoginedProfileItem[] = [];
    const otherUserTokens = jwtCookies.filter(
      (cookie) => cookie.userId != auth.id,
    );
    if (otherUserTokens.length > 0) {
      for (const item of otherUserTokens) {
        if (item.value) {
          const res = await findLoginedProcess(item.value);
          if (res) {
            finalItems.push(res);
          }
        }
      }
      if (finalItems.length > 0) {
        setLoginedItems(finalItems);
      }
    }
  }
  return new Promise((resolve) => resolve(true));
};
const findLoginedProcess = async (
  jwtToken: string,
): Promise<LoginedProfileItem | null> => {
  if (!jwtToken) {
    return new Promise((resolve) => resolve(null));
  }
  try {
    const response = await findLoginedProfile({
      refreshToken: { refreshToken: jwtToken },
    });
    return new Promise((resolve) => resolve(response));
  } catch (error) {
    console.warn('findLoginedProcess Error', error);
    return new Promise((resolve) => resolve(null));
  }
};
const onSwithUserProcess = async (index: number) => {
  const switchToUser = loginedItems.value[index];
  if (switchToUser && switchToUser.user && switchToUser.user.id) {
    const conf = await appConfirm(
      t('app.monogram'),
      t('authen.switchProfileConfirm', {
        name: switchToUser.user?.username || switchToUser.user?.email || '',
      }),
    );
    if (conf) {
      emit('on-switch-profile', switchToUser.user.id);
    }
  }
};
const onGoToAddProfilePage = () => {
  emit('on-open-add-profile');
};
</script>
<template>
  <IonCardContent class="q-pa-sm">
    <BaseButton
      :icon="{
        name: addCircleOutline,
        iconSet: 'ion',
      }"
      :label="t('authen.addProfile')"
      :color="!isDark ? 'light' : 'dark'"
      full
      class="q-py-sm"
      @click="onGoToAddProfilePage"
    />
    <UserItem
      v-if="auth"
      :name="auth.username || ''"
      :description="auth.email || ''"
      :avatar="{
        src: auth.avatar?.thumbnail || '',
      }"
    >
      <template #end>
        <BaseIcon
          :name="checkmarkCircleOutline"
          icon-set="ion"
          color="primary"
        />
      </template>
    </UserItem>
    <SkeletonItem v-if="loading" :show="loading" :items="2" />
    <template v-else-if="loginedItems.length > 0">
      <UserItem
        v-for="(item, index) in loginedItems"
        :key="`${index}-${item.user?.id}`"
        :name="item.user?.username || ''"
        :avatar="{ src: item.user?.avatar?.thumbnail || '' }"
        :description="item.user?.email || ''"
        clickable
        @click="onSwithUserProcess(index)"
      >
        <template
          v-if="
            item.notificationCount &&
            (item.notificationCount.totalNotify > 0 ||
              item.notificationCount.totalNewMessage > 0)
          "
          #bottom
        >
          <IonRow class="text-caption ion-align-items-center">
            <IonIcon
              :icon="ellipse"
              color="danger"
              style="font-size: 12px"
              class="q-mr-xs"
            />
            <p class="text-danger">
              {{
                item.notificationCount.totalNotify +
                  item.notificationCount.totalNewMessage >
                99
                  ? '99+'
                  : item.notificationCount.totalNotify +
                    item.notificationCount.totalNewMessage
              }}
              {{ t('base.notifications') }}
            </p>
          </IonRow>
        </template>
        <template #end>
          <BaseButton
            class="q-mt-sm"
            :icon="{
              name: refreshCircleOutline,
              iconSet: 'ion',
            }"
            icon-only
            clear
            icon-set="ion"
            icon-color="muted"
          >
          </BaseButton>
        </template>
      </UserItem>
    </template>
  </IonCardContent>
</template>
