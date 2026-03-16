import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Skeleton,
  Alert,
  Chip,
  Grow,
  useTheme,
} from '@mui/material';
import { Add, Task as TaskICon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Import Service & Types
import { getTasks, updateTask, createTask } from '../../services/apiTaskService';
import type { Task } from '../../types/task.types';

// Import Dialog Komponen & Utils
import AddTaskDialog from '../tasks/AddTaskDialog';
import { openGoogleCalendar } from '../../utils/calendarUtils';

// Helper untuk mendapatkan tanggal hari ini (YYYY-MM-DD)
const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return 'default';
  }
};

interface TasksWidgetProps {
  addTaskButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

function TasksWidget({ addTaskButtonRef }: TasksWidgetProps): React.JSX.Element {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const todayDate = getTodayDate();
  const taskRowTransition = theme.transitions.create(
    ['transform', 'background-color', 'border-color', 'box-shadow'],
    {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }
  );
  
  // State untuk Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // === 1. FETCH DATA (Filter Hari Ini) ===
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks', { date: todayDate }],
    queryFn: () => getTasks({ date: todayDate }),
  });

  // === 2. MUTATION: CREATE TASK ===
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // === 3. MUTATION: UPDATE STATUS ===
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // === [PERBAIKAN UTAMA DI SINI] ===
  // Handler Submit disesuaikan dengan parameter baru AddTaskDialog
  const handleAddTaskSubmit = (
    title: string, 
    context: string,
    startDate: string,
    taskDate: string, 
    priority: 'low' | 'medium' | 'high',
    addToCalendar: boolean
  ) => {
    createMutation.mutate(
      { 
        title, 
        context, 
        start_date: startDate, 
        task_date: taskDate, 
        priority 
      },
      {
        onSuccess: () => {
          // Jika user mencentang 'Add to Calendar'
          if (addToCalendar) {
            openGoogleCalendar(title, context, taskDate);
          }
          setOpenAddDialog(false); // Tutup dialog
        }
      }
    );
  };

  // Handler Toggle Checkbox
  const handleToggleStatus = (task: Task) => {
    updateMutation.mutate({
      id: task.id,
      data: {
        title: task.label,
        context: task.context,
        priority: task.priority,
        start_date: task.startDate, // Kirim ulang start date
        task_date: task.dueDate,
        completed: !task.completed
      }
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <Box sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
        </Box>
        <Paper sx={{ p: 3, height: 'calc(100% - 60px)', bgcolor: 'background.paper' }}>
          <Skeleton variant="rounded" height={50} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" height={50} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" height={50} />
        </Paper>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: 'text.primary' }}>
            Today's Tasks
          </Typography>
        </Box>
        <Paper sx={{ p: 3, height: 'calc(100% - 60px)' }}>
          <Alert severity="error">Gagal memuat tugas hari ini.</Alert>
        </Paper>
      </Box>
    );
  }

  const isEmpty = !tasks || tasks.length === 0;

  return (
    <Box sx={{ height: '100%' }}>
      {/* Header outside Paper */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: 'text.primary' }}>
          Today's Tasks
        </Typography>
        <Button
          ref={addTaskButtonRef}
          variant="contained"
          color="primary"
          size="small"
          sx={{ color: 'white', textTransform: 'none'}}
          startIcon={<Add />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Task
        </Button>
      </Box>

      {/* Content inside Paper */}
      <Paper sx={{ p: 3, elevation: 1, bgcolor: 'background.paper', height: 'calc(100% - 60px)' }}>
        {/* List Tasks */}
        {isEmpty ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <TaskICon sx={{ fontSize: 32, color: 'action.disabled' }} />
            </Box>
            <Typography variant="body1" sx={{ color: 'text.primary' }}>
              No tasks for today.
            </Typography>
            <Typography variant="caption">Enjoy your free time!</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, overflowY: 'auto', maxHeight: '300px' }}>
            {tasks.map((task, index) => (
              <Grow key={task.id} in timeout={theme.transitions.duration.shorter + index * 50}>
                <ListItem
                  disablePadding
                  sx={{
                    border: '1px solid',
                    borderColor: task.completed ? 'transparent' : 'divider',
                    borderRadius: 2,
                    mb: 1.5,
                    bgcolor: task.completed ? 'action.hover' : 'transparent',
                    transition: taskRowTransition,
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 1,
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&:last-child': { mb: 0 },
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={task.completed}
                    onChange={() => handleToggleStatus(task)}
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      ml: 1,
                      transition: theme.transitions.create('transform', {
                        duration: theme.transitions.duration.shortest,
                      }),
                      '&:hover': { transform: 'scale(1.08)' },
                    }}
                  />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'text.secondary' : 'text.primary',
                            fontWeight: 500
                          }}
                        >
                          {task.label}
                        </Typography>
                        {!task.completed && (
                          <Chip 
                            label={task.priority} 
                            size="small" 
                            color={getPriorityColor(task.priority) as any} 
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              textTransform: 'capitalize',
                              transition: theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shortest,
                              }),
                              '&:hover': { transform: 'scale(1.05)' },
                            }} 
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </Grow>
            ))}
          </List>
        )}
      </Paper>

      {/* Dialog Add Task */}
      <AddTaskDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddTaskSubmit}
      />
    </Box>
  );
}

export default TasksWidget;