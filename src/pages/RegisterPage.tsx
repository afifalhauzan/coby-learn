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

import { registerUser } from '../services/apiAuthService';
import type { RegisterData } from '../services/apiAuthService';

import { MarkEmailRead as MarkEmailReadIcon } from '@mui/icons-material';



interface FormErrors {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

const initialErrors: FormErrors = {
  username: '',
  email: '',
  password: '',
  password_confirm: '',
};

const validateEmailFormat = (email: string, t: (key: string) => string): string => {
  if (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(String(email).toLowerCase())) {
      return t('auth:errors.invalidEmailFormat');
    }
  }
  return '';
};

function RegisterPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isSuccess, setIsSuccess] = useState(false);

  const [role] = useState<'siswa' | 'pembimbing'>('siswa');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('Registrasi berhasil!', data);
      setIsSuccess(true);
    },

    onError: (error: any) => {
      console.error('Registrasi gagal:', error);

      setErrors(initialErrors);
      setGeneralError(null);

      const responseData = error?.response?.data;

      if (responseData?.data && Array.isArray(responseData.data)) {
        const newErrors = { ...initialErrors };

        responseData.data.forEach((err: { field: string; message: string }) => {
          if (err.field === 'username') newErrors.username = err.message;
          if (err.field === 'email') newErrors.email = err.message;
          if (err.field === 'password') newErrors.password = err.message;
          if (err.field === 'passwordconfirm') newErrors.password_confirm = err.message;
        });

        setErrors(newErrors);
      }
      else if (responseData?.meta?.message) {
        const message = responseData.meta.message;
        const lowerCaseMessage = message.toLowerCase();

        if (
          lowerCaseMessage.includes('email already registered') ||
          lowerCaseMessage.includes('email sudah terdaftar')
        ) {
          setErrors((prev) => ({ ...prev, email: t('auth:errors.emailAlreadyRegistered') }));
        }
        else if (
          lowerCaseMessage.includes('password') &&
          lowerCaseMessage.includes('match')
        ) {
          setErrors((prev) => ({ ...prev, password_confirm: t('auth:errors.passwordMismatch') }));
        }
        else {
          setGeneralError(message);
        }
      }
      else {
        setGeneralError(t('auth:errors.registrationFailed'));
      }
    },
  });





  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors(initialErrors);
    setGeneralError(null);
    mutation.reset();

    const feErrors: Partial<FormErrors> = {};

    const emailFormatError = validateEmailFormat(email, t);
    if (emailFormatError) {
      feErrors.email = emailFormatError;
    }

    if (passwordConfirm && password !== passwordConfirm) {
      feErrors.password_confirm = t('auth:errors.passwordMismatch');
    }

    if (Object.keys(feErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...feErrors }));
      return;
    }

    const data: RegisterData = {
      role: role,
      username: username,
      email: email,
      password: password,
      password_confirm: passwordConfirm,
    };

    mutation.mutate(data);
  };

  if (isSuccess) {
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
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 2
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: 'primary.soft', // Adjust if soft not available, or use alpha
              backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.1)',
              mb: 3
            }}
          >
            <MarkEmailReadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" fontWeight="600" sx={{ mb: 2, color: 'text.primary' }}>
            {t('auth:register.successTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('auth:register.successMessage', { email })}
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/sign-in')}
            sx={{
              textTransform: 'none',
              py: 1.5,
              borderRadius: 3,
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {t('auth:register.goToLogin')}
          </Button>
        </Paper>
      </Box>
    );
  }

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
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)' // Shadow halus
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="600" sx={{ color: 'text.primary', mb: 1 }}>
              {t('auth:register.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('auth:register.subtitle')}
            </Typography>
          </Box>

          {generalError && (
            <Alert severity="error" sx={{ width: '100%', borderRadius: 2 }}>
              {generalError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Stack spacing={2.5}>

              <TextField
                label={t('auth:register.fullnameLabel')}
                name="username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />
              <TextField
                label={t('auth:register.emailLabel')}
                name="email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />
              <TextField
                label={t('auth:register.passwordLabel')}
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
              <TextField
                label={t('auth:register.confirmPasswordLabel')}
                name="password_confirm"
                type="password"
                fullWidth
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                error={!!errors.password_confirm}
                helperText={errors.password_confirm}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />

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
                  color:'white',
                  boxShadow: 3
                }}
              >
                {mutation.isPending ? t('auth:register.creating') : t('auth:register.submit')}
              </Button>



            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {t('auth:register.haveAccount')}{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/sign-in')}
              sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'primary.main' }}
            >
              {t('auth:register.signInLink')}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default RegisterPage;