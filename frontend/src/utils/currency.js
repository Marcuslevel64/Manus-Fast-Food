export function formatSoles(amount) {
  const value = Number(amount) || 0;
  return `S/ ${value.toFixed(2)}`;
}

export function sumBy(items, selector) {
  return items.reduce((acc, item) => acc + selector(item), 0);
}
