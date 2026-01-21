import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'dark', // Default to dark for HOACodeLab
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'hoa-theme-storage',
        }
    )
);

export default useThemeStore;