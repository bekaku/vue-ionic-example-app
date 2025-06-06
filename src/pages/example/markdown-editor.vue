<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseMarkdownEditor from '@/components/base/BaseMarkdownEditor.vue';
import BaseMarkdownPreview from '@/components/base/BaseMarkdownPreview.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { ref, useId } from 'vue';
const { appNavigateTo } = useBase();
const { t } = useLang();
const contentId = useId();
const contentPreviewId = useId();

const content = ref<string>(`
## 😲 md-editor-v3

Markdown Editor for Vue3, developed in jsx and typescript, support different themes、beautify content by prettier.

### 🤖 Base

**bold**, <u>underline</u>, _italic_, ~~line-through~~, superscript^26^, subscript~1~, \`inline code\`, [link](https://github.com/imzbf)
> quote: I Have a Dream

1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.

- [ ] Friday
- [ ] Saturday
- [x] Sunday
![Picture](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif)

## 🤗 Code
\`\`\`vue
<template>
  <MdEditor v-model="text" />
</template>
<script setup>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('Hello Editor!');
<\/script>
\`\`\`

## 🖨 Text

The Old Man and the Sea served to reinvigorate Hemingway's literary reputation and prompted a reexamination of his entire body of work.

## 📈 Table
| THead1          |      THead2       |           THead3 |
| :-------------- | :---------------: | ---------------: |
| text-align:left | text-align:center | text-align:right |

## 📏 Formula

Inline: $x+y^{2x}$

$$
\sqrt[3]{x}
$$

## 🧬 Diagram

\`\`\`mermaid
flowchart TD
  Start --> Stop
\`\`\`

## 🪄 Alert

!!! note Supported Types

note、abstract、info、tip、success、question、warning、failure、danger、bug、example、quote、hint、caution、error、attention

!!!

## ☘️ em...
`);
</script>
<template>
  <BasePage
    page-title="Markdown editor"
    fullscreen
    :content-padding="false"
    show-back-link
  >
    <BaseCard title="Editor" clear class="q-pa-md">
      <BaseMarkdownEditor v-model="content" :editor-id="contentId" />
    </BaseCard>
    <BaseCard title="Preview" clear class="q-pa-md">
      <BaseMarkdownPreview v-model="content" :editor-id="contentPreviewId" />
    </BaseCard>
  </BasePage>
</template>
