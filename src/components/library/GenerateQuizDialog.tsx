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
import { useTranslation } from 'react-i18next';

interface GenerateQuizDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (count: number) => void;
  isLoading: boolean;
}

function GenerateQuizDialog({ open, onClose, onSubmit, isLoading }: GenerateQuizDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  const [count, setCount] = useState(5);

  const handleSubmit = () => {
    onSubmit(count);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">{t('material:generateQuizDialog.title')}</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('material:generateQuizDialog.description')}
        </Typography>

        <FormControl fullWidth size="small">
          <InputLabel>{t('material:generateQuizDialog.numberOfQuestions')}</InputLabel>
          <Select
            value={count}
            label={t('material:generateQuizDialog.numberOfQuestions')}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            <MenuItem value={3}>{t('material:generateQuizDialog.options.quick3')}</MenuItem>
            <MenuItem value={5}>{t('material:generateQuizDialog.options.standard5')}</MenuItem>
            <MenuItem value={10}>{t('material:generateQuizDialog.options.deepDive10')}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isLoading} color="inherit">{t('common:actions.cancel')}</Button>
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
          {isLoading ? t('common:states.generating') : t('material:generateQuizDialog.startGeneration')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GenerateQuizDialog;