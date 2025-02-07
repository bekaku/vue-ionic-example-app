<!-- eslint-disable unicorn/prefer-dom-node-text-content -->
<script setup lang="ts">
/*
 <content-item
          :wrap-text="true"
          :content="post.postContent"
          :content-id="`post-content-item-alt-${post.id}`"
          :open-post-view="false"
          :show-copy-text="false"
          :show-more="false"
          :can-urlify="false"
          @on-click="onItemCLick"
        />
 */
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { appPreventDefult, escapeHtml, openUrlInNewTab, roundDecimal } from '@/utils/appUtil';
import { useLang } from '@/composables/useLang';
import { useBase } from '@/composables/useBase';
import { IonCol, IonRow } from '@ionic/vue';
import BaseLinkText from '@/components/base/BaseLinkText.vue';
import ContentHtml from '@/components/base/BaseContentHtml.vue';
import BaseRippleItem from '@/components/base/BaseRippleItem.vue';
const BaseCopyTextBtn = defineAsyncComponent(() => import('@/components/base/BaseCopyTextBtn.vue'));
const {
    contentId = 'content-id',
    wrapText = true,
    openPage = true,
    showCopyText = true,
    showMore = true,
    showBackground = false,
    canUrlify = true,
    limit = 4,
    isEscapeHtml = false,
    hashtagUrlify = true,
    to
}
    = defineProps<{
        contentId?: string
        content?: string
        wrapText?: boolean
        to?: string
        openPage?: boolean
        showCopyText?: boolean
        showMore?: boolean
        showBackground?: boolean
        canUrlify?: boolean
        hashtagUrlify?: boolean
        limit?: number
        isEscapeHtml?: boolean
        textCssStyle?: string
        highLightText?: string
        ripple?: boolean
    }>();
const emit = defineEmits(['on-click']);
const { appNavigateTo, } = useBase();
const { t } = useLang();
const lineHeight = ref(0);
const showMoreBtn = ref(false);
const showMoreText = ref(false);
const contentTimeOut = ref();
onMounted(() => {
    setLimitText();
});
const setLimitText = () => {
    contentTimeOut.value = setTimeout(() => {
        setDescHeight();
        if (canUrlify) {
            setEvenListener();
        }
    }, 50);
};
const setEvenListener = () => {
    const links = document.querySelectorAll(`.content-href-${contentId}`);
    links.forEach((l) => {
        l.addEventListener('click', onHtmlClick);
    });
    if (hashtagUrlify) {
        const hashtags = document.querySelectorAll(
            `.hashtag-href-${contentId}`
        );
        hashtags.forEach((h) => {
            h.addEventListener('click', onHashtagClick);
        });
    }
};
const removeEvenListener = () => {
    const links = document.querySelectorAll(`.content-href-${contentId}`);
    links.forEach((l) => {
        l.removeEventListener('click', onHtmlClick);
    });
    const tagsLinks = document.querySelectorAll(
        `.hashtag-href-${contentId}`
    );
    tagsLinks.forEach((l) => {
        l.removeEventListener('click', onHashtagClick);
    });
};
onBeforeUnmount(() => {
    if (contentTimeOut.value) {
        clearTimeout(contentTimeOut.value);
        contentTimeOut.value = null;
    }
    removeEvenListener();
    showMoreText.value = false;
});

const onHtmlClick = (event: any) => {
    if (!event.target.classList.contains(`content-href-${contentId}`))
        return;
    if (event.srcElement && event.srcElement.href) {
        const link = event.srcElement.href;
        // checkInAppOpen(event, link);
        openUrlInNewTab(link, event);
    }
    event.stopPropagation();
    event.preventDefault();
};
const onHashtagClick = (event: any) => {
    if (!event.target.classList.contains(`hashtag-href-${contentId}`))
        return;
    if (event.srcElement && event.srcElement.innerText) {
        const hashtag = event.srcElement.innerText;
        if (hashtag) {
            appNavigateTo(`/hashtag/${hashtag.replace('#', '')}`);
        }
    }

    event.stopPropagation();
    event.preventDefault();
};
const setDescHeight = () => {
    if (wrapText) {
        const el = document.getElementById(contentId);
        if (el) {
            const divHeight = el.offsetHeight;
            const lh = divHeight / 20;
            lineHeight.value = roundDecimal(lh, 0);
            if (lineHeight.value > limit) {
                showMoreBtn.value = true;
            }
        }
    }
};
const urlify = (
    rawText: string,
    linkColor: string | undefined = undefined
) => {
    const inputText = isEscapeHtml ? escapeHtml(rawText) : rawText;
    if (canUrlify) {
        const urlRegex = /(https?:\/\/\S+)/g;
        const textLink = inputText.replace(urlRegex, (url) => {
            return `<a class="content-href-${contentId} app-text-link ${linkColor || ''
                }" href="${url}">${url}</a>`;
        });

        if (!hashtagUrlify) {
            return textLink;
        }
        return textLink.replace(
            /#([\p{L}\p{N}_\u0E00-\u0E7F]+)/gu,
            `<a class="hashtag-href-${contentId} app-text-link ${linkColor || ''
            }">#$1</a>`
        );
    } else {
        return inputText;
    }
};
const onContentClick = (event: any) => {
    appPreventDefult(event);
    if (openPage && to) {
        appNavigateTo(to);
    } else {
        showMoreText.value = !showMoreText.value;
    }
    emit('on-click');
};
</script>
<template>
    <ion-row v-if="content" v-bind="$attrs">
        <ion-col class="ion-no-margin ion-no-padding">
            <div style="overflow: hidden" :class="{ 'text-holder': showBackground }">
                <BaseRippleItem>
                    <div :id="contentId" :class="{ 'word-limit': showMoreBtn && !showMoreText }"
                        class="app-auto-newline dont-break-out content-text">
                        <ContentHtml :content="urlify(content, 'text-primary')" :high-light-text="highLightText"
                            :class="textCssStyle" @on-press="onContentClick($event)" />
                    </div>
                </BaseRippleItem>
                <BaseCopyTextBtn v-if="showCopyText" :model-value="content" />
                <slot name="moreButton">
                    <BaseLinkText v-if="showMore && showMoreBtn" class="q-py-xs q-ml-sm"
                        :label="!showMoreText ?t('base.seeMore') : t('minimize')" @click="showMoreText = !showMoreText" />
                </slot>
                <slot name="bottom">
                </slot>
            </div>
        </ion-col>
    </ion-row>
</template>
<style scoped lang="scss">
.word-limit {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: v-bind(limit);
    /* number of lines to show */
    line-clamp: v-bind(limit);
    -webkit-box-orient: vertical;
}

.text-holder {
    width: fit-content;
    background-color: var(--app-text-holder-backgroud);
    color: var(--v-text-black);
    padding: 10px;
    border-radius: 8px;
    margin-top: 5px;
    //line-height: 20px;
    // font-size: 15px;
}

.no-bg {
    background-color: transparent !important;
}

body[color-theme='dark'] {
    .text-holder {
        //background-color: var(--second-bg-color-theme-dark);
        color: #fafafa;
    }
}
</style>
