# Restrobopos — Project Overview
> Last updated: 2026-05-09

## What is this?
A **multi-tenant restaurant SaaS platform** (React + Vite) for enterprise restaurant management.
The reference product is **PILOT by Fab Systems** at `app.fab.delivery`.

## Tech Stack
| Tech | Version | Purpose |
|------|---------|---------|
| React | 19.2.5 | UI framework |
| Vite | 8.0.10 | Build tool |
| Tailwind CSS | 3.4.19 | Styling (utility classes) |
| React Router DOM | 7.14.2 | Routing |
| Zustand | 5.0.12 | State management |
| Lucide React | 1.11.0 | Icons |
| Framer Motion | 12.38.0 | Animations |
| @dnd-kit | 6.3.1 | Drag and drop |

## Design System (CSS Variables in index.css)
Uses HSL-based CSS custom properties in `:root`:
- `--primary: 221.2 83.2% 53.3%` (Blue)
- `--background: 210 40% 98%` (Off-white)
- `--foreground: 222.2 84% 4.9%` (Near-black)
- `--card: 0 0% 100%` (White)
- `--muted: 210 40% 96.1%`
- `--destructive: 0 84.2% 60.2%` (Red)
- `--border: 214.3 31.8% 91.4%`
- Dark mode also defined in `.dark` class

## Common UI Patterns
- **Inputs**: `bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary`
- **Primary Button**: `bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 shadow-sm`
- **Cards**: `bg-card border border-border rounded-xl shadow-sm`
- **Collapsible Sections**: Use a `Section` component with chevron toggle
- **Toggle Switch**: Custom `w-11 h-6 rounded-full` with sliding dot
- **Radio Groups**: Standard radio with `accent-[hsl(var(--primary))]`

## Dev Server
```bash
npm run dev   # http://localhost:5173/
```

## Folder Structure
```
restrobopos/
├── public/                    # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── videos/                    # Reference videos
│   ├── offer module.mp4       # Offer module reference
│   └── module configuration.mp4
├── memory/                    # AI memory (this folder)
├── src/
│   ├── main.jsx               # Entry point
│   ├── App.jsx                # Router config
│   ├── App.css                # Legacy styles (unused mostly)
│   ├── index.css              # Design tokens (CSS vars)
│   ├── assets/                # Images
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── components/
│   │   ├── Sidebar.jsx        # Nav sidebar (collapsible)
│   │   ├── Topbar.jsx         # Top bar with restaurant switcher
│   │   ├── modals/
│   │   │   └── SwitchRestaurantModal.jsx
│   │   ├── menu/              # Menu module (complete)
│   │   │   ├── builder/       # Menu builder tab
│   │   │   ├── common/        # Shared menu components
│   │   │   ├── insights/      # Menu insights
│   │   │   ├── linking/       # Store/3rd-party linking
│   │   │   ├── menus/         # Menus tab
│   │   │   ├── modifiers/     # Modifiers/Add-ons tab
│   │   │   ├── offers/        # Menu-level offers
│   │   │   ├── rules/         # Menu rules
│   │   │   └── taxes/         # Tax configuration
│   │   ├── offers/            # ★ OFFER MODULE
│   │   │   ├── OfferList.jsx  # Offer listing with tabs
│   │   │   ├── OfferForm.jsx  # Offer creation/edit form
│   │   │   └── LinkOfferTab.jsx
│   │   └── orders/            # Orders module
│   │       ├── LiveOrdersBoard.jsx
│   │       ├── PastOrdersTable.jsx
│   │       └── FailedOrdersTable.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── CustomerCRM.jsx
│   │   ├── Orders.jsx
│   │   ├── Reports.jsx
│   │   ├── Menu.jsx
│   │   ├── Offers.jsx         # Offer page (thin wrapper)
│   │   ├── Stores.jsx
│   │   └── Profile.jsx
│   ├── store/
│   │   └── useMenuStore.js    # Zustand menu store
│   └── utils/
│       └── taxUtils.js
└── package.json
```

## Routes (App.jsx)
| Path | Component | Status |
|------|-----------|--------|
| /dashboard | Dashboard | ✅ Done |
| /customers | CustomerCRM | ✅ Done |
| /orders | Orders | ✅ Done |
| /reports | Reports | ✅ Done |
| /menu | Menu | ✅ Done |
| /offers | Offers | 🔧 In Progress |
| /stores | Stores | ✅ Done |
| /inventory | Placeholder | 🚧 Coming |
| /settings | Placeholder | 🚧 Coming |
| /super-admin | Placeholder | 🚧 Coming |
| /profile | Profile | ✅ Done |

## Sidebar Navigation
Defined in `Sidebar.jsx` with lucide icons:
Dashboard, Reports & BI, Customers, Orders, Stores, Menu, Offers, Inventory, Store Settings, Super Admin
