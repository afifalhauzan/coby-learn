import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { COLORS } from './landingPage.constants';
import { useTranslation } from 'react-i18next';

function FaqSection(): React.JSX.Element {
  const { t } = useTranslation();
  const faqItems = [
    {
      q: t('landing:faq.items.question1'),
      a: t('landing:faq.items.answer1'),
    },
    {
      q: t('landing:faq.items.question2'),
      a: t('landing:faq.items.answer2'),
    },
    {
      q: t('landing:faq.items.question3'),
      a: t('landing:faq.items.answer3'),
    },
  ];

  return (
    <Box id="faq" sx={{ py: 12, bgcolor: 'background.paper' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight="600" textAlign="center" sx={{ mb: 5, color: 'secondary.dark' }}>
          {t('landing:faq.title')}
        </Typography>

        {faqItems.map((faq) => (
          <Accordion key={faq.q} sx={{ bgcolor: 'background.paper', color: 'secondary.dark', mb: 2, border: `1px solid ${COLORS.border}`, '&:before': { display: 'none' }, borderRadius: '12px !important', p: 1.5}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: COLORS.textMuted }} />}>
              <Typography fontWeight="500" fontSize="1.1rem">{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color={COLORS.textMuted}>{faq.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}

export default FaqSection;
