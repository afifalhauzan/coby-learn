import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardOnboardingState {
  hasCompletedOnboarding: boolean;
  hasSeenAddTaskSpotlight: boolean;
  hasSeenLibrarySpotlight: boolean;
  hasHydrated: boolean;
  completeOnboarding: () => void;
  completeSpotlight: () => void;
  completeLibrarySpotlight: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useDashboardOnboardingStore = create<DashboardOnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      hasSeenAddTaskSpotlight: false,
      hasSeenLibrarySpotlight: false,
      hasHydrated: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      completeSpotlight: () => set({ hasSeenAddTaskSpotlight: true }),
      completeLibrarySpotlight: () => set({ hasSeenLibrarySpotlight: true }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'coby-learn-dashboard-onboarding',
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasSeenAddTaskSpotlight: state.hasSeenAddTaskSpotlight,
        hasSeenLibrarySpotlight: state.hasSeenLibrarySpotlight,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);