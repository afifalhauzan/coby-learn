import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Radio,
  IconButton,
  CircularProgress,
  Alert,
  Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Confetti from 'react-confetti'; // Opsional: Efek visual (jika diinstall), kalau tidak hapus saja

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDailyQuiz, claimDailyQuiz } from '../../services/apiLibraryService';
import type { DailyQuizOptionObj } from '../../services/apiLibraryService';

interface DailyQuizDialogProps {
  open: boolean;
  onClose: () => void;
}

function DailyQuizDialog({ open, onClose }: DailyQuizDialogProps): React.JSX.Element {
  const queryClient = useQueryClient();

  // State Game
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isCompleted, setIsCompleted] = useState(false);

  // 1. Fetch Quiz Data
  const { data: quizData, isLoading, isError } = useQuery({
    queryKey: ['dailyQuiz'],
    queryFn: () => getDailyQuiz({ mode: 'random' }),
    enabled: open, // Hanya fetch saat dialog dibuka
  });

  // 2. Mutation Claim
  const claimMutation = useMutation({
    mutationFn: claimDailyQuiz,
    onSuccess: () => {
      // Refresh data streak di dashboard (asumsi queryKey 'streak' atau 'dashboard-stats')
      queryClient.invalidateQueries({ queryKey: ['dailyQuiz'] });
      setIsCompleted(true);
    },
    onError: (err) => {
      console.error("Gagal klaim:", err);
      alert("Terjadi kesalahan saat menyimpan progress.");
    }
  });

  // Reset state saat dialog dibuka/tutup
  useEffect(() => {
    if (open) {
      setCurrentIdx(0);
      setSelectedKey(null);
      setAnswerStatus('idle');
      setIsCompleted(false);
    }
  }, [open]);

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
      // Submit Score 10
      claimMutation.mutate(10);
    } else {
      // Lanjut soal berikutnya
      setCurrentIdx((prev) => prev + 1);
      setSelectedKey(null);
      setAnswerStatus('idle');
    }
  };

  // Render helper untuk opsi yang struktur JSON-nya unik: [{"A": "Teks"}]
  const renderOption = (optObj: DailyQuizOptionObj, correctKey: string) => {
    // Sesuaikan dengan tipe DailyQuizOptionObj: { key: string, value: string }
    const { key, value } = optObj;

    let borderColor = 'divider';
    let bgcolor = 'transparent';
    let icon = null;

    // Styling logika validasi
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
          // Hanya boleh pilih jika belum benar
          if (answerStatus !== 'correct') {
            handleCheckAnswer(key, correctKey);
          }
        }}
        sx={{
          display: 'flex', alignItems: 'center', p: 2, mb: 2, borderRadius: '12px',
          border: '1px solid', borderColor, bgcolor,
          cursor: answerStatus === 'correct' ? 'default' : 'pointer',
          transition: '0.2s',
          '&:hover': answerStatus === 'idle' ? { borderColor: 'primary.main' } : {}
        }}
      >
        <Radio
          checked={selectedKey === key}
          sx={{ display: 'none' }} // Sembunyikan radio default
        />

        <Box sx={{
          width: 36, height: 36, borderRadius: '50%', border: '1px solid',
          borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center',
          mr: 2, fontWeight: 'bold', color: 'text.secondary', bgcolor: 'background.paper'
        }}>
          {key}
        </Box>

        <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{value}</Typography>

        {icon}
      </Paper>
    );
  };

  // --- RENDER CONTENT ---
  let content;

  if (isLoading) {
    content = <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /></Box>;
  } else if (isError || !quizData) {
    content = <Alert severity="error">Gagal memuat Daily Quiz.</Alert>;
  } else if (quizData.is_done || isCompleted) {
    // Tampilan Selesai / Sudah Dikerjakan
    content = (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        {isCompleted && <Confetti width={400} height={400} recycle={false} numberOfPieces={200} />}

        <LocalFireDepartmentIcon sx={{ fontSize: 80, color: '#F97316', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Streak Saved!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You've completed today's challenge. Come back tomorrow to keep the fire burning!
        </Typography>
        <Button variant="contained" onClick={onClose} sx={{ borderRadius: 50, px: 4, py: 1.5 }}>
          Awesome!
        </Button>
      </Box>
    );
  } else {
    // Tampilan Mengerjakan Soal
    const currentQ = quizData.questions[currentIdx];
    const totalQ = quizData.questions.length;
    const progress = ((currentIdx + 1) / totalQ) * 100;

    content = (
      <>
        {/* Header Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" fontWeight="bold" color="primary">QUESTION {currentIdx + 1}/{totalQ}</Typography>
            <Typography variant="caption" color="text.secondary">Daily Challenge</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        {/* Soal */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          {currentQ.pertanyaan}
        </Typography>

        {/* Opsi Jawaban */}
        <Box sx={{ mb: 2 }}>
          {currentQ.pilihan.map((opt) => renderOption(opt, currentQ.jawaban_benar))}
        </Box>

        {/* Feedback & Next Button */}
        <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {answerStatus === 'wrong' && (
            <Fade in>
              <Alert severity="error" icon={false} sx={{ py: 0, px: 2 }}>
                Salah. Coba lagi!
              </Alert>
            </Fade>
          )}

          {answerStatus === 'correct' && (
            <Fade in>
              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
                sx={{ bgcolor: '#F97316', color: 'white', '&:hover': { bgcolor: 'primary.blue' } }}
              >
                {currentIdx === totalQ - 1 ? (claimMutation.isPending ? 'Claiming...' : 'Finish & Claim') : 'Next Question'}
              </Button>
            </Fade>
          )}
        </Box>
      </>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { p: 1 } }}
    >
      {/* Tombol Close di pojok */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 0, pb: 3 }}>
        {content}
      </DialogContent>
    </Dialog>
  );
}

export default DailyQuizDialog;