import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Stack,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { loginUser, resendVerification } from '../services/apiAuthService';
import apiClient from '../lib/axios';
// import userLoginLottie from '../assets/UserLogin.lottie';


interface FormErrors {
  email: string;
  password: string;
}

const initialErrors: FormErrors = {
  email: '',
  password: '',
};

function LoginPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // --- MUTATION LOGIN BIASA ---
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: any) => {
      // Safely extract token even if backend names it differently (e.g., access_token), 
      // or if it returns the token directly as a string.
      const token = typeof data === 'string' ? data : (data?.token || data?.access_token || data?.accessToken);
      if (token) {
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/dashboard');
      } else {
        setGeneralError(t('auth:errors.invalidResponse'));
      }
    },
    onError: (error: any) => {
      // ... (Logika error handling tetap sama seperti kode Anda)
      console.error('Login gagal:', error);
      const responseData = error?.response?.data;
      setErrors(initialErrors);
      setGeneralError(null);

      if (responseData?.data && Array.isArray(responseData.data)) {
        const newErrors = { ...initialErrors };
        responseData.data.forEach((err: { field: string; message: string }) => {
          if (err.field === 'email') newErrors.email = err.message;
          if (err.field === 'password') newErrors.password = err.message;
        });
        setErrors(newErrors);
      } else if (responseData?.meta?.message) {
        const message = responseData.meta.message.toLowerCase();
        if (message.includes('verify') || message.includes('verifikasi')) {
          setGeneralError(t('auth:errors.verifyEmail'));
        } else {
          setGeneralError(responseData.meta.message);
        }
      } else {
        setGeneralError(t('auth:errors.invalidCredentials'));
      }
    },
  });

  // --- MUTATION LOGIN GOOGLE ---


  // --- MUTATION RESEND VERIFICATION ---
  const resendVerificationMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      setGeneralError(null);
      // Show success message (using alert for now or set a success state)
      // Ideally we should have a success state, but I'll reuse generalError or add a new one?
      // Let's add a local success message state if needed, or just use window.alert or modify the Error Alert to be Success/Info.
      // For better UX, let's use a separate state for success message.
      setResendSuccess(t('auth:messages.verificationSent'));
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || t('auth:errors.verificationFailed');
      setGeneralError(message);
    }
  });

  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const handleResendVerification = () => {
    if (email) {
      resendVerificationMutation.mutate(email);
    } else {
      setGeneralError(t('auth:errors.emailRequired'));
    }
  };



  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(initialErrors);
    setGeneralError(null);
    mutation.reset();
    mutation.mutate({ email, password });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          maxWidth: 450,
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 2 // Shadow halus
        }}
      >
        <Stack spacing={3} alignItems="center">

          {/* Header */}
          <Box sx={{ textAlign: 'center', gap: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }}>
              <DotLottieReact src="/UserLogin.lottie" loop autoplay style={{ width: '100%', height: '100%' }} />
            </Box>
            <Typography variant="h4" fontWeight="600" sx={{ color: 'text.primary' }}>
              {t('auth:login.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('auth:login.subtitle')}
            </Typography>
          </Box>

          {generalError && (
            <Alert
              severity={generalError.toLowerCase().includes('verify') ? "warning" : "error"}
              sx={{
                width: '100%',
                borderRadius: 3,
                fontSize: '0.9rem',
                alignItems: 'center',
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
              action={
                generalError.toLowerCase().includes('verify') ? (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleResendVerification}
                    disabled={resendVerificationMutation.isPending}
                  >
                    {resendVerificationMutation.isPending ? t('common:actions.sending') : t('auth:login.resendEmail')}
                  </Button>
                ) : null
              }
            >
              {generalError}
            </Alert>
          )}

          {resendSuccess && (
            <Alert
              severity="success"
              sx={{
                width: '100%',
                borderRadius: 3,
                fontSize: '0.9rem',
                alignItems: 'center',
              }}
              onClose={() => setResendSuccess(null)}
            >
              {resendSuccess}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Stack spacing={2.5}>

              <TextField
                label={t('auth:login.emailLabel')}
                name="email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                // Styling input agar lebih estetik
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />

              <Box>
                <TextField
                  label={t('auth:login.passwordLabel')}
                  name="password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 3 }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    fontWeight="600"
                    underline="hover"
                    onClick={() => navigate('/forgot-password')}
                  >
                    {t('auth:login.forgotPassword')}
                  </Link>
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={mutation.isPending}
                sx={{
                  textTransform: 'none',
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  boxShadow: 3
                }}
              >
                {mutation.isPending ? t('auth:login.signingIn') : t('auth:login.signIn')}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {t('auth:login.noAccount')}{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/sign-up')}
              sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'primary.main', pb: 0.2, '&:hover': { textDecoration: 'underline' } }}
            >
              {t('auth:login.signUp')}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default LoginPage;