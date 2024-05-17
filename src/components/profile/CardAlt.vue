<template>
  <ion-card class="ion-no-margin ion-no-padding no-border-radius no-shadow">
    <div
      @click="onViewCover"
      style="z-index: 999"
      :style="`height: ${height};
              background-image:linear-gradient(to bottom, rgba(245, 246, 252, 0.1), rgba(0, 0, 0, 0.25)), url(${
                user && user.cover ? user.cover.image : '/social-cover-01.jpg'
              });
              background-position: center;
              -webkit-background-size: cover;
              -moz-background-size: cover;
              -o-background-size: cover;
              background-size: cover;`"
    >
      <slot name="coverExtra"> </slot>
      <div
        class="text-white q-absolute-top-left q-mt-xs q-ml-sm"
        style="top: 120px; left: 0px; z-index: 999"
      >
        <user-badge
          v-if="user.useLevel"
          :level="user.useLevel.levelNo"
          :size="120"
        ></user-badge>
      </div>
    </div>
    <div
      class="text-white q-absolute q-centered-horizontal"
      :style="{ top: avatarTop, zIndex: 99 }"
    >
      <profile-avatar
        :user="user"
        :width="avatarWidth"
        :shadow="2"
        @click="onViewAvata"
      >
      </profile-avatar>

      <slot name="avatarExtra"> </slot>
    </div>

    <ion-card-content class="q-mt-md">
      <div class="ion-text-center q-mt-xl q-mb-md">
        <h1 class="q-text-weight-bold">{{ user.userData?.fullName }}</h1>
        <h3 class="text-muted">{{ user.userData?.positionName }}</h3>
      </div>
      <ion-row v-if="showFollower">
        <ion-col class="ion-no-padding">
          <ion-item lines="none">
            <ion-label class="ion-text-center">
              <h1>{{ user.userData?.followingsTotal }}</h1>
              <p>{{ t('followings') }}</p>
            </ion-label>
          </ion-item>
        </ion-col>
        <ion-col class="ion-no-padding">
          <ion-item lines="none">
            <ion-label class="ion-text-center">
              <h1>{{ user.userData?.followersTotal }}</h1>
              <p>{{ t('followers') }}</p>
            </ion-label>
          </ion-item>
        </ion-col>
      </ion-row>

      <ion-row class="ion-justify-content-center">
        <ion-button
          v-if="!isOwner"
          mode="ios"
          :color="!isDark ? 'light' : 'dark'"
          @click="onFollowOrUnFollow"
        >
          <ion-icon
            :icon="user.userData?.followByYou ? checkmarkOutline : addOutline"
            slot="start"
          />
          {{ user.userData?.followByYou ? t('followings') : t('follow') }}
        </ion-button>
        <ion-button
          v-else
          @click="$emit('open-info')"
          mode="ios"
          :color="!isDark ? 'light' : 'dark'"
        >
          <ion-icon :icon="informationOutline" slot="start" />
          {{ t('aboutInfo') }}
        </ion-button>
        <ion-button
          mode="ios"
          :color="!isDark ? 'light' : 'dark'"
          @click="openPopover($event)"
        >
          <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
        </ion-button>
      </ion-row>
    </ion-card-content>
  </ion-card>
  <base-dialog
    v-if="user && image && dialogGallery"
    :model-value="dialogGallery"
    @on-close="dialogGallery = false"
    :content-padding="false"
    dark
    :title="t('base.photo')"
  >
    <template #avatar>
      <ion-avatar
        slot="start"
        v-if="user.avatar"
        style="width: 32px; height: 32px"
      >
        <ion-img :src="user.avatar.thumbnail" />
      </ion-avatar>
    </template>
    <slide-gallery :images="[image]" :selected-index="0" />
  </base-dialog>
  <ion-popover
    :is-open="popoverOpen"
    :event="event"
    @didDismiss="popoverOpen = false"
    trigger-action="click"
  >
    <ion-content>
      <ion-list lines="none">
        <ion-item
          v-for="(item, index) in filterMenu"
          :key="index"
          button
          :detail="false"
          @click="onItemClick(item.id)"
        >
          <ion-icon :icon="item.icon" slot="start"></ion-icon>
          <ion-label>
            <p class="q-text-black">{{ t(item.label) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, PropType, ref } from 'vue';
import { UserDto, ImageDto } from '@/types/Models';
import {
  informationOutline,
  personRemoveOutline,
  settingsOutline,
  checkmarkOutline,
  addOutline,
} from 'ionicons/icons';
import { actionSheetController } from '@ionic/vue';
import FollowersService from '@/api/FollowersService';
import { ellipsisHorizontal, flagOutline } from 'ionicons/icons';
import { useLang } from '@/composables/UseLang';
import { useBase } from '@/composables/UseBase';
import ProfileAvatar from '@/components/profile/Avatar.vue';
import SlideGallery from '@/components/SlideGallery.vue';
import UserBadge from '@/components/user/Badge.vue';
import {
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonAvatar,
  IonContent,
  IonImg,
  IonPopover,
  IonCardContent,
  IonCard,
} from '@ionic/vue';
const BaseDialog = defineAsyncComponent(
  () => import('@/components/base/Dialog.vue'),
);
interface Menu {
  icon: string;
  label: string;
  description: string;
  id: number;
  canShow: boolean;
}
const props = defineProps({
  user: {
    type: Object as PropType<UserDto>,
    default: () => null,
  },
  coverImage: {
    type: String,
    default: undefined,
  },
  avatarImage: {
    type: String,
    default: undefined,
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
  showMedal: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '250px',
  },
  avatarTop: {
    type: String,
    default: '75px',
  },
  avatarSize: {
    type: String,
    default: '120px',
  },
  avatarWidth: {
    type: Number,
    default: 120,
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
  userLevelNo: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  showFollower: {
    type: Boolean,
    default: false,
  },
});
const { follow, unfollow } = FollowersService();
const { t } = useLang();
const { isDark, WeeGoTo } = useBase();
const emit = defineEmits(['open-info', 'on-open-report-form', 'on-block-this']);
const dialogGallery = ref(false);
const popoverOpen = ref(false);
const viewAvatar = ref(true);
const image = ref<ImageDto | null | undefined>();
const event = ref<Event>();
const items = ref<Menu[]>([
  {
    id: 0,
    label: 'aboutInfo',
    description: 'reportPost',
    icon: informationOutline,
    canShow: true,
  },
  {
    id: 1,
    label: 'report',
    description: 'reportPost',
    icon: flagOutline,
    canShow: !props.isOwner,
  },
  {
    id: 2,
    label: 'base.blockUser',
    description: '',
    icon: personRemoveOutline,
    canShow: !props.isOwner,
  },
  {
    id: 3,
    label: 'base.accountSetting',
    description: '',
    icon: settingsOutline,
    canShow: props.isOwner,
  },
]);
const filterMenu = computed(() => items.value.filter((t) => t.canShow));
const openPopover = (e: Event) => {
  if (filterMenu.value.length == 0) {
    return;
  }
  event.value = e;
  popoverOpen.value = true;
};
const onViewAvata = async () => {
  viewAvatar.value = true;
  image.value = props.user.avatar;
  if (props.isOwner) {
    const actionSheet = await actionSheetController.create({
      buttons: [
        {
          text: t('base.viewAvatar'),
          handler: () => {
            dialogGallery.value = true;
          },
        },
        {
          text: t('base.changeAvatar'),
          handler: () => {
            onChangeAvatarOrCover();
          },
        },
        {
          text: t('base.cancel'),
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  } else {
    dialogGallery.value = true;
  }
};
const onViewCover = async () => {
  viewAvatar.value = false;
  image.value = props.user.cover;
  if (props.isOwner) {
    const actionSheet = await actionSheetController.create({
      buttons: [
        {
          text: t('base.viewCover'),
          handler: () => {
            dialogGallery.value = true;
          },
        },
        {
          text: t('base.changeCover'),
          handler: () => {
            onChangeAvatarOrCover();
          },
        },
        {
          text: t('base.cancel'),
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  } else {
    dialogGallery.value = true;
  }
};

const onChangeAvatarOrCover = (event: any = undefined) => {
  WeeGoTo('/settings/account-settings/photo');
  if (event) {
    event.stopImmediatePropagation();
  }
};
const onItemClick = (id: number) => {
  popoverOpen.value = false;
  if (id == 0) {
    emit('open-info');
  } else if (id == 1) {
    emit('on-open-report-form');
  } else if (id == 2) {
    emit('on-block-this');
  } else if (id == 3) {
    if (props.isOwner) {
      WeeGoTo('/settings/account-settings');
    }
  }
};
const onFollowOrUnFollow = () => {
  if (!props.user || !props.user.id || props.isOwner) {
    return;
  }
  const u = props.user;
  if (u.userData && u.id) {
    if (u.userData.followByYou) {
      onUnFollow(u.id);
    } else {
      onFollow(u.id);
    }
  }
};
const onFollow = async (userId: number) => {
  await follow(userId);
  const u = props.user;
  if (u.userData) {
    u.userData.followByYou = true;
  }
};
const onUnFollow = async (userId: number) => {
  await unfollow(userId);
  const u = props.user;
  if (u.userData) {
    u.userData.followByYou = false;
  }
};
</script>
<style scoped>
.profile-avata {
  border-radius: 50px;
  border: 3px solid #fff;
}
</style>
