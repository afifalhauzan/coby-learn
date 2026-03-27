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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const exportRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const previewScale = 0.2;
  const previewWidth = 1080 * previewScale;
  const previewHeight = 1920 * previewScale;

  const filename = useMemo(() => {
    const safeName = (username || t('streak:share.defaultUsernameSlug', { defaultValue: 'learner' })).replace(/\s+/g, '-').toLowerCase();
    return `streak-${safeName}-${streak}.png`;
  }, [username, streak, t]);

  const generateShareBlob = async () => {
    if (!exportRef.current) {
      throw new Error(t('streak:share.errors.cardNotReady', { defaultValue: 'Share card is not ready yet.' }));
    }

    const moduleUrl = 'https://cdn.skypack.dev/html-to-image';
    const htmlToImage = await import(/* @vite-ignore */ moduleUrl);

    const blob = await htmlToImage.toBlob(exportRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#EBFAFF',
    });

    if (!blob) {
      throw new Error(t('streak:share.errors.imageGenerateFailed', { defaultValue: 'Unable to generate share image.' }));
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
          title: t('streak:share.nativeShare.title', { defaultValue: 'My CobyLearnAI Streak' }),
          text: t('streak:share.nativeShare.text', { streak, defaultValue: 'I just reached a {{streak}}-day streak on CobyLearnAI!' }),
          files: [file],
        });
      } else {
        downloadBlob(blob);
      }

      onShared?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('streak:share.errors.shareFailed', { defaultValue: 'Failed to share streak card.' });
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
      const message = error instanceof Error ? error.message : t('streak:share.errors.downloadFailed', { defaultValue: 'Failed to download streak card.' });
      setShareError(message);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { borderRadius: 1 }, p: 0 }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{t('streak:share.dialog.title', { defaultValue: 'Share Your Streak' })}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('streak:share.dialog.subtitle', { defaultValue: 'Post your latest milestone and keep the streak alive.' })}
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
            {t('common:actions.close', { defaultValue: 'Close' })}
          </Button>
          <Button
            variant="outlined"
            onClick={downloadCard}
            disabled={isSharing}
            startIcon={<DownloadIcon />}
            sx={{ textTransform: 'none' }}
          >
            {t('common:actions.download', { defaultValue: 'Download' })}
          </Button>
          <Button
            variant="contained"
            onClick={shareCard}
            disabled={isSharing}
            startIcon={<ShareIcon />}
            sx={{ textTransform: 'none', color: 'white' }}
          >
            {isSharing
              ? t('common:states.preparing', { defaultValue: 'Preparing...' })
              : t('streak:share.dialog.actions.shareToSocials', { defaultValue: 'Share to Socials' })}
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
