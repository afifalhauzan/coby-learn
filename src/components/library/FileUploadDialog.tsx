import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import NotesIcon from '@mui/icons-material/Notes';
import { useDropzone } from 'react-dropzone';

// Definisi tipe data yang dikirim ke Parent
export interface SubmissionData {
  title: string;
  type: 'pdf' | 'youtube' | 'text';
  file?: File;
  url?: string;
  content?: string;
}

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SubmissionData) => void; // <--- Pastikan ini ada
  isLoading?: boolean;
}

function FileUploadDialog({ open, onClose, onSubmit, isLoading }: FileUploadDialogProps): React.JSX.Element {
  const [tabValue, setTabValue] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  // --- Loading State Animation ---
  const [loadingStep, setLoadingStep] = useState(0);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      setLoadingStep(0);
      const steps = [0, 1, 2];
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setLoadingStep(i);
      }, 2500); // Ganti teks setiap 2.5 detik
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const loadingMessages = [
    { title: 'Uploading Material...', desc: 'Please wait while we secure your file.' },
    { title: 'Analyzing Content...', desc: 'Our AI is reading and understanding the context.' },
    { title: 'Generating Summary...', desc: 'Almost there! Creating your study notes.' },
  ];
  // -------------------------------

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleCloseDialog = () => {
    if (isLoading) return; // Prevent closing while loading
    onClose();
    setTimeout(() => {
      setFile(null);
      setYoutubeLink('');
      setPastedText('');
      setCustomTitle('');
      setTabValue(0);
    }, 300);
  };

  const handleSubmit = () => {
    let type: 'pdf' | 'youtube' | 'text' = 'pdf';
    let finalTitle = customTitle;

    if (tabValue === 0) {
      if (!file) return alert("Please upload a PDF file first.");
      type = 'pdf';
      if (!finalTitle) finalTitle = file.name;
    } else if (tabValue === 1) {
      if (!youtubeLink.trim()) return alert("Please enter a YouTube URL.");
      type = 'youtube';
      if (!finalTitle) finalTitle = 'New Video Material';
    } else if (tabValue === 2) {
      if (!pastedText.trim()) return alert("Please paste some text content.");
      type = 'text';
      if (!finalTitle) finalTitle = 'New Note';
    }

    onSubmit({
      title: finalTitle,
      type,
      file: file || undefined,
      url: youtubeLink,
      content: pastedText
    });
  };

  const isGenerateDisabled =
    (tabValue === 0 && !file) ||
    (tabValue === 1 && !youtubeLink.trim()) ||
    (tabValue === 2 && !pastedText.trim());

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2, // 2 * 8px = 16px
          overflow: 'hidden',
          position: 'relative'
        }
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: 400,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
          }}
        >
          {/* Animated Pulse Circle */}
          <Box sx={{ position: 'relative', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.7)',
                animation: 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                '@keyframes pulse-ring': {
                  '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.7)' },
                  '70%': { transform: 'scale(1)', boxShadow: '0 0 0 20px rgba(99, 102, 241, 0)' },
                  '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' },
                },
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
          </Box>

          <Typography variant="h5" fontWeight="800" gutterBottom sx={{
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'fadeIn 0.5s ease-in-out'
          }}>
            {loadingMessages[loadingStep].title}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, animation: 'fadeIn 0.5s ease-in-out' }}>
            {loadingMessages[loadingStep].desc}
          </Typography>

          {/* Progress Indicators */}
          <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
            {[0, 1, 2].map((step) => (
              <Box
                key={step}
                sx={{
                  width: step === loadingStep ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: step === loadingStep ? 'primary.main' : 'action.hover',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </Box>
      ) : (
        <>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 3, pb: 1 }}>
            <Typography variant="h6" component="div" fontWeight="800">
              Upload Material
            </Typography>
            <IconButton aria-label="close" onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ px: 3, pb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the type of material you want to upload. Our AI will analyze and generate a summary for you.
            </Typography>

            {/* Input Judul Manual */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5, display: 'block', color: 'text.primary' }}>
                Custom Title (Optional)
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Chapter 1 Summary"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            {/* Tabs */}
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                aria-label="upload tabs"
                variant="fullWidth"
                sx={{
                  bgcolor: 'action.hover',
                  borderRadius: 3,
                  minHeight: 48,
                  p: 0.5,
                  '& .MuiTab-root': {
                    borderRadius: 2.5,
                    minHeight: 40,
                    textTransform: 'none',
                    fontWeight: 600,
                    zIndex: 1,
                    transition: '0.2s'
                  },
                  '& .Mui-selected': {
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    color: 'primary.main'
                  },
                  '& .MuiTabs-indicator': { display: 'none' }
                }}
              >
                <Tab label="PDF File" icon={<CloudUploadOutlinedIcon fontSize="small" />} iconPosition="start" />
                <Tab label="YouTube" icon={<InsertLinkIcon fontSize="small" />} iconPosition="start" />
                <Tab label="Text Note" icon={<NotesIcon fontSize="small" />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Panel PDF */}
            <Box role="tabpanel" hidden={tabValue !== 0}>
              {tabValue === 0 && (
                !file ? (
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: '2px dashed',
                      borderColor: isDragActive ? 'primary.main' : 'divider',
                      borderRadius: 3,
                      p: 5,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                      transition: '0.2s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                    }}
                  >
                    <input {...getInputProps()} />
                    <Box sx={{
                      width: 60, height: 60, borderRadius: '50%', bgcolor: 'primary.lighter',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2
                    }}>
                      <CloudUploadOutlinedIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="body1" fontWeight="600" gutterBottom>Click or drag PDF here</Typography>
                    <Typography variant="caption" color="text.secondary">Supported formats: .pdf (Max 10MB)</Typography>
                  </Box>
                ) : (
                  <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'error.lighter', color: 'error.main' }}>
                        <CloudUploadOutlinedIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" noWrap sx={{ maxWidth: 200 }}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={() => setFile(null)} color="error">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                )
              )}
            </Box>

            {/* Panel YouTube */}
            <Box role="tabpanel" hidden={tabValue !== 1}>
              {tabValue === 1 && (
                <TextField
                  fullWidth
                  label="YouTube URL"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              )}
            </Box>

            {/* Panel Text */}
            <Box role="tabpanel" hidden={tabValue !== 2}>
              {tabValue === 2 && (
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Paste Text Content"
                  placeholder="Copy and paste your study notes here..."
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={handleCloseDialog} color="inherit" sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isGenerateDisabled}
              disableElevation
              sx={{
                textTransform: 'none',
                color: 'white',
                px: 4,
                py: 1,
                borderRadius: 2,
                fontWeight: 'bold',
                boxShadow: 4
              }}
            >
              Generate Summary
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default FileUploadDialog;