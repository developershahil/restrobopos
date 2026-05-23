/**
 * Returns the tax rule that applies to a given item.
 * Priority: category-specific tax > global tax (categoryIds = [])
 * If multiple category taxes exist, returns the first match.
 */
export function getItemTax(item, taxes) {
  if (!item || !taxes?.length) return null;
  // Category-specific tax
  const catTax = taxes.find(t => t.categoryIds?.includes(item.categoryId));
  if (catTax) return { ...catTax, source: 'category' };
  // Global tax
  const globalTax = taxes.find(t => !t.categoryIds || t.categoryIds.length === 0);
  if (globalTax) return { ...globalTax, source: 'global' };
  return null;
}

/**
 * Returns all items affected by a given tax rule.
 * - If categoryIds is empty → all items
 * - Otherwise → items whose categoryId is in the list
 */
export function getAffectedItems(tax, items) {
  if (!tax.categoryIds || tax.categoryIds.length === 0) return items;
  return items.filter(i => tax.categoryIds.includes(i.categoryId));
}

/**
 * Returns the tax that applies to a category (category-specific or global).
 */
export function getCategoryTax(categoryId, taxes) {
  const catTax = taxes.find(t => t.categoryIds?.includes(categoryId));
  if (catTax) return catTax;
  return taxes.find(t => !t.categoryIds || t.categoryIds.length === 0) || null;
}

export function totalRate(tax) {
  return (parseFloat(tax?.cgst || 0) + parseFloat(tax?.sgst || 0))
    .toFixed(2).replace(/\.?0+$/, '');
}
