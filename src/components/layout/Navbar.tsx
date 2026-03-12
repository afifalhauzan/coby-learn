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
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Logout, 
  Person3Outlined, 
  Home, 
  MenuBook, 
  Assignment, 
  TrendingUp 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import logo from '../../assets/logo.png';
import { logoutUser } from '../../services/apiAuthService';
import { getDailyQuizStatus } from '../../services/apiLibraryService';

// Daftar menu agar mudah diedit di satu tempat
const MENU_ITEMS = [
  { text: 'Dashboard', path: '/dashboard', icon: Home },
  { text: 'My Library', path: '/library', icon: MenuBook },
  { text: 'My Tasks', path: '/tasks', icon: Assignment },
  { text: 'Progress', path: '/progress', icon: TrendingUp },
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

            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE BOTTOM NAVIGATION */}
      {isMobile && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            borderTop: '1px solid',
            borderColor: 'divider',
          }} 
          elevation={3}
        >
          <BottomNavigation
            value={location.pathname}
            onChange={(event, newValue) => {
              navigate(newValue);
            }}
            showLabels
            sx={{
              backgroundColor: 'background.paper',
              '& .MuiBottomNavigationAction-root': {
                minWidth: 'auto',
                maxWidth: 'none',
                flex: 1,
                padding: '4px 10px',
                position: 'relative',
                '&.Mui-selected': {
                  color: 'primary.main',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50px',
                    height: '3px',
                    backgroundColor: 'primary.main',
                    borderRadius: '0 0 2px 2px',
                    boxShadow: '0 2px 4px rgba(74, 144, 226, 0.3)',
                  },
                },
                '&:not(.Mui-selected)': {
                  color: 'grey.300',
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 300,
                '&.Mui-selected': {
                  fontSize: '0.75rem',
                  fontWeight: 500,
                },
              },
            }}
          >
            {MENU_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <BottomNavigationAction
                  key={item.path}
                  label={item.text}
                  value={item.path}
                  icon={<IconComponent />}
                />
              );
            })}
          </BottomNavigation>
        </Paper>
      )}
    </>
  );
}

export default Navbar;