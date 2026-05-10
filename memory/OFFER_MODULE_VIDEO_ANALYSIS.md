# Offer Module — Video Analysis & Specification
> Last updated: 2026-05-09
> Source: Reference videos from PILOT app (app.fab.delivery)
> Videos: restrobopos/videos/offer module.mp4, restrobopos/videos/module configuration.mp4

---

## 1. OFFER LIST PAGE (app.fab.delivery/offers)

### Layout
- Page title: "Offers" (h1, top-left)
- 4 tabs: **Offer List** | **Link Offer** | **Membership List** | **Membership Offer List**
- Blue **"+ Add Offer"** button (top-right)
- Below tabs: outlet filter dropdown ("Select outlets")
- Table with pagination (< 1 2 >)

### Offer Types (from "Add Offer" dropdown)
The dropdown shows a "Select offer" label and these types:
1. Get an item
2. Buy X Get Y free
3. Menu Discount
4. BOGO
5. Coupled Offer
6. Value Deal
7. BOGO with view
8. Price Override
9. Flat Discount
10. Free Delivery
11. Percentage Discount

### Table Columns
| Column | Content |
|--------|---------|
| Code | Monospace, e.g. VEGBOGO, B@G1@PIZZA |
| Type | BOGO, Value Deal, Flat Discount, etc. |
| Title | Human-readable name |
| Description | Full description text |
| Link Offer | Blue "Link" text button |
| Actions | Toggle switch + Edit icon + Delete icon |

### Mock Data (from video)
| Code | Type | Title | Description | Active |
|------|------|-------|-------------|--------|
| VEGBOGO | BOGO | Buy 1 Get 1 Free | Buy One Get One Free | ✅ |
| B@G1@PIZZA | Value Deal | Buy 2 Get 1 free | Buy two pizza and get one pizza free. | ✅ |
| 2NDPIZZA50 | Value Deal | Pizza@50% | get 50% on second pizza. | ✅ |
| B1G1ALLSIZE | BOGO with view | ALL SIZE BOGO | All size Pizza free. | ✅ |
| BOGO-LAMILANO | BOGO | Buy One Get One Free | Buy One Get One Free | ❌ |
| FREE@chocolava | Get an item | Free Choco lava | get free choco lava | ❌ |
| HUNGRY175 | Flat Discount | Flat 175 Rs Off | 175 Rs off on orders worth 599 Rs and more | ✅ |
| HUNGRY125 | Flat Discount | Flat 125 Rs Off | 125 Rs off on orders worth 399 Rs and more | ✅ |
| SAVERY75 | Flat Discount | Flat 75 Rs Off | 75 Rs off on orders worth 249 Rs and more | ❌ |
| SAVERY50 | Flat Discount | Flat 50 Rs Off | 50 Rs off on orders worth 199 Rs and more | ❌ |

---

## 2. OFFER CONFIGURATION FORM

When user clicks "Add Offer" → selects type → navigates to config form.
URL pattern: `app.fab.delivery/offers/create?offerType=flat_discount`
Edit URL: `app.fab.delivery/offers/edit/1502?offerType=free_items`

### Form Sections (8 collapsible accordion panels)

---

### Section 1: Basic Details (always expanded by default)
| Field | Type | Placeholder/Notes |
|-------|------|-------------------|
| Offer Code * | text input | e.g. VEGBOGO |
| Offer Title * | text input | e.g. Buy 1 Get 1 Free |
| Description | textarea (3 rows) | Enter offer description |

### Section 2: Value & Conditions
| Field | Type | Notes |
|-------|------|-------|
| Minimum Order Value (₹) | number input | e.g. 499 |
| Discount Value | number input + select (₹ Flat / % Off) | Combined input |
| Max Discount (₹) | number input | e.g. 200 |
| Category/Item Applicability | 3 radio buttons | See below |

**Category/Item Applicability Options:**
1. ○ This offer is applicable on all categories.
2. ● This offer is only applicable on specific categories. → Opens **Select Categories Modal**
3. ○ This offer is only applicable on specific items. → Opens **Select Items Modal**

#### Select Categories Modal (full-page overlay)
- **Title**: "Select Categories" with blue badge showing count (e.g. "732 selected")
- **Select Outlets**: Multi-select dropdown with chips/tags (e.g. "Nana Chiloda ×")
  - Shows selected outlets as blue pill badges below
- **"Showing categories for: [Outlet Name]"** + loading indicator
- **Search bar**: "Search categories, items, variants..."
- **Category tree list**: Each row has:
  - Expand/collapse chevron (▸)
  - Checkbox (blue when checked, stop-icon when partial)
  - Category name + outlet suffix (e.g. "Veg Pizzas-Nana Chiloda")
  - "Category" badge (gray pill)
- **Footer**: "× Close" link (left) | "Done (732)" blue button (right)

**Categories seen in video:**
- Buy 1 Get 1 Free-Nana Chiloda
- Drinks & Shakes-Nana Chiloda
- Veg Pizzas-Nana Chiloda
- Protien Pizzas-Nana Chiloda (checked ✅)
- Cheese Burst Pizzas-Nana Chiloda
- Giant Slice Pizzas-Nana Chiloda
- Classic Mania-Nana Chiloda
- Garlic Bread-Nana Chiloda

### Section 3: Clubbing
| Question | Options |
|----------|---------|
| Do you want this offer to apply with any other offer? | ● No / ○ Yes |
| Do you want this offer and the Club Membership Offer to be applied together? | ● No / ○ Yes |
| Apply Offer to Membership Applied Items | ● No / ○ Yes |
| Apply Offer to Exclusive Items | ● No / ○ Yes |
| Do you want to auto-apply this offer? | ● No / ○ Yes |
| Do you want to consolidate this offer with rewards? | ● No / ○ Yes |

### Section 4: Visibility and Linking
| Question | Options |
|----------|---------|
| Should this offer be visible on the Coupon Page in cart? | ● No / ○ Yes |
| Should this offer be visible on Offer Tab in app? | ● No / ○ Yes |
| Decide this offer is applied to all user or specific user | ● Apply to all user / ○ Apply for specific user |

### Section 5: Offer Apply (NEW)
Horizontal checkbox row:
- ☐ Delivery
- ☐ Takeaway
- ☐ Qsr

### Section 6: Validity and Applicability (NEW)
| Field | Type | Notes |
|-------|------|-------|
| Total Usage Limit | Radio (No limit / Set a limit) + number input | e.g. 10000 |
| Individual Usage Limit | Radio (No limit / Set a limit) + number input | Per user |
| Number of users can use this offer | number input | |
| Minimum Required Order Count | number input | |
| Maximum Required Order Count | number input | |
| Make this offer perpetual? | Radio (Yes / No) | |
| Coupon valid from | date picker | Only if not perpetual |
| Coupon valid till | date picker | Only if not perpetual |

### Section 7: Offer Timing
- 3 radio options:
  1. Offer is available for all days of the week
  2. Offer is available at same time for all days of the week
  3. Offer is available at specific time for specific days of the week
- If option 3: Day-wise time slot editor (max 6 slots per day)
  - Each slot: Start time + End time + remove button
  - "+ Add" button per day

### Section 8: Terms & Conditions
- Single textarea: "Please Enter terms and conditions: English"
- Multi-line, resizable

### Action Buttons (bottom)
- "Discard changes" (red text, left-aligned)
- "Save" (blue primary button with save icon, right-aligned)

---

## 3. LINK OFFER TAB

### Current Video Shows
When viewing linked offers per outlet:
- Table with columns: (drag handle ≡) | Type | Title | Description | Code | Unlink button
- Rows have light blue background
- "Unlink" button is blue outline style

### Link Offer Data (from video)
| Type | Title | Description | Code |
|------|-------|-------------|------|
| Value Deal | Buy 2 Get 1 free | Buy two pizza and get one pizza free.... | B@G1@PIZZA |
| BOGO | Buy 1 Get 1 Free | Buy One Get One Free... | VEGBOGO |
| Value Deal | Buy 2 Get 1 Free | Lower-value item will be free. Minimum 3 items... | Buy 2 Get 1 Free |
| Flat Discount | Flat 50 Rs Off | 50 Rs off on orders worth 199 Rs and more... | SAVERY50 |
| Flat Discount | Flat 75 Rs Off | 75 Rs off on orders worth 249 Rs and more... | SAVERY75 |
| Flat Discount | Flat 100 Off on 299 | Flat 100 Off on 299... | HUNGRY100 |
| Flat Discount | Flat 125 Rs Off | 125 Rs off on orders worth 399 Rs and more... | HUNGRY125 |
| Flat Discount | Flat 175 Rs Off | 175 Rs off on orders worth 599 Rs and more... | HUNGRY175 |
| Percentage Discount | Flat 20 % Off | 20 % off on orders worth 999 Rs and more... | FLAT20 |
| Percentage Discount | Flat 25 % Off | 25 % off on orders worth 1999 Rs and more... | TASTY25 |
| Percentage Discount | Flat 30 % off On 2500 | Flat 30 % off On 2500... | EATMORE30 |

---

## 4. CONFIGURATION VIDEO (module configuration.mp4)

Shows editing an existing "free_items" type offer (ID 1502):
- URL: app.fab.delivery/offers/edit/1502?offerType=free_items
- Category/Item selection with specific categories radio selected
- "Select Categories" modal open showing outlet-specific categories
- Behind the modal: a list of items with quantities (e.g. "Veg Pizza | Veg Pizza-Levaral Mobile" with qty "1")
- This is for "Get an item" / "free items" type offers where you specify which items the customer gets free

---

## 5. WHAT NEEDS TO CHANGE (Current vs. Target)

### OfferList.jsx Changes
- [x] Offer types already match (minor additions: Price Override, Percentage Discount, Free Delivery)
- [x] Table structure already matches
- [x] Tabs already match

### OfferForm.jsx — MAJOR REWRITE NEEDED
| Section | Current Status | Target |
|---------|---------------|--------|
| Basic Details | ✅ Exists | ✅ Keep as-is |
| Value & Conditions | ✅ Exists (basic) | ⚠️ Add category/item applicability + modal |
| Clubbing | ✅ Exists (4 items) | ⚠️ Add 2 more items |
| Visibility and Linking | ❌ Different design | 🔄 Restructure to match video |
| Offer Apply | ❌ Missing | ➕ NEW: Delivery/Takeaway/Qsr |
| Validity and Applicability | ❌ Missing | ➕ NEW: Usage limits, dates, perpetual |
| Offer Timing | ✅ Exists | ✅ Keep as-is |
| Terms & Conditions | ✅ Exists | ✅ Keep as-is |
| Select Categories Modal | ❌ Missing | ➕ NEW: Full modal with tree view |
