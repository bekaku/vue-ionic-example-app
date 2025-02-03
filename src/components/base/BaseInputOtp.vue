<template>
  <ion-row class="ion-align-items-center">
    <ion-col v-for="i in length" :key="i">
      <ion-row class="ion-justify-content-center">
        <input type="number" v-model="fieldValues[i - 1]" v-bind="$attrs" @keyup="onKeyUp($event, i - 1)"
          @update:model-value="onUpdate($event, i - 1)" :ref="(el) => updateFieldRef(el, i - 1)" maxlength="1"
          class="input">
      </ion-row>
    </ion-col>
  </ion-row>
</template>
<script setup lang="ts">
import {
  IonCol,
  IonRow
} from '@ionic/vue';
import { computed, onBeforeUpdate, ref, watch } from 'vue';

const props = defineProps<{
  inputLength: number
}>();
const emit = defineEmits<{
  'on-submit': [val: string | undefined]
}>();
// const length = 6;
const length = computed(() => props.inputLength);
const fields = ref<any[]>([]);
const fieldValues = ref([]);

const composite = computed(() => {
  const nonNullFields = fieldValues.value.filter(value => value);
  if (length.value !== nonNullFields.length) {
    return '';
  }
  return nonNullFields.join('');
});

watch(composite, () => {
  if (composite.value) {
    // You should emit this value, e.g.
    emit('on-submit', composite.value);
  }
});

// make sure to reset the refs before each update
onBeforeUpdate(() => {
  fields.value = [];
});

const updateFieldRef = (element: any, index: number) => {
  if (element) {
    fields.value[index] = element;
  }
};

const focus = (index: number) => {
  if (index >= 0) {
    if (index < length.value) {
      fields.value[index].select();
    } else {
      if (composite.value) {
        fields.value[index - 1].blur();
      }
    }
  }
};

const onUpdate = (value: any, index: number) => {
  if (value) {
    focus(index + 1);
  }
};

const onKeyUp = (evnt: any, index: number) => {
  const key = evnt.key;

  if (['Tab', 'Shift', 'Meta', 'Control', 'Alt'].includes(key)) {
    return;
  }

  if (['Delete'].includes(key)) {
    return;
  }

  if (key === 'ArrowLeft' || key === 'Backspace') {
    focus(index - 1);
  } else if (key === 'ArrowRight') {
    focus(index + 1);
  }
};
</script>

<style scoped lang="scss">
.input {
  width: 80%;
  height: 50px;
  border: 1px solid #ccc;
  background-color: transparent;
  border-radius: 5px;
  text-align: center
}
</style>
