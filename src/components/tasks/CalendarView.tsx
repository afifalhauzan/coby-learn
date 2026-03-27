import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  Fade,
  Grow,
  useTheme,
  Stack,
  Divider,
  useMediaQuery
} from '@mui/material';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Add, EventNote } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Task } from '../../types/task.types';

const getStatusColor = (completed: boolean, priority: string) => {
  if (completed) return '#10B981';
  if (priority === 'high') return '#EF4444';
  if (priority === 'medium') return '#F59E0B';
  return '#3B82F6';
};

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

function CalendarView({ tasks, onAddTask, onEditTask }: CalendarViewProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const dayCellTransition = theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  });
  const taskCardTransition = theme.transitions.create(
    ['transform', 'border-color', 'box-shadow', 'background-color'],
    {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }
  );

  // Breakpoints untuk responsiveness
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // HP
  const isTablet = useMediaQuery(theme.breakpoints.down('md')); // Tablet

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Ref untuk scroll otomatis di mobile saat tanggal diklik
  const tasksListRef = useRef<HTMLDivElement>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // Jika di mobile, scroll ke detail task setelah klik tanggal
    if (isTablet && tasksListRef.current) {
      tasksListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- HEADER ---
  const renderHeader = () => (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 3,
      px: 1,
      flexDirection: { xs: 'column', sm: 'row' }, // Stack vertikal di HP
      gap: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
        <Box sx={{ display: 'flex', bgcolor: 'action.hover', borderRadius: 2 }}>
          <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} size="small">
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
      </Box>

      <Button
        variant="outlined"
        onClick={() => { const now = new Date(); setCurrentMonth(now); setSelectedDate(now); }}
        sx={{
          textTransform: 'none',
          borderRadius: '8px',
          px: 3,
          width: { xs: '100%', sm: 'auto' } // Full width di HP
        }}
      >
        {t('common:time.today', { defaultValue: 'Today' })}
      </Button>
    </Box>
  );

  // --- DAYS HEADER ---
  const renderDays = () => {
    const days = [
      t('tasks:calendar.weekdays.sun', { defaultValue: 'SUN' }),
      t('tasks:calendar.weekdays.mon', { defaultValue: 'MON' }),
      t('tasks:calendar.weekdays.tue', { defaultValue: 'TUE' }),
      t('tasks:calendar.weekdays.wed', { defaultValue: 'WED' }),
      t('tasks:calendar.weekdays.thu', { defaultValue: 'THU' }),
      t('tasks:calendar.weekdays.fri', { defaultValue: 'FRI' }),
      t('tasks:calendar.weekdays.sat', { defaultValue: 'SAT' }),
    ];
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
        {days.map((day) => (
          <Typography key={day} align="center" variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
            {isMobile ? day.charAt(0) : day} {/* Tampilkan cuma inisial (S, M, T) di HP */}
          </Typography>
        ))}
      </Box>
    );
  };

  // --- DATE CELLS ---
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, 'd');
        const dayTasks = tasks.filter(t => isSameDay(parseISO(t.dueDate), day));
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isTodayDate = isToday(day);

        // Limit tampilan task berdasarkan ukuran layar
        const maxTasksToShow = isMobile ? 1 : 3;

        days.push(
          <Box
            key={day.toString()}
            onClick={() => handleDateClick(cloneDay)}
            sx={{
              minHeight: { xs: 70, sm: 100, md: 120 }, // Tinggi responsif
              borderRight: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              p: { xs: 0.5, sm: 1 }, // Padding lebih kecil di HP
              cursor: 'pointer',
              bgcolor: isSelected
                ? (theme.palette.mode === 'dark' ? 'rgba(249, 115, 22, 0.08)' : '#E5F4F9')
                : 'transparent',
              transition: dayCellTransition,
              '&:hover': { bgcolor: 'action.hover' },
              display: 'flex', flexDirection: 'column', gap: 0.5,
              position: 'relative'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
              <Typography
                variant="body2"
                sx={{
                  width: { xs: 24, sm: 28 },
                  height: { xs: 24, sm: 28 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                  fontWeight: isTodayDate ? 'bold' : 'normal',
                  bgcolor: isTodayDate ? 'primary.main' : 'transparent',
                  color: isTodayDate ? 'white' : (!isCurrentMonth ? 'text.disabled' : 'text.primary'),
                }}
              >
                {formattedDate}
              </Typography>
            </Box>

            {/* Container Task Items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden' }}>
              {dayTasks.slice(0, maxTasksToShow).map((task) => (
                <Box
                  key={task.id}
                  sx={{
                    bgcolor: getStatusColor(task.completed, task.priority) + (theme.palette.mode === 'dark' ? '44' : '22'),
                    borderLeft: `3px solid ${getStatusColor(task.completed, task.priority)}`,
                    color: 'text.primary',
                    fontSize: { xs: '0.6rem', sm: '0.7rem' }, // Font kecil di HP
                    px: 0.5, py: 0.2, borderRadius: '4px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500,
                    display: isMobile ? 'none' : 'block' // Di HP yang sangat kecil, mungkin kita hide textnya, ganti dot (opsional) - disini saya biarkan hide text jika terlalu sempit, tapi saya ganti logika di bawah.
                  }}
                >
                  {task.label}
                </Box>
              ))}

              {/* Mobile Only Dot Indicator (Jika layar sangat kecil) */}
              {isMobile && dayTasks.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  {dayTasks.slice(0, 3).map((_, idx) => (
                    <Box key={idx} sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  ))}
                </Box>
              )}

              {/* Desktop/Tablet "More" indicator */}
              {!isMobile && dayTasks.length > maxTasksToShow && (
                <Typography variant="caption" sx={{ pl: 1, fontSize: '0.65rem', color: 'text.secondary', fontStyle: 'italic' }}>
                  {t('tasks:calendar.moreTasks', { count: dayTasks.length - maxTasksToShow, defaultValue: '+ {{count}} more' })}
                </Typography>
              )}
            </Box>
          </Box>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Box key={day.toString()} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days}
        </Box>
      );
      days = [];
    }

    return <Box sx={{ borderTop: '1px solid', borderLeft: '1px solid', borderColor: 'divider' }}>{rows}</Box>;
  };

  const selectedDayTasks = tasks.filter(t => isSameDay(parseISO(t.dueDate), selectedDate));

  return (
    // === CSS GRID LAYOUT RESPONSIVE ===
    <Box sx={{
      display: 'grid',
      // Mobile & Tablet: 1 Kolom. Desktop Large (lg): 2 Kolom.
      gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' },
      gap: 3,
      width: '100%',
      alignItems: 'start'
    }}>

      {/* AREA 1: KALENDER (KIRI / ATAS) */}
      <Box sx={{ minWidth: 0 }}>
        <Paper elevation={0} sx={{ p: { xs: 1.5, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
          {renderHeader()}
          {renderDays()}
          <Fade in key={format(currentMonth, 'yyyy-MM')} timeout={theme.transitions.duration.shorter}>
            <Box>{renderCells()}</Box>
          </Fade>
        </Paper>
      </Box>

      {/* AREA 2: SIDEBAR (KANAN / BAWAH) */}
      <Box ref={tasksListRef} sx={{ minWidth: 0, height: { xs: 'auto', lg: '100%' } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider',
            minHeight: { xs: 'auto', md: 350 },
            display: 'flex', flexDirection: 'column'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              {t('tasks:calendar.tasksForDate', {
                date: format(selectedDate, 'MMM d'),
                defaultValue: 'Tasks for {{date}}',
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">{format(selectedDate, 'EEEE, yyyy')}</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, pr: 1, pt: 1, maxHeight: { xs: '400px', lg: 'none' } }}>
            {selectedDayTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, opacity: 0.6 }}>
                <EventNote sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">{t('tasks:calendar.noTasksScheduled', { defaultValue: 'No tasks scheduled.' })}</Typography>
              </Box>
            ) : (
              selectedDayTasks.map((task, index) => (
                <Grow
                  key={task.id}
                  in
                  timeout={theme.transitions.duration.shorter + index * 40}
                >
                  <Paper
                    onClick={() => onEditTask(task)}
                    elevation={0}
                    sx={{
                      p: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider',
                      cursor: 'pointer', transition: taskCardTransition,
                      '&:hover': { transform: 'translateY(-2px)', borderColor: 'primary.main', boxShadow: 2 }
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'text.secondary' : 'text.primary', mb: 1 }}>
                      {task.label}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={task.priority} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: getStatusColor(task.completed, task.priority) + '22', color: getStatusColor(task.completed, task.priority), fontWeight: 'bold' }} />
                      <Typography variant="caption" color="text.secondary">
                        {task.completed
                          ? t('common:states.done', { defaultValue: 'Done' })
                          : format(parseISO(task.dueDate), 'HH:mm')}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grow>
              ))
            )}
          </Box>
          <Button variant="contained" fullWidth startIcon={<Add />} onClick={onAddTask} sx={{ mt: 3, borderRadius: 3, textTransform: 'none', py: 1.5 }}>
            {t('tasks:calendar.actions.addNewTaskForDate', {
              date: format(selectedDate, 'MMM d'),
              defaultValue: 'Add New Task for {{date}}',
            })}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default CalendarView;