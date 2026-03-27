import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { COLORS } from './landingPage.constants';
import { useTranslation } from 'react-i18next';

interface FinalCtaSectionProps {
  onClick: () => void;
}

function FinalCtaSection({ onClick }: FinalCtaSectionProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 12, pt:4,  px: 2, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: { xs: 4, md: 8 }, textAlign: 'center', bgcolor: COLORS.primary, borderRadius: '40px', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', bottom: 0, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}
          />
        
          <Typography variant="h3" fontWeight="500" sx={{  color: 'white', mb: 2, position: 'relative', zIndex: 1 }}>
            {t('landing:finalCta.title')}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 5, fontSize: '1.2rem', position: 'relative', zIndex: 1 }}>
            {t('landing:finalCta.subtitle')}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onClick}
            sx={{ bgcolor: 'white', color: COLORS.primary, px: 6, py: 2, boxShadow:'0 1px 20px rgba(255, 245, 245, 0.3)', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '20px', '&:hover': { bgcolor: '#f0f4f8' } }}
          >
            {t('landing:finalCta.cta')}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default FinalCtaSection;
