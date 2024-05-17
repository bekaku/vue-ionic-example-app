<template>
  <ion-item
    :key="index"
    :button="button"
    :detail="false"
    @click="$emit('on-select', item)"
    :lines="lines"
  >
    <div slot="start">
      <ion-avatar style="width: 42px; height: 42px">
        <ion-img :src="item.avatar?.thumbnail"></ion-img>
      </ion-avatar>
    </div>

    <ion-label :class="{ 'ion-text-nowrap': noTextWrap }">
      <h2 class="text-black">{{ item.username }}</h2>
      <h3 class="text-muted">{{ item.email }}</h3>
    </ion-label>
  </ion-item>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { UserDto } from '@/types/Models';
import { IonItem, IonLabel, IonAvatar, IonImg } from '@ionic/vue';
defineProps({
  item: {
    type: Object as PropType<UserDto>,
    default: () => null,
  },
  index: {
    type: Number,
    default: 0,
  },
  button: {
    type: Boolean,
    default: true,
  },
  noTextWrap: {
    type: Boolean,
    default: false,
  },
  lines: {
    type: String as PropType<'none' | 'full' | 'inset' | undefined>,
    default: 'none',
  },
});
defineEmits(['on-select']);
</script>
