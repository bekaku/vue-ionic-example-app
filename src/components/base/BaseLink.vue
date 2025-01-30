<script setup lang="ts">
import type { IHrefTarget } from '@/types/Common';
const { external = false, color = 'primary' } = defineProps<{
    label?: string
    external?: boolean
    href?: string
    target?: IHrefTarget
    to: string
    color?: string
    colorDark?: string
}>();
</script>
<template>
    <a v-if="external" v-bind="$attrs" :href="to"  target="_blank" class="app-text-link" :class="!color ? 'q-text-black' : 'text-' + color">
        <slot />
    </a>
    <router-link v-else :to="to" :target="external ? '_blank' : undefined" class="app-text-link"
        :class="!color ? 'q-text-black' : 'text-' + color">
        <slot />
    </router-link>
</template>