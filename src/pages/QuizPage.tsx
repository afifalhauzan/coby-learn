// src/pages/QuizPage.tsx
import React, { useState } from 'react'; // Hapus useEffect jika tidak dipakai
import {
  Box,
  Typography,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Stack,
  Button,
  Alert,
  CircularProgress // Tambah loading indicator
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; // Tambah useParams

import { useMutation } from '@tanstack/react-query';

import { submitQuiz, type QuizQuestion, type SubmitQuizResponse } from '../services/apiLibraryService';

function QuizPage(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const { topicId } = useParams<{ topicId: string }>();

  const { questions, materialId } = location.state as { questions: QuizQuestion[], materialId?: number } || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [quizResult, setQuizResult] = useState<SubmitQuizResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);

  const submitMutation = useMutation({
    mutationFn: submitQuiz,
    onSuccess: (data) => {
      setQuizResult(data);
      setShowResults(true);
    },
    onError: (error: any) => {
      console.error("Submit error:", error);
      alert("Gagal mengirim jawaban: " + (error?.response?.data?.message || "Error jaringan"));
    }
  });

  // === VALIDASI AWAL ===
  if (!questions || questions.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">Data kuis hilang. Silakan generate ulang.</Alert>
        <Button onClick={() => navigate('/library')} sx={{ mt: 2 }}>Kembali</Button>
      </Box>
    );
  }

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // === HANDLERS ===

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isReviewMode) {
      setSelectedKey(event.target.value);
    }
  };

  const handleNextQuestion = () => {
    // 1. Simpan jawaban user saat ini ke array lokal
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = selectedKey;
    setUserAnswers(updatedAnswers);

    // 2. Cek apakah ini soal terakhir?
    if (currentQuestionIndex < totalQuestions - 1) {
      // Lanjut soal berikutnya
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedKey(null);
    } else {
      // === SOAL TERAKHIR: SUBMIT KE API ===
      handleSubmitQuiz(updatedAnswers);
    }
  };

  const handleSubmitQuiz = (finalAnswers: (string | null)[]) => {
    if (!topicId) return;

    const formattedAnswers = questions.map((q, index) => ({
      question_id: q.id,
      user_answer: finalAnswers[index] || ""
    }));

    submitMutation.mutate({
      quizId: topicId,
      data: { answers: formattedAnswers }
    });
  };

  const handleReviewNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsReviewMode(false);
      setShowResults(true);
    }
  };

  // --- Helper Style (Sama seperti sebelumnya) ---
  const getOptionStyles = (optionKey: string) => {
    let borderColor = 'divider';
    let bgcolor = 'transparent';
    let labelColor = 'text.primary';

    if (!isReviewMode) {
      if (selectedKey === optionKey) {
        borderColor = 'primary.main';
        bgcolor = 'rgba(249, 115, 22, 0.1)';
      }
    } else {
      // Mode Review: Cek jawaban benar/salah berdasarkan data lokal (karena review mode client-side)
      // Catatan: Idealnya review mode juga bisa ambil detail dari backend, tapi untuk cepat pakai data lokal questions
      const isCorrectAnswer = optionKey === currentQuestion.jawaban_benar;
      const isUserSelected = userAnswers[currentQuestionIndex] === optionKey;

      if (isCorrectAnswer) {
        borderColor = 'success.main';
        bgcolor = 'rgba(46, 125, 50, 0.1)';
        labelColor = 'success.main';
      } else if (isUserSelected) {
        borderColor = 'error.main';
        bgcolor = 'rgba(211, 47, 47, 0.1)';
        labelColor = 'error.main';
      }
    }
    return { borderColor, bgcolor, labelColor };
  };

  // === RENDER ===
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', pb: 8 }}>

      {!showResults && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
        >
          Quit Quiz
        </Button>
      )}

      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>

        {/* TAMPILAN SAAT LOADING SUBMIT */}
        {submitMutation.isPending ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#F97316', mb: 2 }} />
            <Typography variant="h6">Submitting your answers...</Typography>
            <Typography variant="body2" color="text.secondary">Please wait while we calculate your score.</Typography>
          </Box>
        ) : !showResults ? (
          // === TAMPILAN SOAL (Sama seperti sebelumnya) ===
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                {isReviewMode ? 'Reviewing Question' : 'Question'} {currentQuestionIndex + 1} of {totalQuestions}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocalFireDepartmentIcon sx={{ fontSize: 18, color: '#F97316' }} />
                <Typography variant="body2" color="text.secondary">Streak Mode</Typography>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={((currentQuestionIndex + 1) / totalQuestions) * 100}
              sx={{ height: 8, borderRadius: 4, mb: 4, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: '#F97316' } }}
            />

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, lineHeight: 1.6 }}>
              {currentQuestion.pertanyaan}
            </Typography>

            <RadioGroup
              value={isReviewMode ? userAnswers[currentQuestionIndex] : selectedKey}
              onChange={handleAnswerChange}
            >
              <Stack spacing={2}>
                {currentQuestion.pilihan.map((option) => {
                  const styles = getOptionStyles(option.key);
                  return (
                    <Paper
                      key={option.key}
                      variant="outlined"
                      onClick={() => !isReviewMode && setSelectedKey(option.key)}
                      sx={{
                        display: 'flex', alignItems: 'flex-start', p: 2, borderRadius: '12px',
                        border: '1px solid', borderColor: styles.borderColor, bgcolor: styles.bgcolor,
                        cursor: isReviewMode ? 'default' : 'pointer', transition: '0.2s',
                        '&:hover': !isReviewMode ? { borderColor: 'primary.main' } : {}
                      }}
                    >
                      <FormControlLabel
                        value={option.key}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                              width: 32, height: 32, borderRadius: '50%', border: '1px solid',
                              borderColor: styles.borderColor === 'divider' ? 'text.secondary' : styles.borderColor,
                              color: styles.borderColor === 'divider' ? 'text.secondary' : styles.borderColor,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem'
                            }}>
                              {option.key}
                            </Box>
                            <Typography sx={{ color: styles.labelColor, fontWeight: 500 }}>{option.value}</Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>
                  );
                })}
              </Stack>
            </RadioGroup>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={isReviewMode ? handleReviewNext : handleNextQuestion}
                disabled={!isReviewMode && !selectedKey}
                sx={{ textTransform: 'none', bgcolor: '#F97316', color: 'white', px: 4, py: 1, fontWeight: 'bold', '&:hover': { bgcolor: '#ea580c' } }}
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : (isReviewMode ? 'Finish Review' : 'Submit Quiz')}
              </Button>
            </Box>
          </Box>
        ) : (
          // === TAMPILAN HASIL (DATA DARI BACKEND) ===
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(249, 115, 22, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <LocalFireDepartmentIcon sx={{ fontSize: 48, color: '#F97316' }} />
            </Box>

            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              Quiz Completed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              You answered {quizResult?.correct} out of {totalQuestions} questions correctly.
            </Typography>

            {/* Score Stats (Dinamis dari quizResult) */}
            <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 6 }}>
              <Box>
                <Typography variant="h3" fontWeight="bold" color="primary.main">
                  {quizResult?.score || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">Score</Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {quizResult?.correct || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Correct</Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold" color="error.main">
                  {quizResult?.wrong || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Incorrect</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => materialId ? navigate(`/material/${materialId}`) : navigate(-2)}
                sx={{ textTransform: 'none', px: 3 }}
              >
                Back to Material
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setIsReviewMode(true);
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                }}
                sx={{ textTransform: 'none', bgcolor: '#F97316', color: 'white', px: 4, '&:hover': { bgcolor: '#ea580c' } }}
              >
                Review Answers
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default QuizPage;