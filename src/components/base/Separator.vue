<template>
  <template v-if="!vertical">
    <div
      :class="{
        'q-mx-md': inset,
        'app-border-light-bottom': lighter,
        'app-border-bottom': !lighter,
      }"
      style="height: 1px"
      v-bind="$attrs"
    ></div>
    <!-- <div
        :class="{
          'q-mx-md': inset,
          'app-border-lighter-bottom': lighter,
          'app-border-light-bottom': !lighter
        }"
        style="height: 1px"
      ></div> -->
  </template>
  <template v-else>
    <div
      v-bind="$attrs"
      :class="{
        'bg-separator-light': lighter,
        'bg-separator-lighter': !lighter,
      }"
      style="width: 1px; height: 100%"
    ></div>
  </template>
</template>
<script setup lang="ts">
defineProps({
  inset: {
    type: Boolean,
    default: false,
  },
  lighter: {
    type: Boolean,
    default: false,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
});
</script>
