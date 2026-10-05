<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseInfiniteScroll from '@/components/base/BaseInfiniteScroll.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useLang } from '@/composables/useLang';
import { useBase } from '@/composables/useBase';
import { chatHistoryListApi } from '@/libs/data';
import type { GroupChatDto } from '@/types/models';
import { useDateFns } from '@/composables/useDateFns';
import {
  IonBadge,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
} from '@ionic/vue';
import { computed, ref } from 'vue';

const { formatDateTime } = useDateFns();
const PAGE_SIZE = 15;
const { t } = useLang();
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
  return formatDateTime({ date: value, format: 'MMM d, HH:mm' });
};

const getChatAvatar = (chat: GroupChatDto) =>
  chat.dtoAvatar?.thumbnail || chat.dtoAvatar?.image || undefined;
</script>

<template>
  <BasePage
    :page-title="t('nav.chats')"
    collapse="condense"
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

    <ion-list v-if="visibleChats.length" class="chat-history-list app-surface app-surface-flush">
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
  margin: 8px var(--app-space-page) 0;
}

.chat-history-item {
  --min-height: 76px;
}

/* Separators start after the avatar, like an inset grouped list */
.chat-history-item:not(:last-child) {
  --inner-border-width: 0 0 0.55px 0;
}

.chat-avatar {
  position: relative;
  overflow: visible;
  margin-inline-end: 14px;
}

.chat-avatar-fallback {
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  border-radius: 50%;
  background: var(--app-bg-accent);
  color: var(--app-text-accent);
  font-weight: 700;
}

.online-indicator {
  position: absolute;
  right: 0;
  bottom: 1px;
  width: 13px;
  height: 13px;
  border: 2.5px solid var(--app-bg-surface);
  border-radius: 50%;
  background: var(--app-live);
}

.chat-label {
  min-width: 0;
  padding-block: 10px;
}

.chat-title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.chat-title-row h2 {
  overflow: hidden;
  margin: 0;
  color: var(--app-text-strong);
  font-size: 0.9375rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  color: var(--app-text-muted);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.chat-label p {
  overflow: hidden;
  margin: 4px 0 0;
  color: var(--app-text-muted);
  font-size: 0.875rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  min-width: 22px;
  margin-inline-start: 8px;
  padding: 4px 7px;
  border-radius: var(--app-radius-full);
  font-variant-numeric: tabular-nums;
}

.empty-state {
  padding: 48px 20px;
  color: var(--app-text-muted);
  text-align: center;
}
</style>
