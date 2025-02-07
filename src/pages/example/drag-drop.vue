<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
// import draggable from 'vuedraggable';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import {
    IonItem,
    IonLabel
} from '@ionic/vue';
import { computed, ref } from 'vue';
import Draggable from 'vuedraggable/src/vuedraggable';
const list1 = ref([
    { name: 'John', id: 1, img: 'https://cdn.quasar.dev/img/avatar1.jpg' },
    { name: 'Joao', id: 2, img: 'https://cdn.quasar.dev/img/avatar2.jpg' },
    { name: 'Jean', id: 3, img: 'https://cdn.quasar.dev/img/avatar3.jpg' },
    { name: 'Gerard', id: 4, img: 'https://cdn.quasar.dev/img/avatar4.jpg' }
])

const list2 = ref([
    { name: 'Juan', id: 5, img: 'https://cdn.quasar.dev/img/avatar5.jpg' },
    { name: 'Edgard', id: 6, img: 'https://cdn.quasar.dev/img/avatar6.jpg' },
    { name: 'Johnson', id: 7, img: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar13.jpg' }
])
const list3 = ref([
    { name: 'Salah', id: 8, img: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar2.png' },
    { name: 'Virgil', id: 9, img: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar4.png' },
    { name: 'Alison', id: 10, img: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar12.jpg' }
])
const draging1 = ref(false);
const draging2 = ref(false);
const draging3 = ref(false);
// const dragOptions = {
//     animation: 0,
//     group: 'description',
//     disabled: false,
//     ghostClass: 'ghost'
// }
const dragOptions = computed(() => {
    return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
    };
})
const log = (ctx: any) => {
    console.log('log', ctx);
}
const onStartDrag = () => {
    draging1.value = true;
}
const onEndDrag = () => {
    draging1.value = false;
}
</script>
<template>
    <BaseLayout page-title="Drag n Drop" fullscreen show-back-link>
        <BaseCard title="Draggable 1" :subtitle="draging1 ? 'under drag...' : ''">
            <draggable v-model="list1" class="drag-area" item-key="name" v-bind="dragOptions"
                :component-data="{ name: 'flip-list', type: 'transition' }" @change="log" @start="onStartDrag"
                @end="onEndDrag">
                <template #item="{ element, index }">
                    <IonItem button :detail="false">
                        <BaseAvatar slot="start" :src="element.img" />
                        <IonLabel>
                            {{ element.name }} {{ index }}
                        </IonLabel>
                    </IonItem>
                </template>
            </draggable>
        </BaseCard>
        <BaseCard title="Draggable 2" :subtitle="draging2 ? 'under drag...' : ''">
            <draggable v-model="list2" class="drag-area" item-key="name" v-bind="dragOptions"
                :component-data="{ name: 'flip-list', type: 'transition' }" @change="log" @start="draging2 = true" @end="draging2 = false">
                <template #item="{ element, index }">
                    <IonItem button :detail="false">
                        <BaseAvatar slot="start" :src="element.img" />
                        <IonLabel>
                            {{ element.name }} {{ index }}
                        </IonLabel>
                    </IonItem>
                </template>
            </draggable>
        </BaseCard>
        <BaseCard title="Draggable 3" :subtitle="draging3 ? 'under drag...' : ''">
            <draggable v-model="list3" class="drag-area" item-key="name" v-bind="dragOptions"
                :component-data="{ name: 'flip-list', type: 'transition' }" @change="log" @start="draging3 = true" @end="draging3 = false">
                <template #item="{ element, index }">
                    <IonItem button :detail="false">
                        <BaseAvatar slot="start" :src="element.img" />
                        <IonLabel>
                            {{ element.name }} {{ index }}
                        </IonLabel>
                    </IonItem>
                </template>
            </draggable>
        </BaseCard>
    </BaseLayout>
</template>
<style lang="scss" scoped>
.drag-area {
    height: 200px;
    overflow: auto;
}

.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    opacity: 0.5;
    background: #ccc;
}
</style>