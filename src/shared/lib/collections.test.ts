import {uniqueById} from './collections';

const item = (id: string, label = id) => ({id, label});

describe('uniqueById', () => {
  it('keeps a list that has no duplicates', () => {
    const items = [item('a'), item('b')];

    expect(uniqueById(items)).toEqual(items);
  });

  it('drops later entries with an id already seen', () => {
    const result = uniqueById([item('a'), item('b'), item('a')]);

    expect(result.map(i => i.id)).toEqual(['a', 'b']);
  });

  it('keeps the first occurrence, not the last', () => {
    const result = uniqueById([item('a', 'first'), item('a', 'second')]);

    expect(result).toEqual([{id: 'a', label: 'first'}]);
  });

  it('handles an empty list', () => {
    expect(uniqueById([])).toEqual([]);
  });

  it('does not mutate the input', () => {
    const items = [item('a'), item('a')];
    const original = [...items];

    uniqueById(items);

    expect(items).toEqual(original);
  });
});
