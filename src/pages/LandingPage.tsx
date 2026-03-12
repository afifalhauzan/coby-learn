import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stack,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,

} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthMiddleware';

// Icons
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import QuizIcon from '@mui/icons-material/Quiz';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';

// Assets
import logo from '../assets/logo.png';

// --- THEME CONSTANTS (Light Mode Compatible) ---
const COLORS = {
  bgLight: '#F8FAFC',    // Light background
  bgCard: '#FFFFFF',     // Card background
  primary: '#3B82F6',    // Blue 500
  primaryGlow: 'rgba(59, 130, 246, 0.3)',
  accent: '#F97316',     // Orange 500 (secondary in theme)
  accentGlow: 'rgba(249, 115, 22, 0.3)',
  textMain: '#1E293B',   // Dark text for light mode
  textMuted: '#64748B',  // Muted text
  border: 'rgba(15, 23, 42, 0.1)', // Light borders
};

function LandingPage(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLoggedIn = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Scroll Handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  return (
    <Box sx={{
      bgcolor: 'background.default',
      minHeight: '100vh',
      color: 'text.primary',
      fontFamily: '"Inter", sans-serif',
      overflowX: 'hidden'
    }}>

      {/* ================= NAVBAR ================= */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(248, 250, 252, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? `1px solid ${COLORS.border}` : 'none',
          transition: 'all 0.3s ease',
          py: 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
            >
              <img src={logo} alt="CobyLearnAi" style={{ height: '40px' }} />
              <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.5px' }}>
                CobyLearn<Box component="span" sx={{ color: COLORS.accent }}>Ai</Box>
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack direction="row" spacing={4} alignItems="center">
                {['Features', 'How it Works', 'FAQ'].map((item) => (
                  <Button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))}
                    sx={{ color: COLORS.textMuted, '&:hover': { color: COLORS.textMain }, textTransform: 'none', fontSize: '1rem' }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            )}

            {/* Auth Buttons */}
            <Stack direction="row" spacing={2} alignItems="center">
              {!isMobile && (
                <>
                  {isLoggedIn ? (
                    <Button
                      variant="contained"
                      onClick={() => navigate('/dashboard')}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: COLORS.primary,
                        borderRadius: 2, // 2 * 8px = 16px
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        color: 'white',
                        boxShadow: 4,
                        '&:hover': { bgcolor: '#2563EB' }
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => navigate('/sign-in')}
                        sx={{ color: COLORS.textMain, textTransform: 'none', fontWeight: 'bold' }}
                      >
                        Log In
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/sign-up')}
                        sx={{
                          bgcolor: COLORS.accent,
                          color: 'white',
                          borderRadius: '12px',
                          px: 3,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          '&:hover': { bgcolor: 'primary.dark' }
                        }}
                      >
                        Sign Up Free
                      </Button>
                    </>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: COLORS.textMain }}>
                  <MenuIcon fontSize="large" />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { bgcolor: 'background.paper', color: 'text.primary', width: '100%', maxWidth: 300 } }}
      >
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 2 }}>
          {['Features', 'How it Works', 'FAQ'].map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))} sx={{ borderRadius: 2, mb: 1 }}>
                <ListItemText primary={item} primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.2rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
          { /* Mobile Auth Buttons in Menu */}
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isLoggedIn ? (
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{ bgcolor: COLORS.primary, py: 1.5 }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/sign-in')}
                  sx={{ borderColor: COLORS.border, color: 'text.primary', py: 1.5 }}
                >
                  Log In
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/sign-up')}
                  sx={{ bgcolor: COLORS.accent, py: 1.5 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </List>
      </Drawer>

      {/* ================= HERO SECTION ================= */}
      <Box sx={{
        position: 'relative',
        pt: { xs: 16, md: 24 },
        pb: { xs: 8, md: 16 },
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Gradients */}
        <Box sx={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '800px', borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.primary}20 0%, transparent 70%)`,
          filter: 'blur(80px)', zIndex: 0
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', border: `1px solid ${COLORS.primary}40`, mb: 3 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ color: COLORS.primary, letterSpacing: '1px' }}>
              ✨ AI POWERED LEARNING ASSISTANT
            </Typography>
          </Box>

          <Typography variant="h1" fontWeight="900" sx={{
            fontSize: { xs: '3rem', md: '5rem' },
            lineHeight: 1.1,
            mb: 3,
            background: `linear-gradient(to bottom right, #FFFFFF 30%, ${COLORS.textMuted})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Learn Smarter,<br /> Not Harder.
          </Typography>

          <Typography variant="h5" sx={{ color: COLORS.textMuted, maxWidth: '700px', mx: 'auto', mb: 5, lineHeight: 1.6 }}>
            Upload your study materials and let our AI create quizzes, flashcards, and summaries instantly. Track your progress and master any subject.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 8 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => isLoggedIn ? navigate('/dashboard') : navigate('/sign-up')}
              sx={{
                bgcolor: COLORS.accent,
                fontSize: '1.1rem',
                px: 5, py: 1.8,
                borderRadius: '16px',
                fontWeight: 'bold',
                color: 'white',
                boxShadow: 6,
                '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)', transition: '0.2s' }
              }}
            >
              Start for Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => scrollToSection('features')}
              sx={{
                color: COLORS.textMain,
                borderColor: COLORS.border,
                fontSize: '1.1rem',
                px: 5, py: 1.8,
                borderRadius: '16px',
                bgcolor: 'rgba(255,255,255,0.03)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: COLORS.textMain }
              }}
            >
              View Features
            </Button>
          </Stack>

          {/* Hero Image Mockup */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: '24px',
              border: `1px solid ${COLORS.border}`,
              background: `rgba(255, 255, 255, 0.8)`,
              backdropFilter: 'blur(20px)',
              p: 1.5,
              mx: 'auto',
              maxWidth: '1100px',
              boxShadow: 20
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop"
              alt="Dashboard Preview"
              sx={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px', opacity: 0.9 }}
            />
          </Box>
        </Container>
      </Box>

      {/* ================= FEATURES SECTION ================= */}
      <Box id="features" sx={{ py: 12, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>Why CobyLearnAi?</Typography>
            <Typography variant="h6" sx={{ color: COLORS.textMuted }}>Everything you need to ace your exams in one platform.</Typography>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4
          }}>
            {[
              {
                icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: COLORS.primary }} />,
                title: "AI Summarization",
                desc: "Turn long PDFs or texts into concise, easy-to-understand summaries in seconds."
              },
              {
                icon: <QuizIcon sx={{ fontSize: 40, color: '#A855F7' }} />,
                title: "Smart Quizzes",
                desc: "Test your knowledge with AI-generated quizzes tailored to your material."
              },
              {
                icon: <TimelineIcon sx={{ fontSize: 40, color: COLORS.accent }} />,
                title: "Track Progress",
                desc: "Visualize your learning journey with streaks, heatmaps, and performance stats."
              },
              {
                icon: <SchoolIcon sx={{ fontSize: 40, color: '#10B981' }} />,
                title: "Flashcards",
                desc: "Memorize key concepts faster with automatically generated flashcards."
              },
              {
                icon: <CloudUploadIcon sx={{ fontSize: 40, color: '#EC4899' }} />,
                title: "File Support",
                desc: "Support for PDF, Text, and even Youtube Video links (coming soon)."
              },
              {
                icon: <StarIcon sx={{ fontSize: 40, color: '#EAB308' }} />,
                title: "Gamified Learning",
                desc: "Earn XP and keep your streak alive to stay motivated every single day."
              }
            ].map((feature, idx) => (
              <Box key={idx}>
                <Paper sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 2, // 2 * 8px = 16px
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-10px)', borderColor: COLORS.primary }
                }}>
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1.5 }}>{feature.title}</Typography>
                  <Typography variant="body1" sx={{ color: COLORS.textMuted, lineHeight: 1.7 }}>{feature.desc}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ================= HOW IT WORKS ================= */}
      <Box id="how-it-works" sx={{ py: 12, bgcolor: COLORS.bgCard, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 8 }}>How It Works</Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
            {/* Steps */}
            <Stack spacing={4} sx={{ flex: 1 }}>
              {[
                { step: '01', title: 'Upload Material', desc: 'Upload your PDF notes, paste text, or provide a link.' },
                { step: '02', title: 'AI Processing', desc: 'Our AI analyzes the content and extracts key concepts.' },
                { step: '03', title: 'Start Learning', desc: 'Take quizzes or review summaries to master the topic.' }
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 3 }}>
                  <Typography variant="h2" fontWeight="900" sx={{ color: 'rgba(255,255,255,0.05)' }}>{item.step}</Typography>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, color: idx === 1 ? COLORS.primary : 'inherit' }}>{item.title}</Typography>
                    <Typography sx={{ color: COLORS.textMuted }}>{item.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            {/* Illustration Placeholder */}
            <Box sx={{ flex: 1, height: '400px', bgcolor: 'background.default', borderRadius: '32px', border: `1px solid ${COLORS.border}`, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AutoAwesomeIcon sx={{ fontSize: 100, color: COLORS.primary, opacity: 0.2 }} />
                <Typography variant="h6" sx={{ position: 'absolute', bottom: 40, color: COLORS.textMuted }}>AI Processing Engine</Typography>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* ================= FAQ SECTION ================= */}
      <Box id="faq" sx={{ py: 12, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 6 }}>Frequently Asked Questions</Typography>

          {[
            { q: "Is CobyLearnAi free to use?", a: "Yes! You can get started for free. We also plan to offer premium features for power users in the future." },
            { q: "Can I upload handwritten notes?", a: "Currently we support text-based PDFs and raw text. Handwriting recognition is in our roadmap!" },
            { q: "How accurate is the AI?", a: "We use advanced LLMs to ensure high accuracy, but we always recommend reviewing the summaries against your original notes." }
          ].map((faq, idx) => (
            <Accordion key={idx} sx={{ bgcolor: 'background.paper', color: 'text.primary', mb: 2, border: `1px solid ${COLORS.border}`, '&:before': { display: 'none' }, borderRadius: '12px !important' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: COLORS.textMuted }} />}>
                <Typography fontWeight="bold" fontSize="1.1rem">{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color={COLORS.textMuted}>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ================= CTA FINAL ================= */}
      <Box sx={{ py: 12, px: 2 }}>
        <Container maxWidth="lg">
          <Paper sx={{
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            bgcolor: COLORS.primary,
            borderRadius: '40px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decor */}
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
              onClick={() => navigate('/sign-up')}
              sx={{
                bgcolor: 'white',
                color: COLORS.primary,
                px: 6, py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                borderRadius: '20px',
                '&:hover': { bgcolor: '#F1F5F9' }
              }}
            >
              Get Started Now
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* ================= FOOTER ================= */}
      <Box sx={{ py: 8, borderTop: `1px solid ${COLORS.border}`, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
            <Box sx={{ mb: { xs: 4, md: 0 } }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>CobyLearnAi</Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>Empowering students with AI.</Typography>
            </Box>

            <Stack direction="row" spacing={4}>
              {['About', 'Privacy', 'Terms', 'Contact'].map(link => (
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

    </Box>
  );
}

export default LandingPage;