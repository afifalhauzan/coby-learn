import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, Logout, Person3Outlined } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import logo from '../../assets/logo.png';
import { logoutUser } from '../../services/apiAuthService';
import { getDailyQuizStatus } from '../../services/apiLibraryService';

// Daftar menu agar mudah diedit di satu tempat
const MENU_ITEMS = [
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'My Library', path: '/library' },
  { text: 'My Tasks', path: '/tasks' },
  { text: 'Progress', path: '/progress' },
];

function Navbar(): React.JSX.Element {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Breakpoints: MD (Tablet/PC Kecil) ke bawah dianggap Mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: dailyStatus } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const toggleDrawer = (value: boolean) => () => setOpen(value);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/sign-in');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky" // Ganti ke sticky agar navbar tetap terlihat saat scroll
        elevation={0}
        sx={{
          backgroundColor: 'rgba(30, 41, 59, 0.85)', // #1E293B dengan transparansi
          backdropFilter: 'blur(12px)', // Efek kaca buram modern
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          color: '#F1F5F9',
          top: 0,
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: { xs: 64, md: 72 }, justifyContent: 'space-between' }}>

            {/* LEFT GROUP: LOGO */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }}
              onClick={() => navigate('/dashboard')}
            >
              {/* Logo Image Responsive */}
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: isMobile ? '50px' : '90px', // Kecil di HP, Besar di PC
                  transition: '0.3s'
                }}
              />

              {/* Judul Aplikasi (Hilang di layar sangat kecil agar tidak sempit) */}
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: '#F1F5F9',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  display: { xs: 'none', sm: 'block' } // Hidden on Extra Small screens
                }}
              >
                CobyLearnAi
              </Typography>
            </Box>

            {/* CENTER GROUP: DESKTOP MENU */}
            {!isMobile && (
              <Stack direction="row" spacing={1}>
                {MENU_ITEMS.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => navigate(item.path)}
                    sx={{
                      fontWeight: isActive(item.path) ? 700 : 500,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      color: isActive(item.path) ? '#F97316' : '#CBD5E1',
                      position: 'relative',
                      px: 2,
                      '&:hover': {
                        color: '#F97316',
                        bgcolor: 'rgba(255,255,255,0.03)'
                      },
                      // Garis bawah kecil untuk menu aktif
                      '&::after': isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 6,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '2px',
                        bgcolor: '#F97316',
                        borderRadius: '2px'
                      } : {}
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Stack>
            )}

            {/* RIGHT GROUP: ACTIONS */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>



              {/* Avatar with Menu */}
              <IconButton sx={{ p: 0 }} onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                  alt="User"
                  sx={{
                    width: { xs: 32, md: 40 }, // Responsive size
                    height: { xs: 32, md: 40 },
                    border: '2px solid #FACC15',
                    boxShadow: '0 0 0 2px rgba(250, 204, 21, 0.25)',
                    bgcolor: 'primary.main',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}
                >
                  {dailyStatus?.username?.charAt(0).toUpperCase() || 'S'}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    bgcolor: '#0F172A',
                    color: '#F1F5F9',
                    border: '1px solid rgba(255,255,255,0.1)',
                    minWidth: 150
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }} sx={{ fontWeight: 600 }}>
                  <Person3Outlined fontSize="small" sx={{ mr: 1 }} />
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#EF4444', fontWeight: 600 }}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Log Out
                </MenuItem>
              </Menu>

              {/* Mobile Menu Toggle */}
              {isMobile && (
                <IconButton onClick={toggleDrawer(true)} edge="end" sx={{ ml: 0.5 }}>
                  <MenuIcon sx={{ color: '#F1F5F9', fontSize: 28 }} />
                </IconButton>
              )}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#0F172A',
            color: '#F1F5F9',
            width: 280,
            borderLeft: '1px solid rgba(255,255,255,0.1)'
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Drawer Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <img src={logo} alt="logo" style={{ width: '40px' }} />
            <Typography variant="h6" fontWeight="bold">Menu</Typography>
          </Box>

          {/* Menu List */}
          <List sx={{ flexGrow: 1 }}>
            {MENU_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: active ? 'rgba(249,115,22,0.15)' : 'transparent',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: active ? 700 : 500,
                        color: active ? '#F97316' : '#E2E8F0',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Drawer Footer (Optional: Logout) */}
          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button fullWidth variant="outlined" color="error" size="small">
              Log Out
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;