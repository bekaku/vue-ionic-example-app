<template>
  <template v-if="iconSet === 'ion'">
    <ion-icon
      v-bind="$attrs"
      class="q-relative-position"
      style="top: 3px"
      :class="`${color} text-${color}`"
      :icon="name"
      :style="{ fontSize: size + 'px' }"
    />
  </template>

  <template v-else>
    <svg
      v-bind="$attrs"
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      fill="currentColor"
      :viewBox="parsedIcon.viewBox"
      :class="`${color} text-${color}`"
    >
      <template v-if="parsedIcon.paths.length > 0">
        <path
          v-for="(p, index) in parsedIcon.paths"
          :key="index"
          :d="p.d"
          :style="p.style"
        />
      </template>
    </svg>
  </template>
</template>
<script setup lang="ts">
/*
  <base-icon
                    :icon="gift"
                    icon-set="ion"
                    color="text-primary"
                    :size="24"
                  />
   */
import type { IconProps } from '@/types/props';
import { IonIcon } from '@ionic/vue';
import { computed } from 'vue';
const {
  additionalReplce = '',
  name,
  iconSet = 'ion',
  size = 20,
} = defineProps<IconProps>();
const parsedIcon = computed(() => {
  if (iconSet === 'ion') {
    return { viewBox: '', paths: [] }
  }

  let pathsData = name || ''
  let viewBox = ''

  // 1. ตรวจหา viewBox แบบ Custom ที่ Quasar อาจจะแนบมา (คั่นด้วย '|')
  if (pathsData.includes('|')) {
    const parts = pathsData.split('|')
    pathsData = parts[0]
    viewBox = parts[1]
  }

  // 2. กำหนด Default viewBox หากไม่มีติดมากับ String
  if (!viewBox) {
    if (iconSet === 'bootstrap-icons') {
      viewBox = '0 0 16 16'
    } else if (iconSet === 'line-awesome') {
      viewBox = '0 0 32 32'
    } else {
      // สำหรับ mdi, material-icons และอื่นๆ
      viewBox = '0 0 24 24'
    }
  }

  // 3. จัดการเรื่อง additionalReplce ถ้ามีการส่งมา (สำหรับกรณีพิเศษจริงๆ)
  if (additionalReplce) {
    pathsData = pathsData.replaceAll(additionalReplce, '')
  }

  // 4. แยก Path (Quasar ใช้ '&&' ในการคั่นหลาย paths)
  // และแยก Style (Quasar ใช้ '@@' ในการคั่น style เช่น path@@fill:none;)
  const paths = pathsData.split('&&').map((pathStr) => {
    const pathParts = pathStr.split('@@')
    const d = pathParts[0]
    let style = ''

    // หากมี Style พิเศษแนบมากับ Path
    if (pathParts.length > 1) {
      style = pathParts[1]
    }

    return { d, style }
  })

  return {
    viewBox,
    paths,
  }
})
</script>
