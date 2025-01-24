import {useCallback, useState} from 'react';
import {type Sort, withFlippedSort, withSortField} from '../lib/sort';

export type SortState<F extends string> = {
  sort: Sort<F>;
  setSortField: (field: F) => void;
  toggleSortDirection: () => void;
};

export const useSort = <F extends string>(initial: Sort<F>): SortState<F> => {
  const [sort, setSort] = useState(initial);

  const setSortField = useCallback((field: F) => {
    setSort(current => withSortField(current, field));
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSort(withFlippedSort);
  }, []);

  return {sort, setSortField, toggleSortDirection};
};
