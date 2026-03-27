import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import QuizIcon from '@mui/icons-material/Quiz';
import TimelineIcon from '@mui/icons-material/Timeline';
import StarIcon from '@mui/icons-material/Star';
import { COLORS } from './landingPage.constants';
import { useTranslation } from 'react-i18next';

function FeaturesSection(): React.JSX.Element {
  const { t } = useTranslation();

  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: COLORS.primary }} />,
      title: t('landing:features.items.aiSummarization.title'),
      desc: t('landing:features.items.aiSummarization.description'),
    },
    {
      icon: <QuizIcon sx={{ fontSize: 40, color: '#A855F7' }} />,
      title: t('landing:features.items.smartQuizzes.title'),
      desc: t('landing:features.items.smartQuizzes.description'),
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40, color: COLORS.accent }} />,
      title: t('landing:features.items.trackProgress.title'),
      desc: t('landing:features.items.trackProgress.description'),
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#10B981' }} />,
      title: t('landing:features.items.flashcards.title'),
      desc: t('landing:features.items.flashcards.description'),
    },
    {
      icon: <CloudUploadIcon sx={{ fontSize: 40, color: '#EC4899' }} />,
      title: t('landing:features.items.fileSupport.title'),
      desc: t('landing:features.items.fileSupport.description'),
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: '#EAB308' }} />,
      title: t('landing:features.items.gamifiedLearning.title'),
      desc: t('landing:features.items.gamifiedLearning.description'),
    },
  ];

  return (
    <Box id="features" sx={{ py: 12, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="600" sx={{ mb: 2, color: 'secondary.dark'}}>{t('landing:features.title')}</Typography>
          <Typography variant="h6" sx={{ color: COLORS.textMuted }}>{t('landing:features.subtitle')}</Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {features.map((feature) => (
            <Box key={feature.title}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  bgcolor: COLORS.bgCard,
                  textColor: 'secondary.dark',
                  border: `1px solid ${COLORS.border}`,
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-10px)', borderColor: COLORS.primary },
                }}
              >
                <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                <Typography variant="h5" fontWeight="500" sx={{ mb: 1.5, color: 'secondary.dark' }}>{feature.title}</Typography>
                <Typography variant="body1" sx={{ color: COLORS.textMuted, lineHeight: 1.7 }}>{feature.desc}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default FeaturesSection;
