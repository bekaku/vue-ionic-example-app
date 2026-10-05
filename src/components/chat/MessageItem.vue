<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseContentItem from '@/components/base/BaseContentItem.vue';
import BaseFileItems from '@/components/base/BaseFileItems.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseDropdownMenu from '@/components/base/BaseDropdownMenu.vue';
import BasePopover from '@/components/base/BasePopover.vue';
import { useLang } from '@/composables/useLang';
import type { ChatMessageAction, EmojiType, LabelValue } from '@/types/common';
import type { FileManager, GroupChatMsgDto, IdType } from '@/types/models';
import { useDateFns } from '@/composables/useDateFns';
import { IonLabel } from '@ionic/vue';
import {
  arrowRedoOutline,
  arrowUndoOutline,
  closeCircleOutline,
  copyOutline,
  ellipsisVertical,
  happy,
  happyOutline,
  trashOutline,
} from 'ionicons/icons';
import { computed, ref, useId } from 'vue';

const { formatDateTime } = useDateFns();
const { message } = defineProps<{ message: GroupChatMsgDto }>();
const emit = defineEmits<{
  (event: 'reply-click', id: IdType): void;
  (event: 'message-action', message: GroupChatMsgDto, action: ChatMessageAction): void;
  (event: 'reaction-select', message: GroupChatMsgDto, emojiType: EmojiType): void;
}>();
const { t } = useLang();
const contentId = useId();

const reactionEmoji: Record<EmojiType, string> = {
  LIKE: '👍',
  FIGHTING: '💪',
  LAUGH: '😂',
  WOW: '😮',
  CARE: '🥰',
  SAD: '😢',
};
const reactionOptions = Object.keys(reactionEmoji) as EmojiType[];

// Unsent messages only offer Delete; Copy needs text; Unsend is for your own messages.
const actionItems = computed<LabelValue<ChatMessageAction>[]>(() => {
  if (message.unsend) {
    return [
      { label: t('base.delete'), value: 'delete', icon: { name: trashOutline }, color: 'danger' },
    ];
  }
  const items: LabelValue<ChatMessageAction>[] = [
    { label: t('base.reply'), value: 'reply', icon: { name: arrowUndoOutline } },
    { label: t('base.share'), value: 'share', icon: { name: arrowRedoOutline } },
  ];
  if (message.chatMsg) {
    items.push({ label: t('base.copy'), value: 'copy', icon: { name: copyOutline } });
  }
  if (message.sent) {
    items.push({ label: t('base.unsend'), value: 'unsend', icon: { name: closeCircleOutline } });
  }
  items.push({ label: t('base.delete'), value: 'delete', icon: { name: trashOutline }, color: 'danger' });
  return items;
});
const onActionSelect = (action: ChatMessageAction | undefined) => {
  if (action) {
    emit('message-action', message, action);
  }
};

const reactionPickerOpen = ref(false);
const reactionPickerEvent = ref<Event>();
const openReactionPicker = (event: Event) => {
  reactionPickerEvent.value = event;
  reactionPickerOpen.value = true;
};
const selectReaction = (emojiType: EmojiType) => {
  reactionPickerOpen.value = false;
  emit('reaction-select', message, emojiType);
};

const avatar = computed(() =>
  message.sendUser?.avatar?.thumbnail || message.sendUser?.avatar?.image || undefined,
);
const messageTime = computed(() =>
  formatDateTime({ date: message.msgDateTime, format: 'MMM d, HH:mm' }),
);
const reply = computed(() => message.dtoReplyTo);
const replyText = computed(() =>
  reply.value?.chatMsg || reply.value?.chatMessageType || t('base.message'),
);
const attachedFiles = computed<FileManager[]>(() =>
  (message.files ?? [])
    .map(item => item.fileManager)
    .filter((file): file is FileManager => file != null),
);
const getImageItems = computed(() =>
  attachedFiles.value.filter(file => file.fileMimeType === 'IMAGE'),
);
const getFilesItems = computed(() =>
  attachedFiles.value.filter(file => file.fileMimeType !== 'IMAGE'),
);
const hasAttachments = computed(() => attachedFiles.value.length > 0);
const sortedReactions = computed(() =>
  [...(message.reactionEngage ?? [])]
    .filter(reaction => reaction.total > 0)
    .sort((a, b) => b.total - a.total),
);
</script>

<template>
  <article
    class="message-row"
    :class="{ 'message-row-sent': message.sent }"
    :data-message-id="message.id == null ? undefined : String(message.id)"
    tabindex="-1"
  >
    <template v-if="!message.sent">
      <BaseAvatar v-if="avatar" class="message-avatar" :src="avatar" :size="30" />
      <span v-else class="message-avatar message-avatar-fallback" aria-hidden="true">
        {{ message.sendUser?.username?.slice(0, 1) || '?' }}
      </span>
    </template>
    <div class="message-body">
      <ion-label v-if="!message.sent" class="sender-name">
        {{ message.sendUser?.username || t('base.userData') }}
      </ion-label>
      <div class="message-bubble">
        <BaseButton
          v-if="reply"
          class="reply-preview"
          clear
          full
          @click.stop="emit('reply-click', reply.id)"
        >
          <span class="reply-content">
            <strong class="reply-sender">{{ reply.sendUser?.username || t('base.userData') }}</strong>
            <span class="reply-text">{{ replyText }}</span>
          </span>
        </BaseButton>
        <span v-if="message.unsend">{{ message.chatMsg || t('base.message') }}</span>
        <BaseContentItem
          v-else-if="message.chatMsg"
          wrap-text
          :content="message.chatMsg"
          :content-id="contentId"
          is-escape-html
          hashtag-urlify
          :show-copy-text="false"
          :show-more="false"
          :limit="10"
        />
        <span v-else-if="!hasAttachments">{{ message.chatMessageType || t('base.message') }}</span>
        <div v-if="!message.unsend && hasAttachments" class="message-attachments">
          <div
            v-if="getImageItems.length"
            class="message-attachment-images"
            :class="{ 'single-image-grid': getImageItems.length === 1 }"
          >
            <BaseFileItems
              :items="getImageItems"
              layout="grid"
              :grid-size="getImageItems.length === 1 ? '1' : '6'"
              :limit="4"
              show-view-dialog
            />
          </div>
          <div v-if="getFilesItems.length" class="message-attachment-files">
            <BaseFileItems
              :items="getFilesItems"
              layout="list"
              :limit="4"
              show-view-dialog
            />
          </div>
        </div>
      </div>
      <div v-if="sortedReactions.length" class="reaction-summary">
        <span
          v-for="reaction in sortedReactions"
          :key="reaction.emojiType"
          class="reaction-count"
        >
          <span>{{ reactionEmoji[reaction.emojiType] }}</span>
          <span>{{ reaction.total }}</span>
        </span>
      </div>
      <div class="message-meta">
        <time class="message-time">{{ messageTime }}</time>
        <div class="message-actions">
          <BaseDropdownMenu
            class="message-action"
            :aria-label="t('nav.more')"
            :items="actionItems"
            :icon="{ name: ellipsisVertical, size: 18 }"
            witdh="200px"
            @on-select="onActionSelect"
          />
          <BaseButton
            class="message-action"
            :class="{ 'message-action-liked': message.liked }"
            clear
            round
            :aria-label="message.liked ? t('base.reacted') : t('base.react')"
            @click.stop="openReactionPicker"
          >
            <BaseIcon
              slot="icon-only"
              :name="message.liked ? happy : happyOutline"
              icon-set="ion"
              :size="18"
              style="top: 0"
              aria-hidden="true"
            />
          </BaseButton>
        </div>
      </div>
    </div>
    <BasePopover
      v-model="reactionPickerOpen"
      :event="reactionPickerEvent"
      :padding="false"
      width="280px"
      @on-close="reactionPickerOpen = false"
    >
      <div class="reaction-picker" role="group" :aria-label="t('base.react')">
        <BaseButton
          v-for="emojiType in reactionOptions"
          :key="emojiType"
          class="reaction-option"
          :class="{ 'reaction-option-selected': message.emojiType === emojiType }"
          clear
          round
          :aria-label="reactionEmoji[emojiType]"
          :aria-pressed="message.emojiType === emojiType"
          @click="selectReaction(emojiType)"
        >
          {{ reactionEmoji[emojiType] }}
        </BaseButton>
      </div>
    </BasePopover>
  </article>
</template>

<style scoped>
.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 88%;
  align-self: flex-start;
  border-radius: 16px;
  outline: none;
}

.message-row:focus .message-bubble {
  box-shadow: 0 0 0 3px var(--ion-color-warning);
}

.message-row-sent {
  align-self: flex-end;
}

.message-avatar {
  flex: 0 0 30px;
}

.message-avatar-fallback {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 50%;
  background: var(--ion-color-medium-tint);
  color: var(--ion-color-medium-contrast);
  font-size: 12px;
}

.message-body {
  min-width: 0;
}

.sender-name {
  display: block;
  margin: 0 0 4px 8px;
  color: var(--ion-color-medium-shade);
  font-size: 11px;
}

.message-bubble {
  padding: 10px 13px;
  border-radius: 16px 16px 16px 4px;
  background: var(--app-chat-bubble-received-bg);
  color: var(--ion-text-color);
  font-size: 14px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.message-row-sent .message-bubble {
  border-radius: 16px 16px 4px 16px;
  /* background: linear-gradient(
    135deg,
    var(--ion-color-primary-tint) 0%,
    var(--ion-color-primary) 55%,
    var(--ion-color-primary-shade) 100%
  ); */
   background: linear-gradient(
    to top right,
    #06b6d4, /* cyan-500 */
    #2563eb  /* blue-600 */
  );

  box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.2);
  color: var(--ion-color-primary-contrast);
}

.message-attachments {
  width: min(300px, 72vw);
  max-width: 100%;
  margin-top: 8px;
}

.message-attachments:first-child,
.message-attachment-files:first-child {
  margin-top: 0;
}

.message-attachment-images,
.message-attachment-files {
  min-width: 0;
}

.message-attachment-files {
  margin-top: 6px;
}

.single-image-grid {
  --ion-grid-columns: 1;
}

.reply-preview {
  height: auto;
  min-height: 0;
  margin: 0 0 8px;
  overflow: hidden;
  border-inline-start: 3px solid var(--ion-color-primary);
  border-radius: 4px;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: normal;
  text-transform: none;
  --padding-start: 9px;
  --padding-end: 9px;
  --padding-top: 7px;
  --padding-bottom: 7px;
  --background: var(--app-input-bg);
  --color: var(--ion-text-color);
  --border-radius: 0;
  --box-shadow: none;
}

.reply-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  text-align: start;
}

.message-row-sent .reply-preview {
  border-inline-start-color: var(--ion-color-primary-contrast);
}

.reply-preview:focus-visible {
  outline: 2px solid var(--ion-color-warning);
  outline-offset: 2px;
}

.reply-sender,
.reply-text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reply-sender {
  font-size: 12px;
}

.reply-text {
  font-size: 12px;
}

.reaction-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  width: fit-content;
  max-width: 100%;
  margin-top: 5px;
}

.message-row-sent .reaction-summary {
  margin-inline-start: auto;
}

.reaction-count {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border: 1px solid var(--ion-item-border-color);
  border-radius: 999px;
  background: var(--ion-item-background);
  color: var(--ion-text-color);
  font-size: 11px;
  white-space: nowrap;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
}

.message-row-sent .message-meta {
  flex-direction: row-reverse;
}

.message-time {
  margin-inline: 6px;
  color: var(--ion-color-medium);
  font-size: 10px;
  white-space: nowrap;
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* :deep() so the rules also reach the BaseDropdownMenu trigger button. */
.message-actions :deep(.message-action) {
  width: 28px;
  height: 28px;
  min-height: 0;
  margin: 0;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --background: transparent;
  --color: var(--ion-color-medium-shade);
  --border-radius: 50%;
  --box-shadow: none;
}

.message-actions :deep(.message-action-liked) {
  --background: rgba(var(--ion-color-primary-rgb), 0.12);
  --color: var(--ion-color-primary);
}

.message-actions :deep(.message-action:focus-visible) {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}
.reaction-picker {
  display: flex;
  gap: 2px;
  padding: 6px;
}

.reaction-option {
  width: 42px;
  height: 42px;
  min-height: 0;
  margin: 0;
  font-size: 26px;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --border-radius: 50%;
  --box-shadow: none;
}

.reaction-option-selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.12);
}
</style>
