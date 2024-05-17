<template>
  <div v-bind="$attrs" class="ion-margin-vertical"></div>
</template>
<script setup lang="ts">
import { computed, PropType } from 'vue';
import { Hashtag } from '@/types/Models';
const props = defineProps({
  modelValue: {
    type: String,
  },
  items: {
    type: Array as PropType<Hashtag[]>,
    default: () => [],
  },
});
/*
interface Props {
  modelValue: string;
  overlay?: boolean;
  meta: ISortMode;
  todos: ISortMode[];
}
// const props = defineProps<Props>();
const modeDefault: ISortMode = {
  label: 'Test',
  value: 'asc',
};
const props = withDefaults(defineProps<Props>(), {
  overlay: false,
  todos: () => [],
  meta: () => modeDefault,
});

const props = withDefaults(defineProps<{
  item: BusinessPlanHealthItemDto;
  clickable?: boolean;
}>(), {
  clickable: false
});

*/
/*
// runtime
const emit = defineEmits(['change', 'update'])
// type-based
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: alternative, more succinct syntax
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()


*/
// const emit = defineEmits(['update:modelValue']);

// <comp-use-model v-model="testModel" v-model:count="count"></comp-use-model>
// const modelValue = defineModel<number>();
// const count = defineModel('count', { type: Number, default: 0 });
//const count = defineModel('count');
const emit = defineEmits<{
  'update:modelValue': [val: string | undefined];
}>();
const year = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>
