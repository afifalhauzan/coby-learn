import React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { COLORS } from './landingPage.constants';

const STEPS = [
  { step: '01', title: 'Upload Material', desc: 'Upload your PDF notes, paste text, or provide a link.' },
  { step: '02', title: 'AI Processing', desc: 'Our AI analyzes the content and extracts key concepts.' },
  { step: '03', title: 'Start Learning', desc: 'Take quizzes or review summaries to master the topic.' },
];

function HowItWorksSection(): React.JSX.Element {
  return (
    <Box id="how-it-works" sx={{ py: 12, bgcolor: COLORS.bgCard, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 8 }}>How It Works</Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
          <Stack spacing={4} sx={{ flex: 1 }}>
            {STEPS.map((item, idx) => (
              <Box key={item.step} sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="h2" fontWeight="900" sx={{ color: 'rgba(15, 23, 42, 0.1)' }}>{item.step}</Typography>
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, color: idx === 1 ? COLORS.primary : 'inherit' }}>{item.title}</Typography>
                  <Typography sx={{ color: COLORS.textMuted }}>{item.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          <Box sx={{ flex: 1, height: '400px', bgcolor: 'background.default', borderRadius: '32px', border: `1px solid ${COLORS.border}`, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoAwesomeIcon sx={{ fontSize: 100, color: COLORS.primary, opacity: 0.2 }} />
              <Typography variant="h6" sx={{ position: 'absolute', bottom: 40, color: COLORS.textMuted }}>AI Processing Engine</Typography>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default HowItWorksSection;
