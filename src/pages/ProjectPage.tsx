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
import { useTranslation } from 'react-i18next';

import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

const dummySummary = `SQL, or Structured Query Language, is a standard language for managing and manipulating relational databases. It allows users to create, retrieve, update, and delete data. Key concepts include tables, which store data in rows and columns, and queries, which are commands used to interact with the data.

Common SQL commands are SELECT for retrieving data, INSERT for adding new records, UPDATE for modifying existing records, and DELETE for removing records. Understanding joins (INNER, LEFT, RIGHT, FULL) is crucial for combining data from multiple tables based on related columns.

Data types define the kind of value that can be stored in a column, such as INTEGER, VARCHAR, and DATE. Constraints like PRIMARY KEY, FOREIGN KEY, and NOT NULL ensure data integrity within the database.`;

function ProjectPage(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [questionCount, setQuestionCount] = useState('5');

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs aria-label={t('common:navigation.breadcrumb', { defaultValue: 'breadcrumb' })} sx={{ mb: 1 }}>
        <Link underline="hover" color="inherit" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          {t('common:navigation.home', { defaultValue: 'Home' })}
        </Link>
        <Link underline="hover" color="inherit" href="#" onClick={(e) => { e.preventDefault(); navigate('/library'); }}>
          {t('project:breadcrumbs.category', { defaultValue: 'Computer Science' })}
        </Link>
        <Typography color="text.primary">{t('project:breadcrumbs.projectName', { defaultValue: 'Belajar SQL' })}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t('project:header.title', { defaultValue: 'Belajar SQL' })}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('project:header.subtitle', { defaultValue: 'Dive deep into the fundamentals of SQL and database management.' })}
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
            {t('project:actions.editProject', { defaultValue: 'Edit Project' })}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 3 }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Typography variant="h6" fontWeight="bold">{t('project:summary.title', { defaultValue: 'AI Summary' })}</Typography>
              <IconButton size="small" title={t('project:summary.actions.copyTitle', { defaultValue: 'Copy summary' })} aria-label={t('project:summary.actions.copyAria', { defaultValue: 'Copy summary' })}>
                <ContentCopyOutlinedIcon fontSize="small" />
              </IconButton>
            </div>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {t('project:summary.default', { defaultValue: dummySummary })}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{t('project:quizGenerator.title', { defaultValue: 'Test Your Knowledge' })}</Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="question-count-label">{t('project:quizGenerator.numberOfQuestionsLabel', { defaultValue: 'Number of Questions' })}</InputLabel>
              <Select
                labelId="question-count-label"
                id="question-count-select"
                value={questionCount}
                label={t('project:quizGenerator.numberOfQuestionsLabel', { defaultValue: 'Number of Questions' })}
                onChange={(e) => setQuestionCount(e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="5">{t('project:quizGenerator.questionCountOption', { count: 5, defaultValue: '5 Questions' })}</MenuItem>
                <MenuItem value="10">{t('project:quizGenerator.questionCountOption', { count: 10, defaultValue: '10 Questions' })}</MenuItem>
                <MenuItem value="15">{t('project:quizGenerator.questionCountOption', { count: 15, defaultValue: '15 Questions' })}</MenuItem>
                <MenuItem value="20">{t('project:quizGenerator.questionCountOption', { count: 20, defaultValue: '20 Questions' })}</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AutoAwesomeOutlinedIcon />}
              sx={{ textTransform: 'none', width: '100%', color: 'white' }}
            >
              {t('project:quizGenerator.actions.generateFromMaterial', { defaultValue: 'Generate Quiz from Material' })}
            </Button>
          </Paper>

          <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{t('project:notes.title', { defaultValue: 'My Notes' })}</Typography>
            <TextField
              multiline
              rows={8}
              fullWidth
              variant="outlined"
              placeholder={t('project:notes.placeholder', { defaultValue: 'Start typing your notes here...' })}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <Button variant="contained" sx={{ alignSelf: 'flex-end', textTransform: 'none', color: 'white' }}>
              {t('project:notes.actions.save', { defaultValue: 'Save Notes' })}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default ProjectPage;
