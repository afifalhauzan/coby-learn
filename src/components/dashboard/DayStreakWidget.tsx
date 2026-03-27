import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Skeleton,
  useTheme,
  Modal,
  Button,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from '@tanstack/react-query';
import { getDailyQuizStatus } from '../../services/apiLibraryService';
import { useTranslation } from 'react-i18next';
// import FireStreakLottie from '../../assets/FireStreak.lottie';

const getCurrentLevel = (streak: number): number => {
  if (streak <= 0) {
    return 0;
  }

  if (streak >= 30) {
    return 5;
  }

  if (streak >= 15) {
    return 4;
  }

  if (streak >= 7) {
    return 3;
  }

  if (streak >= 3) {
    return 2;
  }

  return 1;
};

const fireLevels = [
  { id: 0, rangeKey: 'dashboard:dayStreak.levels.embers.range', labelKey: 'dashboard:dayStreak.levels.embers.label', descKey: 'dashboard:dayStreak.levels.embers.description' },
  { id: 1, rangeKey: 'dashboard:dayStreak.levels.spark.range', labelKey: 'dashboard:dayStreak.levels.spark.label', descKey: 'dashboard:dayStreak.levels.spark.description' },
  { id: 2, rangeKey: 'dashboard:dayStreak.levels.flame.range', labelKey: 'dashboard:dayStreak.levels.flame.label', descKey: 'dashboard:dayStreak.levels.flame.description' },
  { id: 3, rangeKey: 'dashboard:dayStreak.levels.blaze.range', labelKey: 'dashboard:dayStreak.levels.blaze.label', descKey: 'dashboard:dayStreak.levels.blaze.description' },
  { id: 4, rangeKey: 'dashboard:dayStreak.levels.inferno.range', labelKey: 'dashboard:dayStreak.levels.inferno.label', descKey: 'dashboard:dayStreak.levels.inferno.description' },
  { id: 5, rangeKey: 'dashboard:dayStreak.levels.supernova.range', labelKey: 'dashboard:dayStreak.levels.supernova.label', descKey: 'dashboard:dayStreak.levels.supernova.description' },
];

const motivationByLevel = [
  'dashboard:dayStreak.motivations.level0',
  'dashboard:dayStreak.motivations.level1',
  'dashboard:dayStreak.motivations.level2',
  'dashboard:dayStreak.motivations.level3',
  'dashboard:dayStreak.motivations.level4',
  'dashboard:dayStreak.motivations.level5',
];

function DayStreakWidget(): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: status, isLoading } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  const widgetTransition = theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  });
  const accentTransition = theme.transitions.create(['background-color', 'color', 'transform'], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  });

  // Skeleton loading state
  if (isLoading) {
    return (
      <Paper sx={{ p: 2, height: '100%', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider' }}>
        <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
        <Box sx={{ width: '100%' }}>
          <Skeleton width="40%" height={30} />
          <Skeleton width="60%" />
        </Box>
      </Paper>
    );
  }

  // [TESTING] Start streak from 12 for dummy realism
  const streakCount = status?.streak || 0;
  const currentLevel = getCurrentLevel(streakCount);
  const motivationalText = t(motivationByLevel[currentLevel]);

  return (
    <>
      <Paper
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          elevation: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          transition: widgetTransition,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2,
          },
        }}
      >
        {/* Icon Circle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 64,
            width: 64,
            minWidth: 64,
            mr: 3,
            transition: accentTransition,
            '.MuiPaper-root:hover &': {
              transform: 'scale(1.06)',
            },
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
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
            }}
          >
            <Box
              component="img"
              src={`/fire${currentLevel}.png`}
              alt={t('dashboard:dayStreak.currentFireLevelAlt', { level: currentLevel })}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>

        {/* Text Info */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            component="div"
            sx={{ color: 'text.primary', fontWeight: '700', lineHeight: 1, fontSize: '2rem' }}
          >
            {streakCount}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 0.5,
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {t('dashboard:dayStreak.label')}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.5,
              color: 'warning.dark',
              fontWeight: 600,
            }}
          >
            {motivationalText}
          </Typography>

          <Button
            variant="text"
            size="small"
            onClick={() => setIsModalOpen(true)}
            sx={{
              px: 0,
              textTransform: 'none',
              fontWeight: 700,
              color: 'warning.main',
              minWidth: 'auto',
            }}
          >
            {t('dashboard:dayStreak.checkStreaks')}
          </Button>
        </Box>
      </Paper>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="streak-levels-title"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Paper
          sx={{
            width: '100%',
            maxWidth: 420,
            maxHeight: '80vh',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 24,
          }}
        >
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, zIndex: 2 }}
            aria-label={t('dashboard:dayStreak.closeStreakLevels')}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography id="streak-levels-title" variant="h6" fontWeight={700} mb={0.5}>
              {t('dashboard:dayStreak.streakLevelsTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard:dayStreak.streakLevelsDescription')}
            </Typography>
          </Box>

          <Box sx={{  overflowY: 'auto', flex: 1, minHeight: 0 }}>
            <Stack spacing={1.5}>
              {fireLevels.map((level) => {
                const isReached = currentLevel >= level.id;
                const isCurrent = currentLevel === level.id;

                return (
                  <Box
                    key={level.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: isCurrent ? 'warning.main' : 'divider',
                      bgcolor: isReached ? 'rgba(255, 152, 0, 0.08)' : 'action.hover',
                    }}
                  >
                    <Box
                      component="img"
                      src={`/fire${level.id}.png`}
                      alt={t('dashboard:dayStreak.levelAlt', { level: t(level.labelKey) })}
                      sx={{
                        width: 56,
                        height: 56,
                        objectFit: 'contain',
                      }}
                    />
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} color={isReached ? 'text.primary' : 'text.disabled'}>
                        {t(level.labelKey)} ({t(level.rangeKey)})
                      </Typography>
                      <Typography variant="caption" color={isReached ? 'text.secondary' : 'text.disabled'}>
                        {t(level.descKey)}
                      </Typography>
                    </Box>
                    {isCurrent && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'warning.dark',
                          bgcolor: 'rgba(255, 152, 0, 0.18)',
                          px: 1,
                          py: 0.35,
                          borderRadius: 1,
                          textTransform: 'uppercase',
                        }}
                      >
                        {t('dashboard:dayStreak.currentBadge')}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>

          <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}>
            <Divider sx={{ mb: 2 }} />
            <Button fullWidth variant="contained" onClick={() => setIsModalOpen(false)} sx={{ fontWeight: 700 }}>
              {t('common:actions.close')}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
}

export default DayStreakWidget;