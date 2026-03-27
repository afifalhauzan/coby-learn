import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Paper, IconButton, LinearProgress 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

import type { FlashcardItem } from '../services/apiLibraryService';

function FlashcardPage(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { flashcards } = location.state as { flashcards: FlashcardItem[], title: string } || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Validasi Data
  if (!flashcards || flashcards.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{t('flashcard:errors.noFlashcardsDataFound')}</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>{t('common:actions.goBack')}</Button>
      </Box>
    );
  }

  const totalCards = flashcards.length;
  const currentCard = flashcards[currentIndex];

  // Handlers
  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false); // Reset ke depan
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150); // Delay dikit biar smooth
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', height: '90vh', display: 'flex', flexDirection: 'column', py: 4 }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          {currentIndex + 1} / {totalCards}
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacer */}
      </Box>

      {/* Progress Bar */}
      <LinearProgress 
        variant="determinate" 
        value={((currentIndex + 1) / totalCards) * 100} 
        sx={{ mb: 6, borderRadius: 2, height: 6, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
      />

      {/* FLIP CARD CONTAINER */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          perspective: '1000px', 
          cursor: 'pointer',
          mb: 4
        }}
        onClick={handleFlip}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONT SIDE */}
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              p: 4,
              borderRadius: 2, // 2 * 8px = 16px
              bgcolor: 'primary.main', // Dark Background
              border: '1px solid #334155'
            }}
          >
            <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>{t('flashcard:labels.question')}</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
              {currentCard.front}
            </Typography>
            <Typography variant="h6" sx={{ mt: 4, color: 'white' }}>{t('flashcard:actions.tapToFlip')}</Typography>
          </Paper>

          {/* BACK SIDE */}
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              p: 4,
              borderRadius: 2, // 2 * 8px = 16px
              color: '#1E293B'
            }}
          >
            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2, fontWeight: 'bold' }}>{t('flashcard:labels.answer')}</Typography>
            <Typography variant="h5" fontWeight="medium">
              {currentCard.back}
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center' }}>
        <IconButton 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          sx={{ border: '1px solid', borderColor: 'divider', p: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Button 
          startIcon={<ReplayIcon />} 
          onClick={() => setIsFlipped(!isFlipped)}
          sx={{ textTransform: 'none', color: 'text.secondary' }}
        >
          {t('flashcard:actions.flipCard')}
        </Button>

        <IconButton 
          onClick={handleNext} 
          disabled={currentIndex === totalCards - 1}
          sx={{ bgcolor: 'primary.main', color: 'white', p: 2, '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

    </Box>
  );
}

export default FlashcardPage;