import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Alert,

} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LockReset as LockResetIcon } from '@mui/icons-material';
import { forgotPassword } from '../services/apiAuthService';

function ForgotPasswordPage(): React.JSX.Element {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const mutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            setMessage({
                type: 'success',
                text: data?.meta?.message || 'Instructions have been sent to your email.'
            });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.meta?.message || 'Failed to send reset email. Please try again.';
            setMessage({
                type: 'error',
                text: errorMessage
            });
        }
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email address.' });
            return;
        }
        mutation.mutate(email);
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
                    borderRadius: 5,
                    maxWidth: 450,
                    width: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
            >
                <Stack spacing={3} alignItems="center">

                    <Box sx={{ textAlign: 'center' }}>
                        <LockResetIcon sx={{ color: 'primary.main', fontSize: 48, mb: 1 }} />
                        <Typography variant="h4" fontWeight="800" sx={{ color: 'text.primary' }}>
                            Reset Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your email to receive reset instructions.
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

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}
                            >
                                {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </Stack>
                    </Box>

                    <Button
                        onClick={() => navigate('/sign-in')}
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Back to Login
                    </Button>

                </Stack>
            </Paper>
        </Box>
    );
}

export default ForgotPasswordPage;
