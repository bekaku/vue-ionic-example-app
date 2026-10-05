<script setup lang="ts">
import { useDateFns } from '@/composables/useDateFns';
import { FORMAT_DATE13 } from '@/utils/DateUtil';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BasePage from '@/components/base/BasePage.vue';
import MessageItem from '@/components/chat/MessageItem.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { chatHistoryListApi, chatMessageListApi } from '@/libs/data';
import type { ChatMessageAction, EmojiType } from '@/types/common';
import type { GroupChatMsgDto, IdType } from '@/types/models';
import {
  IonContent,
  IonFooter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTextarea,
  IonToolbar,
  onIonViewDidEnter,
} from '@ionic/vue';
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  mdiChevronRight,
  mdiEmoticon,
  mdiFileGifBox,
  mdiImage,
  mdiMicrophone,
  mdiSend,
  mdiStickerEmoji,
  mdiThumbUp,
} from '@quasar/extras/mdi-v7';

const { getDateNow, formatDateBy } = useDateFns();
const PAGE_SIZE = 15;
const { t } = useLang();
const { appConfirm, appToast, writeToClipboard } = useBase();
const route = useRoute();
const contentRef = ref<any>(null);
const loadedCount = ref(PAGE_SIZE);
const loadingOlder = ref(false);
const draftMessage = ref('');
const localMessages = ref<GroupChatMsgDto[]>([]);

const chatId = computed(() => String(route.params.chatId ?? ''));
const chat = computed(() =>
  chatHistoryListApi.dataList.find(
    (item) => String(item.id ?? '') === chatId.value,
  ),
);

// The fixture is a plain object; wrap it so local reaction changes re-render.
const serverMessages = reactive([...chatMessageListApi.dataList].reverse());
const displayMessages = computed(() =>
  serverMessages.concat(localMessages.value),
);
const visibleMessages = computed(() =>
  displayMessages.value.slice(-loadedCount.value),
);
const hasOlderMessages = computed(
  () => loadedCount.value < displayMessages.value.length,
);

const getScrollElement = async (): Promise<HTMLElement | null> => {
  const ionContent = contentRef.value?.$el ?? contentRef.value;
  if (!ionContent?.getScrollElement) {
    return null;
  }
  return ionContent.getScrollElement();
};

const scrollToLatest = async () => {
  await nextTick();
  const scrollElement = await getScrollElement();
  if (scrollElement) {
    scrollElement.scrollTop = scrollElement.scrollHeight;
  }
};

const prepareConversation = async () => {
  await nextTick();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  const scrollElement = await getScrollElement();
  if (!scrollElement || !chat.value) {
    return;
  }

  // A short first batch cannot be scrolled, so reveal older batches until it can.
  while (
    scrollElement.clientHeight > 0 &&
    scrollElement.scrollHeight <= scrollElement.clientHeight &&
    hasOlderMessages.value
  ) {
    loadedCount.value = Math.min(
      loadedCount.value + PAGE_SIZE,
      displayMessages.value.length,
    );
    await nextTick();
  }
  scrollElement.scrollTop = scrollElement.scrollHeight;
};

const hasDraft = computed(() => draftMessage.value.trim().length > 0);
// Messenger-style: the left actions collapse behind a chevron while typing.
const composerActionsExpanded = ref(false);
const showComposerActions = computed(
  () => !hasDraft.value || composerActionsExpanded.value,
);
watch(draftMessage, () => {
  composerActionsExpanded.value = false;
});

// Enter sends; Shift+Enter (or an IME composition) inserts a new line.
const onComposerKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) {
    return;
  }
  event.preventDefault();
  void sendMessage();
};

const sendMessage = async (content?: string) => {
  const chatMsg = (content ?? draftMessage.value).trim();
  if (!chatMsg) {
    return;
  }

  const now = getDateNow();
  localMessages.value.push({
    id: `local-${now.getTime()}`,
    chatMsg,
    msgDateTime: formatDateBy(now, FORMAT_DATE13),
    readCount: 0,
    sent: true,
    unsend: false,
    files: [],
    liked: false,
    reactionEngage: [],
    chatMessageType: 'TEXT',
  });
  if (content === undefined) {
    draftMessage.value = '';
  }
  await scrollToLatest();
};

const loadOlderMessages = async (event: {
  target?: { complete?: () => void };
}) => {
  if (loadingOlder.value || !hasOlderMessages.value) {
    event.target?.complete?.();
    return;
  }

  // Keep IonInfiniteScroll enabled so complete() can re-arm the next top scroll.
  loadingOlder.value = true;
  try {
    const currentChatId = chatId.value;
    const scrollElement = await getScrollElement();
    const oldScrollHeight = scrollElement?.scrollHeight ?? 0;
    const oldScrollTop = scrollElement?.scrollTop ?? 0;

    // The source is a static fixture; reveal the next older batch as a sample page.
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (currentChatId !== chatId.value) {
      return;
    }
    loadedCount.value = Math.min(
      loadedCount.value + PAGE_SIZE,
      displayMessages.value.length,
    );
    await nextTick();

    const updatedScrollElement = await getScrollElement();
    if (updatedScrollElement && scrollElement) {
      updatedScrollElement.scrollTop =
        oldScrollTop + updatedScrollElement.scrollHeight - oldScrollHeight;
    }
  } finally {
    loadingOlder.value = false;
    event.target?.complete?.();
  }
};

// Local-only reaction toggle (no API yet): picking the current reaction
// removes it, picking another one moves the user's count to it.
const onReactionSelect = (message: GroupChatMsgDto, emojiType: EmojiType) => {
  const reactions = message.reactionEngage ?? [];
  const changeCount = (type: EmojiType, delta: number) => {
    const reaction = reactions.find((item) => item.emojiType === type);
    if (reaction) {
      reaction.total = Math.max(0, reaction.total + delta);
    } else if (delta > 0) {
      reactions.push({ emojiType: type, total: delta });
    }
  };

  const previous = message.liked ? message.emojiType : null;
  if (previous) {
    changeCount(previous, -1);
  }
  if (previous === emojiType) {
    message.liked = false;
    message.emojiType = null;
  } else {
    changeCount(emojiType, 1);
    message.liked = true;
    message.emojiType = emojiType;
  }
  message.reactionEngage = reactions;
};

const removeMessage = (message: GroupChatMsgDto) => {
  for (const list of [serverMessages, localMessages.value]) {
    const index = list.indexOf(message);
    if (index >= 0) {
      list.splice(index, 1);
      return;
    }
  }
};

// Local-only actions (no API yet); Reply and Share are placeholders.
const onMessageAction = async (message: GroupChatMsgDto, action: ChatMessageAction) => {
  switch (action) {
    case 'copy':
      if (message.chatMsg) {
        await writeToClipboard(message.chatMsg);
      }
      break;
    case 'unsend':
      message.unsend = true;
      message.chatMsg = t('base.messageUnsent');
      message.files = [];
      message.reactionEngage = [];
      message.liked = false;
      message.emojiType = null;
      break;
    case 'delete':
      if (await appConfirm(t('base.delete'), t('base.deleteConfirm'))) {
        removeMessage(message);
      }
      break;
    default:
      await appToast({ text: t('base.commingsoon') });
  }
};

const focusReplyMessage = async (replyId: IdType) => {
  if (replyId == null) {
    console.log('open modal');
    return;
  }

  const id = String(replyId);
  const messages = displayMessages.value;
  const targetIndex = messages.findIndex(
    (message) => message.id != null && String(message.id) === id,
  );
  if (targetIndex < 0) {
    console.log('open modal');
    return;
  }

  const neededCount = messages.length - targetIndex;
  if (neededCount > loadedCount.value) {
    loadedCount.value = Math.min(
      messages.length,
      Math.ceil(neededCount / PAGE_SIZE) * PAGE_SIZE,
    );
  }
  await nextTick();

  const ionContent = (contentRef.value?.$el ??
    contentRef.value) as HTMLElement | null;
  const target = Array.from(
    ionContent?.querySelectorAll<HTMLElement>('[data-message-id]') ?? [],
  ).find((element) => element.dataset.messageId === id);
  const scrollElement = await getScrollElement();
  if (!target || !scrollElement) {
    console.log('open modal');
    return;
  }

  const targetRect = target.getBoundingClientRect();
  const scrollRect = scrollElement.getBoundingClientRect();
  target.focus({ preventScroll: true });
  scrollElement.scrollTo({
    top:
      scrollElement.scrollTop +
      targetRect.top -
      scrollRect.top -
      (scrollElement.clientHeight - targetRect.height) / 2,
    behavior: 'smooth',
  });
};

onIonViewDidEnter(() => {
  loadedCount.value = PAGE_SIZE;
  void prepareConversation();
});

watch(chatId, () => {
  loadedCount.value = PAGE_SIZE;
  localMessages.value = [];
  draftMessage.value = '';
  void prepareConversation();
});
</script>

<template>
  <BasePage
    :page-title="chat?.groupName || t('nav.chats')"
    page-default-back-link="/tabs/chat"
  >
    <!-- #content keeps IonContent's ref for scrolling and puts IonFooter beside it. -->
    <template #content>
      <ion-content ref="contentRef" class="chat-room-content">
        <template v-if="chat">
          <ion-infinite-scroll
            v-if="hasOlderMessages"
            position="top"
            threshold="100px"
            @ion-infinite="loadOlderMessages"
          >
            <ion-infinite-scroll-content
              :loading-text="t('base.pleaseWaitWhileLoadingMoreData')"
            />
          </ion-infinite-scroll>

          <div class="conversation-date">
            {{ chat.groupName }}
          </div>
          <div class="message-list">
            <MessageItem
              v-for="message in visibleMessages"
              :key="`${String(message.id)}-${message.msgDateTime}`"
              :message="message"
              @reply-click="focusReplyMessage"
              @reaction-select="onReactionSelect"
              @message-action="onMessageAction"
            />
          </div>
        </template>

        <div v-else class="empty-state" role="status">
          {{ t('error.chatNotfound') }}
        </div>
      </ion-content>

      <ion-footer v-if="chat" class="chat-footer">
        <ion-toolbar>
          <div class="chat-composer">
            <template v-if="showComposerActions">
              <BaseButton
                class="chat-composer-action"
                clear
                round
                color="primary"
                :aria-label="t('base.voiceMessage')"
              >
                <BaseIcon slot="icon-only" :name="mdiMicrophone" icon-set="mdi" :size="24" />
              </BaseButton>
              <BaseButton
                class="chat-composer-action"
                clear
                round
                color="primary"
                :aria-label="t('base.img')"
              >
                <BaseIcon slot="icon-only" :name="mdiImage" icon-set="mdi" :size="24" />
              </BaseButton>
              <BaseButton
                class="chat-composer-action"
                clear
                round
                color="primary"
                :aria-label="t('base.sticker')"
              >
                <BaseIcon slot="icon-only" :name="mdiStickerEmoji" icon-set="mdi" :size="24" />
              </BaseButton>
              <BaseButton
                class="chat-composer-action"
                clear
                round
                color="primary"
                :aria-label="t('base.gif')"
              >
                <BaseIcon slot="icon-only" :name="mdiFileGifBox" icon-set="mdi" :size="24" />
              </BaseButton>
            </template>
            <BaseButton
              v-else
              class="chat-composer-action"
              clear
              round
              color="primary"
              :aria-label="t('nav.more')"
              @click="composerActionsExpanded = true"
            >
              <BaseIcon slot="icon-only" :name="mdiChevronRight" icon-set="mdi" :size="28" />
            </BaseButton>

            <ion-textarea
              v-model="draftMessage"
              class="chat-composer-input"
              :placeholder="t('base.typeMsg')"
              :rows="1"
              auto-grow
              enterkeyhint="send"
              @keydown="onComposerKeydown"
            >
              <BaseButton
                slot="end"
                class="chat-composer-action"
                clear
                round
                color="primary"
                :aria-label="t('base.emoji')"
              >
                <BaseIcon slot="icon-only" :name="mdiEmoticon" icon-set="mdi" :size="24" />
              </BaseButton>
            </ion-textarea>

            <!-- Like sends 👍 while the draft is empty; it turns into Send once text is typed. -->
            <BaseButton
              v-if="hasDraft"
              class="chat-composer-action"
              clear
              round
              color="primary"
              :aria-label="t('base.send')"
              @click="sendMessage()"
            >
              <BaseIcon slot="icon-only" :name="mdiSend" icon-set="mdi" :size="24" />
            </BaseButton>
            <BaseButton
              v-else
              class="chat-composer-action"
              clear
              round
              color="primary"
              :aria-label="t('base.like')"
              @click="sendMessage('👍')"
            >
              <BaseIcon slot="icon-only" :name="mdiThumbUp" icon-set="mdi" :size="26" />
            </BaseButton>
          </div>
        </ion-toolbar>
      </ion-footer>
    </template>
  </BasePage>
</template>

<style scoped lang="scss">
.chat-room-content {
  --background: #fff;
}

body[color-theme='dark'] {
  .chat-room-content {
    --background: var(--app-bg-page-dark);
  }
}

.conversation-date {
  width: fit-content;
  margin: 18px auto;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--app-chat-bubble-received-bg);
  color: var(--ion-color-medium);
  font-size: 12px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 14px 22px;
}

.chat-footer ion-toolbar {
  --padding-start: 8px;
  --padding-end: 8px;
  --min-height: 58px;
}

.chat-composer {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding-block: 4px;
}

.chat-composer-action {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  min-height: 0;
  // (40px field - 36px button) / 2: centred on a single line, bottom-aligned when it grows.
  margin: 0 0 2px;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
}

.chat-composer-input {
  --composer-line-height: 20px;
  --composer-padding-block: 10px;
  --composer-max-rows: 11;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 40px;
  margin: 0 4px;
  --background: var(--app-chat-input-bg);
  --color: var(--ion-text-color);
  --border-radius: 20px;
  --padding-start: 16px;
  --padding-end: 2px;
  // iOS mode adds 10px/8px here; the textarea's own padding sets the height.
  --padding-top: 0;
  --padding-bottom: 0;
  line-height: var(--composer-line-height);

  // Ionic pins the end slot to the top; keep the emoji button on the last line.
  :deep(.textarea-end) {
    align-self: flex-end;
  }

  // Auto-grow up to 11 rows, then scroll inside the field.
  :deep(.native-wrapper) {
    max-height: calc(
      var(--composer-line-height) * var(--composer-max-rows) +
        var(--composer-padding-block) * 2
    );
    overflow-y: auto;
  }

  :deep(.native-wrapper::after),
  :deep(textarea) {
    margin: 0;
    padding-block: var(--composer-padding-block);
    line-height: var(--composer-line-height);
  }
}

.empty-state {
  padding: 48px 20px;
  color: var(--ion-color-medium);
  text-align: center;
}
</style>
