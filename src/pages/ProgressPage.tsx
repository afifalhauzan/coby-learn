import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Alert
} from '@mui/material';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { useQuery } from '@tanstack/react-query';

import { getStudentStats } from '../services/apiStatsService';
import { getDailyQuizStatus } from '../services/apiLibraryService';

import StatCard from '../components/progress/StatCard';
import StudyHeatmap from '../components/progress/StudyHeatmap';

function ProgressPage(): React.JSX.Element {
  const theme = useTheme();
  const [isStreakHovered, setIsStreakHovered] = useState(false);
  const streakLottieRef = useRef<any>(null);

  const [filter, setFilter] = useState<'day' | 'week' | 'month' | 'year'>('week');

  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['studentStats', filter],
    queryFn: () => getStudentStats(filter),
  });

  const { data: streakData } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  // [TESTING] Dummy Data Override & Streak Adjustment
  const adjustedStreak = streakData?.streak || 0;

  const displayStats = stats || {
    total_study_hours: "0h",
    tasks_completed: 0,
    quizzes_taken: 0,
    most_productive_day: "-"
  };


  const handleFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: 'day' | 'week' | 'month' | 'year' | null,
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const isStreakDone = streakData?.is_done ?? false;

  useEffect(() => {
    if (!streakLottieRef.current) {
      return;
    }

    if (isStreakHovered) {
      streakLottieRef.current.setLoop(true);
      streakLottieRef.current.play();
    } else {
      streakLottieRef.current.pause();
    }
  }, [isStreakHovered]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">
          My Progress
        </Typography>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          color="primary"
          size="small"
          sx={{ bgcolor: 'background.paper' }}
        >
          <ToggleButton value="day" sx={{ textTransform: 'none', px: 2 }}>Day</ToggleButton>
          <ToggleButton value="week" sx={{ textTransform: 'none', px: 2 }}>Week</ToggleButton>
          <ToggleButton value="month" sx={{ textTransform: 'none', px: 2 }}>Month</ToggleButton>
          <ToggleButton value="year" sx={{ textTransform: 'none', px: 2 }}>Year</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          <Paper
            elevation={0}
            onMouseEnter={() => setIsStreakHovered(true)}
            onMouseLeave={() => setIsStreakHovered(false)}
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'background-color 0.3s'
            }}
          >
            <Box>
              <Typography variant="h6">
                Current Streak!
              </Typography>
              <Typography variant="body2" sx={{ color: isStreakDone ? 'text.primary' : 'text.secondary', opacity: 0.8 }}>
                {isStreakDone ? 'Keep the flame alive.' : 'Complete daily quiz to ignite!'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <Box sx={{ width: 64, height: 64 }}>
                <DotLottieReact
                  src="src/assets/FireStreak.lottie"
                  loop={false}
                  autoplay={false}
                  dotLottieRefCallback={(instance) => {
                    streakLottieRef.current = instance;
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>

              <Typography variant="h3" fontWeight="bold" sx={{ color: '#FFA726', transition: 'color 0.3s' }}>
                {adjustedStreak}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
            <StudyHeatmap />
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight="500" sx={{ mb: 2 }}>
            Key Stats ({filter})
          </Typography>

          {isLoading ? (
            <Stack spacing={2}>
              {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 3 }} />)}
            </Stack>
          ) : isError ? (
            <Alert severity="error">Failed to load statistics: {(error as any).message}</Alert>
          ) : (
            <Stack spacing={2}>
              <StatCard
                title="Total Study Hours"
                value={displayStats?.total_study_hours || "0h"}
                IconComponent={AccessTimeIcon}
                iconBgColor={theme.palette.primary.main + '15'} // Consistent Opacity
                iconColor={theme.palette.primary.main} // Consistent Color
              />
              <StatCard
                title="Tasks Completed"
                value={displayStats?.tasks_completed?.toString() || "0"}
                IconComponent={CheckCircleOutlineIcon}
                iconBgColor={theme.palette.primary.main + '15'}
                iconColor={theme.palette.primary.main}
              />
              <StatCard
                title="AI Quizzes Taken"
                value={displayStats?.quizzes_taken?.toString() || "0"}
                IconComponent={LibraryBooksIcon}
                iconBgColor={theme.palette.primary.main + '15'}
                iconColor={theme.palette.primary.main}
              />
              <StatCard
                title="Most Productive Day"
                value={displayStats?.most_productive_day || "-"}
                IconComponent={TrendingUpIcon}
                iconBgColor={theme.palette.primary.main + '15'}
                iconColor={theme.palette.primary.main}
              />
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProgressPage;