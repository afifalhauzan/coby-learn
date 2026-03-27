import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DateRangeIcon from '@mui/icons-material/DateRange';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../types/task.types';
import {
  getTasks, createTask, updateTask, deleteTask, type TaskQueryParams
} from '../services/apiTaskService';

import TaskItem from '../components/tasks/TaskItem';
import AddTaskDialog from '../components/tasks/AddTaskDialog';
import CalendarView from '../components/tasks/CalendarView';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog'; // Component Baru
import { openGoogleCalendar } from '../utils/calendarUtils';
import { useTranslation } from 'react-i18next';

const getFormattedDate = (type: 'today' | 'tomorrow'): string => {
  const d = new Date();
  if (type === 'tomorrow') d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStatus = (task: Task) => {
  if (task.completed) return 'completed';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(task.dueDate);
  if (isNaN(date.getTime())) return 'upcoming';
  date.setHours(0, 0, 0, 0);
  if (date < today) return 'overdue';
  if (date.getTime() === today.getTime()) return 'today';
  return 'upcoming';
};

function TasksPage(): React.JSX.Element {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const [statusTab, setStatusTab] = useState<'all' | 'incomplete' | 'completed' | 'overdue'>('all');
  const [dateFilterType, setDateFilterType] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const apiParams: TaskQueryParams = {};
  if (viewMode === 'list') {
    if (dateFilterType !== 'all') apiParams.date = getFormattedDate(dateFilterType);
    if (priorityFilter !== 'all') apiParams.priority = priorityFilter;
  }

  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks', viewMode === 'list' ? apiParams : 'all'],
    queryFn: () => getTasks(viewMode === 'list' ? apiParams : undefined),
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const handleOpenCreate = () => { setEditingTask(null); setOpenDialog(true); };
  const handleOpenEdit = (task: Task) => { setEditingTask(task); setOpenDialog(true); };

  const handleDialogSubmit = (title: string, context: string, startDate: string, taskDate: string, priority: string, addToCalendar: boolean) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: { title, context, start_date: startDate, task_date: taskDate, priority } });
    } else {
      createMutation.mutate({ title, context, start_date: startDate, task_date: taskDate, priority: priority as any }, {
        onSuccess: () => { if (addToCalendar) openGoogleCalendar(title, context, taskDate); }
      });
    }
  };

  const handleUpdateTaskStatus = (task: Task, newStatus: boolean) => {
    updateMutation.mutate({ id: task.id, data: { title: task.label, context: task.context, priority: task.priority, start_date: task.startDate, task_date: task.dueDate, completed: newStatus } });
  };

  const handleDeleteClick = (taskId: number) => {
    setDeleteTaskId(taskId);
  };

  const handleConfirmDelete = () => {
    if (deleteTaskId) {
      deleteMutation.mutate(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  const groupedTasks = useMemo(() => {
    if (!tasks || viewMode !== 'list') return { overdue: [], today: [], upcoming: [], completed: [] };
    const filtered = tasks.filter(task => {
      if (statusTab === 'all') return true;
      if (statusTab === 'completed') return task.completed;
      if (statusTab === 'incomplete') return !task.completed;
      if (statusTab === 'overdue') return !task.completed && getStatus(task) === 'overdue';
      return true;
    });
    const groups = { overdue: [] as Task[], today: [] as Task[], upcoming: [] as Task[], completed: [] as Task[] };
    for (const t of filtered) {
      const s = getStatus(t);
      if (groups[s]) groups[s].push(t);
    }
    return groups;
  }, [tasks, statusTab, viewMode]);

  const totalFilteredTasks =
    groupedTasks.overdue.length +
    groupedTasks.today.length +
    groupedTasks.upcoming.length +
    groupedTasks.completed.length;

  const showEmptyState = !isLoading && !isError && totalFilteredTasks === 0;
  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom>{t('tasks:pageTitle')}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            {t('tasks:pageSubtitle')}
          </Typography>
          <Tabs
            value={viewMode}
            onChange={(_, val) => setViewMode(val)}
            aria-label="view mode tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 0, py: 1 } }}
          >
            <Tab icon={<ListAltIcon fontSize="small" />} iconPosition="start" label={t('tasks:viewModes.listView')} value="list" />
            <Tab icon={<DateRangeIcon fontSize="small" />} iconPosition="start" label={t('tasks:viewModes.calendarView')} value="calendar" />
          </Tabs>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, textTransform: 'none', color: 'white', height: 40, px: 3 }}
          onClick={handleOpenCreate}
        >
          {t('tasks:actions.addTask')}
        </Button>
      </Box>

      <Fab
        color="primary"
        aria-label={t('tasks:actions.addTask')}
        onClick={handleOpenCreate}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          right: 20,
          bottom: 120,
          color: 'white',
          boxShadow: '0 10px 24px rgba(25, 118, 210, 0.28)',
          zIndex: 1050,
          '&:hover': {
            boxShadow: '0 14px 30px rgba(25, 118, 210, 0.34)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }}
      >
        <AddIcon />
      </Fab>

      <Box sx={{ width: '100%' }}>
        {viewMode === 'list' ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <ToggleButtonGroup value={statusTab} exclusive onChange={(_, val) => val && setStatusTab(val)} color="primary" size="small">
                <ToggleButton value="all" sx={{ textTransform: 'none', px: 2 }}>{t('tasks:filters.status.all')}</ToggleButton>
                <ToggleButton value="incomplete" sx={{ textTransform: 'none', px: 2 }}>{t('tasks:filters.status.incomplete')}</ToggleButton>
                <ToggleButton value="completed" sx={{ textTransform: 'none', px: 2 }}>{t('tasks:filters.status.completed')}</ToggleButton>
                <ToggleButton value="overdue" sx={{ textTransform: 'none', px: 2 }}>{t('tasks:filters.status.overdue')}</ToggleButton>
              </ToggleButtonGroup>
              <Box sx={{ flexGrow: 1 }} />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>{t('tasks:filters.date.label')}</InputLabel>
                <Select value={dateFilterType} label={t('tasks:filters.date.label')} onChange={(e) => setDateFilterType(e.target.value as any)} sx={{ px: 1 }}>
                  <MenuItem value="all">{t('tasks:filters.date.allDates')}</MenuItem>
                  <MenuItem value="today">{t('tasks:filters.date.today')}</MenuItem>
                  <MenuItem value="tomorrow">{t('tasks:filters.date.tomorrow')}</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>{t('tasks:filters.priority.label')}</InputLabel>
                <Select value={priorityFilter} label={t('tasks:filters.priority.label')} onChange={(e) => setPriorityFilter(e.target.value as any)} sx={{ px: 1 }}>
                  <MenuItem value="all">{t('tasks:filters.priority.allPriorities')}</MenuItem>
                  <MenuItem value="low">{t('tasks:filters.priority.low')}</MenuItem>
                  <MenuItem value="medium">{t('tasks:filters.priority.medium')}</MenuItem>
                  <MenuItem value="high">{t('tasks:filters.priority.high')}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {isLoading ? (
              <Skeleton height={200} sx={{ borderRadius: 2 }} />
            ) : isError ? (
              <Alert severity="error">{t('tasks:messages.errorLoadingTasks')}</Alert>
            ) : showEmptyState ? (
              <Paper sx={{ p: 6, textAlign: 'center', border: '2px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
                <Typography color="text.secondary">{t('tasks:messages.noTasksAvailable')}</Typography>

              </Paper>
            ) : (
              <>
                {groupedTasks.overdue.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <WarningAmberIcon color="error" />
                      <Typography variant="h6" fontWeight="bold" color="error">{t('tasks:sections.overdue')}</Typography>
                    </Box>
                    {groupedTasks.overdue.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onUpdateStatus={handleUpdateTaskStatus}
                        onDelete={handleDeleteClick}
                        onEdit={handleOpenEdit}
                      />
                    ))}
                  </Box>
                )}
                {(groupedTasks.today.length > 0) && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CalendarTodayIcon color="action" />
                      <Typography variant="h6" fontWeight="bold">{t('tasks:sections.today')}</Typography>
                    </Box>
                    {groupedTasks.today.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onUpdateStatus={handleUpdateTaskStatus}
                        onDelete={handleDeleteClick}
                        onEdit={handleOpenEdit}
                      />
                    ))}
                  </Box>
                )}
                {(groupedTasks.upcoming.length > 0) && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <EventIcon color="action" />
                      <Typography variant="h6" fontWeight="bold">{t('tasks:sections.upcoming')}</Typography>
                    </Box>
                    {groupedTasks.upcoming.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onUpdateStatus={handleUpdateTaskStatus}
                        onDelete={handleDeleteClick}
                        onEdit={handleOpenEdit}
                      />
                    ))}
                  </Box>
                )}
                {groupedTasks.completed.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CheckCircleOutlineIcon color="success" />
                      <Typography variant="h6" fontWeight="bold" color="success.main">{t('tasks:sections.completed')}</Typography>
                    </Box>
                    {groupedTasks.completed.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onUpdateStatus={handleUpdateTaskStatus}
                        onDelete={handleDeleteClick}
                        onEdit={handleOpenEdit}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
          </>
        ) : (
          <Box sx={{ width: '100%', mt: 2 }}>
            {isLoading ? (
              <Skeleton height={600} sx={{ borderRadius: 4 }} />
            ) : isError ? (
              <Alert severity="error">{t('tasks:messages.errorLoadingTasks')}</Alert>
            ) : (
              <CalendarView
                tasks={tasks || []}
                onAddTask={handleOpenCreate}
                onEditTask={handleOpenEdit}
              />
            )}
          </Box>
        )}
      </Box>


      <AddTaskDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleDialogSubmit}
        initialData={editingTask}
      />

      <DeleteConfirmDialog
        open={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleConfirmDelete}
        title={t('tasks:deleteDialog.title')}
        description={t('tasks:deleteDialog.description')}
      />

    </Box>
  );
}

export default TasksPage;