<template>
  <template v-if="levelBadge">
    <div class="ion-text-center">
      <img
        :class="{ 'grey-img': grey }"
        :style="`width: auto ; height: ${size}px;`"
        :src="`/icons/ss/${levelBadge}.png`"
      />
    </div>
  </template>
</template>
<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import { UserLevelBenefitType } from '@/utils/Constant';
import { UserLevelDto } from '@/types/Models';
const props = defineProps({
  size: {
    type: Number,
    default: 24,
  },
  grey: {
    type: Boolean,
    default: false,
  },
  levelDto: {
    type: Object as PropType<UserLevelDto | undefined>,
    default: undefined,
  },
  level: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  level2: {
    type: Number as PropType<number>,
    default: 0,
  },
});
const levelBadge = ref<string | undefined>();
onMounted(() => {
  setBadge();
});
const setBadge = () => {
  if (props.levelDto) {
    setBadgeFn(props.levelDto.levelNo, props.levelDto.level2No);
  } else {
    setBadgeFn(props.level, props.level2);
  }
};

const setBadgeFn = (level: number = 0, level2: number = 0) => {
  if (level != undefined && level >= 0) {
    switch (level) {
      case UserLevelBenefitType.MASTER:
        levelBadge.value = `badge_master_${level2}`;
        break;
      case UserLevelBenefitType.ADVANCE:
        levelBadge.value = `badge_advance_${level2}`;
        break;
      case UserLevelBenefitType.ACTIVE:
        levelBadge.value = `badge_active_${level2}`;
        break;
      case UserLevelBenefitType.LEARNER:
        levelBadge.value = `badge_learner_${level2}`;
        break;
      case UserLevelBenefitType.PASSIVE:
        levelBadge.value = `badge_passive_${level2}`;
        break;
      default:
        levelBadge.value = undefined;
        break;
    }
  }
};
</script>
<style lang="scss" scoped>
.grey-img {
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
  filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
}
</style>
