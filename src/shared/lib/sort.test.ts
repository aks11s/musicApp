import {
  byIsoDate,
  byNumber,
  byText,
  sortBy,
  withFlippedSort,
  withSortField,
} from './sort';

type Row = {name: string; count: number; date: string};

const row = (name: string, count: number, date: string): Row => ({
  name,
  count,
  date,
});

const rows = [
  row('banana', 3, '2024-05-01T00:00:00Z'),
  row('Apple', 10, '2023-01-15T00:00:00Z'),
  row('cherry', 1, '2024-11-20T00:00:00Z'),
];

const comparators = {
  name: byText((r: Row) => r.name),
  count: byNumber((r: Row) => r.count),
  date: byIsoDate((r: Row) => r.date),
};

describe('sortBy', () => {
  it('uses the comparator of the active field', () => {
    const sorted = sortBy(
      rows,
      {field: 'count', isAscending: true},
      comparators,
    );

    expect(sorted.map(r => r.count)).toEqual([1, 3, 10]);
  });

  it('reverses the order when descending', () => {
    const sorted = sortBy(
      rows,
      {field: 'count', isAscending: false},
      comparators,
    );

    expect(sorted.map(r => r.count)).toEqual([10, 3, 1]);
  });

  it('does not mutate the input', () => {
    const input = [...rows];

    sortBy(input, {field: 'name', isAscending: true}, comparators);

    expect(input).toEqual(rows);
  });
});

describe('byText', () => {
  it('ignores case', () => {
    const sorted = sortBy(
      rows,
      {field: 'name', isAscending: true},
      comparators,
    );

    expect(sorted.map(r => r.name)).toEqual(['Apple', 'banana', 'cherry']);
  });

  it('orders numbers inside text the human way', () => {
    const compare = byText((s: string) => s);

    expect(['Mix 10', 'Mix 2'].sort(compare)).toEqual(['Mix 2', 'Mix 10']);
  });
});

describe('byIsoDate', () => {
  it('orders ISO dates chronologically', () => {
    const sorted = sortBy(
      rows,
      {field: 'date', isAscending: true},
      comparators,
    );

    expect(sorted.map(r => r.date.slice(0, 7))).toEqual([
      '2023-01',
      '2024-05',
      '2024-11',
    ]);
  });

  it('treats equal dates as equal', () => {
    expect(comparators.date(rows[0], rows[0])).toBe(0);
  });
});

describe('withSortField', () => {
  it('starts a newly picked field ascending', () => {
    const current = {field: 'title', isAscending: false};

    expect(withSortField(current, 'artist')).toEqual({
      field: 'artist',
      isAscending: true,
    });
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
