import React from 'react';
import { Box} from '@mui/material';
import { Outlet } from 'react-router-dom'; 
import Navbar from './Navbar'; 

function MainLayout(): React.JSX.Element {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* <Container
        maxWidth="xl"
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          p: 0,
          overflow: 'hidden',
        }}
      > */}
        <Navbar />
        <Box 
          component="main" 
          sx={{ p: { xs: 2, md: 4 } }}
        >
          <Outlet /> 
        </Box>
      {/* </Container> */}
    </Box>
  );
}

export default MainLayout;