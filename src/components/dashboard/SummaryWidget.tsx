// src/components/dashboard/SummaryWidget.tsx
import React from 'react';
import { Paper, Typography, Button, Box, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getDailyQuizStatus } from '../../services/apiLibraryService';

function SummaryWidget(): React.JSX.Element {
  const navigate = useNavigate();

  const { data: status, isLoading } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  if (isLoading) {
    return <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />;
  }

  const isDone = status?.is_done ?? false;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}
      >
        Daily Quiz
      </Typography>

      {isDone ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
          <Typography variant="body1" fontWeight="bold" sx={{ color: 'success.main' }}>
            All Done for Today!
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            You've kept your streak alive. Come back tomorrow for a new challenge.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.5 }}
          >
            Test your knowledge and keep your streak going! Don't break the chain.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate('/daily-quiz')}
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              py: 1.2,
              borderRadius: 2,
              fontSize: '0.95rem',
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Start Daily Quiz
          </Button>
        </>
      )}
    </Paper>
  );
}

export default SummaryWidget;
  