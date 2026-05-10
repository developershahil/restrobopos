# Offer Module — Implementation Plan
> Last updated: 2026-05-09
> Status: APPROVED — Ready for execution

## Goal
Rebuild the OfferForm.jsx to exactly match the PILOT (Fab Systems) offer configuration form shown in the reference videos.

---

## Changes Required

### 1. OfferList.jsx — Minor Updates
**File**: `src/components/offers/OfferList.jsx`

**Add these offer types to OFFER_TYPES array:**
- Price Override
- Percentage Discount
- Free Delivery

**Current OFFER_TYPES:**
```js
const OFFER_TYPES = [
  'Free Delivery', 'Get an Item', 'Buy X Get Y Free', 'Menu Discount',
  'BOGO', 'Coupled Offer', 'Value Deal', 'BOGO with View', 'Flat Discount'
];
```

**Target OFFER_TYPES:**
```js
const OFFER_TYPES = [
  'Get an Item', 'Buy X Get Y Free', 'Menu Discount', 'BOGO',
  'Coupled Offer', 'Value Deal', 'BOGO with View', 'Price Override',
  'Flat Discount', 'Free Delivery', 'Percentage Discount'
];
```

---

### 2. OfferForm.jsx — Major Rewrite
**File**: `src/components/offers/OfferForm.jsx`

#### Section 1: Basic Details (KEEP — minor polish)
- Offer Code, Title, Description
- Back arrow + offer type badge

#### Section 2: Value & Conditions (MODIFY)
Keep existing: Min Order, Discount Value, Max Discount
ADD:
- "Decide this offer is apply on which categories or items" — 3 radio options
- When "specific categories" selected → show "Select Categories" button → opens modal
- When "specific items" selected → show "Select Items" button → opens modal

#### Section 3: Clubbing (MODIFY)
Keep existing 4 questions, ADD 2 more:
- "Apply Offer to Membership Applied Items" (No/Yes)
- "Apply Offer to Exclusive Items" (No/Yes)

Full list (6 items):
1. Do you want this offer to apply with any other offer?
2. Do you want this offer and the Club Membership Offer to be applied together?
3. Apply Offer to Membership Applied Items
4. Apply Offer to Exclusive Items
5. Do you want to auto-apply this offer?
6. Do you want to consolidate this offer with rewards?

#### Section 4: Visibility and Linking (RESTRUCTURE)
Remove: toggles for "Visible on App" / "Visible on Web"
Replace with:
1. Should this offer be visible on the Coupon Page in cart? (No/Yes radio)
2. Should this offer be visible on Offer Tab in app? (No/Yes radio)
3. Decide this offer is applied to all user or specific user (All users / Specific user radio)

#### Section 5: Offer Apply (NEW)
3 checkboxes in a row:
- ☐ Delivery
- ☐ Takeaway
- ☐ Qsr

#### Section 6: Validity and Applicability (NEW)
Fields:
- Total Usage Limit: radio (No limit / Set a limit) + conditional number input
- Individual Usage Limit: radio (No limit / Set a limit) + conditional number input
- Number of users can use this offer: number input
- Minimum Required Order Count: number input
- Maximum Required Order Count: number input
- Make this offer perpetual?: radio (Yes / No)
- If No: Coupon valid from (date) + Coupon valid till (date)

#### Section 7: Offer Timing (KEEP)
Already matches video exactly.

#### Section 8: Terms & Conditions (KEEP)
Already matches video exactly.

---

### 3. SelectCategoriesModal.jsx (NEW FILE)
**File**: `src/components/offers/SelectCategoriesModal.jsx`

Full-screen overlay modal with:
- Header: "Select Categories" + count badge
- Outlet multi-select dropdown with pill tags
- Search bar
- Category tree list with checkboxes (expand/collapse)
- Footer: Close + Done(count) button

Mock categories data:
```js
const MOCK_CATEGORIES = [
  { id: 1, name: 'Buy 1 Get 1 Free', outlet: 'Koramangala', items: [...] },
  { id: 2, name: 'Drinks & Shakes', outlet: 'Koramangala', items: [...] },
  { id: 3, name: 'Veg Pizzas', outlet: 'Koramangala', items: [...] },
  { id: 4, name: 'Protein Pizzas', outlet: 'Koramangala', items: [...] },
  { id: 5, name: 'Cheese Burst Pizzas', outlet: 'Koramangala', items: [...] },
  { id: 6, name: 'Giant Slice Pizzas', outlet: 'Koramangala', items: [...] },
  { id: 7, name: 'Classic Mania', outlet: 'Koramangala', items: [...] },
  { id: 8, name: 'Garlic Bread', outlet: 'Koramangala', items: [...] },
  { id: 9, name: 'Sides & Extras', outlet: 'Koramangala', items: [...] },
  { id: 10, name: 'Desserts', outlet: 'Koramangala', items: [...] },
];
```

---

## Section Order (matching video exactly)
1. Basic Details (default open)
2. Value & Conditions (default open)
3. Clubbing (collapsed)
4. Visibility and Linking (collapsed)
5. Offer Apply (collapsed)
6. Validity and Applicability (collapsed)
7. Offer Timing (collapsed)
8. Terms & Conditions (collapsed)

## Form State Shape
```js
const [form, setForm] = useState({
  // Basic
  code: '', title: '', description: '',
  // Value & Conditions
  minOrder: '', discountValue: '', discountType: 'flat', maxDiscount: '',
  applicability: 'all_categories', // 'all_categories' | 'specific_categories' | 'specific_items'
  selectedCategories: [], selectedItems: [],
  // Clubbing
  clubWithOther: 'no', clubWithMembership: 'no',
  applyToMembershipItems: 'no', applyToExclusiveItems: 'no',
  autoApply: 'no', consolidateRewards: 'no',
  // Visibility
  visibleOnCouponPage: 'no', visibleOnOfferTab: 'no',
  userApplicability: 'all', // 'all' | 'specific'
  // Offer Apply
  applyDelivery: false, applyTakeaway: false, applyQsr: false,
  // Validity
  totalUsageLimit: 'no_limit', totalUsageLimitValue: '',
  individualUsageLimit: 'no_limit', individualUsageLimitValue: '',
  maxUsers: '', minOrderCount: '', maxOrderCount: '',
  isPerpetual: 'yes', validFrom: '', validTill: '',
  // Timing
  timingOption: 'all_days',
  // Terms
  termsAndConditions: '',
});
```

---

## Verification Checklist
- [ ] "Add Offer" dropdown shows all 11 types
- [ ] All 8 sections render in correct order
- [ ] Sections collapse/expand correctly
- [ ] Category/item radio shows Select Categories modal
- [ ] Select Categories modal has outlet selector, search, tree view
- [ ] Clubbing has 6 questions
- [ ] Visibility has 3 radio questions  
- [ ] Offer Apply has 3 checkboxes
- [ ] Validity has usage limits, order counts, perpetual toggle + date pickers
- [ ] Timing section unchanged
- [ ] Terms section unchanged
- [ ] Save/Discard buttons at bottom
