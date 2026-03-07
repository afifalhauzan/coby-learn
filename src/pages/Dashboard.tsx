import React from 'react';
import { Box, Container } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import Header from '../components/dashboard/Header';
import SummaryWidget from '../components/dashboard/SummaryWidget';
import DayStreakWidget from '../components/dashboard/DayStreakWidget';
import ToDoWidget from '../components/dashboard/ToDoWidget';
import TasksWidget from '../components/dashboard/TasksWidget';
import QuickActionsWidget from '../components/dashboard/QuickActionsWidget';

import { getTasks } from '../services/apiTaskService';
import { getDailyQuizStatus } from '../services/apiLibraryService';

// Tetap import CSS agar button Add Task tidak rusak layout-nya
import './dashboard.css';

const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function Dashboard(): React.JSX.Element {
  const todayDate = getTodayDate();

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

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <Header username={dailyStatus?.username} />

      {/* Gunakan Container agar konten tidak mepet pinggir layar monitor ultra-wide */}
      <Container maxWidth={false} sx={{ mt: 3, px: { xs: 2, md: 4 } }}>

        {/* === MAIN LAYOUT: CSS GRID === */}
        <Box
          sx={{
            display: 'grid',
            // Mobile: 1 Kolom. Desktop: 2 Kolom (Kiri 3 bagian, Kanan 1 bagian)
            gridTemplateColumns: { xs: '1fr', lg: '3fr 1fr' },
            gap: 3, // Jarak antar grid (24px)
            alignItems: 'start' // Mencegah sidebar ketarik panjang ke bawah
          }}
        >

          {/* --- LEFT AREA (Main Content) --- */}
          <Box
            sx={{
              display: 'grid',
              // Mobile: 1 Kolom. Tablet ke atas: 2 Kolom rata
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            {/* Widget 1: ToDo */}
            {/* Otomatis menempati 1 cell. Di HP full width, di Tablet separuh */}
            <Box sx={{ minHeight: '100%' }}>
              <ToDoWidget completed={completedTasks} total={totalTasks} />
            </Box>

            {/* Widget 2: Streak */}
            <Box sx={{ minHeight: '100%' }}>
              <DayStreakWidget />
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <TasksWidget />
            </Box>
          </Box>

          {/* --- RIGHT AREA (Sidebar) --- */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              // Di HP, Sidebar pindah ke bawah, jadi pastikan dia full width juga
              width: '100%'
            }}
          >
            <SummaryWidget />
            <QuickActionsWidget />
          </Box>

        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;