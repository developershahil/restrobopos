import { create } from 'zustand';

const COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6'];

const initialMenus = [
  { id: 'm1', name: 'Main Menu',      type: 'Default',    status: 'Active',    priority: 0,  outlets: 'All' },
  { id: 'm2', name: 'Breakfast Menu', type: 'Time-Based', status: 'Active',    priority: 5,  outlets: 'All', timeFrom: '07:00', timeTo: '11:00' },
  { id: 'm3', name: 'Festive Menu',   type: 'Festive',    status: 'Scheduled', priority: 10, outlets: 'All', startDate: '2026-10-01', endDate: '2026-10-10' },
];

const initialCategories = [
  { id: 'c1', name: 'Starters', active: true, color: '#6366f1' },
  { id: 'c2', name: 'Mains', active: true, color: '#f59e0b' },
  { id: 'c3', name: 'Desserts', active: true, color: '#10b981' },
  { id: 'c4', name: 'Beverages', active: false, color: '#3b82f6' },
];

const initialItems = [
  { id: 'i1', name: 'Paneer Tikka', price: '12.00', type: 'Veg', status: 'Active', categoryId: 'c1', inStock: true, stockQty: '50', itemCode: 'STR-001', discount: '0', minOrderQty: '1', maxOrderQty: '10', tags: ['Bestseller','Spicy'], description: 'Soft cottage cheese cubes marinated in spiced yogurt.', prepTime: '15', calories: '320', packagingCharge: '5', allergens: ['Dairy'], channels: ['Delivery','Takeaway','Dine-in'] },
  { id: 'i2', name: 'Chicken Wings', price: '14.50', type: 'Non-Veg', status: 'Active', categoryId: 'c1', inStock: true, stockQty: '30', itemCode: 'STR-002', discount: '10', minOrderQty: '1', maxOrderQty: '5', tags: ['Popular'], description: 'Crispy wings tossed in tangy sauce.', prepTime: '20', calories: '450', packagingCharge: '5', allergens: [], channels: ['Delivery','Dine-in'] },
  { id: 'i3', name: 'Spring Rolls', price: '10.00', type: 'Veg', status: 'Out of Stock', categoryId: 'c1', inStock: false, stockQty: '0', itemCode: 'STR-003', discount: '0', minOrderQty: '1', maxOrderQty: '10', tags: [], description: '', prepTime: '10', calories: '200', packagingCharge: '0', allergens: ['Gluten'], channels: ['Delivery','Takeaway','Dine-in'] },
  { id: 'i4', name: 'Garlic Bread', price: '8.00', type: 'Veg', status: 'Active', categoryId: 'c1', inStock: true, stockQty: '100', itemCode: 'STR-004', discount: '0', minOrderQty: '1', maxOrderQty: '5', tags: ['New'], description: '', prepTime: '8', calories: '180', packagingCharge: '0', allergens: ['Gluten','Dairy'], channels: ['Delivery','Takeaway','Dine-in'] },
  { id: 'i5', name: 'Butter Chicken', price: '18.00', type: 'Non-Veg', status: 'Active', categoryId: 'c2', inStock: true, stockQty: '40', itemCode: 'MN-001', discount: '5', minOrderQty: '1', maxOrderQty: '10', tags: ['Bestseller'], description: 'Rich tomato-based curry with tender chicken.', prepTime: '25', calories: '520', packagingCharge: '10', allergens: ['Dairy'], channels: ['Delivery','Takeaway','Dine-in'] },
  { id: 'i6', name: 'Dal Makhani', price: '14.00', type: 'Veg', status: 'Active', categoryId: 'c2', inStock: true, stockQty: '60', itemCode: 'MN-002', discount: '0', minOrderQty: '1', maxOrderQty: '10', tags: [], description: '', prepTime: '20', calories: '380', packagingCharge: '10', allergens: ['Dairy'], channels: ['Delivery','Takeaway','Dine-in'] },
  { id: 'i7', name: 'Gulab Jamun', price: '6.00', type: 'Veg', status: 'Active', categoryId: 'c3', inStock: true, stockQty: '80', itemCode: 'DST-001', discount: '0', minOrderQty: '2', maxOrderQty: '20', tags: ['Popular'], description: '', prepTime: '5', calories: '150', packagingCharge: '0', allergens: ['Dairy','Gluten'], channels: ['Delivery','Takeaway','Dine-in'] },
  { id: 'i8', name: 'Mango Lassi', price: '5.00', type: 'Veg', status: 'Active', categoryId: 'c4', inStock: true, stockQty: '50', itemCode: 'BEV-001', discount: '0', minOrderQty: '1', maxOrderQty: '10', tags: [], description: '', prepTime: '3', calories: '120', packagingCharge: '0', allergens: ['Dairy'], channels: ['Delivery','Takeaway'] },
];

const initialVariants = [
  { id: 'v1', itemId: 'i1', name: 'Regular', price: '12.00' },
  { id: 'v2', itemId: 'i1', name: 'Large', price: '16.00' },
  { id: 'v3', itemId: 'i2', name: 'Half', price: '8.00' },
  { id: 'v4', itemId: 'i2', name: 'Full', price: '14.50' },
];

const initialVariantGroups = [
  { id: 'vg1', name: 'Size' },
  { id: 'vg2', name: 'Preparation' },
];

const initialGlobalVariants = [
  { id: 'gv1', groupId: 'vg1', name: 'Regular', priceDiff: '0' },
  { id: 'gv2', groupId: 'vg1', name: 'Medium', priceDiff: '2' },
  { id: 'gv3', groupId: 'vg1', name: 'Giant', priceDiff: '5' },
  { id: 'gv4', groupId: 'vg1', name: 'Monster', priceDiff: '8' },
];

const initialAddonGroups = [
  { id: 'ag1', name: 'Dips & Sauces', min: 0, max: 2 },
  { id: 'ag2', name: 'Extra Toppings', min: 0, max: 3 },
  { id: 'ag3', name: 'Drinks Add-on', min: 0, max: 1 },
];

const initialAddonItems = [
  { id: 'ai1', groupId: 'ag1', name: 'Mint Chutney', price: '0.50', inStock: true },
  { id: 'ai2', groupId: 'ag1', name: 'Tamarind Sauce', price: '0.50', inStock: true },
  { id: 'ai3', groupId: 'ag1', name: 'Mayo', price: '1.00', inStock: true },
  { id: 'ai4', groupId: 'ag2', name: 'Extra Cheese', price: '1.50', inStock: true },
  { id: 'ai5', groupId: 'ag2', name: 'Jalapeños', price: '0.75', inStock: true },
  { id: 'ai6', groupId: 'ag3', name: 'Soft Drink', price: '2.00', inStock: true },
];

const initialItemAddonLinks = {
  i1: { linked: ['ag1', 'ag2'], applyToCategory: false },
  i2: { linked: ['ag1'], applyToCategory: false },
};

const initialItemVariantLinks = {
  i1: { linked: ['vg1'], applyToCategory: false },
};

const initialItemTiming = {
  i1: { alwaysAvailable: true, days: [], startTime: '', endTime: '' },
};

// taxId → { id, name, cgst, sgst, categoryIds: [] } — empty categoryIds = global
const initialTaxes = [
  { id: 't1', name: 'GST 5%',  cgst: '2.5', sgst: '2.5', categoryIds: [] },
  { id: 't2', name: 'GST 12%', cgst: '6',   sgst: '6',   categoryIds: ['c2'] },
  { id: 't3', name: 'GST 18%', cgst: '9',   sgst: '9',   categoryIds: [] },
];

// offers
const initialOffers = [
  { id: 'o1', name: 'Happy Hour 20% Off', type: 'Percentage', value: '20', itemIds: ['i8'], active: true },
  { id: 'o2', name: 'Starter Combo Deal', type: 'Flat', value: '50', itemIds: ['i1','i4'], active: false },
];

let _idCounter = 100;
const uid = (prefix) => `${prefix}${++_idCounter}`;

export const useMenuStore = create((set, get) => ({
  // ── UI State ────────────────────────────────────────────────
  activeTab: 'builder',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isSimpleMode: false,
  setIsSimpleMode: (mode) => set({ isSimpleMode: mode }),
  showPreviewDrawer: false,
  setShowPreviewDrawer: (show) => set({ showPreviewDrawer: show }),

  // ── Menus ────────────────────────────────────────────────────
  menus: initialMenus,
  selectedMenuId: 'm1',
  setSelectedMenuId: (id) => set({ selectedMenuId: id }),
  addMenu: (data) => set((s) => ({ menus: [...s.menus, { id: uid('m'), ...data }] })),
  updateMenu: (id, data) => set((s) => ({ menus: s.menus.map(m => m.id === id ? { ...m, ...data } : m) })),
  deleteMenu: (id) => set((s) => ({ menus: s.menus.filter(m => m.id !== id) })),

  // ── Builder Selection ─────────────────────────────────────────
  selectedCategoryId: 'c1',
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id, selectedItemId: null }),
  selectedItemId: null,
  setSelectedItemId: (id) => set({ selectedItemId: id }),

  // legacy
  showItemDrawer: false,
  setShowItemDrawer: (show) => set({ showItemDrawer: show }),
  selectedItemForEdit: null,
  setSelectedItemForEdit: (item) => set({ selectedItemForEdit: item, showItemDrawer: true }),

  // ── Categories ───────────────────────────────────────────────
  categories: initialCategories,
  setCategories: (categories) => set({ categories }),
  addCategory: (data) => set((s) => ({ categories: [...s.categories, { id: uid('c'), color: COLORS[s.categories.length % COLORS.length], ...data }] })),
  updateCategory: (id, data) => set((s) => ({ categories: s.categories.map(c => c.id === id ? { ...c, ...data } : c) })),
  deleteCategory: (id) => set((s) => ({
    categories: s.categories.filter(c => c.id !== id),
    items: s.items.filter(i => i.categoryId !== id),
    selectedCategoryId: s.selectedCategoryId === id ? (s.categories.find(c => c.id !== id)?.id || null) : s.selectedCategoryId,
  })),

  // ── Items ─────────────────────────────────────────────────────
  items: initialItems,
  setItems: (items) => set({ items }),
  addItem: (data) => set((s) => ({ items: [...s.items, { id: uid('i'), inStock: true, stockQty: '', itemCode: '', discount: '0', minOrderQty: '1', maxOrderQty: '', tags: [], description: '', prepTime: '', calories: '', packagingCharge: '0', allergens: [], channels: ['Delivery','Takeaway','Dine-in'], ...data }] })),
  updateItem: (id, data) => set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, ...data } : i) })),
  deleteItem: (id) => set((s) => ({
    items: s.items.filter(i => i.id !== id),
    selectedItemId: s.selectedItemId === id ? null : s.selectedItemId,
  })),
  duplicateItem: (id) => set((s) => {
    const src = s.items.find(i => i.id === id);
    if (!src) return s;
    return { items: [...s.items, { ...src, id: uid('i'), name: `${src.name} (Copy)` }] };
  }),
  toggleItemStock: (id) => set((s) => ({
    items: s.items.map(i => i.id === id ? { ...i, inStock: !i.inStock, status: i.inStock ? 'Out of Stock' : 'Active' } : i),
  })),
  bulkToggleCategory: (catId, active) => set((s) => ({
    items: s.items.map(i => i.categoryId === catId ? { ...i, status: active ? 'Active' : 'Inactive', inStock: active } : i),
  })),

  // ── Variants (Per-Item) ───────────────────────────────────────
  variants: initialVariants,
  addVariant: (data) => set((s) => ({ variants: [...s.variants, { id: uid('v'), ...data }] })),
  updateVariant: (id, data) => set((s) => ({ variants: s.variants.map(v => v.id === id ? { ...v, ...data } : v) })),
  deleteVariant: (id) => set((s) => ({ variants: s.variants.filter(v => v.id !== id) })),

  // ── Variant Groups (Global) ───────────────────────────────────
  variantGroups: initialVariantGroups,
  addVariantGroup: (data) => set((s) => ({ variantGroups: [...s.variantGroups, { id: uid('vg'), ...data }] })),
  updateVariantGroup: (id, data) => set((s) => ({ variantGroups: s.variantGroups.map(g => g.id === id ? { ...g, ...data } : g) })),
  deleteVariantGroup: (id) => set((s) => ({ 
    variantGroups: s.variantGroups.filter(g => g.id !== id),
    globalVariants: s.globalVariants.filter(gv => gv.groupId !== id)
  })),

  // ── Global Variants (Items under Groups) ──────────────────────
  globalVariants: initialGlobalVariants,
  addGlobalVariant: (data) => set((s) => ({ globalVariants: [...s.globalVariants, { id: uid('gv'), ...data }] })),
  updateGlobalVariant: (id, data) => set((s) => ({ globalVariants: s.globalVariants.map(gv => gv.id === id ? { ...gv, ...data } : gv) })),
  deleteGlobalVariant: (id) => set((s) => ({ globalVariants: s.globalVariants.filter(gv => gv.id !== id) })),

  // ── Addon Groups ──────────────────────────────────────────────
  addonGroups: initialAddonGroups,
  addAddonGroup: (data) => set((s) => ({ addonGroups: [...s.addonGroups, { id: uid('ag'), ...data }] })),
  updateAddonGroup: (id, data) => set((s) => ({ addonGroups: s.addonGroups.map(g => g.id === id ? { ...g, ...data } : g) })),
  deleteAddonGroup: (id) => set((s) => ({
    addonGroups: s.addonGroups.filter(g => g.id !== id),
    addonItems: s.addonItems.filter(ai => ai.groupId !== id),
  })),

  // ── Addon Items ───────────────────────────────────────────────
  addonItems: initialAddonItems,
  addAddonItem: (data) => set((s) => ({ addonItems: [...s.addonItems, { id: uid('ai'), inStock: true, ...data }] })),
  updateAddonItem: (id, data) => set((s) => ({ addonItems: s.addonItems.map(ai => ai.id === id ? { ...ai, ...data } : ai) })),
  deleteAddonItem: (id) => set((s) => ({ addonItems: s.addonItems.filter(ai => ai.id !== id) })),
  toggleAddonStock: (id) => set((s) => ({
    addonItems: s.addonItems.map(ai => ai.id === id ? { ...ai, inStock: !ai.inStock } : ai)
  })),
  bulkToggleAddonGroup: (groupId, active) => set((s) => ({
    addonItems: s.addonItems.map(ai => ai.groupId === groupId ? { ...ai, inStock: active } : ai)
  })),

  // ── Item Addon Links ──────────────────────────────────────────
  itemAddonLinks: initialItemAddonLinks,
  setItemAddonLinks: (itemId, data) => set((s) => ({ itemAddonLinks: { ...s.itemAddonLinks, [itemId]: data } })),

  // ── Item Variant Links ────────────────────────────────────────
  itemVariantLinks: initialItemVariantLinks,
  setItemVariantLinks: (itemId, data) => set((s) => ({ itemVariantLinks: { ...s.itemVariantLinks, [itemId]: data } })),

  // ── Bulk Linking (Addons & Variants) ──────────────────────────
  bulkLinkModifier: (groupId, modType, mode, selectionIds) => set((s) => {
    const linkField = modType === 'addon' ? 'itemAddonLinks' : 'itemVariantLinks';
    const currentLinks = { ...s[linkField] };

    // Determine target items
    let targetItems = [];
    if (mode === 'all') {
      targetItems = s.items;
    } else if (mode === 'category') {
      targetItems = s.items.filter(i => selectionIds.includes(i.categoryId));
    } else if (mode === 'item') {
      targetItems = s.items.filter(i => selectionIds.includes(i.id));
    }

    // Apply link to target items
    targetItems.forEach(item => {
      const existing = currentLinks[item.id] || { linked: [], applyToCategory: false };
      if (!existing.linked.includes(groupId)) {
        currentLinks[item.id] = { ...existing, linked: [...existing.linked, groupId] };
      }
    });

    return { [linkField]: currentLinks };
  }),

  // ── Item Timing ───────────────────────────────────────────────
  itemTiming: initialItemTiming,
  setItemTiming: (itemId, data) => set((s) => ({ itemTiming: { ...s.itemTiming, [itemId]: data } })),

  // ── Taxes ─────────────────────────────────────────────────────
  taxes: initialTaxes,
  addTax: (data) => set((s) => ({ taxes: [...s.taxes, { id: uid('t'), ...data }] })),
  updateTax: (id, data) => set((s) => ({ taxes: s.taxes.map(t => t.id === id ? { ...t, ...data } : t) })),
  deleteTax: (id) => set((s) => ({ taxes: s.taxes.filter(t => t.id !== id) })),

  // ── Offers ────────────────────────────────────────────────────
  offers: initialOffers,
  addOffer: (data) => set((s) => ({ offers: [...s.offers, { id: uid('o'), active: true, itemIds: [], ...data }] })),
  updateOffer: (id, data) => set((s) => ({ offers: s.offers.map(o => o.id === id ? { ...o, ...data } : o) })),
  deleteOffer: (id) => set((s) => ({ offers: s.offers.filter(o => o.id !== id) })),
  toggleOffer: (id) => set((s) => ({ offers: s.offers.map(o => o.id === id ? { ...o, active: !o.active } : o) })),

  // ── Modifiers / Links (legacy) ────────────────────────────────
  activeModifierTab: 'addons',
  setActiveModifierTab: (tab) => set({ activeModifierTab: tab }),
  links: { s1: ['c1','c2','c3'], s2: ['c1','c2','c3','c4'], s3: ['c1','c2'], s4: ['c4'] },
  setLinks: (updater) => set((state) => ({
    links: typeof updater === 'function' ? updater(state.links) : updater,
  })),
}));
