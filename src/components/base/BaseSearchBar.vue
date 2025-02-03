<script setup lang="ts">
import { IonicColor } from '@/types/common';
import { IonSearchbar } from '@ionic/vue';
import { closeCircle, searchOutline } from 'ionicons/icons';
const {
    animated = true,
    disabled = false,
    debounce = 250,
    icon = searchOutline,
    clearIcon=closeCircle
} = defineProps<{
    animated?: boolean
    color?: IonicColor
    debounce?: number
    disabled?: boolean
    placeholder?: string
    icon?: string
    clearIcon?: string
}>();
const emit = defineEmits<{
    'on-change': [val: string | undefined]
}>();
const onSearchChange = (val: string | undefined) => {
    emit('on-change', val)
}
</script>

<template>
    <IonSearchbar :animated :color :placeholder="placeholder" :disabled :debounce :search-icon="icon" :clear-icon="clearIcon"
        @ion-input="onSearchChange($event.target.value)" />
</template>