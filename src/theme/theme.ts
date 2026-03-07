import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: { main: '#F97316' },      
    secondary: { main: '#3B82F6' },  

    background: {
      default: '#0F172A',  
      paper: '#1E293B',    
    },

    text: {
      primary: '#F1F5F9',  
      secondary: '#94A3B8', 
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },

    button: {
      textTransform: 'none',
      fontWeight: 600,
      borderRadius: 8,
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#1E293B', // paper dark
          boxShadow:
            '0px 10px 15px -3px rgba(0,0,0,0.6), 0px 4px 6px -2px rgba(0,0,0,0.5)',
          padding: 24,
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingTop: 10,
          paddingBottom: 10,
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E293B', // Dark slate
          color: '#F1F5F9',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
  },
});
