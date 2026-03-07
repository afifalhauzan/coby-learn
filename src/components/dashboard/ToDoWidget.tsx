import React from 'react';
import { Paper, Typography, Box, LinearProgress, useTheme } from '@mui/material';

type ToDoWidgetProps = {
  completed: number;
  total: number;
};

function ToDoWidget({ completed, total }: ToDoWidgetProps): React.JSX.Element {
  const theme = useTheme();
  const percent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Paper
      sx={{
        height: '100%',
        p: 3,
        borderRadius: 4, // Sedikit lebih bulat biar modern
        boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
        bgcolor: 'background.paper',
        display: 'flex',        // Flexbox
        flexDirection: 'column', // Susunan vertikal
        justifyContent: 'center' // Konten di tengah secara vertikal
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
          To-Do List
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          You have completed <strong>{completed}</strong> out of <strong>{total}</strong> tasks today.
        </Typography>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
          <Typography variant="body2" fontWeight="500" sx={{ color: 'text.secondary' }}>
            Daily Progress
          </Typography>
          <Typography variant="body2" fontWeight="700" sx={{ color: 'primary.main' }}>
            {Math.round(percent)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            height: 10, // Sedikit lebih tebal
            borderRadius: 5,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            },
          }}
        />
      </Box>
    </Paper>
  );
}

export default ToDoWidget;