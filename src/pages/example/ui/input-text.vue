<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseCheckboxItem from '@/components/base/BaseCheckboxItem.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseInputMoney from '@/components/base/BaseInputMoney.vue';
import BaseInputOtp from '@/components/base/BaseInputOtp.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseRadioItem from '@/components/base/BaseRadioItem.vue';
import BaseSearchBar from '@/components/base/BaseSearchBar.vue';
import BaseSelectItem from '@/components/base/BaseSelectItem.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import BaseTextHeader from '@/components/base/BaseTextHeader.vue';
import { useValidation } from '@/composables/useValidation';
import type { LabelValue } from '@/types/common';
import {
    IonItem,
    IonLabel,
    IonList,
    IonToolbar
} from '@ionic/vue';
import { documentAttachOutline, logoApple, logoFacebook, logoGithub, logoGoogle, logoTwitter, mailOutline, personOutline } from 'ionicons/icons';
import { ref } from 'vue';
const { required, requireEmail } = useValidation();
const name = ref<string>('');
const surname = ref<string>('Bekaku');
const email = ref<string>('bekaku@gmail.com');
const title = ref<string>('Test');
const amount = ref<number>(0);
const money = ref<number>(5000);
const text = ref<string>('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat');
const selectOption = ref<number>();

const ckBox = ref<boolean>(true);
const radioSelected = ref<number>(2);

const simpleItems: LabelValue<number>[] = [
    {
        label: 'Google',
        value: 1,
        description: 'Fox',
        icon: logoGoogle
    },
    {
        label: 'Facebook',
        value: 2,
        icon: logoFacebook
    },
    {
        label: 'Twitter',
        value: 3,
        icon: logoTwitter
    },
    {
        label: 'Apple',
        value: 4,
        icon: logoApple
    },
    {
        label: 'Github',
        value: 5,
        icon: logoGithub
    },
];
const radioOptions: LabelValue<number>[] = [
    { label: 'Crud', value: 1, icon: documentAttachOutline },
    { label: 'Report', value: 2, avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
    { label: 'Other', value: 3 },
]
const onInputChange = (ev: any) => {
    console.log('onInputChange', ev);
}
const onInput = (ev: any) => {
    console.log('onInput', ev);
}
const onBlur = (ev: any) => {
    console.log('onBlur', ev);
}
const onFocus = (ev: any) => {
    console.log('onFocus', ev);
}

const onOptSubmit = (otp?: string) => {
    console.log('onOptSubmit', otp);
}

const onSearchChange = (val: string | undefined) => {
    console.log('onSearchChange', val);
}
const onCheckboxChange = (event: any) => {
    console.log('onChange checked:', event);
}
</script>
<template>
    <BasePage page-title="Form input" fullscreen show-back-link>
        <template #headerBottom>
            <IonToolbar>
                <BaseSearchBar placeholder="Search bar..." @on-change="onSearchChange" />
            </IonToolbar>
        </template>
        <BaseCard flat title="Form">
            <IonList>
                <!-- <div class="q-pr-sx">

                </div> -->
                <BaseSelectItem v-model="selectOption" :items="simpleItems" :multiple="false" required class="q-mb-xs"
                    with-input label="Select options" />
                <BaseInput v-model="name" label="Name" :icon="personOutline" clear-input placeholder="Type your name"
                    required round :rules="[required]" @on-blur="onBlur" @on-focus="onFocus" @on-change="onInputChange"
                    @on-input="onInput" />
                <BaseInput v-model="surname" label="Surname">
                    <template #end>
                        <BaseAvatar src="https://cdn.quasar.dev/img/avatar2.jpg" :size="24" />
                    </template>
                </BaseInput>
                <BaseInput v-model="email" label="Email" :icon="mailOutline" required
                    :rules="[required, requireEmail]" />
                <BaseInput v-model="title" label="Title" :maxlength="20" counter :bordered="false">
                    <template #before>
                        <BaseButton label="before" color="danger" />
                    </template>
                    <template #end>
                        <BaseButton label="end" />
                    </template>
                    <template #after>
                        <BaseButton label="after" color="warning" />
                    </template>
                </BaseInput>
                <BaseInput v-model="amount" label="Amount" type="number" :min="0" :max="10" :bordered="false"
                    helper-text="Limit 0 to 10" />

                <BaseTextHeader label="Money" />
                <IonItem lines="none">
                    <IonLabel>
                        <BaseInputMoney v-model="money" label="Money format" />
                    </IonLabel>
                </IonItem>

                <BaseTextHeader label="Textarea" />
                <BaseTextarea v-model="text" label="Test textarea" placeholder="textarea" />

                <BaseTextHeader label="Input OTP" />
                <IonItem lines="none">
                    <IonLabel>
                        <BaseInputOtp :input-length="5" @on-submit="onOptSubmit" />
                    </IonLabel>
                </IonItem>
                <BaseTextHeader label="Checkbox" />
                <BaseCheckboxItem v-model="ckBox" value="customValue" :label="text" @on-change="onCheckboxChange" />
                <BaseTextHeader label="Radio group" />
                <div class="q-px-md">
                    radioSelected: {{ radioSelected }}
                </div>
                <BaseRadioItem v-model="radioSelected" :items="radioOptions" />
            </IonList>
            <BaseButton class="q-pa-sm" label="Submit" full />
        </BaseCard>
    </BasePage>
</template>
