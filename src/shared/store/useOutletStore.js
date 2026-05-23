import { create } from 'zustand';

export const OUTLETS = [
  { id: 'o1', name: 'Koramangala Branch' },
  { id: 'o2', name: 'Indiranagar Branch' },
  { id: 'o3', name: 'Whitefield Branch' },
  { id: 'o4', name: 'HSR Layout Branch' },
];

export const useOutletStore = create((set) => ({
  activeOutlet: OUTLETS[0],
  outlets: OUTLETS,
  setActiveOutlet: (outletId) => set((state) => ({
    activeOutlet: state.outlets.find(o => o.id === outletId) || state.outlets[0]
  }))
}));
