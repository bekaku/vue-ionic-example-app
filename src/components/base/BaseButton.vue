<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import type { AppColor, ButtonFill, IconSetType, IHrefTarget, IonicColor } from '@/types/common';
import { IonButton } from '@ionic/vue';
const {
    clear = false,
    disabled = false,
    type = 'button',
    iconOnly = false,
    iconSet = 'ion',
    iconSize = 24,
    round = false,
    outline = false,
    avatarSize = 32,
    full = false
} = defineProps<{
    color?: IonicColor
    clear?: boolean
    disabled?: boolean
    expand?: 'block' | 'full'
    fill?: ButtonFill
    full?: boolean
    label?: string
    href?: string
    avatar?: string
    avatarSize?: number
    icon?: string
    iconRight?: string
    iconOnly?: boolean
    iconSize?: number
    iconColor?: AppColor
    iconSet?: IconSetType
    target?: IHrefTarget
    round?: boolean
    outline?: boolean
    size?: 'default' | 'large' | 'small'
    strong?: boolean
    type?: 'button' | 'reset' | 'submit'
    to?: string
}>();
</script>
<template>
    <ion-button v-bind="$attrs" :color :disabled :fill="clear ? 'clear' : outline ? 'outline' : 'solid'"
        :expand="full ? 'block' : undefined" :href :target :type :shape="round ? 'round' : undefined" :size
        :router-link="to || undefined">
        <slot>
            <template v-if="avatar">
                <base-avatar slot="start" class="q-mr-xs" :src="avatar" :size="avatarSize" />
            </template>
            <template v-else-if="!iconOnly && icon">
                <base-icon slot="start" class="q-pb-xs" :class="{ 'q-mr-xs': iconSet != 'ion' }" :icon="icon" :size="iconSize" :icon-set="iconSet"
                    :color="iconColor || ''" />
            </template>
            <base-icon v-if="iconOnly && icon" slot="icon-only" class="q-pb-xs" :icon="icon" :size="iconSize"
                :icon-set="iconSet" :color="iconColor ? iconColor : clear ? 'black' : ''" />

            <template v-if="label">{{ label }}</template>
            <template v-if="iconRight">
                <base-icon slot="end" class="q-pb-xs" :icon="iconRight" :size="iconSize" :icon-set="iconSet"
                    :color="iconColor || ''" />
            </template>
        </slot>
    </ion-button>
</template>
