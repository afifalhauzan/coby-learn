import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Alert,
  LinearProgress,
  Snackbar,
} from '@mui/material';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { useQuery } from '@tanstack/react-query';
import { animate } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { getStudentStats } from '../services/apiStatsService';
import { getDailyQuizStatus } from '../services/apiLibraryService';

import StatCard from '../components/progress/StatCard';
import StudyHeatmap from '../components/progress/StudyHeatmap';
import XPLevelModal from '../components/progress/XPLevelModal';
import { useXPStore } from '../stores/useXPStore';

// import FireStreakLottie from '../assets/FireStreak.lottie';

const getCurrentLevel = (streak: number): number => {
  if (streak === 0) {
    return 0;
  }

  const level = Math.floor((streak - 1) / 2) + 1;
  return Math.min(level, 5);
};

function ProgressPage(): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();

  const [filter, setFilter] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [isXPModalOpen, setIsXPModalOpen] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isLevelUpToastOpen, setIsLevelUpToastOpen] = useState(false);

  const totalXP = useXPStore((state) => state.totalXP);
  const milestones = useXPStore((state) => state.milestones);
  const levelUpEvent = useXPStore((state) => state.levelUpEvent);
  const setXPFromStats = useXPStore((state) => state.setXPFromStats);
  const getCurrentLevelFromXP = useXPStore((state) => state.getCurrentLevel);
  const getNextLevelFromXP = useXPStore((state) => state.getNextLevel);
  const getProgressToNext = useXPStore((state) => state.getProgressToNext);
  const clearLevelUpEvent = useXPStore((state) => state.clearLevelUpEvent);

  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['studentStats', filter],
    queryFn: () => getStudentStats(filter),
  });

  const { data: monthlyStats } = useQuery({
    queryKey: ['studentStats', 'month'],
    queryFn: () => getStudentStats('month'),
  });

  const { data: streakData } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  // [TESTING] Dummy Data Override & Streak Adjustment
  const adjustedStreak = streakData?.streak || 0;
  const currentLevel = getCurrentLevel(adjustedStreak);

  const accentTransition = theme.transitions.create(['background-color', 'color', 'transform'], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  });

  const displayStats = stats || {
    total_study_hours: "0h",
    tasks_completed: 0,
    quizzes_taken: 0,
    most_productive_day: "-"
  };

  const parseStudyHours = (value: string): number => {
    if (!value) {
      return 0;
    }

    const lower = value.toLowerCase().replace(',', '.');
    const hourMatch = lower.match(/(\d+(?:\.\d+)?)\s*h/);
    const minuteMatch = lower.match(/(\d+(?:\.\d+)?)\s*m/);

    let totalHours = 0;

    if (hourMatch) {
      totalHours += Number(hourMatch[1]);
    }

    if (minuteMatch) {
      totalHours += Number(minuteMatch[1]) / 60;
    }

    if (!hourMatch && !minuteMatch) {
      const numericOnly = Number.parseFloat(lower.replace(/[^0-9.]/g, ''));
      return Number.isNaN(numericOnly) ? 0 : numericOnly;
    }

    return totalHours;
  };

  useEffect(() => {
    if (!monthlyStats) {
      return;
    }

    setXPFromStats({
      hours: parseStudyHours(monthlyStats.total_study_hours),
      tasks: monthlyStats.tasks_completed,
      quizzes: monthlyStats.quizzes_taken,
    });
  }, [monthlyStats, setXPFromStats]);

  const currentXPLevel = useMemo(() => getCurrentLevelFromXP(totalXP), [getCurrentLevelFromXP, totalXP]);
  const nextXPLevel = useMemo(() => getNextLevelFromXP(totalXP), [getNextLevelFromXP, totalXP]);
  const xpProgressToNext = useMemo(() => getProgressToNext(totalXP), [getProgressToNext, totalXP]);
  const xpToNextLevel = nextXPLevel ? Math.max(0, nextXPLevel.xp - totalXP) : 0;
  const seasonDate = useMemo(() => new Date(), []);
  const seasonMonthLabel = useMemo(
    () => seasonDate.toLocaleString('en-US', { month: 'long' }),
    [seasonDate]
  );
  const daysRemainingInSeason = useMemo(() => {
    const year = seasonDate.getFullYear();
    const month = seasonDate.getMonth();
    const today = seasonDate.getDate();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return totalDays - today;
  }, [seasonDate]);

  useEffect(() => {
    const controls = animate(0, xpProgressToNext, {
      duration: 0.9,
      ease: 'easeInOut',
      onUpdate: (latest) => setAnimatedProgress(latest),
    });

    return () => controls.stop();
  }, [xpProgressToNext]);

  useEffect(() => {
    if (levelUpEvent) {
      setIsLevelUpToastOpen(true);
    }
  }, [levelUpEvent]);


  const handleFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: 'day' | 'week' | 'month' | 'year' | null,
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const isStreakDone = streakData?.is_done ?? false;
  const filterLabel = t(`progress:labels.${filter}`);

  return (
    <Box>
      <XPLevelModal
        open={isXPModalOpen}
        onClose={() => setIsXPModalOpen(false)}
        totalXP={totalXP}
        currentLevel={currentXPLevel}
        milestones={milestones}
        seasonMonthLabel={seasonMonthLabel}
        daysRemainingInSeason={daysRemainingInSeason}
      />

      <Snackbar
        open={isLevelUpToastOpen}
        autoHideDuration={2800}
        onClose={() => {
          setIsLevelUpToastOpen(false);
          clearLevelUpEvent();
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {
            setIsLevelUpToastOpen(false);
            clearLevelUpEvent();
          }}
          severity="success"
          variant="filled"
          sx={{ width: '100%', textTransform: 'none',  textColor : 'white', fontWeight: 600, borderRadius: 3, boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' }}
        >
          {levelUpEvent
            ? t('progress:messages.levelUpReached', {
              level: levelUpEvent.toLevel,
              name: levelUpEvent.toName,
            })
            : t('progress:messages.levelUp')}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">
          {t('progress:labels.myProgress')}
        </Typography>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          color="primary"
          size="small"
          sx={{ bgcolor: 'background.paper' }}
        >
          <ToggleButton value="day" sx={{ textTransform: 'none', px: 2 }}>{t('progress:labels.day')}</ToggleButton>
          <ToggleButton value="week" sx={{ textTransform: 'none', px: 2 }}>{t('progress:labels.week')}</ToggleButton>
          <ToggleButton value="month" sx={{ textTransform: 'none', px: 2 }}>{t('progress:labels.month')}</ToggleButton>
          <ToggleButton value="year" sx={{ textTransform: 'none', px: 2 }}>{t('progress:labels.year')}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper
        elevation={0}
        onClick={() => setIsXPModalOpen(true)}
        sx={{
          p: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.04), rgba(25, 118, 210, 0.08))',
          boxShadow: '0 8px 22px rgba(25, 118, 210, 0.12)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 12px 28px rgba(25, 118, 210, 0.16)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('progress:labels.level')} {currentXPLevel.level} - {currentXPLevel.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'right' }}>
            {nextXPLevel
              ? t('progress:messages.nextLevel', { xp: xpToNextLevel })
              : t('progress:messages.maxLevel')}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          {t('progress:messages.daysLeftInSeason', {
            days: daysRemainingInSeason,
            month: seasonMonthLabel,
          })}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={animatedProgress}
          sx={{
            height: 11,
            borderRadius: 999,
            bgcolor: 'rgba(25, 118, 210, 0.14)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
            },
          }}
        />
      </Paper>

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
                {t('progress:labels.currentStreak')}
              </Typography>
              <Typography variant="body2" sx={{ color: isStreakDone ? 'text.primary' : 'text.secondary', opacity: 0.8 }}>
                {isStreakDone
                  ? t('progress:messages.keepFlameAlive')
                  : t('progress:messages.completeDailyQuizToIgnite')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 64,
                  width: 64,
                  minWidth: 64,
                  mr: 1,
                  transition: accentTransition,
                  '.MuiPaper-root:hover &': {
                    transform: 'scale(1.06)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    transition: accentTransition,
                    animation: 'streakFireFloat 3.4s ease-in-out infinite',
                    '@keyframes streakFireFloat': {
                      '0%, 100%': {
                        transform: 'translateY(0)',
                      },
                      '50%': {
                        transform: 'translateY(-6px)',
                      },
                    },
                    '.MuiPaper-root:hover &': {
                      transform: 'rotate(-8deg) translateY(-4px)',
                    },
                    mx: 'auto',
                  }}
                >
                  <Box
                    component="img"
                    src={`/fire${currentLevel}.png`}
                    alt={t('progress:labels.currentFireLevel', { level: currentLevel })}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
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
            {t('progress:labels.keyStats', { filter: filterLabel })}
          </Typography>

          {isLoading ? (
            <Stack spacing={2}>
              {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 3 }} />)}
            </Stack>
          ) : isError ? (
            <Alert severity="error">
              {t('progress:messages.failedToLoadStatistics', { message: (error as any).message })}
            </Alert>
          ) : (
            <Stack spacing={2}>
              <StatCard
                title={t('progress:labels.totalStudyHours')}
                value={displayStats?.total_study_hours || "0h"}
                IconComponent={AccessTimeIcon}
                iconBgColor={theme.palette.primary.main + '15'} // Consistent Opacity
                iconColor={theme.palette.primary.main} // Consistent Color
              />
              <StatCard
                title={t('progress:labels.tasksCompleted')}
                value={displayStats?.tasks_completed?.toString() || "0"}
                IconComponent={CheckCircleOutlineIcon}
                iconBgColor={theme.palette.primary.main + '15'}
                iconColor={theme.palette.primary.main}
              />
              <StatCard
                title={t('progress:labels.aiQuizzesTaken')}
                value={displayStats?.quizzes_taken?.toString() || "0"}
                IconComponent={LibraryBooksIcon}
                iconBgColor={theme.palette.primary.main + '15'}
                iconColor={theme.palette.primary.main}
              />
              <StatCard
                title={t('progress:labels.mostProductiveDay')}
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