import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import QuizIcon from '@mui/icons-material/Quiz';
import TimelineIcon from '@mui/icons-material/Timeline';
import StarIcon from '@mui/icons-material/Star';
import { COLORS } from './landingPage.constants';

const FEATURES = [
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: COLORS.primary }} />,
    title: 'AI Summarization',
    desc: 'Turn long PDFs or texts into concise, easy-to-understand summaries in seconds.',
  },
  {
    icon: <QuizIcon sx={{ fontSize: 40, color: '#A855F7' }} />,
    title: 'Smart Quizzes',
    desc: 'Test your knowledge with AI-generated quizzes tailored to your material.',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 40, color: COLORS.accent }} />,
    title: 'Track Progress',
    desc: 'Visualize your learning journey with streaks, heatmaps, and performance stats.',
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40, color: '#10B981' }} />,
    title: 'Flashcards',
    desc: 'Memorize key concepts faster with automatically generated flashcards.',
  },
  {
    icon: <CloudUploadIcon sx={{ fontSize: 40, color: '#EC4899' }} />,
    title: 'File Support',
    desc: 'Support for PDF, Text, and even Youtube Video links (coming soon).',
  },
  {
    icon: <StarIcon sx={{ fontSize: 40, color: '#EAB308' }} />,
    title: 'Gamified Learning',
    desc: 'Earn XP and keep your streak alive to stay motivated every single day.',
  },
];

function FeaturesSection(): React.JSX.Element {
  return (
    <Box id="features" sx={{ py: 12, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>Why CobyLearnAi?</Typography>
          <Typography variant="h6" sx={{ color: COLORS.textMuted }}>Everything you need to ace your exams in one platform.</Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {FEATURES.map((feature) => (
            <Box key={feature.title}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-10px)', borderColor: COLORS.primary },
                }}
              >
                <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1.5 }}>{feature.title}</Typography>
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
