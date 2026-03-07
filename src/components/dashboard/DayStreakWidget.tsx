import React from 'react';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useQuery } from '@tanstack/react-query';
import { getDailyQuizStatus } from '../../services/apiLibraryService';

function DayStreakWidget(): React.JSX.Element {
  const { data: status, isLoading } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  // Skeleton loading state
  if (isLoading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, height: '100%', bgcolor: '#1E293B', display: 'flex', alignItems: 'center' }}>
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
  const iconColor = isDone ? '#F97316' : '#94A3B8';
  const bgCircleColor = isDone ? 'rgba(249, 115, 22, 0.15)' : 'rgba(148, 163, 184, 0.12)';

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: '#1E293B',
        boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
        height: '100%',
        display: 'flex',       // Pastikan flex container
        alignItems: 'center',  // Vertikal center
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
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
          bgcolor: bgCircleColor,
          borderRadius: '50%',
          mr: 3,
          transition: '0.3s',
        }}
      >
        <LocalFireDepartmentIcon
          sx={{ color: iconColor, fontSize: 32, transition: '0.3s' }}
        />
      </Box>

      {/* Text Info */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h4" // Font lebih besar sedikit biar gagah
          component="div"
          sx={{ color: '#F8FAFC', fontWeight: '800', lineHeight: 1 }}
        >
          {streakCount}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mt: 0.5,
            color: isDone ? '#22C55E' : '#94A3B8',
            fontWeight: isDone ? 600 : 500,
            letterSpacing: '0.02em'
          }}
        >
          {isDone ? 'Streak Active!' : 'Day Streak'}
        </Typography>
      </Box>

      {/* Optional: Indicator kanan (bisa dihapus jika tidak suka) */}
      {isDone && (
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22C55E', boxShadow: '0 0 10px #22C55E' }} />
      )}
    </Paper>
  );
}

export default DayStreakWidget;