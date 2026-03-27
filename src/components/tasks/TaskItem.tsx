import React from 'react';
import { Paper, Box, Typography, IconButton, Checkbox, Chip, useTheme } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { Task } from '../../types/task.types';
import { useTranslation } from 'react-i18next';

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (task: Task, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return 'default';
  }
};

// === HELPER FORMAT TANGGAL & WAKTU ===
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  
  // Jika tanggal tidak valid, return string kosong
  if (isNaN(date.getTime())) return '-';

  // Format: "25 Nov, 14:30"
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Format 24 Jam
  });
};

function TaskItem({ task, onUpdateStatus, onDelete, onEdit }: TaskItemProps): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();
  const taskItemTransition = theme.transitions.create(
    ['transform', 'box-shadow', 'border-color', 'background-color', 'opacity'],
    {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }
  );
  
  // Panggil helper format di sini
  const displayDate = formatDateTime(task.dueDate);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: task.completed ? 'transparent' : 'divider',
        bgcolor: task.completed ? 'action.hover' : 'background.paper',
        opacity: task.completed ? 0.7 : 1,
        transition: taskItemTransition,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={(e) => onUpdateStatus(task, e.target.checked)}
        color="primary"
        sx={{ mt: -0.5 }}
      />
      
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
          <Typography
            variant="subtitle1"
            fontWeight="600"
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary'
            }}
          >
            {task.label}
          </Typography>
          
          <Chip 
            label={task.priority} 
            size="small" 
            color={getPriorityColor(task.priority) as any} 
            variant={task.completed ? "outlined" : "filled"}
            sx={{ height: 20, fontSize: '0.7rem', textTransform: 'capitalize' }} 
          />
        </Box>

        {task.context && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, wordBreak: "break-word" }}>
            {task.context}
          </Typography>
        )}

        {/* TAMPILAN WAKTU */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
          <AccessTimeIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {t('tasks:taskItem.dueLabel', { date: displayDate })}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <IconButton 
          size="small" 
          onClick={() => onEdit(task)} 
          sx={{ color: 'primary.main', mb: 0.5 }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={() => onDelete(task.id)} 
          sx={{ color: 'error.main' }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default TaskItem;