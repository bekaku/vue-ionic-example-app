<script setup lang="ts">
import { useBase } from '@/composables/useBase';
import { useCamera } from '@/composables/useCamera';
import { useLang } from '@/composables/useLang';
import {
  LIMIT_VDO_SIZE,
  LIMIT_VDO_SIZE_MB,
  LIMIT_VIDEO_SECOND,
} from '@/libs/constant';
import type { FileManager } from '@/types/models';
import { formatDurationFromSecond } from '@/utils/DateUtil';
import { base64ToFile } from '@/utils/FileUtils';
import { generateSnowFlakeId } from '@/utils/snowflake';
import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import {
  cameraOutline,
  imageOutline,
  playCircleOutline,
  videocamOutline,
} from 'ionicons/icons';
import { defineAsyncComponent, defineEmits, defineExpose, defineModel, defineProps, ref } from 'vue';

type ChoiceType = 'photo' | 'camera' | 'video' | 'record-video'
const {
  multiple = false,
  limit = 20,
  choices = ['photo', 'camera', 'video', 'record-video'],
  icon = imageOutline,
} = defineProps<{
  forWeb?: boolean
  multiple?: boolean
  fullWidth?: boolean
  limit?: number
  choices?: ChoiceType[]
  icon?: string
  label?: string
}>()

const emit = defineEmits<{
  'on-change': [val: FileManager[] | null]
  'on-pick-photo': [val: FileManager[] | null]
  'on-take-picture': [val: FileManager | null]
  'on-pick-video': [val: FileManager | null]
  'on-record-video': [val: FileManager | null]
}>()
const BaseModal = defineAsyncComponent(
  () => import('@/components/base/BaseModal.vue'),
)
const modelValue = defineModel<FileManager[]>({ default: () => [] });

const show = ref(false)
const { appToast } = useBase()
const { onPickPhoto, onTakePicture, onPickVideo, onRecordVideo } = useCamera()

const { t } = useLang()

const takePicture = async () => {
  onClosePicker()
  const file = await onTakePicture()
  // console.log('takePicture', JSON.stringify(file))
  if (file) {
    modelValue.value.push(file)
    // emit('on-take-picture', file)
    emit('on-change', [file])
  }
  onClosePicker()
}
const pickPhoto = async () => {
  onClosePicker()
  const files = await onPickPhoto(multiple ? limit : 1)
  // console.log('pickPhoto', JSON.stringify(files))
  if (files && files.length > 0) {
    modelValue.value.push(...files)
    // emit('on-pick-photo', files)
    emit('on-change', files)
  }
}

const validateVideoFile = (
  f: FileManager | undefined | null,
): Promise<boolean> => {
  if (!f) {
    onClosePicker()
    return new Promise((resolve) => resolve(false))
  }

  if (f.fileSize) {
    const sizeNum = f.fileSize
    if (sizeNum > LIMIT_VDO_SIZE) {
      appToast({
        text: t('error.limitEachFile', [LIMIT_VDO_SIZE_MB]),
        color: 'warning',
        time: 3000,
      })
      return new Promise((resolve) => resolve(false))
    }
  }

  if (f.duration) {
    if (f.duration > LIMIT_VIDEO_SECOND) {
      appToast({
        text: t('drive.longVideoAlert', [
          formatDurationFromSecond(LIMIT_VIDEO_SECOND),
        ]),
        color: 'warning',
        time: 3000,
      })
      return new Promise((resolve) => resolve(false))
    }
  }
  return new Promise((resolve) => resolve(true))
}
const pickVideo = async () => {
  onClosePicker()
  const files = await onPickVideo(1)
  let file
  if (files && files.length > 0) {
    file = files[0]
  }
  const validFile = await validateVideoFile(file)
  if (validFile && file) {
    const f = await initialFileVdo(file)
    // console.log('pickVideo final', JSON.stringify(f))
    modelValue.value.push(f)
    // emit('on-pick-video', f)
    emit('on-change', [f])
  }
}
const recordVideo = async () => {
  onClosePicker()
  const file = await onRecordVideo()
  const validFile = await validateVideoFile(file)
  if (validFile && file) {
    const f = await initialFileVdo(file)
    // console.log('recordVideo final', JSON.stringify(f))
    modelValue.value.push(f)
    // emit('on-record-video', f)
    emit('on-change', [f])
  }
}
const open = () => {
  if (limit == modelValue.value.length) {
    appToast({
      text: t('error.limitFile2', { total: limit }),
      color: 'warning',
      time: 3000,
    })
    return
  }

  show.value = true
}
const onClosePicker = () => {
  show.value = false
}

const initialFileVdo = async (f: FileManager): Promise<FileManager> => {
  if (!f) {
    return new Promise((resolve) => resolve(f))
  }

  if (f.fileThumbnailPath) {
    const uniqueId = generateSnowFlakeId()
    const tnFile = await base64ToFile(
      f.fileThumbnailPath,
      `thumb_${uniqueId}.jpg`
    )
    // console.log('initialFileVdo > tnFile', JSON.stringify(tnFile))
    if (tnFile) {
      f.thumbnailFile = tnFile
    }
  }
  return new Promise((resolve) => resolve(f))
}
defineExpose({
  open,
})
</script>
<template>
  <base-modal
    v-if="show"
    v-model="show"
    :title="label || t('base.chooseFromFile')"
    :initial-breakpoint="choices.length > 2 ? 0.5 : 0.25"
    :breakpoints="choices.length > 2 ? [0, 0.5] : [0, 0.25]"
    @on-close="show = false"
  >
    <ion-list lines="none">
      <ion-item
        v-if="choices.includes('photo')"
        button
        :detail="false"
        @click="pickPhoto"
      >
        <ion-icon slot="start" :icon="imageOutline"></ion-icon>
        <ion-label>
          <h2>{{ t('drive.choosePicture') }}</h2>
        </ion-label>
      </ion-item>
      <ion-item
        v-if="choices.includes('camera')"
        button
        :detail="false"
        @click="takePicture"
      >
        <ion-icon slot="start" :icon="cameraOutline"></ion-icon>
        <ion-label>
          <h2>{{ t('base.chooseFromCamera') }}</h2>
        </ion-label>
      </ion-item>
      <ion-item
        v-if="choices.includes('video')"
        button
        :detail="false"
        @click="pickVideo"
      >
        <ion-icon slot="start" :icon="playCircleOutline"></ion-icon>
        <ion-label>
          <h2>{{ t('drive.chooseVideos') }}</h2>
        </ion-label>
      </ion-item>
      <ion-item
        v-if="choices.includes('record-video')"
        button
        :detail="false"
        @click="recordVideo"
      >
        <ion-icon slot="start" :icon="videocamOutline"></ion-icon>
        <ion-label>
          <h2>{{ t('drive.recordVideos') }}</h2>
        </ion-label>
      </ion-item>
    </ion-list>
  </base-modal>
  <div
    v-bind="$attrs"
    :style="{ display: !fullWidth ?'inline-block' : 'block' }"
    :class="{ div: !fullWidth }"
    @click="open"
  >
    <slot>
      <ion-button fill="clear">
        <ion-icon slot="icon-only" :icon="icon"></ion-icon>
      </ion-button>
    </slot>
  </div>
</template>
<style lang="css" scoped>
.div {
  width: fit-content;
}
</style>
