import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { COLORS } from './landingPage.constants';

interface FinalCtaSectionProps {
  onClick: () => void;
}

function FinalCtaSection({ onClick }: FinalCtaSectionProps): React.JSX.Element {
  return (
    <Box sx={{ py: 12, px: 2 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: { xs: 4, md: 8 }, textAlign: 'center', bgcolor: COLORS.primary, borderRadius: '40px', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />

          <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 2, position: 'relative', zIndex: 1 }}>
            Ready to Transform Your Grades?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 5, fontSize: '1.2rem', position: 'relative', zIndex: 1 }}>
            Join our community of students and start learning smarter today.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onClick}
            sx={{ bgcolor: 'white', color: COLORS.primary, px: 6, py: 2, fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '20px', '&:hover': { bgcolor: '#F1F5F9' } }}
          >
            Get Started Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default FinalCtaSection;
