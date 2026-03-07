import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Container,
  TextField,
  Dialog,

} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Confetti from 'react-confetti'; // Opsional

import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDailyQuiz, claimDailyQuiz, getDailyQuizStatus } from '../services/apiLibraryService';
import type { DailyQuizOptionObj, DailyQuizResponse } from '../services/apiLibraryService';

function DailyQuizPage(): React.JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State Game
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isCompleted, setIsCompleted] = useState(false);

  // State Setup
  const [setupMode, setSetupMode] = useState<'selection' | 'topic_input'>('selection');
  const [customTopic, setCustomTopic] = useState('');
  const [quizData, setQuizData] = useState<DailyQuizResponse | null>(null);

  // Jika error dari backend (misal: materi kosong)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noMaterialError, setNoMaterialError] = useState(false);

  // 0. Cek Status Dulu (Apakah sudah dikerjakan hari ini?)
  const { data: statusData, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['dailyQuizStatus'],
    queryFn: getDailyQuizStatus,
  });

  // Gunakan mutation untuk fetch/generate quiz agar tidak otomatis jalan
  const fetchQuizMutation = useMutation({
    mutationFn: getDailyQuiz,
    onSuccess: (data) => {
      setQuizData(data);
      setErrorMessage(null);
    },
    onError: (error: any) => {
      // Validasi khusus untuk Mode Random (Surprise Me) jika materi kosong (biasanya 400 Bad Request di endpoint ini)
      // Kita asumsikan api mengembalikan message terkait "belum memiliki materi"
      if (setupMode === 'selection' && error?.response?.status === 400) {
        setNoMaterialError(true);
        return;
      }

      const msg = error?.response?.data?.message || "Failed to load Daily Quiz.";
      setErrorMessage(msg);
      // Kembali ke selection jika error
      if (setupMode !== 'selection') {
        // Optional: stay on topic input if it was topic error
      }
    }
  });

  // 2. Mutation Claim
  const claimMutation = useMutation({
    mutationFn: claimDailyQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyQuizStatus'] });
      setIsCompleted(true);
    },
    onError: (err) => {
      console.error("Gagal klaim:", err);
      alert("Terjadi kesalahan saat menyimpan progress.");
    }
  });

  // Handler Start
  const handleStartRandom = () => {
    setErrorMessage(null);
    fetchQuizMutation.mutate({ mode: 'random' });
  };

  const handleStartTopic = () => {
    if (!customTopic.trim()) {
      alert("Please enter a topic");
      return;
    }
    setErrorMessage(null);
    fetchQuizMutation.mutate({ mode: 'topic', topic: customTopic });
  };

  // Logic Cek Jawaban
  const handleCheckAnswer = (key: string, correctAnswer: string) => {
    setSelectedKey(key);

    if (key === correctAnswer) {
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('wrong');
    }
  };

  const handleNext = () => {
    if (!quizData) return;

    // Jika ini soal terakhir dan benar
    if (currentIdx === quizData.questions.length - 1) {
      // Submit Score 10 (Sesuai request)
      claimMutation.mutate(10);
    } else {
      // Lanjut soal berikutnya
      setCurrentIdx((prev) => prev + 1);
      setSelectedKey(null);
      setAnswerStatus('idle');
    }
  };

  // Render helper untuk opsi
  const renderOption = (optObj: DailyQuizOptionObj, correctKey: string) => {
    const { key, value } = optObj;

    let borderColor = 'divider';
    let bgcolor = 'transparent';
    let icon = null;

    if (selectedKey === key) {
      if (answerStatus === 'correct') {
        borderColor = 'success.main';
        bgcolor = 'rgba(46, 125, 50, 0.1)';
        icon = <CheckCircleIcon color="success" />;
      } else if (answerStatus === 'wrong') {
        borderColor = 'error.main';
        bgcolor = 'rgba(211, 47, 47, 0.1)';
        icon = <ErrorIcon color="error" />;
      } else {
        borderColor = 'primary.main';
      }
    }

    return (
      <Paper
        key={key}
        variant="outlined"
        onClick={() => {
          if (answerStatus !== 'correct') {
            handleCheckAnswer(key, correctKey);
          }
        }}
        sx={{
          display: 'flex', alignItems: 'center', p: 2, mb: 2, borderRadius: '12px',
          border: '1px solid', borderColor, bgcolor,
          cursor: answerStatus === 'correct' ? 'default' : 'pointer',
          transition: '0.2s',
          '&:hover': answerStatus === 'idle' ? { borderColor: 'primary.main', transform: 'translateY(-2px)' } : {}
        }}
      >
        <Box sx={{
          width: 36, height: 36, borderRadius: '50%', border: '1px solid',
          borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center',
          mr: 2, fontWeight: 'bold', color: 'text.secondary', bgcolor: 'background.paper',
          flexShrink: 0
        }}>
          {key}
        </Box>
        <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{value}</Typography>
        {icon}
      </Paper>
    );
  };

  // --- RENDER CONTENT ---

  // 1. Loading Check Status
  if (isLoadingStatus) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  // 2. Already Done (or completed now)
  if (statusData?.is_done || isCompleted) {
    // TAMPILAN SELESAI
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
        {(isCompleted) && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} />}

        <Paper sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
          <LocalFireDepartmentIcon sx={{ fontSize: 80, color: '#F97316', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Streak Saved!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You've completed today's challenge. Come back tomorrow to keep the fire burning!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ borderRadius: 50, px: 4, py: 1.5, fontWeight: 'bold', textTransform: 'none', color: 'white' }}
          >
            Back to Dashboard
          </Button>
        </Paper>
        {/* Dialog No Material */}
        <Dialog
          open={noMaterialError}
          onClose={() => setNoMaterialError(false)}
          PaperProps={{
            sx: { borderRadius: 4, p: 2, maxWidth: 500 }
          }}
          TransitionComponent={Fade}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(79, 70, 229, 0.1)', color: 'primary.main', mb: 3 }}>
              <UploadFileIcon sx={{ fontSize: 40 }} />
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              No Materials Found
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              You haven't uploaded any materials yet. Please upload materials first to use this quiz feature.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setNoMaterialError(false)}
                sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/library')}
                sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
              >
                Upload Now
              </Button>
            </Box>
          </Box>
        </Dialog>

      </Container>
    );
  }

  // 3. Loading Generator
  if (fetchQuizMutation.isPending) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: 2 }}>
        <CircularProgress />
        <Typography>Generating your challenge...</Typography>
      </Box>
    );
  }

  // 4. Setup Selection (No Data yet)
  if (!quizData) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 4 }}>
          Back to Dashboard
        </Button>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Daily Challenge
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 6 }}>
          Choose how you want to test your knowledge today.
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}

        {setupMode === 'selection' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Option 1: Random */}
            <Paper
              variant="outlined"
              onClick={handleStartRandom}
              sx={{
                p: 3, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                borderRadius: 3, transition: '0.2s',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover', transform: 'translateY(-4px)' }
              }}
            >
              <Box sx={{ p: 2, bgcolor: 'primary.lighter', color: 'primary.main', borderRadius: 2 }}>
                <LocalFireDepartmentIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">Surprise Me</Typography>
                <Typography variant="body2" color="text.secondary">
                  Questions based on your random uploaded materials.
                </Typography>
              </Box>
            </Paper>

            {/* Option 2: Topic */}
            <Paper
              variant="outlined"
              onClick={() => setSetupMode('topic_input')}
              sx={{
                p: 3, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                borderRadius: 3, transition: '0.2s',
                '&:hover': { borderColor: 'secondary.main', bgcolor: 'action.hover', transform: 'translateY(-4px)' }
              }}
            >
              <Box sx={{ p: 2, bgcolor: 'secondary.lighter', color: 'secondary.main', borderRadius: 2 }}>
                <CheckCircleIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">Specific Topic</Typography>
                <Typography variant="body2" color="text.secondary">
                  Focus on a specific subject you want to master.
                </Typography>
              </Box>
            </Paper>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Enter Topic
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Sejarah Kemerdekaan Indonesia"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => setSetupMode('selection')} fullWidth>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleStartTopic} fullWidth disabled={!customTopic.trim()}>
                Start Quiz
              </Button>
            </Box>
          </Box>
        )}


        {/* Dialog No Material */}
        <Dialog
          open={noMaterialError}
          onClose={() => setNoMaterialError(false)}
          PaperProps={{
            sx: { borderRadius: 4, p: 2, maxWidth: 500 }
          }}
          TransitionComponent={Fade}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2 }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: '50%', bgcolor: 'primary.lighter',
              color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3
            }}>
              <UploadFileIcon sx={{ fontSize: 40 }} />
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              No Materials Found
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
              You haven't uploaded any materials yet. Please upload materials first to use this quiz feature.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setNoMaterialError(false)}
                sx={{ borderRadius: 2, fontWeight: 'bold' }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/library')}
                sx={{ borderRadius: 2, fontWeight: 'bold' }}
              >
                Upload Now
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Container>
    );
  }

  // TAMPILAN GAMEPLAY

  const currentQ = quizData.questions[currentIdx];
  const totalQ = quizData.questions.length;
  const progress = ((currentIdx + 1) / totalQ) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Nav */}
      <Button
        startIcon={<CloseIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Quit
      </Button>

      <Paper sx={{ p: { xs: 2, md: 6 }, borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}>
        {/* Progress */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" fontWeight="bold" color="primary">QUESTION {currentIdx + 1} OF {totalQ}</Typography>
            <Typography variant="caption" color="text.secondary">Daily Challenge</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: '#F97316' } }} />
        </Box>

        {/* Soal */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, lineHeight: 1.5 }}>
          {currentQ.pertanyaan}
        </Typography>

        <Box sx={{ mb: 4 }}>
          {currentQ.pilihan.map((opt) => renderOption(opt, currentQ.jawaban_benar))}
        </Box>

        <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {answerStatus === 'wrong' && (
            <Fade in>
              <Alert severity="error" icon={<ErrorIcon />} sx={{ py: 0.5, px: 2, mr: 2 }}>
                Incorrect. Try again!
              </Alert>
            </Fade>
          )}

          {answerStatus === 'correct' && (
            <Fade in>
              <Button
                variant="contained"
                size="large"
                onClick={handleNext}
                sx={{
                  bgcolor: '#F97316', color: 'white', px: 4, borderRadius: '12px', fontWeight: 'bold',
                  '&:hover': { bgcolor: '#ea580c' }
                }}
              >
                {currentIdx === totalQ - 1 ? (claimMutation.isPending ? 'Claiming...' : 'Finish & Claim') : 'Next Question'}
              </Button>
            </Fade>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default DailyQuizPage;