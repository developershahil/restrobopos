import { create } from 'zustand';

export const useOutletSettingsStore = create((set, get) => ({
  settings: {},

  getSettings: (outletId) => {
    // If not initialized, return default 'true' for all
    const current = get().settings[outletId];
    if (current) return current;
    
    return {
      master: true,
      delivery: true,
      takeaway: true,
      dineIn: true
    };
  },

  toggleSetting: (outletId, key) => set((state) => {
    const current = state.settings[outletId] || {
      master: true,
      delivery: true,
      takeaway: true,
      dineIn: true
    };

    return {
      settings: {
        ...state.settings,
        [outletId]: {
          ...current,
          [key]: !current[key]
        }
      }
    };
  })
}));
