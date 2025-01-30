<template>
  <ion-item v-if="item" button :detail="item.itemDetail" lines="none" :router-link="item.link"
    @click="$emit('onSelect', item)">
    <slot name="start">
      <ion-icon v-if="item.icon && item.iconType == 'ion'" :icon="item.icon"
        :style="item.iconSize ? `font-size:${item.iconSize}px` : undefined"
        :class="item.iconColor ? item.iconColor : ''" slot="start"></ion-icon>
      <template v-else-if="item.icon && item.iconType == 'bootstrap'">
        <span slot="start">
          <base-icon :icon="item.icon" :size="item.iconSize ? item.iconSize : 26" icon-set="bootstrap-icons"
            :color="item.iconColor ? item.iconColor : ''"></base-icon>
        </span>
      </template>
    </slot>
    <ion-label class="ion-text-capitalize">
      {{
        item.i18n ? t(item.title) : item.title
      }}
    </ion-label>
  </ion-item>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import type { IMenuItem } from '@/types/Models';
import { useLang } from '@/composables/UseLang';
import BaseIcon from '@/components/base/Icon.vue';
import { IonItem, IonLabel, IonIcon } from '@ionic/vue';
defineProps({
  modelValue: {
    type: String,
  },
  item: {
    type: Object as PropType<IMenuItem>,
    default: () => null,
  },
});
const emit = defineEmits(['update:modelValue', 'onSelect']);
const { t } = useLang();
</script>
