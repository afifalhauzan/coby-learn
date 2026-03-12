// src/components/library/GenerateQuizDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface GenerateQuizDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (count: number) => void;
  isLoading: boolean;
}

function GenerateQuizDialog({ open, onClose, onSubmit, isLoading }: GenerateQuizDialogProps): React.JSX.Element {
  const [count, setCount] = useState(5);

  const handleSubmit = () => {
    onSubmit(count);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">Generate AI Quiz</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select how many questions you want our AI to generate from this material.
        </Typography>

        <FormControl fullWidth size="small">
          <InputLabel>Number of Questions</InputLabel>
          <Select
            value={count}
            label="Number of Questions"
            onChange={(e) => setCount(Number(e.target.value))}
          >
            <MenuItem value={3}>3 Questions (Quick)</MenuItem>
            <MenuItem value={5}>5 Questions (Standard)</MenuItem>
            <MenuItem value={10}>10 Questions (Deep Dive)</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isLoading} color="inherit">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isLoading}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          {isLoading ? 'Generating...' : 'Start Generation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GenerateQuizDialog;