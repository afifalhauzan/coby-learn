import React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { COLORS } from './landingPage.constants';
import logo from '../../assets/logo_1.svg';
import { useTranslation } from 'react-i18next';

function LandingFooter(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 4, borderTop: `1px solid ${COLORS.border}`, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
          <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 2, cursor: 'pointer' }}
            >
              <img src={logo} alt={t('landing:footer.logoAlt')} style={{ height: '40px' }} />
              <Box>
                <Typography
                    variant="h6"
                    fontWeight="700"
                    sx={{ letterSpacing: '-0.5px', color: COLORS.textMain }}
                >
                    CobyLearn<Box component="span" sx={{ color: COLORS.accent }}>Ai</Box>
                </Typography>
                <Typography
                    variant="subtitle2"
                    sx={{ color: COLORS.textMuted }}
                >
                    {t('landing:footer.tagline')}
                </Typography>
              </Box>
            </Box>

          <Stack direction="row" spacing={4}>
            {['about', 'privacy', 'terms', 'contact'].map((linkKey) => (
              <Typography key={linkKey} sx={{ color: COLORS.textMuted, cursor: 'pointer', '&:hover': { color: COLORS.textMain } }}>
                {t(`landing:footer.links.${linkKey}`)}
              </Typography>
            ))}
          </Stack>
        </Stack>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 8, color: '#334155' }}>
          {t('landing:footer.copyright', { year: new Date().getFullYear() })}
        </Typography>
      </Container>
    </Box>
  );
}

export default LandingFooter;
