import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Alert
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Lock as LockIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../services/apiAuthService';

function ResetPasswordPage(): React.JSX.Element {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Try to get token from URL query param ?token=...
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            setMessage({
                type: 'success',
                text: data?.meta?.message || t('auth:resetPassword.messages.successRedirect', { defaultValue: 'Password successfully reset. Redirecting to login...' })
            });
            setTimeout(() => navigate('/sign-in'), 3000);
        },
        onError: (error: any) => {
            console.log(error)
            const errorMessage = error?.response?.data?.meta?.message || t('auth:resetPassword.messages.failed', { defaultValue: 'Failed to reset password.' });
            setMessage({
                type: 'error',
                text: errorMessage
            });
        }
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);

        if (!token) {
            setMessage({ type: 'error', text: t('auth:resetPassword.messages.invalidToken', { defaultValue: 'Invalid or missing token.' }) });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: t('auth:resetPassword.messages.passwordMismatch', { defaultValue: 'Passwords do not match.' }) });
            return;
        }
        if (password.length < 6) {
            setMessage({ type: 'error', text: t('auth:resetPassword.messages.passwordMinLength', { defaultValue: 'Password must be at least 6 characters.' }) });
            return;
        }

        mutation.mutate({
            token,
            password,
            password_confirm: confirmPassword
        });
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
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
            >
                <Stack spacing={3} alignItems="center">

                    <Box sx={{ textAlign: 'center' }}>
                        <LockIcon sx={{ color: 'primary.main', fontSize: 48, mb: 1 }} />
                        <Typography variant="h4" fontWeight="600" sx={{ color: 'text.primary' }}>
                            {t('auth:resetPassword.title', { defaultValue: 'Set New Password' })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t('auth:resetPassword.subtitle', { defaultValue: 'Please enter your new password below.' })}
                        </Typography>
                    </Box>

                    {message && (
                        <Alert
                            severity={message.type}
                            sx={{ width: '100%', borderRadius: 3 }}
                        >
                            {message.text}
                        </Alert>
                    )}

                    {/* If token is missing, show manual input just in case, or just error */}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <Stack spacing={2.5}>

                            {!searchParams.get('token') && (
                                <TextField
                                    label={t('auth:resetPassword.fields.token.label', { defaultValue: 'Reset Token' })}
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    fullWidth
                                    helperText={t('auth:resetPassword.fields.token.helperText', { defaultValue: 'Paste the token from your email if not auto-filled' })}
                                />
                            )}

                            <TextField
                                label={t('auth:resetPassword.fields.newPassword.label', { defaultValue: 'New Password' })}
                                type="password"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />

                            <TextField
                                label={t('auth:resetPassword.fields.confirmPassword.label', { defaultValue: 'Confirm Password' })}
                                type="password"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}
                            >
                                {mutation.isPending
                                    ? t('auth:resetPassword.actions.resetting', { defaultValue: 'Resetting...' })
                                    : t('auth:resetPassword.actions.reset', { defaultValue: 'Reset Password' })}
                            </Button>
                        </Stack>
                    </Box>

                </Stack>
            </Paper>
        </Box>
    );
}

export default ResetPasswordPage;
