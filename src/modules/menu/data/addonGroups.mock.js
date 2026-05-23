// src/modules/menu/data/addonGroups.mock.js
// Mock addon groups and items — replace with menuService.fetchAddons() when backend is ready.

export const MOCK_ADDON_GROUPS = [
  { id: 'ag1', name: 'Dips & Sauces',   min: 0, max: 2 },
  { id: 'ag2', name: 'Extra Toppings',  min: 0, max: 3 },
  { id: 'ag3', name: 'Drinks Add-on',   min: 0, max: 1 },
];

export const MOCK_ADDON_ITEMS = [
  { id: 'ai1', groupId: 'ag1', name: 'Mint Chutney',   price: '0.50', inStock: true },
  { id: 'ai2', groupId: 'ag1', name: 'Tamarind Sauce', price: '0.50', inStock: true },
  { id: 'ai3', groupId: 'ag1', name: 'Mayo',           price: '1.00', inStock: true },
  { id: 'ai4', groupId: 'ag2', name: 'Extra Cheese',   price: '1.50', inStock: true },
  { id: 'ai5', groupId: 'ag2', name: 'Jalapeños',      price: '0.75', inStock: true },
  { id: 'ai6', groupId: 'ag3', name: 'Soft Drink',     price: '2.00', inStock: true },
];

export const MOCK_ITEM_ADDON_LINKS = {
  i1: { linked: ['ag1', 'ag2'], applyToCategory: false },
  i2: { linked: ['ag1'],        applyToCategory: false },
};
