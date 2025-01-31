<template>
  <notification-badge
    :no="notify.totalNotify"
    @click="onGo"
  ></notification-badge>
</template>
<script setup lang="ts">
import NotificationBadge from '@/components/notification/Badge.vue';
import { useBase } from '@/composables/useBase';
import { useNotification } from '@/composables/useNotification';
import { useDeviceStore } from '@/stores/deviceStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';
const deviceStore = useDeviceStore();
const { isActive } = storeToRefs(deviceStore);

const { notify, setLastNotify } = useNotificationStore();
const { appNavigateTo } = useBase();
const { fetchNotReadNotify } = useNotification();
onMounted(() => {
  // fetchNotReadNotify();
});
const onGo = () => {
  if (notify.totalNotify) {
    setLastNotify(notify.lastestId);
    notify.totalNotify = 0;
  }

  appNavigateTo('/notifications');
};
watch(isActive, (state) => {
  if (state) {
    fetchNotReadNotify();
  }
});
</script>
