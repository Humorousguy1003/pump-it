import { atom } from 'recoil';
import { Filter } from '~/types/other';

export const defaultFilterState: Filter = {
    searchTerm: '',
    status: '*',
    raiseAmount: '*',
    chainId: '*',
    categoryId: null,
    pageSize: 9,
    page: 1,
};

export const filterState = atom<Filter>({
    key: 'filterState',
    default: defaultFilterState,
});
