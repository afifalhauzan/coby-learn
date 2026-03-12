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
        p: { xs: 0, sm: 0, md: 0 },
      }}
    >
      {/* <Container
        maxWidth="xl"
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: 2,
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