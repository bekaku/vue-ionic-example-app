<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseContentItem from '@/components/base/BaseContentItem.vue';
import BaseEllipsis from '@/components/base/BaseEllipsis.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseOpenGraphItemAlt from '@/components/base/BaseOpenGraphItemAlt.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import { extractHashtagsFromString } from '@/utils/appUtil';
import {
    IonCardContent
} from '@ionic/vue';
import { biHash } from '@quasar/extras/bootstrap-icons';
import { refresh } from 'ionicons/icons';
import { ref, useId } from 'vue';
const contentUniqeId = useId();
const contentUniqeId2 = useId();
const content = ref<string>(`TypeScript has become the go-to language for many developers, providing the benefits of static typing while maintaining the flexibility of JavaScript. However, as TypeScript continues to evolve, some practices that were once considered best may now be outdated or suboptimal. In this article, we’ll cover 10 bad TypeScript habits you should break in 2024 to write cleaner, more efficient, and maintainable code.

1. Not Using strict Mode
The Problem:
Many developers disable TypeScript’s strict mode to avoid dealing with stricter type checks.

Why It’s Bad:
When strict mode is off, TypeScript becomes more lenient, reducing the effectiveness of type safety. This can lead to unexpected bugs and make refactoring more challenging in the future.

What to Do Instead:
Enable strict mode in your tsconfig.json. It will enforce better type checks and ensure that your code is more robust in the long run.

https://www.youtube.com/watch?v=PCSqrpAWq1s


DOMPurify is a DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG.
https://github.com/cure53/DOMPurify
Example
<img src=x onerror=alert(1)//>
<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>
<TABLE><tr><td>HELLO</tr></TABL>

#dev_tips #ทดสอบเท็ก`);
const showContent = ref(true);
const onPreview = () => {
    showContent.value = false;
    setTimeout(() => {
        showContent.value = true;
    }, 500);
}

const testExtractHashTag = () => {
    const contentHashTags = extractHashtagsFromString(content.value);
    console.log('contentHashTags', contentHashTags);
    // const finalText = content.value.replace(
    //     /#([a-zA-Z\p{L}\p{N}_\u0E00-\u0E7F]+)/gu,
    //     '<a class="hashtag-href">#$1</a>'
    // );
    // console.log('contentHashTags', finalText)
}
</script>
<template>
    <BasePage page-title="Content text" fullscreen show-back-link>
        <BaseCard flat title="Content">
            <BaseTextarea v-model="content" label="Content" max-height="250px" />
            <IonCardContent class="q-gutter-md">
                <BaseButton :icon=" { name: refresh, iconSet: 'ion' }" label="Reload Preview" @click="onPreview" />

                <BaseButton :icon=" { name: biHash, iconSet: 'bootstrap-icons' }" label="Extract HashTag from content"
                    @click="testExtractHashTag" />
            </IonCardContent>
        </BaseCard>
        <BaseCard flat title="Ellipsis">
            <IonCardContent>
                <BaseEllipsis :lines="4" clickable>
                    {{ content }}
                </BaseEllipsis>
            </IonCardContent>
        </BaseCard>
        <BaseCard flat title="Preview with sanitize html">
            <IonCardContent>
                <template v-if="showContent">
                    <BaseContentItem wrap-text :content="content" :content-id="contentUniqeId" :is-escape-html="false"
                        hashtag-urlify show-more />
                </template>
            </IonCardContent>
            <BaseOpenGraphItemAlt v-if="showContent" :content="content" short image-size="150px" />
        </BaseCard>
        <BaseCard flat title="Preview with escape html">
            <IonCardContent>
                <template v-if="showContent">
                    <BaseContentItem wrap-text :content="content" :content-id="contentUniqeId2" is-escape-html
                        hashtag-urlify show-more />
                </template>
            </IonCardContent>
            <BaseOpenGraphItemAlt v-if="showContent" :content="content" :short="false" />
        </BaseCard>
    </BasePage>
</template>
