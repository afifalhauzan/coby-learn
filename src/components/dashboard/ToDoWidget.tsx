import React from 'react';
import { Paper, Typography, Box, LinearProgress, useTheme } from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

type ToDoWidgetProps = {
  completed: number;
  total: number;
};

function ToDoWidget({ completed, total }: ToDoWidgetProps): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();
  const percent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Paper
      sx={{
        height: '100%',
        elevation: 1,
        bgcolor: 'background.paper',
        display: 'flex',        // Flexbox
        flexDirection: 'column', // Susunan vertikal
        justifyContent: 'center' // Konten di tengah secara vertikal
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {t('tasks:todoWidget.title')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              {t('tasks:todoWidget.completedSummary', { completed, total })}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'rgba(74, 144, 226, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Assignment sx={{ color: 'primary.main', fontSize: 20 }} />
          </Box>
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('tasks:todoWidget.dailyProgress')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 400 }}>
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