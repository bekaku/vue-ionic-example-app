<template>
  <ion-textarea v-model="val" v-bind="$attrs"></ion-textarea>
</template>
<script setup lang="ts">
/*
 <form-text-area
              :model-value="item.postContent"
              label-placement="floating"
              auto-grow
              :label="t('postContent')"
              :helperText="t('helper.requireMinimumLetter', { no: 4 })"
              @update:modelValue="(newVal : string) => item.postContent=newVal"
            >
            </form-text-area>
*/
import { computed, PropType } from 'vue';
import { IonTextarea } from '@ionic/vue';
const props = defineProps({
  modelValue: {
    type: String as PropType<string | undefined>,
    default: () => '',
  },
});
const emit = defineEmits(['update:modelValue']);
const val = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>
