<script setup lang="ts" generic="T">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import { useLang } from '@/composables/useLang';
import type { IonicColor, ItemLines, LabelValue } from '@/types/common';
import { appPreventDefult } from '@/utils/appUtil';
import { IonChip, IonCol, IonIcon, IonItem, IonLabel, IonRow } from '@ionic/vue';
import { chevronExpandOutline, close, trashOutline } from 'ionicons/icons';
import { computed, defineAsyncComponent, ref } from 'vue';
import BaseButton from './BaseButton.vue';
import BaseIcon from './BaseIcon.vue';
const BaseSelectDialog = defineAsyncComponent(() => import('@/components/base/BaseSelectDialog.vue'));
const {
    bordered = true,
    multiple = true,
    fetchImage = false,
    items = [],
    inputDebounce = 0,
    readonly = false,
    canFilter = true,
    clearable = true,
    loading = false,
    checkColor = 'primary',
    lines = 'none',
    required = false,
    withInput = false,
} = defineProps<{
    bordered?: boolean
    icon?: string
    iconSize?: number
    avatarSize?: number
    canFilter?: boolean
    clearable?: boolean
    checkColor?: IonicColor
    fetchImage?: boolean
    items?: LabelValue<T>[]
    inputDebounce?: number
    loading?: boolean
    multiple?: boolean
    readonly?: boolean
    searchPlacholder?: string
    title?: string
    lines?: ItemLines
    label?: string
    required?: boolean
    withInput?: boolean
}>();
const emit = defineEmits<{
    'on-change': [items: T | T[] | null | undefined]
    'on-close': []
    'on-clear': []
}>();
const { t } = useLang();
const modelValue = defineModel<T | T[] | null>();
const showOptions = ref<boolean>(false);
const requireText = computed<boolean>(() => {
    if (!required) {
        return false;
    }
    if (multiple && Array.isArray(modelValue.value)) {
        if (modelValue.value.length == 0) {
            return true;
        }
    } else if (!modelValue.value) {
        // return t('error.validateRequireChoose');
        return true;
    }
    return false;
});
const showClearBtn = computed(() => {
    if (!clearable) {
        return false;
    }
    if (modelValue.value == undefined || modelValue.value == null) {
        return false;
    }
    if (!multiple) {
        return modelValue.value != undefined && modelValue.value != null
    }
    return Array.isArray(modelValue.value) && modelValue.value.length > 0;
})
const getItemBySelectId = (val: T | T[] | null | undefined) => {
    if (!modelValue.value) {
        return;
    }
    return items.find(t => t.value == val);
};
const onChange = (items: T | T[] | null | undefined) => {
    emit('on-change', items)
}
const onClose = () => {
    emit('on-close');
};
const onClick = () => {
    if (!readonly) {
        showOptions.value = true;
    }
};
const onClear = (event: any) => {
    appPreventDefult(event);
    if (!modelValue.value) {
        return;
    }
    if (multiple && Array.isArray(modelValue.value)) {
        modelValue.value = [];
    } else {
        modelValue.value = null;
    }
    emit('on-clear');
}
const onRemove = (event: any, index: number) => {
    appPreventDefult(event);
    if (!modelValue.value) {
        return;
    }
    if (multiple && Array.isArray(modelValue.value)) {
        modelValue.value.splice(index, 1);
    } else {
        modelValue.value = null;
    }

    emit('on-change', modelValue.value);
};
</script>
<template>
    <ion-item v-if="!loading" v-bind="$attrs" :lines="lines" :detail="false" button
        :class="{ 'q-ml-md q-mr-lg': withInput, 'bordered': bordered }" @click="onClick">
        <template v-if="!multiple && modelValue">
            <base-avatar v-if="getItemBySelectId(modelValue)?.avatar" slot="start"
                :src="getItemBySelectId(modelValue)?.avatar || ''" :fetch-image />
            <BaseIcon v-else-if="getItemBySelectId(modelValue)?.icon" slot="start"
                :icon="getItemBySelectId(modelValue)?.icon || ''" :icon-set="getItemBySelectId(modelValue)?.iconSet" />
        </template>
        <ion-label class="ion-text-wrap">
            <slot name="label">
                <h3>{{ label }} <span v-if="required" class="text-danger">*</span></h3>
            </slot>
            <ion-row v-if="multiple && modelValue && Array.isArray(modelValue) && modelValue.length > 0">
                <ion-col class="ion-no-padding ion-no-margin">
                    <ion-chip v-for="(val, orgIndex) in modelValue" :key="`org-${val}-${orgIndex}`">
                        <base-avatar v-if="getItemBySelectId(val)?.avatar" :src="getItemBySelectId(val)?.avatar || ''"
                            :fetch-image :size="20" />
                        <BaseIcon v-else-if="getItemBySelectId(val)?.icon" :icon="getItemBySelectId(val)?.icon || ''"
                            :icon-set="getItemBySelectId(val)?.iconSet" />
                        <ion-label>{{ getItemBySelectId(val)?.label }}</ion-label>
                        <ion-icon :icon="close" @click="onRemove($event, orgIndex)" />
                    </ion-chip>
                </ion-col>
            </ion-row>
            <template v-else>
                <p>
                    {{ getItemBySelectId(modelValue)?.label }}
                </p>
            </template>
            <!-- <p v-if="requireText" class="text-danger q-text-caption">{{ t('error.validateRequireChoose') }}</p> -->
        </ion-label>
        <IonRow slot="end" class="ion-align-items-center">
            <slot name="end">
                <BaseButton v-if="showClearBtn" clear color="danger" icon-color="danger" icon-only :icon="close"
                    @click="onClear($event)" />
                <IonIcon :icon="chevronExpandOutline" class="q-text-muted" />
            </slot>
        </IonRow>
    </ion-item>
    <BaseSelectDialog v-if="showOptions" v-model="modelValue" v-model:show="showOptions" :auto-close="!multiple" :items
        :multiple :title="title || label" :fetch-image :input-debounce :can-filter :readonly :loading :check-color
        @on-change="onChange" @on-close="onClose" />
</template>
<style scoped lang="scss">
ion-item {
    // border: 1px solid var(--app-border-color);
    border-radius: 10px;
    --background: var(--app-input-backgroud);
}

ion-item.bordered {
    border: 1px solid var(--border-light-color);
}
</style>