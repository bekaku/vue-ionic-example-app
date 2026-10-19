<script setup lang="ts">
import { component as VueNumber } from '@coders-tm/vue-number-format';
import type { ItemLines, VueMoneyConFig } from '@/types/common';
import type { IconProps } from '@/types/props';
import { IonItem, IonLabel } from '@ionic/vue';
import { computed, ref, useTemplateRef } from 'vue';
import BaseIcon from './BaseIcon.vue';

const props = withDefaults(
  defineProps<{
    bordered?: boolean;
    config?: Partial<VueMoneyConFig>;
    disabled?: boolean;
    helperText?: string;
    hint?: string;
    icon?: IconProps;
    label?: string;
    lines?: ItemLines;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    rules?: any[];
    textAlign?: 'left' | 'right' | 'center';
  }>(),
  {
    bordered: true,
    disabled: false,
    lines: 'none',
    readonly: false,
    required: false,
    rules: () => [],
    textAlign: 'left',
  },
);

const emit = defineEmits<{
  'change': [value: any];
  'update': [value: any];
  'on-change': [value: any];
  'on-input': [value: any];
  'on-focus': [event: any];
  'on-blur': [event: any];
}>();

const modelValue = defineModel<number | string>({ default: 0 });

const defaultConfig: VueMoneyConFig = {
  decimal: '.',
  separator: ',',
  prefix: '',
  suffix: '',
  precision: 2,
  nullValue: '',
  masked: false,
  reverseFill: false,
};

const mergedConfig = computed<VueMoneyConFig>(() => ({
  ...defaultConfig,
  ...props.config,
}));

const numberInputRef = useTemplateRef<any>('numberInputRef');
const isFocused = ref(false);
const errorText = ref<string>();

const validateRules = (value: number | string | undefined | null) => {
  if (props.rules && props.rules.length > 0) {
    for (const validFunc of props.rules) {
      const validateResult = validFunc(value);
      if (validateResult === true) {
        errorText.value = undefined;
      } else {
        errorText.value = validateResult;
        break;
      }
    }
  }
};

const updateField = (ev: any) => {
  const unmasked = ev?.target?.unmasked ?? ev?.target?.value ?? ev;
  modelValue.value = unmasked;
  validateRules(unmasked);
  emit('update', unmasked);
  emit('on-input', unmasked);
};

const changeField = (ev: any) => {
  const unmasked = ev?.target?.unmasked ?? ev?.target?.value ?? ev;
  emit('change', unmasked);
  emit('on-change', unmasked);
};

const onFocus = (ev: any) => {
  isFocused.value = true;
  emit('on-focus', ev);
};

const onBlur = (ev: any) => {
  isFocused.value = false;
  validateRules(modelValue.value);
  emit('on-blur', ev);
};

const onSetFocus = () => {
  if (numberInputRef.value) {
    const el = numberInputRef.value.$el ?? numberInputRef.value;
    if (typeof el.focus === 'function') {
      el.focus();
    } else {
      const nativeInput = el.querySelector?.('input');
      nativeInput?.focus();
    }
  }
};

defineExpose({
  onSetFocus,
});
</script>

<template>
  <IonItem v-bind="$attrs" :lines="lines">
    <slot name="before" />
    <IonLabel class="ion-no-margin">
      <div
        class="base-input-money"
        :class="{
          bordered,
          'has-focus': isFocused,
          'is-disabled': disabled,
          'is-readonly': readonly,
        }"
        @click="onSetFocus"
      >
        <div v-if="label || $slots.label" class="base-input-money-label">
          <slot name="label">
            {{ label }}
            <span v-if="required" class="text-danger">*</span>
          </slot>
        </div>
        <div class="base-input-money-row">
          <slot name="start">
            <BaseIcon v-if="icon != undefined" class="q-mr-sm" v-bind="icon" />
          </slot>
          <vue-number
            ref="numberInputRef"
            v-model="modelValue"
            class="base-input-money-input"
            :placeholder="placeholder"
            :disabled="disabled || readonly"
            :readonly="readonly"
            :style="{ textAlign }"
            v-bind="mergedConfig"
            @input="updateField($event)"
            @change="changeField($event)"
            @focus="onFocus($event)"
            @blur="onBlur($event)"
          />
          <slot name="end" />
        </div>
      </div>
      <slot name="hint">
        <p v-if="errorText" class="text-danger q-text-caption ion-no-margin q-mt-xs">
          {{ errorText }}
        </p>
        <p v-else-if="helperText || hint" class="text-muted q-text-caption ion-no-margin q-mt-xs">
          {{ helperText || hint }}
        </p>
      </slot>
    </IonLabel>
    <slot name="after" />
  </IonItem>
</template>

<style scoped lang="scss">
.base-input-money {
  background-color: var(--app-input-bg);
  border-radius: 10px;
  min-height: 56px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid transparent;
  transition:
    border-color var(--app-motion-fast, 0.2s) ease,
    box-shadow var(--app-motion-fast, 0.2s) ease;

  &.bordered {
    border-color: var(--app-border-light);
  }

  &.has-focus {
    border-color: var(--ion-color-primary, #3880ff);
  }

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.base-input-money-label {
  font-size: 0.75rem;
  color: var(--app-text-muted);
  line-height: 1.2;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.base-input-money-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.base-input-money-input {
  flex: 1;
  min-width: 0;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
  color: var(--app-text-strong, var(--ion-text-color));
  font-family: inherit;

  &::placeholder {
    color: var(--app-text-muted);
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }
}
</style>
