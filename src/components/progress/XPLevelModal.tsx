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
import type { XPMilestone } from '../../stores/useXPStore';

interface XPLevelModalProps {
  open: boolean;
  onClose: () => void;
  totalXP: number;
  currentLevel: XPMilestone;
  milestones: XPMilestone[];
}

const iconByLevel: Record<number, React.JSX.Element> = {
  1: <AutoAwesomeIcon fontSize="small" />,
  2: <DiamondIcon fontSize="small" />,
  3: <SchoolIcon fontSize="small" />,
  4: <WorkspacePremiumIcon fontSize="small" />,
  5: <EmojiEventsIcon fontSize="small" />,
};

function XPLevelModal({ open, onClose, totalXP, currentLevel, milestones }: XPLevelModalProps): React.JSX.Element {
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
          aria-label="Close XP levels"
        >
          <CloseIcon />
        </IconButton>

        <Typography id="xp-level-modal-title" variant="h6" fontWeight={700}>
          XP Levels
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Total XP: {totalXP}
        </Typography>

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
                    Level {milestone.level}: {milestone.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requires {milestone.xp} XP
                  </Typography>
                </Box>

                <Chip
                  icon={isUnlocked ? undefined : <LockIcon sx={{ fontSize: '0.85rem !important' }} />}
                  label={isUnlocked ? (isCurrent ? 'Current' : 'Unlocked') : 'Locked'}
                  size="small"
                  color={isUnlocked ? 'primary' : 'default'}
                  variant={isCurrent ? 'filled' : 'outlined'}
                />
              </Box>
            );
          })}
        </Stack>

        <Button onClick={onClose} fullWidth variant="contained" sx={{ mt: 2, fontWeight: 700 }}>
          Close
        </Button>
      </Paper>
    </Modal>
  );
}

export default XPLevelModal;
