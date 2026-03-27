import React from 'react';
import { Paper, Typography, Box, Skeleton, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getDailyQuizStatus } from '../../services/apiLibraryService';
import { useTranslation } from 'react-i18next';

function FocusSessionWidget(): React.JSX.Element {
  const [weekOffset, setWeekOffset] = React.useState(0);
  const { t } = useTranslation();

  const { data: status, isLoading } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  if (isLoading) {
    return (
      <Paper sx={{ p: 2, height: '100%', bgcolor: 'background.paper' }}>
        <Skeleton width="70%" height={24} sx={{ mb: 1 }} />
        <Skeleton width="50%" height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <Skeleton key={day} variant="circular" width={32} height={32} />
          ))}
        </Box>
      </Paper>
    );
  }

  const streakCount = status?.streak || 0;

  // Generate weekdays for the selected week (Monday-Friday)
  const today = new Date();
  const selectedDate = new Date(today);
  selectedDate.setDate(today.getDate() + weekOffset * 7);

  const currentDay = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - currentDay); // Go back to Sunday

  const weekDays = [
    t('dashboard:focusSession.weekdays.mon'),
    t('dashboard:focusSession.weekdays.tue'),
    t('dashboard:focusSession.weekdays.wed'),
    t('dashboard:focusSession.weekdays.thu'),
    t('dashboard:focusSession.weekdays.fri'),
  ];
  const weekDates: Date[] = [];
  
  // Generate week dates starting from Monday (skip Sunday)
  for (let i = 1; i <= 5; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }

  const isSameDate = (dateA: Date, dateB: Date): boolean => {
    return (
      dateA.getDate() === dateB.getDate() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getFullYear() === dateB.getFullYear()
    );
  };

  const handlePrevWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography
            variant="body1"
            sx={{ 
              color: 'text.primary',
              fontSize: '1rem',
              mb: 0.5,
              fontWeight: 400,
              lineHeight: 1.2
            }}
          >
            {t('dashboard:focusSession.youAreOnA')}
          </Typography>
          <Typography
            variant="h6"
            sx={{ 
              color: 'text.primary',
              fontWeight: 500,
              fontSize: '1.1rem',
              lineHeight: 1.2
            }}
          >
            {t('dashboard:focusSession.dayStreak', { count: streakCount })}
          </Typography>
        </Box>
        
        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton 
            size="small" 
            onClick={handlePrevWeek}
            aria-label={t('dashboard:focusSession.previousWeek')}
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
          >
            <ChevronLeft fontSize="small" sx={{ color: 'text.secondary' }} />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleNextWeek}
            aria-label={t('dashboard:focusSession.nextWeek')}
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <ChevronRight fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Box>
        {/* Day Labels */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: 1,
            mb: 1
          }}
        >
          {weekDays.map((day) => (
            <Typography
              key={day}
              variant="caption"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Date Numbers */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: 1
          }}
        >
          {weekDates.map((date, index) => {
            const dateNum = date.getDate();
            const isToday = isSameDate(date, today);
            
            return (
              <Box
                key={index}
                sx={{
                  width: 40,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: isToday ? 3 : 2,
                  bgcolor: isToday ? 'primary.main' : 'grey.100',
                  color: isToday ? 'white' : 'text.primary',
                  fontWeight: isToday ? 700 : 500,
                  fontSize: '0.875rem',
                  border: 'none',
                  borderColor: isToday ? 'transparent' : 'divider',
                  transition: 'all 0.2s ease-in-out',
                  mx: 'auto'
                }}
              >
                {dateNum}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}

export default FocusSessionWidget;