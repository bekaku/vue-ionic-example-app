<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseInfiniteScroll from '@/components/base/BaseInfiniteScroll.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useLang } from '@/composables/useLang';
import { useBase } from '@/composables/useBase';
import { chatHistoryListApi } from '@/libs/data';
import type { GroupChatDto } from '@/types/models';
import { formatDateTime } from '@/utils/DateUtil';
import {
  IonBadge,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
} from '@ionic/vue';
import { computed, ref } from 'vue';

const PAGE_SIZE = 5;
const { t, locale } = useLang();
const { appNavigateTo } = useBase();
const searchText = ref('');
const visibleCount = ref(PAGE_SIZE);
const loadingMore = ref(false);

const filteredChats = computed(() => {
  const search = searchText.value.trim().toLocaleLowerCase();
  if (!search) {
    return chatHistoryListApi.dataList;
  }

  return chatHistoryListApi.dataList.filter(chat =>
    `${chat.groupName ?? ''} ${chat.latestMessage ?? ''}`
      .toLocaleLowerCase()
      .includes(search),
  );
});

const visibleChats = computed(() =>
  filteredChats.value.slice(0, visibleCount.value),
);
const hasMoreChats = computed(() => visibleCount.value < filteredChats.value.length);

const onSearchInput = (event: CustomEvent<{ value?: string | null }>) => {
  searchText.value = event.detail.value ?? '';
  visibleCount.value = PAGE_SIZE;
};

const loadMoreChats = async (event: { target?: { complete?: () => void } }) => {
  if (loadingMore.value || !hasMoreChats.value) {
    event.target?.complete?.();
    return;
  }

  loadingMore.value = true;
  try {
    // The source is a static fixture, so this page simulates a short page load.
    await new Promise(resolve => setTimeout(resolve, 250));
    visibleCount.value = Math.min(
      visibleCount.value + PAGE_SIZE,
      filteredChats.value.length,
    );
  } finally {
    loadingMore.value = false;
    event.target?.complete?.();
  }
};

const openChat = (chat: GroupChatDto) => {
  if (typeof chat.id !== 'string') {
    return;
  }
  appNavigateTo(`/chat/${encodeURIComponent(chat.id)}`);
};

const getInitials = (name?: string | null) =>
  (name ?? '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toLocaleUpperCase();

const formatChatTime = (value?: string | null) => {
  if (!value) {
    return '';
  }
  return formatDateTime(value, 'MMM d, HH:mm', locale.value);
};

const getChatAvatar = (chat: GroupChatDto) =>
  chat.dtoAvatar?.thumbnail || chat.dtoAvatar?.image || undefined;
</script>

<template>
  <BasePage
    :page-title="t('nav.chats')"
    fullscreen
    :content-padding="false"
    :show-back-link="false"
  >
    <ion-searchbar
      mode="ios"
      animated
      :placeholder="`${t('base.search')} ${t('nav.chats')}`"
      :debounce="200"
      @ion-input="onSearchInput"
    />

    <ion-list v-if="visibleChats.length" class="chat-history-list">
      <ion-item
        v-for="chat in visibleChats"
        :key="String(chat.id)"
        button
        :detail="false"
        lines="none"
        class="chat-history-item"
        @click="openChat(chat)"
      >
        <BaseAvatar
          v-if="getChatAvatar(chat)"
          slot="start"
          class="chat-avatar"
          :src="getChatAvatar(chat) ?? ''"
          :size="50"
        >
          <template #extra>
            <span
              v-if="chat.online"
              class="online-indicator"
              :aria-label="t('online')"
            />
          </template>
        </BaseAvatar>
        <div v-else slot="start" class="chat-avatar chat-avatar-fallback">
          <span>{{ getInitials(chat.groupName) }}</span>
          <span
            v-if="chat.online"
            class="online-indicator"
            :aria-label="t('online')"
          />
        </div>

        <ion-label class="chat-label">
          <div class="chat-title-row">
            <h2>{{ chat.groupName || t('nav.chats') }}</h2>
            <time v-if="chat.latestUpdate" class="chat-time">
              {{ formatChatTime(chat.latestUpdate) }}
            </time>
          </div>
          <p>{{ chat.latestMessage || t('base.img') }}</p>
        </ion-label>

        <ion-badge
          v-if="chat.totalNewMessage > 0"
          slot="end"
          color="primary"
          class="unread-badge"
        >
          {{ chat.totalNewMessage > 99 ? '99+' : chat.totalNewMessage }}
        </ion-badge>
      </ion-item>
    </ion-list>

    <div v-else class="empty-state" role="status">
      {{ t('error.dataNotfound') }}
    </div>

    <BaseInfiniteScroll
      v-if="hasMoreChats"
      position="bottom"
      @on-infinite="loadMoreChats"
    />
  </BasePage>
</template>

<style scoped>
.chat-history-list {
  margin: 0;
}

.chat-history-item {
  --padding-start: 16px;
  --inner-padding-end: 16px;
  --min-height: 78px;
}

.chat-avatar {
  position: relative;
  overflow: visible;
}

.chat-avatar-fallback {
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  border-radius: 50%;
  background: var(--ion-color-light);
  color: var(--ion-color-primary);
  font-weight: 700;
}

.online-indicator {
  position: absolute;
  right: 0;
  bottom: 1px;
  width: 12px;
  height: 12px;
  border: 2px solid var(--ion-background-color, #fff);
  border-radius: 50%;
  background: var(--ion-color-success);
}

.chat-label {
  min-width: 0;
  padding-block: 8px;
}

.chat-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.chat-title-row h2 {
  overflow: hidden;
  margin: 0;
  font-size: 15px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time,
.chat-label small {
  color: var(--ion-color-medium);
  font-size: 11px;
  white-space: nowrap;
}

.chat-label p {
  overflow: hidden;
  margin: 6px 0 0;
  color: var(--ion-color-medium-shade);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-label small {
  display: block;
  margin-top: 4px;
}

.unread-badge {
  margin-inline-start: 8px;
}

.empty-state {
  padding: 48px 20px;
  color: var(--ion-color-medium);
  text-align: center;
}
</style>
