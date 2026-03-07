import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import type { Task } from '../../types/task.types';

// Helper: Ubah "2025-11-25T14:30:00Z" menjadi "2025-11-25T14:30" (untuk input html)
const formatForInput = (isoString?: string) => {
  if (!isoString) return '';
  return isoString.substring(0, 16); // Ambil sampai menit saja
};

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: Task | null; 
  onSubmit: (
    title: string, 
    context: string,
    startDate: string,
    taskDate: string, 
    priority: 'low' | 'medium' | 'high',
    addToCalendar: boolean
  ) => void;
}

function AddTaskDialog({ open, onClose, initialData, onSubmit }: AddTaskDialogProps): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [startDate, setStartDate] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [addToCalendar, setAddToCalendar] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        // === MODE EDIT ===
        setTitle(initialData.label);
        setContext(initialData.context || '');
        
        // Format data yang ada agar masuk ke input datetime-local
        setStartDate(formatForInput(initialData.startDate));
        setTaskDate(formatForInput(initialData.dueDate));
        
        setPriority(initialData.priority);
        setAddToCalendar(false);
      } else {
        // === MODE CREATE ===
        setTitle('');
        setContext('');
        
        // Default: Hari ini, jam sekarang
        const now = new Date();
        // Menggeser waktu agar sesuai timezone lokal untuk default value
        const localIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().substring(0, 16);
        
        setStartDate(localIso);
        setTaskDate(localIso);
        
        setPriority('medium');
        setAddToCalendar(false);
      }
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (title && taskDate) {
      onSubmit(title, context, startDate, taskDate, priority, addToCalendar);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {initialData ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            label="Task Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description / Context"
            fullWidth
            multiline
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& input::-webkit-calendar-picker-indicator': {
                filter: 'invert(1)', 
                cursor: 'pointer'
              },
              '& input': {
                color: 'white',
              }
            }}
          />
          <TextField
            label="Due Time"
            type="datetime-local"
            fullWidth
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            sx={{
              '& input::-webkit-calendar-picker-indicator': {
                filter: 'invert(1)', 
                cursor: 'pointer'
              },
              '& input': {
                color: 'white',
              }
            }}
          />
        </Box>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          {!initialData && (
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={addToCalendar} 
                    onChange={(e) => setAddToCalendar(e.target.checked)} 
                    color="primary" 
                  />
                }
                label="Add to Google Calendar"
              />
              <FormHelperText sx={{ ml: 3.5, mt: 0 }}>
                Will open a Google Calendar tab with the appropriate time.
              </FormHelperText>
            </Box>
          )}

        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ color: 'white' }}>
          {initialData ? 'Save Changes' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTaskDialog;