import React from 'react';
import { Typography } from '@mui/material';
import { format } from 'date-fns';

interface HeaderProps {
  username?: string;
}

function Header({ username }: HeaderProps): React.JSX.Element {
  const currentDate = format(new Date(), 'EEEE, MMMM d');

  return (
    <>
      <Typography
        component="h3"
        variant="h4" // Default for mobile
        sx={{
          color: 'text.primary',
          mb: 0.5,
          fontWeight: 600,
          // Responsive font size mapping
          fontSize: {
            xs: '1.5rem', // h4-ish
            md: '2.125rem' // h3-ish
          }
        }}
      >
        Hello {username || 'Student'}!
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontWeight: 500 }}>
        {currentDate}
      </Typography>
    </>
  );
}

export default Header;