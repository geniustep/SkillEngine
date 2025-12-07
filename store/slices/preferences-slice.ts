import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  pageSize: number;
  setPageSize: (size: number) => void;
  dateFormat: string;
  setDateFormat: (format: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      pageSize: 10,
      setPageSize: (size) => set({ pageSize: size }),
      dateFormat: 'MM/dd/yyyy',
      setDateFormat: (format) => set({ dateFormat: format }),
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'preferences-storage',
    }
  )
);
