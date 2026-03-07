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
      <Typography variant="h4" component="h1" sx={{ color: 'text.primary', mb: 0.5 }}>
        Hello {username || 'Student'}!
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
        {currentDate}
      </Typography>
    </>
  );
}

export default Header;