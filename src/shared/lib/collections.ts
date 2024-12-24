type WithId = {id: string};

export const uniqueById = <T extends WithId>(items: T[]): T[] => {
  const seen = new Set<string>();
  return items.filter(item => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};
