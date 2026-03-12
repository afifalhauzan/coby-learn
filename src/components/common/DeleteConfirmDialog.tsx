// src/components/common/DeleteConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  Zoom
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Zoom ref={ref} {...props} />;
});

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Task?",
  description = "Are you sure you want to delete this task? This action cannot be undone."
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      PaperProps={{
        sx: {
          padding: 2,
          minWidth: 320,
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      {/* Tombol Close Kecil di Pojok Kanan */}
      <IconButton 
        onClick={onClose} 
        sx={{ position: 'absolute', right: 12, top: 12, color: 'text.disabled' }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
        {/* Icon Lingkaran Merah */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: '#FEE2E2', // Merah muda sangat lembut
            color: '#EF4444',   // Merah terang
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 32 }} />
        </Box>

        <DialogTitle sx={{ p: 0, mb: 1, fontWeight: 'bold', fontSize: '1.25rem' }}>
          {title}
        </DialogTitle>

        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 0, width: '100%', display: 'flex', gap: 1.5, justifyContent: 'center' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              color: 'text.secondary',
              borderColor: 'divider',
              px: 3,
              flex: 1,
              '&:hover': { borderColor: 'text.primary', bgcolor: 'transparent' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              bgcolor: '#EF4444',
              px: 3,
              flex: 1,
              color: 'white',
              '&:hover': { bgcolor: '#DC2626' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmDialog;