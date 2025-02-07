<script setup lang="ts">
import UserService from '@/api/UserService';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import SkeletonListItem from '@/components/skeleton/SkeletonListItem.vue';
import { useAxios } from '@/composables/useAxios';
import type { ApiListResponse } from '@/types/common';
import type { Permission, UserDto } from '@/types/models';
import { ref } from 'vue';

const { callAxios } = useAxios();
const { getUserSessionData } = UserService();
const reponseApiItem = ref<ApiListResponse<Permission> | null>(null);
const reaponseApiLoading = ref<boolean>(false);

const reponseListItems = ref<Permission[] | null>(null);
const reponseListLoading = ref<boolean>(false);

const reponseObject = ref<Permission | null>(null);
const reponseObjectLoading = ref<boolean>(false);

const responseError = ref<any>();
const responseErrorLoading = ref<boolean>(false);

const userData = ref<UserDto>();
const fetchViaApiService = async () => {
    try {
        const response = await getUserSessionData();
        console.log('fetchViaApiService response', response);
        userData.value = response || undefined;
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}
const fetchResponseApi = async () => {
    reaponseApiLoading.value = true;
    reponseApiItem.value = await callAxios<ApiListResponse<Permission>>({
        API: '/api/permission?page=0&size=10&sort=code,asc',
        method: 'GET',
    });
    reaponseApiLoading.value = false;
}
const fetchResponseList = async () => {
    reponseListLoading.value = true;
    reponseListItems.value = await callAxios<Permission[]>({
        API: '/api/permission/findAllBackendPermission',
        method: 'GET',
    });
    reponseListLoading.value = false;
}
const fetchResponseObject = async () => {
    reponseObjectLoading.value = true;
    reponseObject.value = await callAxios<Permission>({
        API: '/api/permission/1',
        method: 'GET',
    });
    reponseObjectLoading.value = false;
}
const fetchError = async () => {
    /* alternative
    try {
        await callAxios<Permission[]>({
            API: '/api/permission/notfound_url',
            method: 'GET',
        });
    } catch (error) {
        responseError.value = JSON.stringify(error);
        console.warn('use-axios > fetchError', error)
    }
    */

    responseErrorLoading.value = true;
    callAxios<Permission[]>({
        API: '/api/permission/notfound-url',
        method: 'GET',
    }).then((response) => {
        console.log('use-axios > fetch OK', response);
    }).catch((error) => {
        responseError.value = error;
        console.warn('use-axios > fetchError > catch', error)
    }).finally(() => {
        console.log('use-axios > fetchError > finally');
        responseErrorLoading.value = false;
    });
}
/* Example for delete, post, put
Delete
await callAxios<ResponseMessage | null>({
    API: '/api/permission/999',
    method: 'DELETE',
});
// Post
await callAxios<RefreshTokenResponse | null>({
    API: '/api/auth/login',
    method: 'POST',
    body: {
        user: {
            emailOrUsername: 'email@ggg.com',
            password: 'xxxxxxx',
        }
    }
});

// PUT
await callAxios<ResponseMessage>({
    API: '/api/user/updateEmail',
    method: 'PUT',
    body: {
        user: {
            email: 'edit@email.com'
        }
    }
});
*/
</script>
<template>
    <BaseLayout page-title="Fetch data" fullscreen show-back-link>
        <BaseCard>
            <BaseButton full clear label="Fetch via service" @click="fetchViaApiService" />
            <div v-if="userData" class="pre-div bg-black text-light-green-13">
                <pre>{{ userData }}</pre>
            </div>
        </BaseCard>
        <BaseCard>
            <BaseButton full clear label="Fetch response API" @click="fetchResponseApi" />
            <SkeletonListItem v-if="reaponseApiLoading" :item="3" />
            <div v-else class="pre-div bg-black text-light-green-13">
                <pre>{{ reponseApiItem }}</pre>
            </div>
        </BaseCard>
        <BaseCard>
            <BaseButton full clear label="Fetch response LIST" @click="fetchResponseList" />
            <SkeletonListItem v-if="reponseListLoading" :item="3" />
            <div v-else class="pre-div bg-black text-light-green-13">
                <pre>{{ reponseListItems }}</pre>
            </div>
        </BaseCard>
        <BaseCard>
            <BaseButton full clear label="Fetch response Object" @click="fetchResponseObject" />
            <SkeletonListItem v-if="reponseObjectLoading" :item="3" />
            <div v-else class="pre-div bg-black text-light-green-13">
                <pre>{{ reponseObject }}</pre>
            </div>
        </BaseCard>
        <BaseCard>
            <BaseButton full clear color="danger" label="Fetch ERROR handling" @click="fetchError" />
            <SkeletonListItem v-if="responseErrorLoading" :item="3" />
            <div v-else class="pre-div bg-black text-red">
                <pre>{{ JSON.stringify(responseError) }}</pre>
            </div>
        </BaseCard>
    </BaseLayout>
</template>
<style lang="scss" scoped>
.pre-div {
    max-height: 250px;
    overflow: auto;
}
</style>
