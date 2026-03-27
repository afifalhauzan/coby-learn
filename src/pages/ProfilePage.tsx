import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Avatar,
    Stack,
    Alert,
    Fade,
} from '@mui/material';
import { Save as SaveIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getProfile, updateProfile } from '../services/apiUserService';
import type { UpdateProfileData } from '../services/apiUserService';

function ProfilePage(): React.JSX.Element {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch current profile
    const { data: userProfile, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getProfile,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (userProfile) {
            setUsername(userProfile.username);
            setEmail(userProfile.email);
        }
    }, [userProfile]);

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            setSuccessMessage(t('profile:messages.updateSuccess', { defaultValue: 'Profile updated successfully!' }));
            setErrorMessage(null);
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['dailyQuizStatus'] }); // Might affect navbar name
        },
        onError: (error: any) => {
            setSuccessMessage(null);
            const msg = error?.response?.data?.message || t('profile:messages.updateFailed', { defaultValue: 'Failed to update profile' });
            setErrorMessage(msg);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);

        const data: UpdateProfileData = {
            username,
            email
        };
        mutation.mutate(data);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                {t('profile:title', { defaultValue: 'Account Settings' })}
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Stack spacing={4} alignItems="center">
                    {/* Avatar Section */}
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: 'primary.main',
                                fontSize: '2.5rem',
                                border: '4px solid',
                                borderColor: 'background.paper',
                                boxShadow: 3
                            }}
                        >
                            {username ? username.charAt(0).toUpperCase() : <AccountCircleIcon sx={{ fontSize: 60 }} />}
                        </Avatar>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Stack spacing={3}>
                            {successMessage && (
                                <Fade in>
                                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                                        {successMessage}
                                    </Alert>
                                </Fade>
                            )}

                            {errorMessage && (
                                <Fade in>
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        {errorMessage}
                                    </Alert>
                                </Fade>
                            )}

                            <TextField
                                label={t('profile:fields.username.label', { defaultValue: 'Username' })}
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading || mutation.isPending}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: 3 }
                                }}
                            />

                            <TextField
                                label={t('profile:fields.email.label', { defaultValue: 'Email Address' })}
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading || mutation.isPending}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: 3 }
                                }}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={isLoading || mutation.isPending}
                                    startIcon={<SaveIcon />}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 3,
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        color:'white',
                                        boxShadow: 4
                                    }}
                                >
                                    {mutation.isPending
                                        ? t('common:states.saving', { defaultValue: 'Saving...' })
                                        : t('common:actions.save', { defaultValue: 'Save Changes' })}
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}

export default ProfilePage;
