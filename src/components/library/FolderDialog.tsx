import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'; 
import { useTheme } from '@mui/material/styles';
import type { Folder } from '../../types/folder.types';

const DEFAULT_COLORS = [
  '#3E8EDE', // Primary Main (Biru)
  '#FF8C42', // Secondary Main (Oranye)
  '#28a745', // Success Main (Hijau)
  '#d32f2f', // Error Main (Merah)
  '#0288d1', 
  '#9e9e9e', 
];

interface FolderDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; iconColor: string }) => void;
  initialData?: Folder | null;
}

function FolderDialog({ open, onClose, onSave, initialData }: FolderDialogProps): React.JSX.Element {
  const theme = useTheme(); // (Opsional) Anda bisa hapus ini jika DEFAULT_COLORS sudah cukup

  const isEditMode = Boolean(initialData);

  const [folderName, setFolderName] = useState('');
  
  const [selectedIconColor, setSelectedIconColor] = useState<string>(DEFAULT_COLORS[0]);

  const iconColors = DEFAULT_COLORS;

  useEffect(() => {
    if (open) {
      if (isEditMode && initialData) {
        setFolderName(initialData.name);
        setSelectedIconColor(initialData.iconColor);
      } else {
        setFolderName('');
        setSelectedIconColor(DEFAULT_COLORS[0]); 
      }
    }
  }, [open, isEditMode, initialData]); // Hapus 'theme' dari dependency

  const handleSave = () => {
    if (folderName.trim() && selectedIconColor) { // Tambahkan cek selectedIconColor
      onSave({ name: folderName.trim(), iconColor: selectedIconColor });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {isEditMode ? 'Edit Folder' : 'Create New Folder'}
        </Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 2, borderBottom: 'none' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Folder Name</Typography>
        <TextField
          autoFocus
          margin="dense"
          id="folderName"
          placeholder="e.g., Biology Midterm Prep"
          type="text"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{ sx: { borderRadius: '8px' } }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Folder Icon</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {iconColors.map((color) => (
            <IconButton
              key={color}
              onClick={() => setSelectedIconColor(color)}
              sx={{
                p: 1.5,
                borderRadius: '8px',
                border: 2,
                borderColor: selectedIconColor === color ? 'primary.main' : 'transparent',
                backgroundColor: selectedIconColor === color ? theme.palette.primary.light + '22' : 'transparent',
              }}
            >
              <FolderOutlinedIcon sx={{ color: color, fontSize: 30 }} />
            </IconButton>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="text" onClick={onClose} sx={{ color: 'text.secondary', textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!folderName.trim()} 
          sx={{ textTransform: 'none', color:'white' }}
        >
          {isEditMode ? 'Save Changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FolderDialog;