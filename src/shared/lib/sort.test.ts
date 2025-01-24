import {sortBy, withFlippedSort, withSortField} from './sort';

const compare = (a: number, b: number): number => a - b;

describe('sortBy', () => {
  it('sorts ascending', () => {
    expect(sortBy([3, 1, 2], {field: 'n', isAscending: true}, compare)).toEqual([1, 2, 3]);
  });

  it('sorts descending', () => {
    expect(sortBy([3, 1, 2], {field: 'n', isAscending: false}, compare)).toEqual([3, 2, 1]);
  });

  it('passes the active field to the comparator', () => {
    const fields: string[] = [];

    sortBy([1, 2], {field: 'year', isAscending: true}, (a, b, field) => {
      fields.push(field);
      return a - b;
    });

    expect(new Set(fields)).toEqual(new Set(['year']));
  });

  it('does not mutate the input', () => {
    const input = [3, 1, 2];

    sortBy(input, {field: 'n', isAscending: true}, compare);

    expect(input).toEqual([3, 1, 2]);
  });
});

describe('withSortField', () => {
  it('starts a newly picked field ascending', () => {
    const current = {field: 'title', isAscending: false};

    expect(withSortField(current, 'artist')).toEqual({field: 'artist', isAscending: true});
  });

  // picking the field that is already active is not a direction change
  it('keeps the current sort when the same field is picked', () => {
    const current = {field: 'title', isAscending: false};

    expect(withSortField(current, 'title')).toBe(current);
  });
});

describe('withFlippedSort', () => {
  it('flips ascending to descending', () => {
    expect(withFlippedSort({field: 'year', isAscending: true})).toEqual({
      field: 'year',
      isAscending: false,
    });
  });

  it('flips back', () => {
    expect(withFlippedSort({field: 'year', isAscending: false})).toEqual({
      field: 'year',
      isAscending: true,
    });
  });
});
