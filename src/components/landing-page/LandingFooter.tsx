import React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { COLORS } from './landingPage.constants';

function LandingFooter(): React.JSX.Element {
  return (
    <Box sx={{ py: 8, borderTop: `1px solid ${COLORS.border}`, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
          <Box sx={{ mb: { xs: 4, md: 0 } }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>CobyLearnAi</Typography>
            <Typography variant="body2" sx={{ color: COLORS.textMuted }}>Empowering students with AI.</Typography>
          </Box>

          <Stack direction="row" spacing={4}>
            {['About', 'Privacy', 'Terms', 'Contact'].map((link) => (
              <Typography key={link} sx={{ color: COLORS.textMuted, cursor: 'pointer', '&:hover': { color: COLORS.textMain } }}>
                {link}
              </Typography>
            ))}
          </Stack>
        </Stack>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 8, color: '#334155' }}>
          © {new Date().getFullYear()} CobyLearnAi. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default LandingFooter;
