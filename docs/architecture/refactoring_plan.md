# Comprehensive Project File Structure (No Code Changes Made)

Below is the **full, complete file structure** for the entire project. This structure safely breaks down large files into smaller parts based exactly on their specific work/responsibility, without breaking any existing routing or functionality.

```text
src/
│
├── assets/                       # Static assets (images, icons, global CSS)
│
├── store/                        # Global State Management (Zustand)
│   ├── useInventoryStore.js      # Existing inventory state
│   ├── useGlobalSettingsStore.js # For App Settings, Brand, Cashback, etc.
│   ├── useStoreSettingsStore.js  # For Store configs, Taxes, POS limits
│   ├── useCrmStore.js            # For Customer lists and points
│   └── useReportsStore.js        # For reporting filters and data
│
├── utils/                        # Shared Helper Functions & Constants
│   ├── formatters.js             # Date, currency, and number formatting
│   ├── validators.js             # Form validation logic
│   └── constants.js              # Hardcoded data (e.g., MOCK_BRANDS, SECTIONS)
│
├── layouts/                      # Page Layout Wrappers
│   └── DashboardLayout.jsx       # Main layout with Sidebar and Topbar
│
├── components/                   # UI and Feature-Specific Logic
│   │
│   ├── ui/                       # Universal Reusable UI Components
│   │   ├── Toggle.jsx            # Blue/Grey Enable/Disable buttons
│   │   ├── InputGroup.jsx        # Text input with label & subtext
│   │   ├── BaseCard.jsx          # Standard bordered layout box
│   │   ├── BaseModal.jsx         # Popup overlay wrapper
│   │   └── DataTable.jsx         # Standardized table component
│   │
│   ├── shared/                   # Shared Complex Components
│   │   ├── Sidebar.jsx           
│   │   ├── Topbar.jsx            
│   │   ├── GlobalSearchModal.jsx 
│   │   └── EmptyState.jsx        
│   │
│   ├── global-settings/          # Split from GlobalSettings.jsx
│   │   ├── AppSettings.jsx       # Restaurant name, splash screen logic
│   │   ├── BrandSettings.jsx     # Logos, colors, social links
│   │   ├── ApiIntegrations.jsx   # SMS Gateway and Maps API keys
│   │   ├── Languages.jsx         # Multi-language selector
│   │   ├── LegalContent.jsx      # About Us, Contact, Privacy textareas
│   │   ├── Cashback.jsx          # Cashback earning & advance settings
│   │   ├── OrderingMode.jsx      # Order type table and creation modal
│   │   └── ClubMembership.jsx    # Membership plans and badges
│   │
│   ├── store-settings/           # Split from StoreSettings.jsx
│   │   ├── GeneralInfo.jsx       # Store address and contact
│   │   ├── TaxSettings.jsx       # Tax percentages and logic
│   │   ├── PosSettings.jsx       # POS specific configurations
│   │   ├── DeliveryLimits.jsx    # COD and MOV logic
│   │   ├── WorkingHours.jsx      # Timings logic
│   │   └── FoodLicenses.jsx      # License uploads and expiry
│   │
│   ├── crm/                      # Split from CustomerCRM.jsx
│   │   ├── CustomerList.jsx      # Main table of customers
│   │   ├── CustomerDetails.jsx   # Individual customer view/edit modal
│   │   ├── CustomerFilters.jsx   # Search and sorting logic
│   │   └── LoyaltyPoints.jsx     # Point adjustment logic
│   │
│   ├── dashboard/                # Split from Dashboard.jsx
│   │   ├── StatCards.jsx         # Top metric cards (Sales, Orders)
│   │   ├── RevenueChart.jsx      # Graph logic
│   │   └── RecentOrdersList.jsx  # Latest activity feed
│   │
│   ├── reports/                  # Split from Reports.jsx
│   │   ├── ReportFilters.jsx     # Date and category selectors
│   │   ├── ReportTable.jsx       # Data grid
│   │   └── ExportControls.jsx    # CSV/PDF download logic
│   │
│   ├── profile/                  # Split from Profile.jsx
│   │   ├── ProfileDetails.jsx    # User info editor
│   │   ├── Security.jsx          # Password reset logic
│   │   └── Preferences.jsx       # User specific settings
│   │
│   ├── item-availability/        # Split from ItemAvailability.jsx
│   │   ├── AvailabilityList.jsx  # Grid/List of items
│   │   └── StatusControls.jsx    # In-stock/Out-of-stock toggles
│   │
│   ├── stores/                   # Split from Stores.jsx
│   │   ├── StoreList.jsx         # Grid of store cards
│   │   ├── StoreMap.jsx          # Visual store mapping
│   │   └── StoreMetrics.jsx      # Multi-store quick stats
│   │
│   ├── inventory/                # (Existing modular folder)
│   ├── menu/                     # (Existing modular folder)
│   ├── orders/                   # (Existing modular folder)
│   ├── offers/                   # (Existing modular folder)
│   ├── notifications/            # (Existing modular folder)
│   └── modals/                   # (Existing shared modals)
│
└── pages/                        # Routing Wrappers ONLY (Clean & Tiny)
    ├── Login.jsx                 # Full page login
    ├── Dashboard.jsx             # Renders components/dashboard/*
    ├── GlobalSettings.jsx        # Renders components/global-settings/*
    ├── StoreSettings.jsx         # Renders components/store-settings/*
    ├── CustomerCRM.jsx           # Renders components/crm/*
    ├── Reports.jsx               # Renders components/reports/*
    ├── Profile.jsx               # Renders components/profile/*
    ├── ItemAvailability.jsx      # Renders components/item-availability/*
    ├── Stores.jsx                # Renders components/stores/*
    ├── Inventory.jsx             # Renders components/inventory/*
    ├── Menu.jsx                  # Renders components/menu/*
    ├── Orders.jsx                # Renders components/orders/*
    ├── Offers.jsx                # Renders components/offers/*
    └── Notifications.jsx         # Renders components/notifications/*
```

## How this Architecture Works
1. **Separation of Concerns:** The files in `src/pages/` act solely as the "entry point" for the React Router. They contain almost zero logic. 
2. **Logic Isolation:** All the heavy lifting (forms, buttons, API calls) is done inside the specific folders in `src/components/`. For example, all Cashback logic goes *only* in `Cashback.jsx`.
3. **Consistency:** Because all modules pull buttons and inputs from `src/components/ui/`, if you change the color of a button, it updates perfectly across the entire application simultaneously.
