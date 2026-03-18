import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Fab,
  Paper,
  IconButton,
  Skeleton,
  Alert,
  Grow,
  useTheme,
  useMediaQuery,
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
import SpotlightCallout from '../components/dashboard/SpotlightCallout';
import type { Folder } from '../types/folder.types';
import { useDashboardOnboardingStore } from '../stores/useDashboardOnboardingStore';

function LibraryPage(): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const desktopAddFolderRef = useRef<HTMLButtonElement | null>(null);
  const mobileAddFolderRef = useRef<HTMLButtonElement | null>(null);
  const spotlightTargetRef = isMobile ? mobileAddFolderRef : desktopAddFolderRef;
  const hasHydrated = useDashboardOnboardingStore((state) => state.hasHydrated);
  const hasCompletedOnboarding = useDashboardOnboardingStore((state) => state.hasCompletedOnboarding);
  const hasSeenAddTaskSpotlight = useDashboardOnboardingStore((state) => state.hasSeenAddTaskSpotlight);
  const hasSeenLibrarySpotlight = useDashboardOnboardingStore((state) => state.hasSeenLibrarySpotlight);
  const completeLibrarySpotlight = useDashboardOnboardingStore((state) => state.completeLibrarySpotlight);
  const shouldShowLibrarySpotlight =
    hasHydrated &&
    hasCompletedOnboarding &&
    hasSeenAddTaskSpotlight &&
    !hasSeenLibrarySpotlight;
  const folderCardTransition = theme.transitions.create(
    ['transform', 'box-shadow', 'border-color', 'background-color'],
    {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }
  );
  const actionRevealTransition = theme.transitions.create(['opacity', 'transform'], {
    duration: theme.transitions.duration.shortest,
    easing: theme.transitions.easing.easeInOut,
  });

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
  const masteryFolderCount =
    folders?.filter((folder) => {
      const materialsInFolder = typeof folder.material_count === 'number'
        ? folder.material_count
        : Array.isArray((folder as Folder & { items?: unknown[] }).items)
          ? (folder as Folder & { items?: unknown[] }).items!.length
          : 0;

      return materialsInFolder >= 2;
    }).length || 0;

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
      <Typography variant="h4" gutterBottom>
        My Library
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Organize your study materials neatly and efficiently.
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          ref={desktopAddFolderRef}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingFolder(null);
            setOpenDialog(true);
          }}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            textTransform: 'none',
            px: 3,
            py: 1.2,
            fontWeight: 600,
            color: 'white',
            boxShadow: 'none',
            transition: theme.transitions.create(['transform', 'box-shadow'], {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.easeInOut,
            }),
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }}
        >
          Add Folder
        </Button>
      </Box>

      <Fab
        ref={mobileAddFolderRef}
        color="primary"
        aria-label="Add Folder"
        onClick={() => {
          setEditingFolder(null);
          setOpenDialog(true);
        }}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          right: 20,
          bottom: 120,
          color: 'white',
          boxShadow: '0 10px 24px rgba(25, 118, 210, 0.28)',
          zIndex: theme.zIndex.fab ?? 1050,
          transition: theme.transitions.create(['transform', 'box-shadow'], {
            duration: theme.transitions.duration.shorter,
            easing: theme.transitions.easing.easeInOut,
          }),
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
          folders?.map((folder, index) => (
            <Grow key={folder.id} in timeout={theme.transitions.duration.shorter + index * 40}>
              <Paper
                elevation={0}
                onClick={() => navigate(`/library/${folder.id}`)}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: folderCardTransition,
                  cursor: 'pointer',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'shadows[1]',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                    borderColor: 'primary.main',
                    '& .folder-actions': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    }
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                  },
                }}
              >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  minWidth: 50, // Prevents shrinking below this
                  minHeight: 50,
                  flexShrink: 0, // CRITICAL: Tells Flexbox "Do not squeeze me"
                  borderRadius: 3,
                  bgcolor: `${folder.iconColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: folder.iconColor,
                  transition: theme.transitions.create('transform', {
                    duration: theme.transitions.duration.shorter,
                    easing: theme.transitions.easing.easeInOut,
                  }),
                  '.MuiPaper-root:hover &': {
                    transform: 'scale(1.08)',
                  },
                }}
              >
                <FolderOutlinedIcon sx={{ fontSize: 32 }} />
              </Box>

              {/* Text Info */}
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: 'wrap',
                    overflow: 'hidden',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    textOverflow: 'ellipsis',
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
                    borderRadius: 1,
                    transition: theme.transitions.create(['background-color', 'transform'], {
                      duration: theme.transitions.duration.shortest,
                    }),
                    '.MuiPaper-root:hover &': {
                      bgcolor: 'primary.lighter',
                      transform: 'translateY(-1px)',
                    },
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
                  transform: { xs: 'translateX(0)', md: 'translateX(6px)' },
                  transition: actionRevealTransition,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFolder(folder);
                    setOpenDialog(true);
                  }}
                  sx={{
                    color: 'text.secondary',
                    transition: theme.transitions.create(['transform', 'background-color', 'color'], {
                      duration: theme.transitions.duration.shortest,
                    }),
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'primary.lighter',
                      transform: 'scale(1.08)',
                    },
                  }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(folder.id);
                  }}
                  sx={{
                    color: 'text.secondary',
                    transition: theme.transitions.create(['transform', 'background-color', 'color'], {
                      duration: theme.transitions.duration.shortest,
                    }),
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: 'error.lighter',
                      transform: 'scale(1.08)',
                    },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              </Paper>
            </Grow>
          ))
        )}
      </Box>


      <FolderDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveDialog}
        initialData={editingFolder}
        masteryFolderCount={masteryFolderCount}
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

      <SpotlightCallout
        open={shouldShowLibrarySpotlight}
        targetRef={spotlightTargetRef}
        onOverlayClick={completeLibrarySpotlight}
        title="Second step: organize your material"
        description="Create your own folders and add materials so your library stays tidy and easy to review."
        dismissAriaLabel="Dismiss library spotlight"
      />

    </Box>
  );
}

export default LibraryPage;