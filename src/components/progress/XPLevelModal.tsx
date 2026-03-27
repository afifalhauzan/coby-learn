import React from 'react';
import {
  Modal,
  Paper,
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DiamondIcon from '@mui/icons-material/Diamond';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { XPMilestone } from '../../stores/useXPStore';
import { useTranslation } from 'react-i18next';

interface XPLevelModalProps {
  open: boolean;
  onClose: () => void;
  totalXP: number;
  currentLevel: XPMilestone;
  milestones: XPMilestone[];
  seasonMonthLabel: string;
  daysRemainingInSeason: number;
}

const iconByLevel: Record<number, React.JSX.Element> = {
  1: <AutoAwesomeIcon fontSize="small" />,
  2: <DiamondIcon fontSize="small" />,
  3: <SchoolIcon fontSize="small" />,
  4: <WorkspacePremiumIcon fontSize="small" />,
  5: <EmojiEventsIcon fontSize="small" />,
};

function XPLevelModal({
  open,
  onClose,
  totalXP,
  currentLevel,
  milestones,
  seasonMonthLabel,
  daysRemainingInSeason,
}: XPLevelModalProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="xp-level-modal-title"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 460,
          maxHeight: '80vh',
          borderRadius: '24px',
          position: 'relative',
          p: 3,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 10, top: 10 }}
          aria-label={t('progress:xpModal.aria.closeXpLevels')}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="xp-level-modal-title" variant="h6" fontWeight={700}>
          {t('progress:xpModal.labels.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {t('progress:xpModal.labels.totalXp', { xp: totalXP })}
        </Typography>

        <Box
          sx={{
            mt: 1.5,
            p: 1.25,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            bgcolor: 'rgba(25, 118, 210, 0.08)',
            border: '1px solid',
            borderColor: 'rgba(25, 118, 210, 0.22)',
          }}
        >
          <InfoOutlinedIcon sx={{ mt: 0.1, fontSize: 18, color: 'primary.main' }} />
          <Box>
            <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 600, display: 'block' }}>
              {t('progress:xpModal.messages.monthlyResetInfo')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              {t('progress:messages.daysLeftInSeason', {
                days: daysRemainingInSeason,
                month: seasonMonthLabel,
              })}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.25} sx={{ overflowY: 'auto', pr: 0.5 }}>
          {milestones.map((milestone) => {
            const isUnlocked = totalXP >= milestone.xp;
            const isCurrent = currentLevel.level === milestone.level;

            return (
              <Box
                key={milestone.level}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: isCurrent ? 'primary.main' : 'divider',
                  bgcolor: isUnlocked ? 'rgba(25, 118, 210, 0.06)' : 'action.hover',
                  boxShadow: isCurrent ? '0 0 0 2px rgba(25, 118, 210, 0.2), 0 0 22px rgba(25, 118, 210, 0.18)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isUnlocked ? 'primary.main' : 'action.disabledBackground',
                    color: isUnlocked ? 'primary.contrastText' : 'text.secondary',
                  }}
                >
                  {iconByLevel[milestone.level] || <AutoAwesomeIcon fontSize="small" />}
                </Box>

                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {t('progress:xpModal.labels.levelName', {
                      level: milestone.level,
                      name: milestone.name,
                    })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('progress:xpModal.labels.requiresXp', { xp: milestone.xp })}
                  </Typography>
                </Box>

                <Chip
                  icon={isUnlocked ? undefined : <LockIcon sx={{ fontSize: '0.85rem !important' }} />}
                  label={
                    isUnlocked
                      ? (isCurrent ? t('progress:xpModal.states.current') : t('progress:xpModal.states.unlocked'))
                      : t('progress:xpModal.states.locked')
                  }
                  size="small"
                  color={isUnlocked ? 'primary' : 'default'}
                  variant={isCurrent ? 'filled' : 'outlined'}
                />
              </Box>
            );
          })}
        </Stack>

        <Button onClick={onClose} fullWidth variant="contained" sx={{ mt: 2, fontWeight: 700 }}>
          {t('progress:actions.close')}
        </Button>
      </Paper>
    </Modal>
  );
}

export default XPLevelModal;
