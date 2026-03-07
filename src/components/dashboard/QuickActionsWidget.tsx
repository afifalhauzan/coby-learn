import React from 'react';
import { Paper, Typography, Stack, Button } from '@mui/material';
import { Add, MenuBookOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


function QuickActionsWidget(): React.JSX.Element {
    const navigate = useNavigate();
  
  return (
    <Paper>
      <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Stack spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/tasks')}
          startIcon={<Add />}
          fullWidth
          sx={{ py: 1.5, color: 'white' }}
        >
          Add Task
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/library')}

          startIcon={<MenuBookOutlined />}
          fullWidth
          sx={{ py: 1.5, borderColor: '#CBD5E1', color: '#CBD5E1' }}
        >
          Add Material
        </Button>

      </Stack>
    </Paper>
  );
}

export default QuickActionsWidget;