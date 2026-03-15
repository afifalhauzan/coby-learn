import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography, Box, Skeleton, useTheme } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQuery } from '@tanstack/react-query';
import { getDailyQuizStatus } from '../../services/apiLibraryService';
import FireStreakLottie from '../../assets/FireStreak.lottie';

function DayStreakWidget(): React.JSX.Element {
  const theme = useTheme();
  const [isWidgetHovered, setIsWidgetHovered] = useState(false);
  const dotLottieRef = useRef<any>(null);

  const { data: status, isLoading } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  useEffect(() => {
    if (!dotLottieRef.current) {
      return;
    }

    if (isWidgetHovered) {
      dotLottieRef.current.setLoop(true);
      dotLottieRef.current.play();
    } else {
      dotLottieRef.current.pause();
    }
  }, [isWidgetHovered]);

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

  const isDone = status?.is_done ?? false;
  // [TESTING] Start streak from 12 for dummy realism
  const streakCount = status?.streak || 0;

  return (
    <Paper
      onMouseEnter={() => setIsWidgetHovered(true)}
      onMouseLeave={() => setIsWidgetHovered(false)}
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        elevation: 1,
        height: '100%',
        display: 'flex',       // Pastikan flex container
        alignItems: 'center',  // Vertikal center
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
          width: 64,  // Ukuran fix biar tidak gepeng
          height: 64,
          minWidth: 64, // Mencegah penyusutan di layar kecil
          bgcolor: isDone ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 167, 38, 0.1)',
          borderRadius: '50%',
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
            '.MuiPaper-root:hover &': {
              transform: 'rotate(-8deg)',
            },
          }}
        >
          <DotLottieReact
            src={FireStreakLottie}
            loop={false}
            autoplay={false}
            dotLottieRefCallback={(instance) => {
              dotLottieRef.current = instance;
            }}
            style={{ width: '100%', height: '100%' }}
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
            letterSpacing: '0.02em'
          }}
        >
          Day Streak
        </Typography>
      </Box>
    </Paper>
  );
}

export default DayStreakWidget;