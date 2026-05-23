// src/modules/menu/data/variants.mock.js
// Mock variant data — replace with menuService.fetchVariants() when backend is ready.

export const MOCK_VARIANTS = [
  { id: 'v1', itemId: 'i1', name: 'Regular', price: '12.00' },
  { id: 'v2', itemId: 'i1', name: 'Large',   price: '16.00' },
  { id: 'v3', itemId: 'i2', name: 'Half',    price: '8.00' },
  { id: 'v4', itemId: 'i2', name: 'Full',    price: '14.50' },
];

export const MOCK_VARIANT_GROUPS = [
  { id: 'vg1', name: 'Size' },
  { id: 'vg2', name: 'Preparation' },
];

export const MOCK_GLOBAL_VARIANTS = [
  { id: 'gv1', groupId: 'vg1', name: 'Regular', priceDiff: '0' },
  { id: 'gv2', groupId: 'vg1', name: 'Medium',  priceDiff: '2' },
  { id: 'gv3', groupId: 'vg1', name: 'Giant',   priceDiff: '5' },
  { id: 'gv4', groupId: 'vg1', name: 'Monster', priceDiff: '8' },
];

export const MOCK_ITEM_VARIANT_LINKS = {
  i1: { linked: ['vg1'], applyToCategory: false },
};
