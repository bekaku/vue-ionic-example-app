import { computed, Ref, ref, watch } from 'vue';
import { usePaging } from '@/composables/UsePaging';
import { useSort } from '@/composables/UseSort';
import { ICrudListApiOptions } from '@/types/Common';
import { useAxios } from '@/composables/UseAxios';
import { isAppException, isArray, isEmpty, isListResponse, isServerResponseMessage } from '@/utils/AppUtil';
import { ApiListResponse } from '@/types/Models';

export const usePagefecth = <T>(options: ICrudListApiOptions) => {
    const { callAxios } = useAxios();
    const { pages, resetPaging } = usePaging(options?.itemsPerPage ? options.itemsPerPage : 10);
    const { sort, sortMode } = useSort(options?.defaultSort);
    const dataList = ref<T[]>([]) as Ref<T[]>;
    const isInfiniteDisabled = ref(false);
    const firstLoaded = ref(false);
    const loading = ref(false);
    const urlEndpoint = ref(options.urlEndpoint);
    const additionalUri = ref(options?.additionalUri);

    const queryParam = computed((): string | undefined => {
        let haveParam = false;
        let q = '';
        if (options.pageAble == undefined || options.pageAble) {
            q += `page=${(options.pageStartZero == undefined || options.pageStartZero) ? (pages.value.current > 0 ? pages.value.current - 1 : 0) : pages.value.current}`;
            q += `&size=${pages.value.itemsPerPage}`;
            haveParam = true;
        }
        if (options.sortAble == undefined || options.sortAble) {
            if (haveParam) {
                q += '&';
            }
            q += `${sort.value.column && sort.value.mode ? 'sort=' + sort.value.column + ',' + sort.value.mode : ''}`;
            haveParam = true;
        }
        if (additionalUri.value) {
            if (haveParam) {
                q += '&';
            }
            q += `${additionalUri.value}`;
        }
        return !isEmpty(q) ? q : undefined;
    });
    const apiEndpoint = computed(
        () => `${urlEndpoint.value}${queryParam.value ? '?' + queryParam.value : ''}`
    );
    const loadData = async () => {
        loading.value = true;
        const response = await callAxios<ApiListResponse<T>>({
            API: apiEndpoint.value,
            method: 'GET'
        });
        if (!firstLoaded.value) {
            firstLoaded.value = true;
        }
        loading.value = false;
        if (!isAppException(response) && !isServerResponseMessage(response)) {
            if (isListResponse(response)) {
                if (!options.concatList) {
                    dataList.value = response.dataList;
                } else {
                    dataList.value.push(...response.dataList);
                }

                if (response.totalPages != undefined) {
                    pages.value.totalPages = response.totalPages;
                }
                if (response.totalElements != undefined) {
                    pages.value.totalElements = response.totalElements;
                    if (response.totalElements == 0 || response.totalElements < pages.value.itemsPerPage) {
                        isInfiniteDisabled.value = true;
                    }
                }
                if (response.last != undefined) {
                    pages.value.last = response.last;
                    isInfiniteDisabled.value = response.last;
                }

            } else if (isArray(response)) {
                if (!options.concatList) {
                    dataList.value = response as any;
                } else {
                    dataList.value.push(...response as any);
                }
            }
        }
        return new Promise((resolve) => {
            resolve(true);
        });
    };
    const resetData = (resetPage: boolean = true) => {
        if (resetPage) {
            resetPaging();
        }
        dataList.value = [];
        firstLoaded.value = false;
        isInfiniteDisabled.value = false;
    };
    const onReload = async () => {
        resetPaging();
        dataList.value = [];
        firstLoaded.value = false;
        isInfiniteDisabled.value = false;
        await loadData();
        return new Promise((resolve) => resolve(true));
    };

    const onNextPage = async () => {
        pages.value.current++;
        await loadData();
        return new Promise((resolve) => resolve(true));
    };

    const loadPageChange = async (resetPage: boolean = false) => {
        resetData(resetPage);
        await loadData();
        return new Promise((resolve) => resolve(true));
    };

    const onPageChange = async (value: number | undefined) => {
        await loadPageChange(false);
        return new Promise((resolve) => resolve(true));
    };

    const onPerPageChange = async (value: number | undefined) => {
        await loadPageChange(false);
        return new Promise((resolve) => resolve(true));
    };
    watch(sort.value, async (s) => {
        if (s) {
            if (firstLoaded.value) {
                await onReload();
            }
        }
    });
    return {
        isInfiniteDisabled,
        firstLoaded,
        loading,
        pages,
        sort,
        sortMode,
        dataList,
        urlEndpoint,
        additionalUri,
        loadData,
        resetData,
        onPageChange,
        onPerPageChange,
        onNextPage,
        onReload
    };
};
