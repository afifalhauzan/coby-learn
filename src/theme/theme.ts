import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',

    primary: { 
      light: '#EDF4FC',
      main: '#4A90E2',
      dark: '#386CAA'
    },
    secondary: { main: '#386CAA' },    // Orange accent from original

    background: {
      default: '#EDF4FC',  // Foundation Blue Light
      paper: '#FFFFFF',    // Pure white for paper surfaces
    },

    grey: {
      300: '#C1C1C1', // Light grey for borders and dividers
      500: '#9E9E9E', // Medium grey for disabled elements
    },

    text: {
      primary: '#1E293B',   // Deep Slate for accessibility
      secondary: '#64748B', // Slate 500 for secondary text
      disabled: '#9E9E9E',  // Gray #000000/38 for disabled text
    },

    // Enhanced palette for better semantic colors
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#4A90E2' },
    success: { main: '#10B981' },

    // Custom action colors using Foundation Blue
    action: {
      hover: 'rgba(74, 144, 226, 0.04)',
      selected: 'rgba(74, 144, 226, 0.08)',
    },
  },

  shape: {
    borderRadius: 16, // Global border radius for "fun" feel
  },

  // Custom shadow system with Foundation Blue-tinted shadows
  shadows: [
    'none',
    '0px 1px 2px rgba(26, 50, 79, 0.05)', // elevation 1
    '0px 1px 3px rgba(26, 50, 79, 0.08), 0px 1px 2px rgba(26, 50, 79, 0.06)', // elevation 2
    '0px 2px 4px rgba(26, 50, 79, 0.08), 0px 2px 3px rgba(26, 50, 79, 0.07)', // elevation 3
    '0px 4px 6px rgba(26, 50, 79, 0.08), 0px 2px 4px rgba(26, 50, 79, 0.06)', // elevation 4 - Cards/Modals
    '0px 6px 10px rgba(26, 50, 79, 0.08), 0px 2px 4px rgba(26, 50, 79, 0.06)', // elevation 5
    '0px 8px 12px rgba(26, 50, 79, 0.08), 0px 4px 8px rgba(26, 50, 79, 0.06)', // elevation 6
    '0px 10px 16px rgba(26, 50, 79, 0.08), 0px 4px 8px rgba(26, 50, 79, 0.06)', // elevation 7
    '0px 12px 20px rgba(26, 50, 79, 0.08), 0px 6px 12px rgba(26, 50, 79, 0.06)', // elevation 8
    '0px 16px 24px rgba(26, 50, 79, 0.10), 0px 6px 12px rgba(26, 50, 79, 0.08)', // elevation 9
    '0px 20px 30px rgba(26, 50, 79, 0.12), 0px 8px 16px rgba(26, 50, 79, 0.10)', // elevation 10
    '0px 24px 36px rgba(26, 50, 79, 0.12), 0px 10px 20px rgba(26, 50, 79, 0.10)', // elevation 11
    '0px 28px 42px rgba(26, 50, 79, 0.12), 0px 12px 24px rgba(26, 50, 79, 0.10)', // elevation 12
    '0px 32px 48px rgba(26, 50, 79, 0.14), 0px 14px 28px rgba(26, 50, 79, 0.12)', // elevation 13
    '0px 36px 54px rgba(26, 50, 79, 0.14), 0px 16px 32px rgba(26, 50, 79, 0.12)', // elevation 14
    '0px 40px 60px rgba(26, 50, 79, 0.16), 0px 18px 36px rgba(26, 50, 79, 0.14)', // elevation 15
    '0px 44px 66px rgba(26, 50, 79, 0.16), 0px 20px 40px rgba(26, 50, 79, 0.14)', // elevation 16
    '0px 48px 72px rgba(26, 50, 79, 0.18), 0px 22px 44px rgba(26, 50, 79, 0.16)', // elevation 17
    '0px 52px 78px rgba(26, 50, 79, 0.18), 0px 24px 48px rgba(26, 50, 79, 0.16)', // elevation 18
    '0px 56px 84px rgba(26, 50, 79, 0.20), 0px 26px 52px rgba(26, 50, 79, 0.18)', // elevation 19
    '0px 60px 90px rgba(26, 50, 79, 0.20), 0px 28px 56px rgba(26, 50, 79, 0.18)', // elevation 20
    '0px 64px 96px rgba(26, 50, 79, 0.22), 0px 30px 60px rgba(26, 50, 79, 0.20)', // elevation 21
    '0px 68px 102px rgba(26, 50, 79, 0.22), 0px 32px 64px rgba(26, 50, 79, 0.20)', // elevation 22
    '0px 72px 108px rgba(26, 50, 79, 0.24), 0px 34px 68px rgba(26, 50, 79, 0.22)', // elevation 23
    '0px 76px 114px rgba(26, 50, 79, 0.24), 0px 36px 72px rgba(26, 50, 79, 0.22)', // elevation 24
  ] as const,

  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },

    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Consistent with global shape
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 4px 6px rgba(26, 50, 79, 0.08), 0px 2px 4px rgba(26, 50, 79, 0.06)', // Foundation Blue-tinted shadow
          padding: 8,
          border: '1px solid rgba(26, 50, 79, 0.06)', // Light border with Foundation Blue tint
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Increased from 8px for modern feel
          paddingTop: 10,
          paddingBottom: 10,
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(26, 50, 79, 0.08)', // Subtle depth for buttons
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(26, 50, 79, 0.12)', // Enhanced on hover
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1A324F', // Foundation Blue Darker on light background
          boxShadow: '0px 1px 3px rgba(26, 50, 79, 0.08), 0px 1px 2px rgba(26, 50, 79, 0.06)',
          borderBottom: '1px solid rgba(26, 50, 79, 0.06)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 4px 6px rgba(26, 50, 79, 0.08), 0px 2px 4px rgba(26, 50, 79, 0.06)',
          border: '1px solid rgba(26, 50, 79, 0.06)',
          transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out, border-color 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 12px rgba(26, 50, 79, 0.12), 0px 4px 8px rgba(26, 50, 79, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 20px 30px rgba(26, 50, 79, 0.15), 0px 8px 16px rgba(26, 50, 79, 0.10)',
          border: '1px solid rgba(26, 50, 79, 0.08)',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: 'rgba(26, 50, 79, 0.12)',
              transition: 'border-color 0.2s ease-in-out',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(74, 144, 226, 0.5)', // Foundation Blue Normal with opacity
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4A90E2', // Foundation Blue Normal
              borderWidth: 2,
            },
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(74, 144, 226, 0.08)', // Foundation Blue Normal with low opacity
            transform: 'scale(1.05)',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(74, 144, 226, 0.08)', // Foundation Blue Normal with low opacity
          color: '#1A324F', // Foundation Blue Darker
          border: '1px solid rgba(74, 144, 226, 0.12)',
        },
        filled: {
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          borderColor: 'rgba(16, 185, 129, 0.2)',
          color: '#065F46',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          color: '#991B1B',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          borderColor: 'rgba(245, 158, 11, 0.2)',
          color: '#92400E',
        },
        standardInfo: {
          backgroundColor: 'rgba(74, 144, 226, 0.08)', // Foundation Blue Normal
          borderColor: 'rgba(74, 144, 226, 0.2)',
          color: '#1A324F', // Foundation Blue Darker
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(26, 50, 79, 0.08)', // Foundation Blue Darker with low opacity
          overflow: 'hidden',
        },
        bar: {
          borderRadius: 8,
        },
      },
    },
  },
});
