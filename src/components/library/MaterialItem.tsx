import React, { useState } from 'react';
import { 
  Box, Paper, Typography, IconButton, Chip, Menu, MenuItem, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button 
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import YouTubeIcon from '@mui/icons-material/YouTube';
import DescriptionIcon from '@mui/icons-material/Description';
import QuizIcon from '@mui/icons-material/Quiz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMaterial, updateMaterial } from '../../services/apiLibraryService';
import type { StudyMaterial } from '../../services/apiLibraryService';

interface MaterialItemProps {
  material: StudyMaterial;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <PictureAsPdfIcon sx={{ color: '#EF4444', fontSize: 32 }} />;
    case 'youtube': return <YouTubeIcon sx={{ color: '#FF0000', fontSize: 32 }} />;
    case 'quiz': return <QuizIcon sx={{ color: '#F97316', fontSize: 32 }} />;
    default: return <DescriptionIcon sx={{ color: '#3B82F6', fontSize: 32 }} />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'pdf': return 'PDF Document';
    case 'youtube': return 'YouTube Video';
    case 'quiz': return 'AI Quiz';
    default: return 'Study Note';
  }
};

function MaterialItem({ material }: MaterialItemProps): React.JSX.Element {
  const navigate = useNavigate(); 
  const queryClient = useQueryClient();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(material.title);

  const deleteMutation = useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] }); 
      queryClient.invalidateQueries({ queryKey: ['package'] });
    },
    onError: () => alert("Gagal menghapus materi")
  });

  const updateMutation = useMutation({
    mutationFn: () => updateMaterial(material.id, newTitle, material.packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['package'] });
      setIsRenameOpen(false);
    },
    onError: () => alert("Gagal mengubah nama materi")
  });


  const handleCardClick = () => {
    navigate(`/material/${material.id}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); 
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (window.confirm(`Yakin ingin menghapus "${material.title}"?`)) {
      deleteMutation.mutate(material.id);
    }
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewTitle(material.title);
    handleMenuClose();
    setIsRenameOpen(true);
  };

  const submitRename = () => {
    if (newTitle.trim()) {
      updateMutation.mutate();
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        onClick={handleCardClick}
        sx={{
          p: 2, mb: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider',
          bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2,
          cursor: 'pointer',
          transition: '0.2s', 
          '&:hover': { 
            borderColor: 'primary.main', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Box sx={{ width: 56, height: 56, borderRadius: '12px', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {getIcon(material.type)}
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight="600" noWrap>
              {material.title}
            </Typography>
            {material.type === 'quiz' && <Chip label="Quiz" size="small" color="secondary" sx={{ height: 20, fontSize: '0.65rem' }} />}
          </Box>
          <Typography variant="body2" color="text.secondary">
             {getTypeLabel(material.type)} • {material.createdAt}
          </Typography>
          {material.summary && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontStyle: 'italic', opacity: 0.8 }} noWrap>
              "{material.summary}"
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {material.type !== 'quiz' && (
            <IconButton  onClick={handleCardClick} title="Open Source" sx={{ color: 'primary.main' }}>
              <OpenInNewIcon />
            </IconButton>
          )}
          <IconButton onClick={handleMenuOpen} sx={{ color: 'text.secondary' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={(e: any) => handleMenuClose(e)}
          onClick={(e) => e.stopPropagation()} 
          PaperProps={{ sx: { borderRadius: 2, minWidth: 150 } }}
        >
          <MenuItem onClick={handleRenameClick}>Rename</MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>Delete</MenuItem>
        </Menu>
      </Paper>

      <div onClick={(e) => e.stopPropagation()}>
        <Dialog open={isRenameOpen} onClose={() => setIsRenameOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Rename Material</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Material Title"
              fullWidth
              variant="outlined"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsRenameOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={submitRename} variant="contained" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default MaterialItem;