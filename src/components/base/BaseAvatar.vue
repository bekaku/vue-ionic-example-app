<script setup lang="ts">
/*
 <base-avatar  v-if="item.avatar" :src="item.avatar" :fetch-image="fecthImage"/>

 // Ionic Align Avatar On Top Item
   <base-avatar
          class="ion-align-self-stretch"
          slot="start"
          v-if="itemApprove.approveBy?.avatar?.thumbnail"
          fetch-image
          :src="itemApprove.approveBy.avatar.thumbnail"
        />
 */
import FileManagerService from '@/api/FileManagerService';
import { useBlobUrls } from '@/composables/useBlobUrls';
import { IonAvatar, IonSkeletonText } from '@ionic/vue';
import { onBeforeUnmount, ref, watch } from 'vue';
import type { AvatarProps } from '@/types/props';
import BaseBadge from '@/components/base/BaseBadge.vue';
const {
  top = false,
  fetchImage = false,
  rounded = false,
  square = false,
  round = true,
  size = 32,
  src,
  bordered = false,
  borderedColor = '#fff',
  borderedWidth = '2px',
} = defineProps<AvatarProps>();
const { fethCdnData } = FileManagerService();
const { track, revokeAll } = useBlobUrls();
const loading = ref(true);
const firstLoaded = ref(false);
const srcUrl = ref<any>();
const onFetchImage = async () => {
  if (!src) {
    loading.value = false;
    return;
  }
  if (fetchImage) {
    revokeAll();
    const res = await fethCdnData(src);
    // fall back to the plain url when the fetch returns nothing
    srcUrl.value = res ? track(res) : src;
  } else {
    srcUrl.value = src;
  }
  loading.value = false;
  if (!firstLoaded.value) {
    firstLoaded.value = true;
  }
};
// fetch once on mount and again only when src changes
// (the old watchEffect re-ran when firstLoaded flipped, fetching every avatar twice).
// Must stay below onFetchImage: `immediate` calls it synchronously right here.
watch(() => src, () => onFetchImage(), { immediate: true });
onBeforeUnmount(() => {
  srcUrl.value = undefined;
});
</script>
<template>
  <ion-avatar v-if="src" v-bind="$attrs" :style="`width: ${size}px; height: ${size}px;`"
    :class="{ 'bordered': bordered, 'avatar-top': top }">
    <slot>
      <ion-skeleton-text v-if="loading" :class="{
        'avatar-round': round && !square,
        'avatar-rounded': rounded && !square,
        'avatar-square': square
      }
        " :animated="true"></ion-skeleton-text>
      <Transition>
        <img v-if="!loading" :src="srcUrl" loading="lazy" decoding="async" :alt="'avatar'"
          :class="{ 'avatar-rounded': !square && rounded, 'avatar-round': !square && !rounded, 'avatar-square': square }" />
      </Transition>
    </slot>
    <slot name="extra"></slot>
     <slot name="badge">
      <BaseBadge v-if="badge" v-bind="badge" />
     </slot>
  </ion-avatar>
</template>
<style scoped>
.bordered {
  border: v-bind(borderedWidth) solid v-bind(borderedColor)
}

.avatar-round {
  border-radius: 50%;
}

.avatar-rounded {
  border-radius: 5px;
}

.avatar-square {
  border-radius: 0;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
