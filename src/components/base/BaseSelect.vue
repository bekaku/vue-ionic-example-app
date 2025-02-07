<script setup lang="ts" generic="T">
import { useLang } from '@/composables/useLang';
import type { IonicColor, ItemLines, LabelValue } from '@/types/common';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import { checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import { onBeforeUnmount, ref, watch } from 'vue';
import BaseCard from './BaseCard.vue';
import BaseLabelValueItem from './BaseLabelValueItem.vue';
import BaseSearchBar from './BaseSearchBar.vue';
import BaseSpinner from './BaseSpinner.vue';

const {
    multiple = true,
    fetchImage = false,
    items = [],
    inputDebounce = 0,
    readonly = false,
    canFilter = true,
    loading = false,
    checkColor = 'primary',
    lines = 'inset'
} = defineProps<{
    iconSize?: number
    avatarSize?: number
    canFilter?: boolean
    checkColor?: IonicColor
    fetchImage?: boolean
    items?: LabelValue<T>[]
    inputDebounce?: number
    loading?: boolean
    multiple?: boolean
    readonly?: boolean
    searchPlacholder?: string
    lines?: ItemLines
}>();
const emit = defineEmits<{
    'on-change': [item: T | T[] | null | undefined]
}>();
const { t } = useLang();
const filteredItems = ref<LabelValue<any>[]>([...items]);
// const modelValue = defineModel<any[]>({ default: () => [] });
const modelValue = defineModel<T | T[] | null>();
const filterText = defineModel<string>('filter');
const changeTimeout = ref<any>(null);
const isChecked = (value: any): boolean => {
    if (multiple && Array.isArray(modelValue.value)) {
        return modelValue.value.find(item => item === value) !== undefined;
    }
    if (modelValue.value != null && modelValue.value != undefined) {
        return modelValue.value === value;
    }
    return false;
};
const confirmChanges = () => {
    emit('on-change', modelValue.value);
};

/**
 * Update the rendered view with
 * the provided search query. If no
 * query is provided, all data
 * will be rendered.
 */
const filterList = (searchQuery: string | undefined | null) => {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined || searchQuery == null) {
        filteredItems.value = [...items];
    } else {
        /**
         * Otherwise, normalize the search
         * query and check to see which items
         * contain the search query as a substring.
         */
        const normalizedQuery = searchQuery.toLowerCase();
        filteredItems.value = items.filter(item => item.label.toLowerCase().includes(normalizedQuery) || (item.description && item.description.toLowerCase().includes(normalizedQuery)));
    }
};
const onSelect = (selectedItem: LabelValue<any> | undefined) => {
    if (readonly) {
        return;
    }
    if (selectedItem != undefined && selectedItem?.value) {
        const checked = isChecked(selectedItem.value);
        if (!multiple) {
            if (checked) {
                modelValue.value = null;
            } else {
                modelValue.value = selectedItem.value;
            }
        } else if (!checked) {
            if (modelValue.value == undefined || modelValue.value == null) {
                modelValue.value = [];
            }
            if (Array.isArray(modelValue.value)) {
                modelValue.value = [...modelValue.value, selectedItem.value];
            }
        } else {
            if (modelValue.value == undefined || modelValue.value == null) {
                modelValue.value = [];
            }
            if (Array.isArray(modelValue.value)) {
                modelValue.value = modelValue.value.filter(
                    item => item !== selectedItem.value
                );
            }
        }
    }
    changeTimeout.value = setTimeout(() => {
        confirmChanges();
    }, 250);
}
const onSearchChange = (val: string | undefined) => {
    console.log('onSearchChange', val);
    filterText.value = val;
}
onBeforeUnmount(() => {
    if (changeTimeout.value) {
        clearTimeout(changeTimeout.value);
        changeTimeout.value = null;
    }
})
watch(filterText, (state) => {
    filterList(state);
});
</script>
<template>
    <BaseCard>
        <slot name="top" />
        <BaseSearchBar v-if="canFilter" :placeholder="searchPlacholder || t('base.search')" :debounce="inputDebounce"
            @on-change="onSearchChange" />
        <IonList>
            <IonItem v-if="loading">
                <IonLabel>
                    <BaseSpinner />
                </IonLabel>
            </IonItem>
            <template v-if="filteredItems.length > 0">
                <BaseLabelValueItem v-for="(item, index) in filteredItems" :key="`${index}-${item.value}`"
                    class="ion-text-wrap" :avatar-size="avatarSize" :icon-size="iconSize" :fetch-image="fetchImage"
                    :item="item" :lines @on-select="onSelect">
                    <template #end>
                        <IonIcon :icon="isChecked(item.value) ? checkmarkCircle : ellipseOutline"
                            :class="isChecked(item.value) ? 'text-'+checkColor : 'text-muted'" class="icon" />
                            <!-- :color="isChecked(item.value) ? checkColor : undefined" class="icon" /> -->
                    </template>
                </BaseLabelValueItem>
            </template>
            <IonItem v-else lines="none">
                <IonLabel>
                    <p>{{ t('error.dataNotfound') }}</p>
                </IonLabel>
            </IonItem>
        </IonList>
        <slot name="bottom" />
    </BaseCard>
</template>
<style lang="css" scoped>
.icon{
    font-size: 24px;
}
</style>