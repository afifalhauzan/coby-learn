import React from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import GlobalStyles from "@mui/material/GlobalStyles";
import App from './App';
import { Analytics } from "@vercel/analytics/next"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const container = document.getElementById('root');


if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Analytics />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            html: {
              'scrollbar-gutter': 'stable',
              scrollBehavior: 'smooth',
            }
          }}
        />
        <BrowserRouter>
          {/* 3. Wrap <App /> with the provider (This is the fix) */}
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
}