// src/modules/menu/data/menus.mock.js
// Mock menus — replace with menuService.fetchMenus() when backend is ready.

export const MOCK_MENUS = [
  { id: 'm1', name: 'Main Menu',      type: 'Default',    status: 'Active',    priority: 0,  outlets: 'All' },
  { id: 'm2', name: 'Breakfast Menu', type: 'Time-Based', status: 'Active',    priority: 5,  outlets: 'All', timeFrom: '07:00', timeTo: '11:00' },
  { id: 'm3', name: 'Festive Menu',   type: 'Festive',    status: 'Scheduled', priority: 10, outlets: 'All', startDate: '2026-10-01', endDate: '2026-10-10' },
];
