import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STREAK_MILESTONES = [1, 3, 5, 10, 30] as const;

const isValidDate = (value: string | null): value is string => {
  if (!value) {
    return false;
  }

  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

const getStartOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const getCalendarDayDiff = (from: Date, to: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((getStartOfDay(to).getTime() - getStartOfDay(from).getTime()) / msPerDay);
};

interface StreakState {
  lastQuizDate: string | null;
  currentStreak: number;
  isReadyForIncrement: boolean;
  showShareModal: boolean;
  activeMilestone: number | null;
  shownMilestones: number[];
  validateStreakWindow: () => void;
  checkMilestoneAfterQuiz: () => void;
  closeShareModal: () => void;
  markMilestoneShared: (milestone: number) => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      lastQuizDate: null,
      currentStreak: 0,
      isReadyForIncrement: false,
      showShareModal: false,
      activeMilestone: null,
      shownMilestones: [],

      validateStreakWindow: () => {
        const { lastQuizDate } = get();

        if (!isValidDate(lastQuizDate)) {
          set({
            isReadyForIncrement: false,
            lastQuizDate: null,
          });
          return;
        }

        const now = new Date();
        const last = new Date(lastQuizDate);
        const hourDiff = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
        const dayDiff = getCalendarDayDiff(last, now);

        // Hard reset after 48h inactivity.
        if (hourDiff > 48) {
          set({
            currentStreak: 0,
            isReadyForIncrement: false,
          });
          return;
        }

        set({
          isReadyForIncrement: dayDiff === 1,
        });
      },

      checkMilestoneAfterQuiz: () => {
        const state = get();
        const now = new Date();

        let nextStreak = state.currentStreak;

        if (!isValidDate(state.lastQuizDate)) {
          nextStreak = 1;
        } else {
          const last = new Date(state.lastQuizDate);
          const hourDiff = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
          const dayDiff = getCalendarDayDiff(last, now);

          if (dayDiff <= 0) {
            // Same day completion should not increment again.
            nextStreak = state.currentStreak;
          } else if (dayDiff === 1) {
            nextStreak = state.currentStreak + 1;
          } else if (hourDiff > 48 || dayDiff >= 2) {
            // New streak starts after missing >1 day.
            nextStreak = 1;
          }
        }

        const reachedMilestone = STREAK_MILESTONES.find((milestone) => milestone === nextStreak) || null;
        const shouldShowModal =
          reachedMilestone !== null && !state.shownMilestones.includes(reachedMilestone);

        set({
          currentStreak: nextStreak,
          lastQuizDate: now.toISOString(),
          isReadyForIncrement: false,
          activeMilestone: shouldShowModal ? reachedMilestone : null,
          showShareModal: shouldShowModal,
        });
      },

      closeShareModal: () => {
        set({
          showShareModal: false,
          activeMilestone: null,
        });
      },

      markMilestoneShared: (milestone) => {
        const { shownMilestones } = get();

        if (shownMilestones.includes(milestone)) {
          set({
            showShareModal: false,
            activeMilestone: null,
          });
          return;
        }

        set({
          shownMilestones: [...shownMilestones, milestone],
          showShareModal: false,
          activeMilestone: null,
        });
      },
    }),
    {
      name: 'coby-learn-streak',
      partialize: (state) => ({
        lastQuizDate: state.lastQuizDate,
        currentStreak: state.currentStreak,
        shownMilestones: state.shownMilestones,
      }),
    }
  )
);
