<template>
  <notification-badge
    :no="notify.totalNotify"
    @click="onGo"
  ></notification-badge>
</template>
<script setup lang="ts">
import NotificationBadge from '@/components/notification/Badge.vue';
import { useBase } from '@/composables/UseBase';
import { useNotification } from '@/composables/UseNotification';
import { useDeviceStore } from '@/stores/DeviceStore';
import { useNotificationStore } from '@/stores/NotificationStore';
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';
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
