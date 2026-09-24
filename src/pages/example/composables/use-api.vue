<script setup lang="ts">
import UserService from '@/api/UserService';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import SkeletonListItem from '@/components/skeleton/SkeletonListItem.vue';
import { ApiFetchError, useApi } from '@/composables/useApi';
import type { ApiListResponse } from '@/types/common';
import type { Permission, UserDto } from '@/types/models';
import { ref } from 'vue';

const api = useApi();
const { getUserSessionData } = UserService();
const reponseApiItem = ref<ApiListResponse<Permission> | null>(null);
const reaponseApiLoading = ref<boolean>(false);

const reponseListItems = ref<Permission[] | null>(null);
const reponseListLoading = ref<boolean>(false);

const reponseObject = ref<Permission | null>(null);
const reponseObjectLoading = ref<boolean>(false);

const responseRaw = ref<any>();
const responseRawLoading = ref<boolean>(false);

const responseError = ref<any>();
const responseErrorLoading = ref<boolean>(false);

const responseTimeout = ref<any>();
const responseTimeoutLoading = ref<boolean>(false);

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
    try {
        // query is appended to the url -> /api/permission?page=0&size=10&sort=code,asc
        reponseApiItem.value = await api<ApiListResponse<Permission>>('/api/permission', {
            query: { page: 0, size: 10, sort: 'code,asc' }
        });
    } finally {
        reaponseApiLoading.value = false;
    }
}
const fetchResponseList = async () => {
    reponseListLoading.value = true;
    try {
        reponseListItems.value = await api<Permission[]>('/api/permission/findAllPermission');
    } finally {
        reponseListLoading.value = false;
    }
}
const fetchResponseObject = async () => {
    reponseObjectLoading.value = true;
    try {
        reponseObject.value = await api<Permission>('/api/permission/350897401642356736');
    } finally {
        reponseObjectLoading.value = false;
    }
}
const fetchRaw = async () => {
    responseRawLoading.value = true;
    try {
        // api.raw returns the full Response, parsed body is in _data
        const response = await api.raw<Permission[]>('/api/permission/findAllPermission');
        responseRaw.value = {
            status: response.status,
            contentType: response.headers.get('content-type'),
            total: response._data?.length
        };
    } finally {
        responseRawLoading.value = false;
    }
}
const fetchError = async () => {
    responseErrorLoading.value = true;
    try {
        // notify: false -> no auto toast, handle the error yourself
        await api<Permission[]>('/api/permission/notfound-url', { notify: false });
    } catch (error) {
        if (error instanceof ApiFetchError) {
            responseError.value = {
                message: error.message,
                status: error.status,
                statusText: error.statusText,
                data: error.data
            };
        }
        console.warn('use-api > fetchError > catch', error)
    } finally {
        responseErrorLoading.value = false;
    }
}
const fetchTimeout = async () => {
    responseTimeoutLoading.value = true;
    try {
        await api<Permission[]>('/api/permission/findAllPermission', { timeout: 1 });
    } catch (error) {
        if (error instanceof ApiFetchError) {
            responseTimeout.value = { message: error.message, cause: (error.cause as Error | undefined)?.name };
        }
    } finally {
        responseTimeoutLoading.value = false;
    }
}
/* Example for delete, post, put, upload, download
// Delete
await api<ResponseMessage>('/api/permission/999', { method: 'DELETE' });

// Post
await api<RefreshTokenResponse>('/api/auth/login', {
    method: 'POST',
    body: {
        user: {
            emailOrUsername: 'email@ggg.com',
            password: 'xxxxxxx',
        }
    }
});

// PUT
await api<ResponseMessage>('/api/appUser/updateEmail', {
    method: 'PUT',
    body: {
        user: {
            email: 'edit@email.com'
        }
    }
});

// Upload: FormData is sent as-is, browser sets multipart boundary
const formData = new FormData();
formData.append('file', file);
await api<FileManager>('/api/fileManager/uploadApi', {
    method: 'POST',
    body: formData,
    baseURL: getEnv<string>('VITE_CDN_BASE_URL')
});

// Download with progress, baseURL '' for absolute url
const blob = await api<Blob>(fileUrl, {
    baseURL: '',
    responseType: 'blob',
    onDownloadProgress: ({ loaded, total }) => console.log(loaded, total)
});

// Cancel
const controller = new AbortController();
api('/api/permission', { signal: controller.signal });
controller.abort();
*/
</script>
<template>
    <BasePage page-title="useApi (fetch)" fullscreen show-back-link>
        <BaseCard>
            <BaseButton full clear label="Fetch via service" @click="fetchViaApiService" />
            <div v-if="userData" class="pre-div bg-black text-light-green-13">
                <pre>{{ userData }}</pre>
            </div>
        </BaseCard>
        <BaseCard>
            <BaseButton full clear label="Fetch response API (query)" @click="fetchResponseApi" />
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
            <BaseButton full clear label="Fetch RAW response (api.raw)" @click="fetchRaw" />
            <SkeletonListItem v-if="responseRawLoading" :item="3" />
            <div v-else class="pre-div bg-black text-light-green-13">
                <pre>{{ responseRaw }}</pre>
            </div>
        </BaseCard>
        <BaseCard>
            <BaseButton full clear color="danger" label="Fetch ERROR handling" @click="fetchError" />
            <SkeletonListItem v-if="responseErrorLoading" :item="3" />
            <div v-else class="pre-div bg-black text-red">
                <pre>{{ responseError }}</pre>
            </div>
        </BaseCard>
        <BaseCard>
            <BaseButton full clear color="danger" label="Fetch TIMEOUT (1ms)" @click="fetchTimeout" />
            <SkeletonListItem v-if="responseTimeoutLoading" :item="3" />
            <div v-else class="pre-div bg-black text-red">
                <pre>{{ responseTimeout }}</pre>
            </div>
        </BaseCard>
    </BasePage>
</template>
<style lang="scss" scoped>
.pre-div {
    max-height: 250px;
    overflow: auto;
}
</style>
