import { create } from 'zustand';

export type XPInputStats = {
  hours: number;
  tasks: number;
  quizzes: number;
};

export type XPMilestone = {
  level: number;
  name: string;
  xp: number;
};

export type LevelUpEvent = {
  id: number;
  fromLevel: number;
  toLevel: number;
  toName: string;
};

type XPStore = {
  weights: {
    hour: number;
    task: number;
    quiz: number;
  };
  milestones: XPMilestone[];
  totalXP: number;
  previousXP: number;
  levelUpEvent: LevelUpEvent | null;
  calculateXP: (stats: XPInputStats) => number;
  getCurrentLevel: (totalXP?: number) => XPMilestone;
  getNextLevel: (totalXP?: number) => XPMilestone | null;
  getProgressToNext: (totalXP?: number) => number;
  setXPFromStats: (stats: XPInputStats) => void;
  clearLevelUpEvent: () => void;
};

export const useXPStore = create<XPStore>((set, get) => ({
  weights: { hour: 50, task: 100, quiz: 150 },
  milestones: [
    { level: 1, name: 'Dust Collector', xp: 0 },
    { level: 2, name: 'Fragment Seeker', xp: 500 },
    { level: 3, name: 'Crystal Weaver', xp: 1500 },
    { level: 4, name: 'Prism Scholar', xp: 3500 },
    { level: 5, name: 'Gemstone Master', xp: 7000 },
  ],
  totalXP: 0,
  previousXP: 0,
  levelUpEvent: null,

  calculateXP: (stats) => {
    const { hour, task, quiz } = get().weights;
    return Math.max(0, Math.round((stats.hours * hour) + (stats.tasks * task) + (stats.quizzes * quiz)));
  },

  getCurrentLevel: (xpOverride) => {
    const totalXP = xpOverride ?? get().totalXP;
    const found = [...get().milestones].reverse().find((milestone) => totalXP >= milestone.xp);
    return found || get().milestones[0];
  },

  getNextLevel: (xpOverride) => {
    const totalXP = xpOverride ?? get().totalXP;
    return get().milestones.find((milestone) => milestone.xp > totalXP) || null;
  },

  getProgressToNext: (xpOverride) => {
    const totalXP = xpOverride ?? get().totalXP;
    const currentLevel = get().getCurrentLevel(totalXP);
    const nextLevel = get().getNextLevel(totalXP);

    if (!nextLevel) {
      return 100;
    }

    const currentStartXP = currentLevel.xp;
    const range = nextLevel.xp - currentStartXP;

    if (range <= 0) {
      return 100;
    }

    const progress = ((totalXP - currentStartXP) / range) * 100;
    return Math.min(100, Math.max(0, progress));
  },

  setXPFromStats: (stats) => {
    const previousXP = get().totalXP;
    const nextXP = get().calculateXP(stats);
    const previousLevel = get().getCurrentLevel(previousXP);
    const nextLevel = get().getCurrentLevel(nextXP);

    set({
      previousXP,
      totalXP: nextXP,
      levelUpEvent: nextLevel.level > previousLevel.level
        ? {
            id: Date.now(),
            fromLevel: previousLevel.level,
            toLevel: nextLevel.level,
            toName: nextLevel.name,
          }
        : null,
    });
  },

  clearLevelUpEvent: () => {
    set({ levelUpEvent: null });
  },
}));
