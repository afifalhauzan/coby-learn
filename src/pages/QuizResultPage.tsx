import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Skeleton,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useQuery } from '@tanstack/react-query';
import { getQuizResultDetail } from '../services/apiLibraryService';

function QuizResultPage(): React.JSX.Element {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();

  const { data: result, isLoading, isError, error } = useQuery({
    queryKey: ['quizResult', resultId],
    queryFn: () => getQuizResultDetail(resultId || ''),
    enabled: !!resultId,
  });

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Skeleton height={100} sx={{ mb: 2 }} />
        <Skeleton height={300} sx={{ mb: 2 }} />
        <Skeleton height={300} />
      </Box>
    );
  }

  if (isError || !result) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Gagal memuat hasil kuis: {(error as any)?.message || "Data tidak ditemukan"}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Kembali
        </Button>
      </Box>
    );
  }

  const correctCount = result.questions.filter(q => q.is_correct).length;
  const totalCount = result.questions.length;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', pb: 8, px: 2 }}>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
      >
        Back to Material
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '16px',
          bgcolor: '#1E293B',
          border: '1px solid #334155',
          mb: 4,
          textAlign: 'center',
          color: 'white'
        }}
      >
        <Typography variant="h6" sx={{ color: '#94A3B8', mb: 1 }}>Quiz Result</Typography>
        <Typography variant="h2" fontWeight="bold" sx={{ color: result.score >= 70 ? '#4ADE80' : '#F87171' }}>
          {result.score}
        </Typography>
        <Typography variant="body1" sx={{ color: '#CBD5E1', mt: 1 }}>
          You answered {correctCount} out of {totalCount} questions correctly.
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2 }}>
          Completed on {new Date(result.created_at).toLocaleString('id-ID')}
        </Typography>
      </Paper>

      <Stack spacing={3}>
        {result.questions.map((question, index) => (
          <Paper
            key={question.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              borderLeft: question.is_correct ? '6px solid #4ADE80' : '6px solid #F87171'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Question {index + 1}
              </Typography>
              {question.is_correct ? (
                <Chip icon={<CheckCircleIcon />} label="Correct" color="success" size="small" variant="outlined" />
              ) : (
                <Chip icon={<CancelIcon />} label="Incorrect" color="error" size="small" variant="outlined" />
              )}
            </Box>

            <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
              {question.pertanyaan}
            </Typography>

            <Stack spacing={1.5}>
              {question.pilihan.map((opt) => {
                let bgcolor = 'transparent';
                let borderColor = 'divider';
                let textColor = 'text.primary';
                let icon = null;

                const isSelected = opt.key === question.user_answer;
                const isCorrect = opt.key === question.correct_answer;

                if (isCorrect) {
                  bgcolor = 'rgba(74, 222, 128, 0.1)';
                  borderColor = '#4ADE80';
                  textColor = 'success.main';
                  icon = <CheckCircleIcon color="success" fontSize="small" />;
                } else if (isSelected && !isCorrect) {
                  bgcolor = 'rgba(248, 113, 113, 0.1)';
                  borderColor = '#F87171';
                  textColor = 'error.main';
                  icon = <CancelIcon color="error" fontSize="small" />;
                } else if (isSelected) {
                  bgcolor = 'rgba(74, 222, 128, 0.1)';
                  borderColor = '#4ADE80';
                }

                return (
                  <Box
                    key={opt.key}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 1.5,
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: borderColor,
                      bgcolor: bgcolor,
                    }}
                  >
                    <Box
                      sx={{
                        width: 28, height: 28, borderRadius: '50%',
                        border: '1px solid', borderColor: isSelected || isCorrect ? borderColor : 'text.secondary',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mr: 2, fontWeight: 'bold', fontSize: '0.8rem',
                        color: isSelected || isCorrect ? textColor : 'text.secondary'
                      }}
                    >
                      {opt.key}
                    </Box>
                    <Typography sx={{ flexGrow: 1, color: isSelected || isCorrect ? textColor : 'text.primary', fontWeight: isSelected || isCorrect ? 600 : 400 }}>
                      {opt.value}
                    </Typography>
                    {icon}
                  </Box>
                );
              })}
            </Stack>

            {!question.is_correct && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Correct Answer:</strong> Option {question.correct_answer}
                </Typography>
              </Box>
            )}
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default QuizResultPage;