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
// import FireStreakLottie from '../../assets/FireStreak.lottie';

const getCurrentLevel = (streak: number): number => {
  if (streak === 0) {
    return 0;
  }

  const level = Math.floor((streak - 1) / 2) + 1;
  return Math.min(level, 5);
};

const fireLevels = [
  { id: 0, range: '0 Days', label: 'Embers', desc: 'Start your streak journey' },
  { id: 1, range: '1-2 Days', label: 'Spark', desc: 'It starts glowing' },
  { id: 2, range: '3-4 Days', label: 'Flame', desc: 'Momentum is building' },
  { id: 3, range: '5-6 Days', label: 'Blaze', desc: 'Strong flow' },
  { id: 4, range: '7-8 Days', label: 'Inferno', desc: 'Serious commitment' },
  { id: 5, range: '9+ Days', label: 'Supernova', desc: 'Amazing streak consistency!' },
];

const motivationByLevel = [
  'One small step starts the fire.',
  'Great start. Keep the spark alive!',
  'You are building real momentum.',
  'Strong streak. Keep it burning!',
  'Incredible consistency. Stay locked in!',
  'Legendary streak. You are unstoppable!',
];

function DayStreakWidget(): React.JSX.Element {
  const theme = useTheme();
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
  const motivationalText = motivationByLevel[currentLevel];

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
              alt={`Current fire level ${currentLevel}`}
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
            Day Streak
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
            Check Your Streaks
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
            aria-label="Close streak levels"
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography id="streak-levels-title" variant="h6" fontWeight={700} mb={0.5}>
              Streak Levels
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fire level is based on your day streak.
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
                      alt={`${level.label} level`}
                      sx={{
                        width: 56,
                        height: 56,
                        objectFit: 'contain',
                      }}
                    />
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} color={isReached ? 'text.primary' : 'text.disabled'}>
                        {level.label} ({level.range})
                      </Typography>
                      <Typography variant="caption" color={isReached ? 'text.secondary' : 'text.disabled'}>
                        {level.desc}
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
                        Current
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
              Close
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
}

export default DayStreakWidget;