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
        position="sticky" // Sticky to the top, stays visible when scrolling
        elevation={1} // Use shadow elevation 1 from Material Design theme
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          top: 0,
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: { xs: 48, md: 56 }, justifyContent: 'space-between' }}>

            {/* LEFT GROUP: LOGO */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1 }}
              onClick={() => navigate('/dashboard')}
            >
              {/* Logo Image Responsive */}
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: isMobile ? '35px' : '60px', // Kecil di HP, Besar di PC
                  transition: '0.3s'
                }}
              />

              {/* Judul Aplikasi (Hilang di layar sangat kecil agar tidak sempit) */}
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
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
                      color: isActive(item.path) ? 'primary.main' : 'text.disabled',
                      position: 'relative',
                      px: 2,
                      '&:hover': {
                        color: 'secondary.main',
                        bgcolor: 'action.hover'
                      },
                      // Garis bawah kecil untuk menu aktif
                      '&::after': isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 6,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '55px',
                        height: '2px',
                        bgcolor: 'primary.main',
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
                    border: '2px solid',
                    boxShadow: 2,
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
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider',
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
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 600 }}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Log Out
                </MenuItem>
              </Menu>

              {/* Mobile Menu Toggle */}
              {isMobile && (
                <IconButton onClick={toggleDrawer(true)} edge="end" sx={{ ml: 0.5 }}>
                  <MenuIcon sx={{ color: 'text.primary', fontSize: 28 }} />
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
            backgroundColor: 'background.paper',
            color: 'text.primary',
            width: 280,
            borderLeft: '1px solid',
            borderColor: 'divider'
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
                      backgroundColor: active ? 'action.selected' : 'transparent',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: active ? 700 : 500,
                        color: active ? 'primary.main' : 'text.primary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Drawer Footer (Optional: Logout) */}
          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
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