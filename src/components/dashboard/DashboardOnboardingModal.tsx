import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTranslation } from 'react-i18next';
import logoImage from '../../assets/logo_1.svg';
// import FireStreakLottie from '../../assets/FireStreak.lottie';
import QuizIcon from '@mui/icons-material/Quiz';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface DashboardOnboardingModalProps {
  open: boolean;
  username?: string;
  onFinish: () => void;
}

const steps = [
  {
    titleKey: 'dashboard:onboarding.title',
    contentKey: 'dashboard:onboarding.step1Description',
    visual: 'image' as const,
  },
  {
    titleKey: 'dashboard:onboarding.step2Title',
    contentKey: 'dashboard:onboarding.step2Description',
    visual: 'lottie' as const,
  },
  {
    titleKey: 'dashboard:onboarding.step3Title',
    contentKey: 'dashboard:onboarding.step3Description',
    visual: 'logo' as const,
  },
  {
    titleKey: 'dashboard:onboarding.step4Title',
    contentKey: 'dashboard:onboarding.step4Description',
    visual: 'bot' as const,
  },
] as const;

function DashboardOnboardingModal({ open, username, onFinish }: DashboardOnboardingModalProps): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
    }
  }, [open]);

  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onFinish();
      return;
    }

    setDirection(1);
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const renderVisual = () => {
    if (currentStepData.visual === 'lottie') {
      return (
        <Box sx={{ width: 180, height: 150 }}>
          <DotLottieReact
            src="/FireStreak.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
      );
    }

    if (currentStepData.visual === 'logo') {
      return (
        <QuizIcon sx={{ fontSize: 85, color: '#A855F7' }} />
      );
    }

    if (currentStepData.visual === 'bot') {
      return (
        <SmartToyIcon sx={{ fontSize: 85, color: 'primary.main' }} />
      );
    }

    return (
      <Box
        component="img"
        src={logoImage}
        alt="Coby Learn Logo preview"
        sx={{ width: '100%', maxWidth: 200, height: 160, objectFit: 'contain' }}
      />
    );
  };

  const visualVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 56 : -56,
      scale: 0.88,
      rotate: dir > 0 ? 2 : -2,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: [1, 1.06, 0.98, 1],
      rotate: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -36 : 36,
      scale: 0.95,
    }),
  };

  return (
    <Dialog
        open={open}
        // 1. Force fullScreen to false so it stays a modal on all devices
        fullScreen={false} 
        maxWidth="sm"
        fullWidth
        PaperProps={{
            sx: {
            p: 1,
            // 2. Add margin and rounded corners for that "card" feel
            m: { xs: 2, sm: 'auto' }, 
            borderRadius: '16px',
            overflow: 'hidden',
            },
        }}
        >
      <Paper elevation={0} sx={{ p: { xs: 1, sm: 2 }, position: 'relative', border: 'none' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1}>
            {steps.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: index === currentStep ? 22 : 8,
                  borderRadius: 10,
                  height: 8,
                  bgcolor: index <= currentStep ? 'primary.main' : 'grey.300',
                  transition: theme.transitions.create(['width', 'background-color'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                }}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button onClick={onFinish} sx={{ textTransform: 'none', fontWeight: 600 }}>
              {t('dashboard:onboarding.skip')}
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={3} alignItems="center" textAlign="center">
          <Box
            sx={{
              width: '100%',
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={visualVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 330, damping: 22 },
                  opacity: { duration: 0.2 },
                  rotate: { type: 'spring', stiffness: 280, damping: 20 },
                  scale: { duration: 0.42, times: [0, 0.45, 0.75, 1], ease: 'easeOut' },
                }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                {renderVisual()}
              </motion.div>
            </AnimatePresence>
          </Box>

          <Stack spacing={1.5} alignItems="center">
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.12em' }}>
              {currentStep === 0 ? t('dashboard:header.greeting', { name: username || 'Student' }) : ''}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: '1.7rem', sm: '2rem' } }}>
              {t(currentStepData.titleKey)}
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: 420 }}>
              {t(currentStepData.contentKey)}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            sx={{ textColor: currentStep === 0 ? 'white' : 'primary.main', textTransform: 'none', fontWeight: 600 }}
          >
            {t('dashboard:onboarding.back')}
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 5,
            }}
          >
            {isLastStep ? t('dashboard:onboarding.startLearning') : t('dashboard:onboarding.next')}
          </Button>
        </Stack>
      </Paper>
    </Dialog>
  );
}

export default DashboardOnboardingModal;