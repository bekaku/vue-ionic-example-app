<template>
  <notification-badge
    :no="notify.totalNotify"
    @click="onGo"
  ></notification-badge>
</template>
<script setup lang="ts">
import { defineAsyncComponent, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/NotificationStore';
import { useDeviceStore } from '@/stores/DeviceStore';
import { useBase } from '@/composables/UseBase';
import { useNotification } from '@/composables/UseNotification';
import NotificationBadge from '@/components/notification/Badge.vue';
const deviceStore = useDeviceStore();
const { isActive } = storeToRefs(deviceStore);

const { notify, setLastNotify } = useNotificationStore();
const { WeeGoTo } = useBase();
const { fetchNotReadNotify } = useNotification();
onMounted(() => {
  // fetchNotReadNotify();
});
const onGo = () => {
  if (notify.totalNotify) {
    setLastNotify(notify.lastestId);
    notify.totalNotify = 0;
  }

  WeeGoTo('/notifications');
};
watch(isActive, (state) => {
  if (state) {
    fetchNotReadNotify();
  }
});
</script>
