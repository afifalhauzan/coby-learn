import React from 'react';
import { Box, Typography } from '@mui/material';

interface StreakShareCardProps {
  username: string;
  streak: number;
  dateLabel?: string;
}

const getFireLevel = (streak: number): number => {
  if (streak <= 0) {
    return 0;
  }

  if (streak >= 9) {
    return 5;
  }

  if (streak >= 7) {
    return 4;
  }

  if (streak >= 5) {
    return 3;
  }

  if (streak >= 3) {
    return 2;
  }

  return 1;
};

function StreakShareCard({ username, streak, dateLabel }: StreakShareCardProps): React.JSX.Element {
  const fireLevel = getFireLevel(streak);

  return (
    <Box
      sx={{
        width: 1080,
        height: 1920,
        aspectRatio: '9 / 16',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, #E0F2FE 0%, #FFFFFF 100%)',
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          position: 'flex',
          inset: 0,
          background: 'radial-gradient(circle at 50% 46%, rgba(59, 130, 246, 0.18), rgba(255, 255, 255, 0) 48%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ pt: 4, px: 4, position: 'flex', zIndex: 1, alignItems: 'center', justifyItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2.5 }}>
          <Box
            component="img"
            src="/logo_1.svg"
            alt="CobyLearnAI logo"
            sx={{ width: 62, height: 62, objectFit: 'contain' }}
          />
          <Typography sx={{ fontSize: 52, fontWeight: 700, color: '#3B82F6', letterSpacing: 0.2 }}>
            CobyLearnAI
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Typography sx={{ fontSize: 56, color: '#3B82F6', mb: 1.5, fontWeight: 400 }}>
          Congrats!
        </Typography>
        <Typography sx={{ fontSize: 92, color: '#1E3A5F', fontWeight: 800, lineHeight: 1.1 }}>
          Streak Day
          <Box component="span" sx={{ color: '#F97316' }}> - {streak}</Box>
        </Typography>
        <Typography sx={{ mt: 3, fontSize: 58, color: '#3B82F6', fontWeight: 600 }}>
          {username || 'Learner'}
        </Typography>
        {dateLabel && (
          <Typography sx={{ mt: 1, fontSize: 32, color: '#64748B', fontWeight: 500 }}>
            {dateLabel}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          mt: 2,
        }}
      >
        <Box
          component="img"
          src={`/fire${fireLevel}.png`}
          alt={`Streak fire level ${fireLevel}`}
          sx={{
            width: 560,
            height: 560,
            objectFit: 'contain',
            filter: 'drop-shadow(0 26px 42px rgba(249, 115, 22, 0.24))',
          }}
        />
      </Box>

      <Box
        sx={{
          px: 4,
          pb: 4,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 74, fontWeight: 800, color: '#475569', lineHeight: 1 }}>
            Keep it up!
          </Typography>
          <Typography sx={{ mt: 1.25, fontSize: 44, color: '#475569' }}>
            coby-learn.vercel.app
          </Typography>
        </Box>

        <Box
          component="img"
          src="/base.svg"
          alt="Coby mascot"
          sx={{ width: 340, height: 340, objectFit: 'contain' }}
        />
      </Box>
    </Box>
  );
}

export default StreakShareCard;
