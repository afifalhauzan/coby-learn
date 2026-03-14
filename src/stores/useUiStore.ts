import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiStoreState {
  hasSeenChatSuggestions: boolean;
  markChatSuggestionsSeen: () => void;
}

export const useUiStore = create<UiStoreState>()(
  persist(
    (set) => ({
      hasSeenChatSuggestions: false,
      markChatSuggestionsSeen: () => set({ hasSeenChatSuggestions: true }),
    }),
    {
      name: 'coby-learn-ui',
      partialize: (state) => ({
        hasSeenChatSuggestions: state.hasSeenChatSuggestions,
      }),
    }
  )
);