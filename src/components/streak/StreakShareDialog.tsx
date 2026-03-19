import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import StreakShareCard from './StreakShareCard';

interface StreakShareDialogProps {
  open: boolean;
  onClose: () => void;
  username: string;
  streak: number;
  dateLabel?: string;
  onShared?: () => void;
}

function StreakShareDialog({
  open,
  onClose,
  username,
  streak,
  dateLabel,
  onShared,
}: StreakShareDialogProps): React.JSX.Element {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const previewScale = 0.2;
  const previewWidth = 1080 * previewScale;
  const previewHeight = 1920 * previewScale;

  const filename = useMemo(() => {
    const safeName = (username || 'learner').replace(/\s+/g, '-').toLowerCase();
    return `streak-${safeName}-${streak}.png`;
  }, [username, streak]);

  const generateShareBlob = async () => {
    if (!exportRef.current) {
      throw new Error('Share card is not ready yet.');
    }

    const moduleUrl = 'https://cdn.skypack.dev/html-to-image';
    const htmlToImage = await import(/* @vite-ignore */ moduleUrl);

    const blob = await htmlToImage.toBlob(exportRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#EBFAFF',
    });

    if (!blob) {
      throw new Error('Unable to generate share image.');
    }

    return blob;
  };

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const shareCard = async () => {
    if (!exportRef.current || isSharing) {
      return;
    }

    setIsSharing(true);
    setShareError(null);

    try {
      const blob = await generateShareBlob();

      const file = new File([blob], filename, { type: 'image/png' });

      const nav = navigator as Navigator & {
        canShare?: (data: { files?: File[] }) => boolean;
      };

      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({
          title: 'My CobyLearnAI Streak',
          text: `I just reached a ${streak}-day streak on CobyLearnAI!`,
          files: [file],
        });
      } else {
        downloadBlob(blob);
      }

      onShared?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to share streak card.';
      setShareError(message);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadCard = async () => {
    if (!exportRef.current || isSharing) {
      return;
    }

    setIsSharing(true);
    setShareError(null);

    try {
      const blob = await generateShareBlob();
      downloadBlob(blob);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download streak card.';
      setShareError(message);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { borderRadius: 1 }, p: 0 }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Share Your Streak</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Post your latest milestone and keep the streak alive.
          </Typography>

          <Box
            sx={{
              width: previewWidth,
              height: previewHeight,
              mx: 'auto',
              overflow: 'hidden',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: '#ffffff',
            }}
          >
            <Box
              sx={{
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left',
                width: 1080,
                height: 1920,
              }}
            >
              <StreakShareCard username={username} streak={streak} dateLabel={dateLabel} />
            </Box>
          </Box>

          {shareError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {shareError}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>
            Close
          </Button>
          <Button
            variant="outlined"
            onClick={downloadCard}
            disabled={isSharing}
            startIcon={<DownloadIcon />}
            sx={{ textTransform: 'none' }}
          >
            Download
          </Button>
          <Button
            variant="contained"
            onClick={shareCard}
            disabled={isSharing}
            startIcon={<ShareIcon />}
            sx={{ textTransform: 'none', color: 'white' }}
          >
            {isSharing ? 'Preparing...' : 'Share to Socials'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Off-screen high-resolution export target */}
      {open && (
        <Box
          sx={{
            position: 'fixed',
            left: -20000,
            top: -20000,
            width: 1080,
            height: 1920,
            pointerEvents: 'none',
            opacity: 0,
            zIndex: -1,
          }}
        >
          <Box ref={exportRef}>
            <StreakShareCard username={username} streak={streak} dateLabel={dateLabel} />
          </Box>
        </Box>
      )}
    </>
  );
}

export default StreakShareDialog;
