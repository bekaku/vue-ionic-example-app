<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseInputMoney from '@/components/base/BaseInputMoney.vue';
import BaseInputOtp from '@/components/base/BaseInputOtp.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseSearchBar from '@/components/base/BaseSearchBar.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import { useValidation } from '@/composables/useValidation';
import {
    IonItem,
    IonLabel,
    IonList,
    IonToolbar
} from '@ionic/vue';
import { mailOutline, personOutline } from 'ionicons/icons';
import { ref } from 'vue';
const { required, requireEmail } = useValidation();
const name = ref<string>('');
const surname = ref<string>('Bekaku');
const email = ref<string>('bekaku@gmail.com');
const title = ref<string>('Test');
const amount = ref<number>(0);
const money = ref<number>(5000);
const text = ref<string>('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat');

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
</script>
<template>
    <base-layout page-title="Form input" fullscreen show-back-link>
        <template #headerAfter>
            <IonToolbar>
                <BaseSearchBar placeholder="Search bar..." @on-change="onSearchChange" />
            </IonToolbar>
        </template>
        <BaseCard flat title="Input text">
            <IonList>
                <BaseInput v-model="name" label="Name" :icon="personOutline" clear-input placeholder="Type your name"
                    required round :rules="[required]" @on-blur="onBlur" @on-focus="onFocus" @on-change="onInputChange"
                    @on-input="onInput" />
                <BaseInput v-model="surname" label="Surname">
                    <template #end>
                        <div slot="end">
                            <BaseAvatar src="https://cdn.quasar.dev/img/avatar2.jpg" :size="24" />
                        </div>
                    </template>
                </BaseInput>
                <BaseInput v-model="email" label="Email" :icon="mailOutline" required
                    :rules="[required, requireEmail]" />
                <BaseInput v-model="title" label="Title" :maxlength="20" counter :bordered="false">
                    <template #end>
                        <BaseButton slot="end" label="Slot end" />
                    </template>
                    <template #after>
                        <BaseButton slot="end" label="Slot after" color="warning" />
                    </template>
                    </BaseInput>
                <BaseInput v-model="amount" label="Amount" type="number" :min="0" :max="10" :bordered="false"
                    helper-text="Limit 0 to 10" />
                <IonItem lines="none">
                    <IonLabel>
                        <BaseInputMoney v-model="money" label="Money format" />
                    </IonLabel>
                </IonItem>

                <BaseTextarea v-model="text" label="Test textarea" placeholder="textarea" />
                <IonItem lines="none">
                    <IonLabel>
                        <h3 class="q-ml-md">Input OTP</h3>
                        <BaseInputOtp :input-length="5" @on-submit="onOptSubmit" />
                    </IonLabel>
                </IonItem>
            </IonList>
            <BaseButton class="q-pa-sm" label="Submit" full />
        </BaseCard>
    </base-layout>
</template>
