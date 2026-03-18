import React, { useState, useEffect, useRef } from 'react';
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
  Tooltip,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import type { Folder } from '../../types/folder.types';

const DEFAULT_COLORS = [
  '#3E8EDE', // Primary Main (Biru)
  '#FF8C42', // Secondary Main (Oranye)
  '#28a745', // Success Main (Hijau)
  '#d32f2f', // Error Main (Merah)
  '#0288d1', 
  '#9e9e9e', 
];

const DEFAULT_UNLOCKED_COLOR_COUNT = 3;
const MASTERY_UNLOCK_TARGET = 5;
const LOCKED_TOOLTIP_MESSAGE = 'Mastery required: Have 5 folders with at least 2 materials each to unlock more colors.';

interface FolderDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; iconColor: string }) => void;
  initialData?: Folder | null;
  masteryFolderCount: number;
}

function FolderDialog({
  open,
  onClose,
  onSave,
  initialData,
  masteryFolderCount,
}: FolderDialogProps): React.JSX.Element {
  const theme = useTheme(); // (Opsional) Anda bisa hapus ini jika DEFAULT_COLORS sudah cukup

  const isEditMode = Boolean(initialData);

  const [folderName, setFolderName] = useState('');
  
  const [selectedIconColor, setSelectedIconColor] = useState<string>(DEFAULT_COLORS[0]);
  const [shakeColor, setShakeColor] = useState<string | null>(null);
  const [showUnlockGlow, setShowUnlockGlow] = useState(false);
  const previousUnlockedStateRef = useRef(masteryFolderCount >= MASTERY_UNLOCK_TARGET);

  const iconColors = DEFAULT_COLORS;
  const isExtendedPaletteUnlocked = masteryFolderCount >= MASTERY_UNLOCK_TARGET;
  const masteryProgress = (Math.min(masteryFolderCount, MASTERY_UNLOCK_TARGET) / MASTERY_UNLOCK_TARGET) * 100;

  const handleColorSelect = (color: string, isLocked: boolean) => {
    if (isLocked) {
      setShakeColor(color);
      window.setTimeout(() => {
        setShakeColor((prev) => (prev === color ? null : prev));
      }, 350);
      return;
    }

    setSelectedIconColor(color);
  };

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

  useEffect(() => {
    if (!open) {
      previousUnlockedStateRef.current = isExtendedPaletteUnlocked;
      setShowUnlockGlow(false);
      return;
    }

    if (!previousUnlockedStateRef.current && isExtendedPaletteUnlocked) {
      setShowUnlockGlow(true);
      window.setTimeout(() => setShowUnlockGlow(false), 1400);
    }

    previousUnlockedStateRef.current = isExtendedPaletteUnlocked;
  }, [open, isExtendedPaletteUnlocked]);

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
          {iconColors.map((color, index) => {
            const isLockedColor = index >= DEFAULT_UNLOCKED_COLOR_COUNT && !isExtendedPaletteUnlocked;

            return (
              <Box
                key={color}
                component={motion.div}
                animate={shakeColor === color ? { x: [0, -5, 5, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.28 }}
              >
                <Tooltip title={isLockedColor ? LOCKED_TOOLTIP_MESSAGE : ''} arrow placement="top">
                  <Box sx={{ position: 'relative' }}>
                    <IconButton
                      onClick={() => handleColorSelect(color, isLockedColor)}
                      aria-disabled={isLockedColor}
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        border: 2,
                        opacity: isLockedColor ? 0.4 : 1,
                        borderColor: selectedIconColor === color ? 'primary.main' : 'transparent',
                        backgroundColor: selectedIconColor === color ? theme.palette.primary.light + '22' : 'transparent',
                        cursor: isLockedColor ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <FolderOutlinedIcon sx={{ color: color, fontSize: 30 }} />
                    </IconButton>

                    {isLockedColor && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 2,
                          bottom: 2,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'none',
                        }}
                      >
                        <LockOutlinedIcon sx={{ fontSize: 11, color: 'text.secondary' }} />
                      </Box>
                    )}

                    {showUnlockGlow && index >= DEFAULT_UNLOCKED_COLOR_COUNT && isExtendedPaletteUnlocked && (
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0.8, scale: 0.94 }}
                        animate={{ opacity: 0, scale: 1.12 }}
                        transition={{ duration: 0.8 }}
                        sx={{
                          position: 'absolute',
                          inset: -2,
                          borderRadius: '10px',
                          border: '2px solid',
                          borderColor: 'primary.main',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
        <Box sx={{ mt: 1.25 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Mastery Progress
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {Math.min(masteryFolderCount, MASTERY_UNLOCK_TARGET)}/{MASTERY_UNLOCK_TARGET}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={masteryProgress}
            sx={{
              height: 6,
              borderRadius: 99,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 99,
              },
            }}
          />
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