import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from '../../assets/logo_1.svg';
import { COLORS, LANDING_NAV_ITEMS } from './landingPage.constants';

interface LandingNavbarProps {
  isLoggedIn: boolean;
  onNavigateDashboard: () => void;
  onNavigateLogin: () => void;
  onNavigateSignup: () => void;
  onScrollToSection: (id: string) => void;
}

function LandingNavbar({
  isLoggedIn,
  onNavigateDashboard,
  onNavigateLogin,
  onNavigateSignup,
  onScrollToSection,
}: LandingNavbarProps): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionClick = (id: string) => {
    onScrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(248, 250, 252, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? `1px solid ${COLORS.border}` : 'none',
          transition: 'all 0.3s ease',
          borderRadius: 0,
          py: 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box
              onClick={handleScrollTop}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
            >
              <img src={logo} alt="CobyLearnAi" style={{ height: '40px' }} />
              <Typography
                variant="h5"
                fontWeight="800"
                sx={{ letterSpacing: '-0.5px', color: scrolled ? COLORS.textMain : '#FFFFFF' }}
              >
                CobyLearn<Box component="span" sx={{ color: COLORS.accent }}>Ai</Box>
              </Typography>
            </Box>

            {!isMobile && (
              <Stack direction="row" spacing={4} alignItems="center">
                {LANDING_NAV_ITEMS.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    sx={{
                      color: scrolled ? COLORS.textMuted : '#FFFFFF',
                      '&:hover': {
                        color: scrolled ? COLORS.textMain : '#FFFFFF',
                        opacity: 0.8,
                      },
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            )}

            <Stack direction="row" spacing={2} alignItems="center">
              {!isMobile && (
                <>
                  {isLoggedIn ? (
                    <Button
                      variant="contained"
                      onClick={onNavigateDashboard}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: COLORS.primary,
                        borderRadius: 2,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        color: 'white',
                        boxShadow: 4,
                        '&:hover': { bgcolor: '#2563EB' },
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={onNavigateLogin}
                        sx={{
                          color: scrolled ? COLORS.textMain : '#FFFFFF',
                          borderColor: scrolled ? COLORS.border : 'rgba(255,255,255,0.5)',
                          textTransform: 'none',
                          fontWeight: 'bold',
                          borderRadius: '8px',
                          '&:hover': {
                            borderColor: scrolled ? COLORS.textMain : '#FFFFFF',
                            bgcolor: scrolled ? 'transparent' : 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        variant="contained"
                        onClick={onNavigateSignup}
                        sx={{
                          bgcolor: COLORS.primary,
                          color: 'white',
                          borderRadius: '8px',
                          px: 3,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          boxShadow: 'none',
                          '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' },
                        }}
                      >
                        Sign Up Free
                      </Button>
                    </>
                  )}
                </>
              )}

              {isMobile && (
                <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: scrolled ? COLORS.textMain : '#FFFFFF' }}>
                  <MenuIcon fontSize="large" />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

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
          {LANDING_NAV_ITEMS.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => handleSectionClick(item.id)} sx={{ borderRadius: 2, mb: 1 }}>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.2rem' }} />
              </ListItemButton>
            </ListItem>
          ))}

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isLoggedIn ? (
              <Button fullWidth variant="contained" onClick={onNavigateDashboard} sx={{ bgcolor: COLORS.primary, py: 1.5 }}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button fullWidth variant="outlined" onClick={onNavigateLogin} sx={{ borderColor: COLORS.border, color: 'text.primary', py: 1.5 }}>
                  Log In
                </Button>
                <Button fullWidth variant="contained" onClick={onNavigateSignup} sx={{ bgcolor: COLORS.accent, py: 1.5 }}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </List>
      </Drawer>
    </>
  );
}

export default LandingNavbar;
