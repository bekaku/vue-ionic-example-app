<script setup lang="ts">
import BaseSwiperSlides from '@/components/base/BaseSwiperSlides.vue';
import type { FileManagerDto, ImageDto } from '@/types/models';
import { onMounted, ref, useTemplateRef } from 'vue';
import FileManagerService from '@/api/FileManagerService';
import type { SlideOptions, SwiperSlideChange } from '@/types/common';
import { IonCol, IonRow } from '@ionic/vue';
import { useFileSystem } from '@/composables/useFileSystem';
const {
    files,
    images = [],
    fetch = false,
    dark = true,
    height = '95vh',
    width = '100%',
} = defineProps<{
    files: FileManagerDto[]
    images?: ImageDto[]
    fetch?: boolean
    dark?: boolean
    height?: string
    width?: string
}>();
const emit = defineEmits(['on-slide-change', 'on-close', 'on-delete']);
const { savePicture } = useFileSystem();
const { fethCdnData } = FileManagerService();
const baseImgViewSwiperRef = useTemplateRef('baseImgViewSwiperRef');
const selectedIndex = defineModel<number>('selectedIndex', { default: 0 });
const loading = ref(true);
const items = ref<any[]>([]);
const slideOpts = ref<SlideOptions>({
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: false,
    pagination: false,
    initialSlide: selectedIndex.value,
    zoom: true,
});
onMounted(async () => {
    await setList();
    loading.value = false;
});
const fetchImage = async (src: string) => {
    const res = await fethCdnData(src);
    if (res) {
        return new Promise((resolve) => {
            resolve(res);
        });
    } else {
        return new Promise((resolve) => {
            resolve(null);
        });
    }
};
const setList = async () => {
    if (files && files.length > 0) {
        for (const f of files) {
            if (fetch) {
                const src = await fetchImage(f.filePath);
                if (src) {
                    items.value.push(src);
                }
            } else {
                items.value.push(f.filePath);
            }
        }
    } else if (images && images.length > 0) {
        for (const img of images) {
            if (fetch) {
                const src = await fetchImage(img.image);
                if (src) {
                    items.value.push(src);
                }
            } else {
                items.value.push(img.image);
            }
        }
    }

    return new Promise((resolve) => {
        resolve(true);
    });
};
const onSlideChange = (item: SwiperSlideChange) => {
    if (!loading.value && item) {
        selectedIndex.value = item.realIndex;
    }
};
const onDelete = async (index: number) => {
    items.value.splice(index, 1);
    emit('on-delete', index);
    if (items.value.length == 0) {
        emit('on-close')
    }
};
const onDownload = async (index: number) => {
    if (items.value.length > 0 && index != undefined) {
        const filePath = items.value[index];
        console.log('onDownload', filePath);
        if (filePath) {
            await savePicture(filePath);
        }
    }
};
const onNext = () => {
    if (baseImgViewSwiperRef.value) {
        baseImgViewSwiperRef.value.onNext()
    }
}
const onPrev = () => {
    if (baseImgViewSwiperRef.value) {
        baseImgViewSwiperRef.value.onPrev()
    }
}

const zoomIn = () => {
    if (baseImgViewSwiperRef.value) {
        baseImgViewSwiperRef.value.onZoomIn()
    }
};
const zoomOut = () => {
    if (baseImgViewSwiperRef.value) {
        baseImgViewSwiperRef.value.onZoomOut()
    }
};
defineExpose({
    onNext,
    onPrev,
    zoomIn,
    zoomOut,
    onDelete,
    onDownload
});
</script>
<template>
    <ion-row class="ion-align-items-center" :class="{ 'bg-black': dark, 'bg-grey-1': !dark }">
        <ion-col class="ion-no-padding">
            <base-swiper-slides ref="baseImgViewSwiperRef" :params="slideOpts" :style="{ height, width }"
                @on-slide-change="onSlideChange">
                <swiper-slide v-for="(img, index) in items" :key="`${index}-${img}`">
                    <ion-row class="ion-align-items-center  swiper-zoom-container">
                        <img class="swiper-zoom-target" :style="{ maxWidth: width, maxHeight: height }" :src="img"
                            alt="img" />
                        <!-- <img class="swiper-zoom-target" :style="{ height, width: 'auto' }" :src="img" alt="img" /> -->
                        <!-- <BaseImage :src="img" class="swiper-zoom-target" :fetch="false" ratio="1" fit="scale-down"
                            :style="{ height, width: '100vw' }" /> -->
                    </ion-row>
                </swiper-slide>
            </base-swiper-slides>
        </ion-col>
    </ion-row>
</template>