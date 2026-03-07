import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Skeleton,
  Alert,
} from '@mui/material';

// Icons
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderOffIcon from '@mui/icons-material/FolderOff';

import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../services/apiLibraryService';

// Components
import FolderDialog from '../components/library/FolderDialog';
import FileUploadDialog from '../components/library/FileUploadDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog'; // Import the new dialog
import type { Folder } from '../types/folder.types';

function LibraryPage(): React.JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- States ---
  const [openDialog, setOpenDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  
  // State for Delete Dialog
  const [deleteFolderId, setDeleteFolderId] = useState<number | null>(null);

  // --- Queries ---
  const { data: folders, isLoading, isError, error } = useQuery({
    queryKey: ['folders'],
    queryFn: getFolders,
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ folderId, data }: { folderId: number; data: { name: string; iconColor: string } }) =>
      updateFolder(folderId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });

  // --- Handlers ---
  const handleSaveDialog = (data: { name: string; iconColor: string }) => {
    if (editingFolder) {
      updateMutation.mutate({ folderId: editingFolder.id, data });
    } else {
      createMutation.mutate(data);
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFolder(null);
  };

  // Modern Delete Handlers
  const handleDeleteClick = (folderId: number) => {
    setDeleteFolderId(folderId); // Open the dialog
  };

  const handleConfirmDelete = () => {
    if (deleteFolderId) {
      deleteMutation.mutate(deleteFolderId);
      setDeleteFolderId(null); // Close the dialog
    }
  };

  const isEmpty = !isLoading && folders?.length === 0;

  // -----------------------------
  // LOADING SKELETON
  // -----------------------------
  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>My Library</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Skeleton variant="rounded" width={140} height={42} />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 3 }} />
          ))}
        </Box>
      </Box>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------
  if (isError) {
    return <Alert severity="error">Failed to load library: {error.message}</Alert>;
  }

  // -----------------------------
  // MAIN RENDER
  // -----------------------------
  return (
    <Box sx={{ width: '100%' }}>
      {/* Page Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Library
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Organize your study materials neatly and efficiently.
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingFolder(null);
            setOpenDialog(true);
          }}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            px: 3,
            py: 1.2,
            fontWeight: 600,
            color: 'white',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
          }}
        >
          Add Folder
        </Button>
      </Box>

      {/* Grid Content */}
      <Box
        sx={{
          display: 'grid',
          // Responsive Grid: 1 column on mobile, adaptive columns on desktop
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(280px, 1fr))' }, 
          gap: 2.5,
        }}
      >
        {/* Empty state */}
        {isEmpty ? (
          <Paper
            sx={{
              gridColumn: '1 / -1', // Span full width
              p: 8,
              borderRadius: 4,
              border: '2px dashed',
              borderColor: 'divider',
              textAlign: 'center',
              bgcolor: 'transparent'
            }}
          >
            <FolderOffIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
              Library is Empty
            </Typography>
            <Typography color="text.secondary">
              No folders found. Click "Add Folder" to create one.
            </Typography>
          </Paper>
        ) : (
          folders?.map((folder) => (
            <Paper
              key={folder.id}
              elevation={0}
              onClick={() => navigate(`/library/${folder.id}`)}
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                  borderColor: 'primary.main',
                  '& .folder-actions': { opacity: 1 } // Show actions on hover
                },
              }}
            >
              {/* Icon */}
              <Box 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  borderRadius: 3, 
                  bgcolor: `${folder.iconColor}15`, // Transparan version of color
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: folder.iconColor 
                }}
              >
                <FolderOutlinedIcon sx={{ fontSize: 32 }} />
              </Box>

              {/* Text Info */}
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '1rem',
                    mb: 0.5
                  }}
                >
                  {folder.name}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="500"
                  sx={{ 
                    bgcolor: 'action.hover', 
                    px: 1, py: 0.5, 
                    borderRadius: 1 
                  }}
                >
                  {folder.material_count} items
                </Typography>
              </Box>

              {/* Action Buttons (Edit/Delete) */}
              <Box 
                className="folder-actions"
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  opacity: { xs: 1, md: 0 }, // Always visible on mobile, hover on desktop
                  transition: '0.2s'
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFolder(folder);
                    setOpenDialog(true);
                  }}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.lighter' } }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(folder.id);
                  }}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.lighter' } }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      
      <FolderDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveDialog}
        initialData={editingFolder}
      />
      
      <FileUploadDialog
        open={openFileDialog}
        onClose={() => setOpenFileDialog(false)}
        onSubmit={(fileData) => {
          console.log("Uploaded:", fileData);
          setOpenFileDialog(false);
        }}
      />

      <DeleteConfirmDialog 
        open={!!deleteFolderId}
        onClose={() => setDeleteFolderId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Folder?"
        description="Are you sure you want to delete this folder? All files inside will also be removed."
      />

    </Box>
  );
}

export default LibraryPage;