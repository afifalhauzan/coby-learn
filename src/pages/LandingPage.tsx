import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthMiddleware';
import LandingNavbar from '../components/landing-page/LandingNavbar';
import Hero from '../components/landing-page/Hero';
import FeaturesSection from '../components/landing-page/FeaturesSection';
import HowItWorksSection from '../components/landing-page/HowItWorksSection';
import FaqSection from '../components/landing-page/FaqSection';
import FinalCtaSection from '../components/landing-page/FinalCtaSection';
import LandingFooter from '../components/landing-page/LandingFooter';

function LandingPage(): React.JSX.Element {
  const navigate = useNavigate();
  const isLoggedIn = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        color: 'text.primary',
        fontFamily: '"Inter", sans-serif',
        overflowX: 'hidden',
      }}
    >
      <LandingNavbar
        isLoggedIn={isLoggedIn}
        onNavigateDashboard={() => navigate('/dashboard')}
        onNavigateLogin={() => navigate('/sign-in')}
        onNavigateSignup={() => navigate('/sign-up')}
        onScrollToSection={scrollToSection}
      />
      <Hero
        isLoggedIn={isLoggedIn}
        onPrimaryClick={() => navigate(isLoggedIn ? '/dashboard' : '/sign-up')}
        onSecondaryClick={() => scrollToSection('features')}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <FinalCtaSection onClick={() => navigate('/sign-up')} />
      <LandingFooter />
    </Box>
  );
}

export default LandingPage;