<template>
  <span
    class="text-muted q-text-smaller q-text-weight-light q-relative-position"
    style="top: 1px"
  >
    <base-icon :icon="biDot" :size="size" color="text-muted" />
  </span>
</template>
<script setup lang="ts">
import { biDot } from '@quasar/extras/bootstrap-icons';
import BaseIcon from '@/components/base/Icon.vue';
defineProps({
  size: {
    type: Number,
    default: 11,
  },
});
</script>
