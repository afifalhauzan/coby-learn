import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

const dummySummary = `SQL, or Structured Query Language, is a standard language for managing and manipulating relational databases. It allows users to create, retrieve, update, and delete data. Key concepts include tables, which store data in rows and columns, and queries, which are commands used to interact with the data.

Common SQL commands are SELECT for retrieving data, INSERT for adding new records, UPDATE for modifying existing records, and DELETE for removing records. Understanding joins (INNER, LEFT, RIGHT, FULL) is crucial for combining data from multiple tables based on related columns.

Data types define the kind of value that can be stored in a column, such as INTEGER, VARCHAR, and DATE. Constraints like PRIMARY KEY, FOREIGN KEY, and NOT NULL ensure data integrity within the database.`;

function ProjectPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [questionCount, setQuestionCount] = useState('5');

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        <Link underline="hover" color="inherit" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          Home
        </Link>
        <Link underline="hover" color="inherit" href="#" onClick={(e) => { e.preventDefault(); navigate('/library'); }}>
          Computer Science
        </Link>
        <Typography color="text.primary">Belajar SQL</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Belajar SQL
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Dive deep into the fundamentals of SQL and database management.
          </Typography>
        </Box>

        {/* Tombol di sebelah kanan */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<EditOutlinedIcon />}
            sx={{ textTransform: 'none' }}
          >
            Edit Project
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 3 }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Typography variant="h6" fontWeight="bold">AI Summary</Typography>
              <IconButton size="small" title="Copy summary">
                <ContentCopyOutlinedIcon fontSize="small" />
              </IconButton>
            </div>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {dummySummary}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Test Your Knowledge</Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="question-count-label">Number of Questions</InputLabel>
              <Select
                labelId="question-count-label"
                id="question-count-select"
                value={questionCount}
                label="Number of Questions"
                onChange={(e) => setQuestionCount(e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="5">5 Questions</MenuItem>
                <MenuItem value="10">10 Questions</MenuItem>
                <MenuItem value="15">15 Questions</MenuItem>
                <MenuItem value="20">20 Questions</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AutoAwesomeOutlinedIcon />}
              sx={{ textTransform: 'none', width: '100%', color: 'white' }}
            >
              Generate Quiz from Material
            </Button>
          </Paper>

          <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>My Notes</Typography>
            <TextField
              multiline
              rows={8}
              fullWidth
              variant="outlined"
              placeholder="Start typing your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <Button variant="contained" sx={{ alignSelf: 'flex-end', textTransform: 'none', color: 'white' }}>
              Save Notes
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default ProjectPage;
