import type { ISort, ISortMode } from '@/types/Common';
import { ref } from 'vue';
export const useSort = (defaultSort?: ISort) => {
  const sortMode = ref<ISortMode[]>([
    { value: 'asc', label: 'sort.asc' },
    { value: 'desc', label: 'sort.desc' }
  ]);
  const sortInitial: ISort = {
    column: defaultSort && defaultSort.column ? defaultSort.column : 'id',
    mode: defaultSort && defaultSort.mode ? defaultSort.mode : 'desc'
  };
  const sort = ref<ISort>(Object.assign({}, sortInitial));
  const resetSort = () => {
    sort.value = Object.assign({}, sortInitial);
  };
  return {
    sortMode,
    sort,
    resetSort
  };
};
