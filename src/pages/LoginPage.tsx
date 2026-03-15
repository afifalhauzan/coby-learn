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
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { loginUser, resendVerification } from '../services/apiAuthService';
import apiClient from '../lib/axios';
import userLoginLottie from '../assets/UserLogin.lottie';


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


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // --- MUTATION LOGIN BIASA ---
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      navigate('/dashboard');
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
          setGeneralError('Please verify your email address to continue.');
        } else {
          setGeneralError(responseData.meta.message);
        }
      } else {
        setGeneralError('Invalid email or password. Please try again.');
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
      setResendSuccess('Verification email sent! Please check your inbox.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to resend verification email.';
      setGeneralError(message);
    }
  });

  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const handleResendVerification = () => {
    if (email) {
      resendVerificationMutation.mutate(email);
    } else {
      setGeneralError('Please enter your email address first.');
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
              <DotLottieReact src={userLoginLottie} loop autoplay style={{ width: '100%', height: '100%' }} />
            </Box>
            <Typography variant="h4" fontWeight="600" sx={{ color: 'text.primary' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please enter your details to sign in.
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
                    {resendVerificationMutation.isPending ? 'Sending...' : 'Resend Email'}
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
                label="Email Address"
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
                  label="Password"
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
                    Forgot password?
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
                {mutation.isPending ? 'Signing In...' : 'Sign In'}
              </Button>



            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/sign-up')}
              sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'primary.main' }}
            >
              Sign Up
            </Link>
          </Typography>

          <Box
            sx={{
              width: '100%',
              borderRadius: 2,
              px: 2,
              py: 1.25,
              bgcolor: 'grey.100',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Dummy User: <strong>admin@gmail.com</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Password: <strong>password</strong>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

export default LoginPage;