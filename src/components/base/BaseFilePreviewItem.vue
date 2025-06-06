<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseImage from '@/components/base/BaseImage.vue';
import type { FileManagerDto } from '@/types/models';
import { getFileTypeIcon } from '@/utils/fileUtils';
import { computed } from 'vue';

const {
    fetch = false,
    useThumbnail = false,
    imageSize = '100%',
    iconSize = 40,
    radius = false,
    radiusSize = '15px',
    item,
} = defineProps<{
    showDelete?: boolean
    col?: string
    item: FileManagerDto
    index: number
    formatSize?: boolean
    fetch?: boolean
    useThumbnail?: boolean
    showName?: boolean
    showSize?: boolean
    imageSize?: string
    iconSize?: number
    dense?: boolean
    radius?: boolean
    radiusSize?: string
}>();
const emit = defineEmits(['on-remove', 'on-click']);
const getImagePath = computed(() => useThumbnail && item.fileThumbnailPath ? item.fileThumbnailPath : item.filePath);
const onRemove = (event: any, index: number) => {
    emit('on-remove', index);
    if (event) {
        event.stopImmediatePropagation();
    }
};
const onClick = (event: any, index: number) => {
    if (event) {
        event.stopImmediatePropagation();
    }
    emit('on-click', index, event);
};
</script>

<template>
    <div v-bind="$attrs" @click="onClick($event, index)">
        <template v-if="item.isImage || item.image">
            <base-image :class="{ 'img-radius': radius }" :style="{ height: `${imageSize}`, width: `${imageSize}` }"
                :fetch="fetch" :src="getImagePath" ratio="4/3">
            </base-image>
        </template>
        <template v-else>
            <base-icon :name="getFileTypeIcon(item.fileMime)" icon-set="bootstrap-icons"
                :size="iconSize" />
        </template>
    </div>
</template>

<style scoped lang="scss">
.img-radius {
    border-radius: v-bind(radiusSize);
}
</style>
