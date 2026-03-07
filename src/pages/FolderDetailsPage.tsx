import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Skeleton,
  Breadcrumbs,
  Link,
  Alert,
  Stack,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getPackageDetails, createMaterial } from '../services/apiLibraryService';
import type { CreateMaterialPayload } from '../services/apiLibraryService';

import MaterialItem from '../components/library/MaterialItem';
import FileUploadDialog from '../components/library/FileUploadDialog';

function FolderDetailsPage(): React.JSX.Element {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const { data: packageData, isLoading, isError, error } = useQuery({
    queryKey: ['package', folderId],
    queryFn: () => getPackageDetails(folderId || ''),
    enabled: !!folderId,
  });

  const createMutation = useMutation({
    mutationFn: createMaterial,
    onSuccess: (newMaterial) => {
      queryClient.invalidateQueries({ queryKey: ['package', folderId] });

      setOpenUploadDialog(false);

      navigate(`/material/${newMaterial.id}`);
    },
    onError: (err: any) => {
      console.error("Upload failed:", err);
      const msg = err?.response?.data?.message || "Gagal mengupload materi. Silakan coba lagi.";
      alert(msg);
    }
  });

  // === 3. HANDLER SUBMIT DARI DIALOG ===
  const handleUploadSubmit = (data: {
    title: string;
    type: 'pdf' | 'youtube' | 'text';
    file?: File;
    url?: string;
    content?: string;
  }) => {
    if (!folderId) return;

    const payload: CreateMaterialPayload = {
      packageId: folderId,
      title: data.title,
      type: data.type,
      file: data.file,
      url: data.url,
      content: data.content
    };

    createMutation.mutate(payload);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/library')}
          sx={{ mb: 2, color: 'text.secondary', textTransform: 'none' }}
        >
          Back to Library
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <Breadcrumbs sx={{ mb: 1, color: 'text.secondary' }}>
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate('/library')}
                sx={{ cursor: 'pointer' }}
              >
                My Library
              </Link>
              <Typography color="text.primary">
                {isLoading ? <Skeleton width={150} /> : packageData?.title}
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {isLoading ? (
                <Skeleton variant="circular" width={40} height={40} />
              ) : (
                <FolderOpenIcon
                  fontSize="large"
                  sx={{
                    color: packageData?.iconColor || 'primary.main',
                    transition: 'color 0.3s'
                  }}
                />
              )}

              <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                {isLoading ? <Skeleton width={300} /> : packageData?.title}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenUploadDialog(true)}
              sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 600, color: 'white', flexGrow: { xs: 1, md: 0 } }}
            >
              Upload Material
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box>
        {isLoading ? (
          <Box>
            <Skeleton variant="rounded" height={88} sx={{ mb: 2, borderRadius: 3 }} />
            <Skeleton variant="rounded" height={88} sx={{ mb: 2, borderRadius: 3 }} />
            <Skeleton variant="rounded" height={88} sx={{ borderRadius: 3 }} />
          </Box>
        ) : isError ? (
          <Alert severity="error">
            Gagal memuat detail folder: {(error as Error).message}
          </Alert>
        ) : !packageData?.materials || packageData.materials.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 10,
              color: 'text.secondary',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 4,
              bgcolor: 'background.default'
            }}
          >
            <FolderOpenIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold">Folder Kosong</Typography>
            <Typography variant="body2">
              Paket "{packageData?.title}" belum memiliki materi.
            </Typography>
          </Paper>
        ) : (
          <Box>
            {packageData.materials.map((item) => (
              <MaterialItem
                key={item.id}
                material={item as any}
              />
            ))}
          </Box>
        )}
      </Box>

      <FileUploadDialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        onSubmit={handleUploadSubmit}
        isLoading={createMutation.isPending}
      />
    </Box>
  );
}

export default FolderDetailsPage;