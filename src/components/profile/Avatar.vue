<template>
  <!-- <ion-avatar
    v-if="avata"
    :style="`width: ${width}px; height: ${width}px; overflow: hidden;`"
    :class="`shadow-${shadow}`"
  >
    <ion-img :src="avata" />
    <div
      v-if="flame"
      class="q-absolute-top"
      style="
        z-index: 199;
        overflow: hidden;
        border-radius: 100%;
        top: 16px;
        left: 16px;
      "
      :style="`width: ${width}px; height: ${width}px`"
    >
      <ion-img style="width: 100%; height: auto" :src="flame" />
    </div>
  </ion-avatar> 

-->
  <base-image
    v-if="avata"
    :style="`width: ${width}px; height: ${width}px; overflow: hidden;border-radius: 100%;${
      border ? 'border: 3px solid #fff;' : ''
    }`"
    :class="`shadow-${shadow}`"
    :src="avata"
    ratio="4/3"
  >
    <!-- <div
      v-if="flame"
      class="q-absolute-top"
      style="overflow: hidden; top: 8px; left: 0px"
      :style="`width: ${width}px; height: ${width}px`"
    >
      <ion-img style="width: 100%; height: auto" :src="flame" />
    </div> -->
  </base-image>
</template>
<script setup lang="ts">
import { computed, PropType } from 'vue';
import { UserDto } from '@/types/Models';
import { UserLevelBenefitType } from '@/utils/Constant';
import BaseImage from '@/components/base/Image.vue';
import { IonImg } from '@ionic/vue';
const props = defineProps({
  user: {
    type: Object as PropType<UserDto>,
    default: () => null,
  },
  width: {
    type: Number,
    default: 45,
  },
  shadow: {
    type: Number,
    default: 0,
  },
  border: {
    type: Boolean,
    default: true,
  },
});

const avata = computed(() => props.user?.avatar?.image);
const flame = computed(() => {
  const level = props.user?.useLevel;
  if (level) {
    if (level.levelNo == UserLevelBenefitType.MASTER) {
      return '/icons/ss/frame_master.png';
    } else if (level.levelNo == UserLevelBenefitType.ADVANCE) {
      return '/icons/ss/frame_advance.png';
    } else if (level.levelNo == UserLevelBenefitType.ACTIVE) {
      return '/icons/ss/frame_active.png';
    } else if (level.levelNo == UserLevelBenefitType.LEARNER) {
      return '/icons/ss/frame_learner.png';
    } else if (level.levelNo == UserLevelBenefitType.PASSIVE) {
      return '/icons/ss/frame_passive.png';
    }
  }
  return undefined;
});
</script>
