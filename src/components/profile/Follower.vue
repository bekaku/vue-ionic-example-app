<template>
  <template v-if="!fristLoaded">
    <base-spinner></base-spinner>
  </template>
  <template v-else>
    <ion-row v-if="items.length == 0">
      <ion-col>
        <base-result
          :icon-size-alt="32"
          :show-icon="true"
          status="empty"
          :description="t('error.dataNotfound')"
        >
        </base-result>
      </ion-col>
    </ion-row>
    <template v-else>
      <ion-list>
        <user-profile-item
          v-for="(item, index) in items"
          :key="`${index}-${item.id}`"
          :item="item.followedUserDto"
          lines="full"
          @on-select="onItemClick"
        >
          <template v-if="feedType == 'following'" #end>
            <ion-button
              slot="end"
              fill="clear"
              @click="onBeforeUnfollow($event, index)"
            >
              <ion-icon
                slot="icon-only"
                :icon="removeCircleOutline"
                color="danger"
              ></ion-icon>
            </ion-button>
          </template>
        </user-profile-item>
      </ion-list>
      <load-more
        v-if="fristLoaded && !isInfiniteDisabled"
        :loading="loading"
        :frist-loaded="fristLoaded"
        :is-infinite-disabled="isInfiniteDisabled"
        :label="t('base.loadMore')"
        @on-next-page="loadNextPage"
      >
      </load-more>
    </template>
  </template>
</template>

<script setup lang="ts">
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
import { usePaging } from '@/composables/UsePaging';
import { Followers, FeedProfileSection, UserProfileDto } from '@/types/Models';
import FollowersService from '@/api/FollowersService';
import { computed, defineAsyncComponent, onMounted, PropType, ref } from 'vue';
import {
  IonRow,
  IonCol,
  IonList,
  IonButton,
  IonIcon,
  IonPopover,
  IonContent,
} from '@ionic/vue';
import { removeCircleOutline } from 'ionicons/icons';
const BaseResult = defineAsyncComponent(
  () => import('@/components/base/Result.vue'),
);
const LoadMore = defineAsyncComponent(
  () => import('@/components/LoadMore.vue'),
);
const BaseSpinner = defineAsyncComponent(
  () => import('@/components/base/Spinner.vue'),
);
const UserProfileItem = defineAsyncComponent(
  () => import('@/components/user/ProfileItem.vue'),
);
const props = defineProps({
  feedType: {
    type: String as PropType<FeedProfileSection>,
    default: 'following',
  },
  userId: {
    type: Number as PropType<number | undefined | null>,
    required: true,
  },
});
const { followings, followers, unfollow } = FollowersService();
const { t } = useLang();
const { pages } = usePaging(12);
const { onOpenProfile, WeeConfirm, WeeLoading } = useBase();

const isInfiniteDisabled = ref(false);
const fristLoaded = ref(false);
const loading = ref(false);

const items = ref<Followers[]>([]);
const pageParam = computed(
  () =>
    `?page=${pages.value.current > 0 ? pages.value.current - 1 : 0}&size=${
      pages.value.itemsPerPage
    }`,
);
onMounted(async () => {
  loadData();
});
const onItemClick = (item: UserProfileDto) => {
  console.log('onItemClick');
  onOpenProfile(undefined, item.id);
};
const loadData = async () => {
  if (props.feedType == 'following') {
    loadFollowing();
  } else {
    loadFollower();
  }
};
const loadFollower = async () => {
  const res = await followers(pageParam.value);
  if (res) {
    items.value.push(...res.dataList);
    if (res.last || res.totalElements == 0) {
      isInfiniteDisabled.value = true;
    }
  } else {
    isInfiniteDisabled.value = true;
  }
  if (!fristLoaded.value) {
    fristLoaded.value = true;
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};
const loadFollowing = async () => {
  const res = await followings(pageParam.value);
  if (res) {
    items.value.push(...res.dataList);
    if (res.last || res.totalElements == 0) {
      isInfiniteDisabled.value = true;
    }
  } else {
    isInfiniteDisabled.value = true;
  }
  if (!fristLoaded.value) {
    fristLoaded.value = true;
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};

const loadNextPage = async () => {
  pages.value.current++;
  loading.value = true;
  await loadData();
  loading.value = false;
};

const onBeforeUnfollow = async (event: any, index: number) => {
  if (event) {
    event.stopImmediatePropagation();
  }
  const confirm = await WeeConfirm(t('app.monogram'), t('unfollowConfirm'));
  if (confirm) {
    onUnFollow(index);
  }
};
const onUnFollow = async (index: number) => {
  const u = items.value[index];
  if (u && u.followedUserDto && u.followedUserDto.id) {
    const loading: any = await WeeLoading();
    loading.present();
    await unfollow(u.followedUserDto.id);
    loading.dismiss();
    items.value.splice(index, 1);
  }
};
</script>
