import React, { useEffect, useRef } from 'react';
import { Box, Container, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import Header from '../components/dashboard/Header';
import DashboardOnboardingModal from '../components/dashboard/DashboardOnboardingModal';
import DailyQuizWidget from '../components/dashboard/DailyQuizWidget';
import DayStreakWidget from '../components/dashboard/DayStreakWidget';
import ToDoWidget from '../components/dashboard/ToDoWidget';
import TasksWidget from '../components/dashboard/TasksWidget';
import SpotlightCallout from '../components/dashboard/SpotlightCallout';
import QuickActionsWidget from '../components/dashboard/QuickActionsWidget';
import FocusSessionWidget from '../components/dashboard/FocusSessionWidget';
import DailyMissionsPanel from '../components/dashboard/DailyMissionsPanel';

import { getTasks } from '../services/apiTaskService';
import { getDailyQuizStatus } from '../services/apiLibraryService';

// Tetap import CSS agar button Add Task tidak rusak layout-nya
import './dashboard.css';
import { theme } from '../theme/theme';
import { useDashboardOnboardingStore } from '../stores/useDashboardOnboardingStore';
import { useStreakStore } from '../stores/useStreakStore';

const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function Dashboard(): React.JSX.Element {
  const addTaskRef = useRef<HTMLButtonElement | null>(null);
  const todayDate = getTodayDate();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const hasCompletedOnboarding = useDashboardOnboardingStore((state) => state.hasCompletedOnboarding);
  const hasSeenAddTaskSpotlight = useDashboardOnboardingStore((state) => state.hasSeenAddTaskSpotlight);
  const hasHydrated = useDashboardOnboardingStore((state) => state.hasHydrated);
  const completeOnboarding = useDashboardOnboardingStore((state) => state.completeOnboarding);
  const completeSpotlight = useDashboardOnboardingStore((state) => state.completeSpotlight);
  const validateStreakWindow = useStreakStore((state) => state.validateStreakWindow);

  useEffect(() => {
    validateStreakWindow();
  }, [validateStreakWindow]);

  const { data: dailyStatus } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks', { date: todayDate }],
    queryFn: () => getTasks({ date: todayDate }),
  });

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const shouldShowOnboarding = hasHydrated && !hasCompletedOnboarding;
  const shouldShowAddTaskSpotlight =
    hasHydrated && hasCompletedOnboarding && !hasSeenAddTaskSpotlight;

  if (isMobile) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
        <DashboardOnboardingModal
          open={shouldShowOnboarding}
          username={dailyStatus?.username}
          onFinish={completeOnboarding}
        />

        <Container maxWidth={false} sx={{ mt: 3, px: { xs: 0 } }}>
          <Header username={dailyStatus?.username} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '3.2fr 1.2fr' }, // Adjust ratios to match UI
              gap: 2,
              alignItems: 'start'
            }}
          >
            <ToDoWidget completed={completedTasks} total={totalTasks} />

            <DayStreakWidget />
            <FocusSessionWidget />

            <TasksWidget addTaskButtonRef={addTaskRef} />
            <DailyMissionsPanel dailyQuizDone={dailyStatus?.is_done} />

            <DailyQuizWidget />
            <QuickActionsWidget />
          </Box>
        </Container>

        <SpotlightCallout
          open={shouldShowAddTaskSpotlight}
          targetRef={addTaskRef}
          onOverlayClick={completeSpotlight}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <DashboardOnboardingModal
        open={shouldShowOnboarding}
        username={dailyStatus?.username}
        onFinish={completeOnboarding}
      />

      <Header username={dailyStatus?.username} />

      <Container maxWidth={false} sx={{ mt: 3, px: { xs: 0 } }}>
        {/* MAIN GRID: Two Column Layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '3.2fr 1.2fr' }, // Adjust ratios to match UI
            gap: 2,
            alignItems: 'start'
          }}
        >
          {/* --- LEFT AREA: Main Content --- */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Top Row: ToDo and Day Streak */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2
              }}
            >
              <ToDoWidget completed={completedTasks} total={totalTasks} />
              <DayStreakWidget />
            </Box>

            {/* Middle: Today's Tasks */}
            <TasksWidget addTaskButtonRef={addTaskRef} />

            {/* Missions */}
            <DailyMissionsPanel dailyQuizDone={dailyStatus?.is_done} />
          </Box>

          {/* --- RIGHT AREA: Sidebar --- */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {/* Calendar (In your code it's FocusSessionWidget) */}
            <FocusSessionWidget />

            {/* Daily Quiz */}
            <DailyQuizWidget />

            {/* Quick Actions */}
            <QuickActionsWidget />
          </Box>

        </Box>
      </Container>

      <SpotlightCallout
        open={shouldShowAddTaskSpotlight}
        targetRef={addTaskRef}
        onOverlayClick={completeSpotlight}
      />
    </Box>
  );
}

export default Dashboard;