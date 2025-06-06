<script setup lang="ts" generic="T">
import type { ISortMode, LabelValue } from '@/types/common';
/*
import TempComp from '@/components/test/TempComp.vue';
const textVal = ref();

<TempComp v-model="textVal" />
*/

const props = defineProps<{
  modelValue: string
  overlay?: boolean
  meta: ISortMode
  items: LabelValue<T>[]
}>();
// const emit = defineEmits<{
//   (e: 'change', id: number): void
//   (e: 'update', value: string): void
// }>()
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>();
const modelValue = defineModel<string>();
const onSubmit = () => {
  emit('change', 1);
  emit('update', 'Test');
};
</script>

<template>
  <div v-bind="$attrs">
    <input v-model="modelValue" />
    <br />
    <button @click="onSubmit">Submit</button>
  </div>
</template>
