
/* eslint-disable ts/no-unused-vars */
import { useAxios } from '@/composables/useAxios';
import { usePaging } from '@/composables/usePaging';
import { useSort } from '@/composables/useSort';
import type { ApiListResponse, CrudListApiOptions } from '@/types/common';
import { isAppException, isArray, isEmpty, isListResponse, isServerResponseMessage } from '@/utils/appUtil';
import { warningOutline } from 'ionicons/icons';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';
import { useBase } from './useBase';


export const usePagefecth = <T>(options: CrudListApiOptions) => {
    const { callAxios } = useAxios();
    const { appToast } = useBase();
    const { pages, resetPaging } = usePaging(options?.itemsPerPage ? options.itemsPerPage : 10);
    const { sort } = useSort(options?.defaultSort);
    const dataList = ref<T[]>([]) as Ref<T[]>;
    const isInfiniteDisabled = ref(false);
    const firstLoaded = ref(false);
    const loading = ref(false);
    const urlEndpoint = ref(options.apiEndpoint);
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
        try {
            const response = await callAxios<ApiListResponse<T>>({
                API: apiEndpoint.value,
                method: 'GET'
            });
            let list: T[] = [];
            if (!isAppException(response) && !isServerResponseMessage(response)) {
                if (isListResponse(response)) {
                    if (!options.reverseList) {
                        list = response.dataList;
                    } else {
                        list = response.dataList.reverse();
                    }
                    await setDataList(list);
                    if (response.totalPages != undefined) {
                        pages.value.totalPages = response.totalPages;
                    }
                    if (response.totalElements != undefined) {
                        pages.value.totalElements = response.totalElements;
                        if (response.totalElements == 0 || response.totalElements < pages.value.itemsPerPage) {
                            isInfiniteDisabled.value = true;
                        } else {
                            isInfiniteDisabled.value = false;
                        }
                    }
                    if (response.last != undefined) {
                        pages.value.last = response.last;
                        isInfiniteDisabled.value = response.last;
                    }
                } else if (response && isArray(response)) {
                    const responseList: T[] = response as unknown as T[];
                    if (responseList.length == 0 || responseList.length < pages.value.itemsPerPage) {
                        isInfiniteDisabled.value = true;
                    } else {
                        isInfiniteDisabled.value = false;
                    }
                    if (!options.reverseList) {
                        list = responseList;
                    } else {
                        list = responseList.reverse();
                    }
                    await setDataList(list);
                }
            }
        } catch (error: any) {
            console.error('useCrudList', error);
            if (error.message) {
                appToast({
                    text: error.message,
                    icon: warningOutline,
                    color: 'danger',
                    time: 10*1000
                  });
            }
        } finally {
            if (!firstLoaded.value) {
                firstLoaded.value = true;
            }

            loading.value = false;
        }
        return new Promise((resolve) => {
            resolve(true);
        });
    };
    const setDataList = (list: T[]) => {
        return new Promise((resolve) => {
            if (pages.value.current == 1) {
                dataList.value = list;
            } else {
                if (!options.concatList) {
                    dataList.value = list;
                } else {
                    if (!options.addUnshift) {
                        dataList.value.push(...list);
                    } else {
                        dataList.value.unshift(...list);
                    }
                }
            }
            resolve(true)
        })
    }
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
        if (!options.preventResetListReload) {
            firstLoaded.value = false;
            dataList.value = [];
        }
        isInfiniteDisabled.value = false;
        await loadData();
        return new Promise(resolve => resolve(true));
    };

    const onNextPage = async () => {
        if (firstLoaded.value) {
            pages.value.current++;
            await loadData();
        }
        return new Promise(resolve => resolve(true));
    };

    const loadPageChange = async (resetPage: boolean = false) => {
        resetData(resetPage);
        await loadData();
        return new Promise(resolve => resolve(true));
    };

    const onPageChange = async (value: number | undefined) => {
        await loadPageChange(false);
        return new Promise(resolve => resolve(true));
    };

    const onPerPageChange = async (value: number | undefined) => {
        await loadPageChange(false);
        return new Promise(resolve => resolve(true));
    };
    return {
        isInfiniteDisabled,
        firstLoaded,
        loading,
        pages,
        sort,
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
