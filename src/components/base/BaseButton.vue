<script setup lang="ts">
import BaseIcon from '@/components/base/Icon.vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import type { ButtonFill, IconSetType, IHrefTarget } from '@/types/common';
import { IonButton } from '@ionic/vue';
const {
    clear = false,
    disabled = false,
    type = 'button',
    iconOnly = false,
    iconSet = 'ion',
    iconSize = 20,
    round = false,
    outline = false,
    avatarSize = 32
} = defineProps<{
    color?: 'danger' | 'dark' | 'light' | 'medium' | 'primary' | 'secondary' | 'success' | 'tertiary' | 'warning' | string | undefined
    clear?: boolean
    disabled?: boolean
    expand?: 'block' | 'full'
    fill?: ButtonFill
    label?: string
    href?: string
    avatar?: string
    avatarSize?: number
    icon?: string
    iconRight?: string
    iconOnly?: boolean
    iconSize?: number
    iconColor?: string
    iconSet?: IconSetType
    target?: IHrefTarget
    round?: boolean
    outline?: boolean
    size?: 'default' | 'large' | 'small'
    strong?: boolean
    type?: 'button' | 'reset' | 'submit'
}>();
</script>
<template>
    <ion-button v-bind="$attrs" :color :disabled :fill="clear ? 'clear' : outline ? 'outline' : 'solid'" :expand :href
        :target :type :shape="round ? 'round' : undefined" :size>
        <slot>
            <template v-if="avatar">
                <base-avatar class="q-mr-xs" slot="start" :src="avatar" :size="avatarSize" />
            </template>
            <template v-else-if="icon">
                <template v-if="!iconOnly">
                    <base-icon slot="start" class="q-pb-xs" :icon="icon" :size="iconSize" :icon-set="iconSet"
                        :color="iconColor ? 'text-' + iconColor : ''" />
                </template>
                <template v-else>
                    <base-icon slot="icon-only" class="q-pb-xs" :icon="icon" :size="iconSize" :icon-set="iconSet"
                        :color="iconColor ? 'text-' + iconColor : clear ? 'text-black' : ''" />
                </template>
            </template>
            <template v-if="label">{{ label }}</template>
            <template v-if="iconRight">
                <base-icon slot="end" class="q-pb-xs" :icon="iconRight" :size="iconSize" :icon-set="iconSet"
                    :color="iconColor ? 'text-' + iconColor : ''" />
            </template>
        </slot>
    </ion-button>
</template>
