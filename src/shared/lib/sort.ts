export type Sort<F extends string> = {
  field: F;
  isAscending: boolean;
};

export const sortBy = <T, F extends string>(
  items: T[],
  sort: Sort<F>,
  compare: (a: T, b: T, field: F) => number,
): T[] =>
  [...items].sort((a, b) => {
    const result = compare(a, b, sort.field);
    return sort.isAscending ? result : -result;
  });

export const withSortField = <F extends string>(current: Sort<F>, field: F): Sort<F> =>
  current.field === field ? current : {field, isAscending: true};

export const withFlippedSort = <F extends string>(current: Sort<F>): Sort<F> => ({
  ...current,
  isAscending: !current.isAscending,
});
