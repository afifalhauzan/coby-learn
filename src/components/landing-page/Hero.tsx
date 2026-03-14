import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { COLORS } from './landingPage.constants';

interface HeroProps {
  isLoggedIn: boolean;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

function Hero({ isLoggedIn, onPrimaryClick, onSecondaryClick }: HeroProps): React.JSX.Element {
  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 20, md: 30 },
        pb: { xs: 12, md: 24 },
        textAlign: 'center',
        overflow: 'hidden',
        backgroundImage: 'url(/learn.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(17, 45, 93, 0.75)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.2)', mb: 3 }}>
          <Typography variant="caption" fontWeight="bold" sx={{ color: '#E2E8F0', letterSpacing: '1px' }}>
            AI POWERED LEARNING ASSISTANT
          </Typography>
        </Box>

        <Typography variant="h1" fontWeight="900" sx={{ fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1.1, mb: 3, color: '#FFFFFF' }}>
          Learn Smarter,<br /> Not Harder.
        </Typography>

        <Typography variant="h5" sx={{ color: '#E2E8F0', maxWidth: '700px', mx: 'auto', mb: 5, lineHeight: 1.6 }}>
          Upload your study materials and let our AI create quizzes, flashcards, and summaries instantly. Track your progress and master any subject.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={onPrimaryClick}
            sx={{
              bgcolor: COLORS.primary,
              fontSize: '1.1rem',
              px: 5,
              py: 1.8,
              borderRadius: '8px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: 6,
              '&:hover': { bgcolor: '#2563EB', transform: 'translateY(-2px)', transition: '0.2s' },
            }}
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Start for Free'}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={onSecondaryClick}
            sx={{
              color: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1.1rem',
              px: 5,
              py: 1.8,
              borderRadius: '8px',
              bgcolor: 'rgba(255,255,255,0.05)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#FFFFFF' },
            }}
          >
            View Features
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default Hero;
