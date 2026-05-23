// src/modules/menu/data/offers.mock.js
// Mock offers — replace with menuService.fetchOffers() when backend is ready.

export const MOCK_OFFERS = [
  { id: 'o1', name: 'Happy Hour 20% Off', type: 'Percentage', value: '20', itemIds: ['i8'],       active: true  },
  { id: 'o2', name: 'Starter Combo Deal', type: 'Flat',       value: '50', itemIds: ['i1', 'i4'], active: false },
];
