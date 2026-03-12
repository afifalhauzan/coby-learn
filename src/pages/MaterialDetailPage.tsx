import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Stack,
  Skeleton,
  Alert,
  Divider,
  TextField,
  Avatar,
  Chip,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StyleIcon from '@mui/icons-material/Style';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getMaterialDetail,
  generateQuiz,
  getMaterialQuizzes,
  generateFlashcards
} from '../services/apiLibraryService';

import { getChatHistory, sendChatMessage, type ChatMessage } from '../services/apiChatService';

import GenerateQuizDialog from '../components/library/GenerateQuizDialog';
import FocusSessionWidget from '../components/common/FocusSessionWidget';

interface ChatWidgetProps {
  materialId: number;
}

const ChatWidget = ({ materialId }: ChatWidgetProps) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { data: history } = useQuery({
    queryKey: ['chatHistory', materialId],
    queryFn: () => getChatHistory(materialId),
    enabled: !!materialId,
  });

  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (text: string) => sendChatMessage(materialId, text),
    onSuccess: (botReply) => {
      setMessages((prev) => [...prev, botReply]);
    },
    onError: () => {
      alert("Gagal mengirim pesan ke AI.");
    }
  });

  const handleSendChat = () => {
    if (!chatInput.trim() || chatMutation.isPending) return;

    const userText = chatInput;

    const tempUserMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      message: userText,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setChatInput('');

    chatMutation.mutate(userText);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2, // 2 * 8px = 16px
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        mt: 4
      }}
    >
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.default' }}>
        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
          <SmartToyIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'text.primary' }}>AI Tutor</Typography>
          <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
            Online
          </Typography>
        </Box>
      </Box>

      {/* Chat Body */}
      <Box
        ref={chatContainerRef}
        sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        {messages.length === 0 && (
          <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
            Tanyakan apa saja tentang materi ini!
          </Typography>
        )}

        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            <Paper sx={{
              p: 1.5,
              borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
              bgcolor: msg.role === 'user' ? 'secondary.main' : 'action.selected',
              color: msg.role === 'user' ? 'white' : 'text.primary'
            }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <Typography variant="body2" {...props} />,
                  code: ({ node, ...props }) => <code style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '4px' }} {...props} />
                }}
              >
                {msg.message}
              </ReactMarkdown>
            </Paper>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              {msg.role === 'user' ? 'You' : 'AI'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        ))}

        {chatMutation.isPending && (
          <Box sx={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
            <Paper sx={{ p: 1.5, borderRadius: '16px 16px 16px 0', bgcolor: 'action.selected', color: 'text.secondary' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>AI sedang mengetik...</Typography>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Chat Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default', display: 'flex', gap: 1 }}>
        <TextField
          variant="outlined"
          placeholder="Ask something..."
          size="small"
          fullWidth
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
          disabled={chatMutation.isPending}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper', borderRadius: '10px', color: 'text.primary',
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'text.secondary' },
            }
          }}
        />
        <IconButton
          onClick={handleSendChat}
          disabled={!chatInput.trim() || chatMutation.isPending}
          sx={{
            bgcolor: 'secondary.main', color: 'white', borderRadius: '10px',
            '&:hover': { bgcolor: 'secondary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.selected', color: 'text.secondary' }
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

// =================================================================
// 2. MAIN PAGE COMPONENT
// =================================================================
function MaterialDetailPage(): React.JSX.Element {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openQuizDialog, setOpenQuizDialog] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [materialId]);

  // === DATA FETCHING ===
  const { data: material, isLoading, isError } = useQuery({
    queryKey: ['material', materialId],
    queryFn: () => getMaterialDetail(materialId || ''),
    enabled: !!materialId,
  });

  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['materialQuizzes', materialId],
    queryFn: () => getMaterialQuizzes(materialId || ''),
    enabled: !!materialId,
  });

  // === MUTATIONS ===
  const quizMutation = useMutation({
    mutationFn: generateQuiz,
    onSuccess: (data) => {
      setOpenQuizDialog(false);
      queryClient.invalidateQueries({ queryKey: ['materialQuizzes', materialId] });
      if (data.id) {
        navigate(`/quiz/${data.id}`, {
          state: { questions: data.questions, title: `Quiz: ${material?.title}`, materialId: data.material_id }
        });
      }
    },
    onError: (err: any) => alert("Gagal membuat kuis: " + (err?.response?.data?.message || "Error"))
  });

  const flashcardMutation = useMutation({
    mutationFn: generateFlashcards,
    onSuccess: (data) => {
      navigate('/flashcards/play', {
        state: { flashcards: data.flashcards, title: material?.title }
      });
    },
    onError: (_: any) => alert("Gagal membuat flashcard.")
  });

  const handleGenerateSubmit = (count: number) => {
    if (!materialId) return;
    quizMutation.mutate({ material_id: Number(materialId), question_count: count });
  };

  const handleCreateFlashcard = () => {
    if (!materialId) return;
    flashcardMutation.mutate({ material_id: Number(materialId) });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading) return <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}><Skeleton height={400} sx={{ bgcolor: 'background.paper' }} /></Box>;
  if (isError || !material) return <Alert severity="error">Gagal memuat materi.</Alert>;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', color: 'text.primary', pb: 10 }}>
      <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 4 }, pt: 4 }}>

        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2, textTransform: 'none', color: 'text.secondary', pl: 0 }}
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              {material.title}
            </Typography>

          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={material.type.toUpperCase()} size="small" color="primary" variant="outlined" />
            <Typography variant="body2" color="text.secondary">
              Added on {material.createdAt}
            </Typography>
          </Box>
        </Box>

        {/* ========================================================= */}
        {/* CSS GRID NATIVE LAYOUT */}
        {/* ========================================================= */}
        <Box sx={{
          display: 'grid',
          // Mobile: 1 kolom (1fr), Desktop (lg): 2 kolom dengan rasio 2:1 (2fr 1fr)
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          // Gap antar item 32px (4 * 8px)
          gap: 4,
          // Align start agar kolom kanan tidak dipaksa stretch tingginya mengikuti kolom kiri
          alignItems: 'start'
        }}>

          {/* === KOLOM KIRI (KONTEN UTAMA) === */}
          {/* Menggunakan minWidth: 0 untuk mencegah overflow pada grid item jika ada konten pre/code panjang */}
          <Box sx={{ minWidth: 0 }}>

            {/* Summary */}
            <Paper
              elevation={0}
              sx={{
                p: 4, borderRadius: 2, // 2 * 8px = 16px
                bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                minHeight: 500, mb: 4
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: 'text.primary' }}>
                Material Summary
              </Typography>
              <Box sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary', mt: 3, mb: 2 }} {...props} />,
                    h2: ({ node, ...props }) => <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary', mt: 2, mb: 1 }} {...props} />,
                    p: ({ node, ...props }) => <Typography variant="body1" sx={{ mb: 2 }} {...props} />,
                    li: ({ node, ...props }) => <li style={{ marginBottom: '8px', marginLeft: '20px' }} {...props} />,
                  }}
                >
                  {material.summary || '_No summary available yet._'}
                </ReactMarkdown>
              </Box>
              <Divider sx={{ my: 4, borderColor: 'divider' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Last updated just now</Typography>
            </Paper>

            {/* Quiz History */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: 'text.primary' }}>
              Quiz History
            </Typography>
            <Stack spacing={2}>
              {isLoadingQuizzes ? (
                <Skeleton height={100} sx={{ bgcolor: 'background.paper', borderRadius: 3 }} />
              ) : quizzes && quizzes.length > 0 ? (
                quizzes.map((quiz, index) => (
                  <Paper
                    key={quiz.id}
                    elevation={0}
                    sx={{
                      p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: '0.2s', '&:hover': { borderColor: 'secondary.main', transform: 'translateY(-2px)' }
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>Quiz #{(quizzes?.length || 0) - index}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{quiz.question_count} Questions • {formatDate(quiz.created_at)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      {quiz.score !== null ? (
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>SCORE</Typography>
                          <Typography variant="h4" fontWeight="bold" sx={{ color: 'success.main', lineHeight: 1 }}>{quiz.score}</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ color: 'secondary.main', display: 'block' }}>PENDING</Typography>
                        </Box>
                      )}
                      <Button
                        variant={quiz.score !== null ? "outlined" : "contained"}
                        onClick={() => quiz.score !== null ? navigate(`/quiz/result/${quiz.id}`) : navigate(`/quiz/${quiz.id}`)}
                        sx={{
                          borderRadius: '10px', textTransform: 'none', px: 3,
                          borderColor: quiz.score !== null ? 'divider' : 'none',
                          color: quiz.score !== null ? 'text.secondary' : 'white',
                          bgcolor: quiz.score !== null ? 'transparent' : 'secondary.main',
                          '&:hover': { bgcolor: quiz.score !== null ? 'action.hover' : 'secondary.dark' }
                        }}
                      >
                        {quiz.score !== null ? 'Review' : 'Start'}
                      </Button>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', border: '1px dashed', borderColor: 'divider' }}>
                  <Typography color="text.secondary">Belum ada riwayat kuis.</Typography>
                </Paper>
              )}
            </Stack>
          </Box>

          {/* === KOLOM KANAN (SIDEBAR STICKY) === */}
          <Box component="aside">
            <Box sx={{ position: 'sticky', top: 24 }}>

              {/* Tombol Aksi */}
              <Stack spacing={2} sx={{ mb: 4 }}>
                <Button
                  fullWidth variant="contained" startIcon={<AutoAwesomeIcon />}
                  onClick={() => setOpenQuizDialog(true)} disabled={quizMutation.isPending}
                  sx={{
                    bgcolor: 'secondary.main', color: 'white', py: 1.5, borderRadius: '12px', fontWeight: 'bold', textTransform: 'none',
                    '&:hover': { bgcolor: 'secondary.dark' }
                  }}
                >
                  {quizMutation.isPending ? 'Generating...' : 'Generate New Quiz'}
                </Button>
                <Button
                  fullWidth variant="contained" startIcon={<StyleIcon />}
                  onClick={handleCreateFlashcard} disabled={flashcardMutation.isPending}
                  sx={{
                    bgcolor: 'action.selected', color: 'text.primary', py: 1.5, borderRadius: '12px', fontWeight: 'bold', textTransform: 'none',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  {flashcardMutation.isPending ? 'Creating...' : 'Create Flashcards'}
                </Button>
              </Stack>

              {/* Widget Focus */}
              <FocusSessionWidget />

              {/* Widget Chatbot */}
              <ChatWidget materialId={Number(materialId)} />

            </Box>
          </Box>

        </Box>

        <GenerateQuizDialog
          open={openQuizDialog}
          onClose={() => setOpenQuizDialog(false)}
          onSubmit={handleGenerateSubmit}
          isLoading={quizMutation.isPending}
        />
      </Box>
    </Box>
  );
}

export default MaterialDetailPage;