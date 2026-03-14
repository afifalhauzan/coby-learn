import React from 'react';
import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import { motion, useScroll, useTransform } from 'framer-motion';
import heroImage from '../../assets/hero_image.png';
import { COLORS } from './landingPage.constants';
import { useTheme, useMediaQuery } from '@mui/material';

interface HeroProps {
    isLoggedIn: boolean;
    onPrimaryClick: () => void;
    onSecondaryClick: () => void;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }): React.JSX.Element {
    return (
        <Paper
            elevation={4}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                borderRadius: '12px',
                bgcolor: 'white',
                minWidth: 180,
            }}
        >
            <Box sx={{ color: COLORS.primary, display: 'flex', alignItems: 'center', background: 'rgba(59,130,246,0.1)', p: 1, borderRadius: '10%' }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1, pt: '5px' }}>
                    {label}
                </Typography>
                <Typography variant="h6" sx={{ color: '#1A2B5E', fontWeight: 600 }}>
                    {value}
                </Typography>
            </Box>
        </Paper>
    );
}

function Hero({ isLoggedIn, onPrimaryClick, onSecondaryClick }: HeroProps): React.JSX.Element {
    const { scrollY } = useScroll();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Adjust range based on device
    // On mobile, we reduce the travel distance (e.g., 40px instead of 150px)
    const topCardParallaxY = useTransform(
        scrollY,
        [0, 700],
        [0, isMobile ? 30 : 150]
    );

    const bottomCardParallaxY = useTransform(
        scrollY,
        [0, 700],
        [0, isMobile ? 25 : 95]
    );

    return (
        <Box
            sx={{
                bgcolor: '#EBF3FF',
                pt: { xs: 14, md: 16 },
                pb: { xs: 8, md: 12 },
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                    {/* Left: Text content */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            variant="h2"
                            fontWeight="700"
                            sx={{
                                fontSize: { xs: '2.6rem', md: '3.6rem' },
                                lineHeight: 1.15,
                                color: '#1A2B5E',
                            }}
                        >
                            Learn Smarter,
                        </Typography>
                        <Typography
                            variant="h2"
                            fontWeight="700"
                            sx={{
                                fontSize: { xs: '2.6rem', md: '3.6rem' },
                                color: 'primary.main',
                                mb: 2.5,
                            }}
                        >
                            Not Harder
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ color: '#4A5568', maxWidth: 480, mb: 4, lineHeight: 1.75, fontSize: '1rem' }}
                        >
                            Upload your study materials and let AI instantly transform them into summaries, quizzes, and flashcards. <br /> Turn hours of reading into minutes of mastering.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={onPrimaryClick}
                                sx={{
                                    bgcolor: COLORS.primary,
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '0.95rem',
                                    textTransform: 'none',
                                    boxShadow: 3,
                                    '&:hover': { bgcolor: '#2563EB', transform: 'translateY(-2px)', transition: 'all 0.2s' },
                                }}
                            >
                                {isLoggedIn ? 'Go to Dashboard' : 'Start Learning'}
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={onSecondaryClick}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '0.95rem',
                                    textTransform: 'none',
                                    borderColor: COLORS.primary,
                                    color: COLORS.primary,
                                    '&:hover': { bgcolor: 'rgba(59,130,246,0.06)', borderColor: '#2563EB' },
                                }}
                            >
                                View Features
                            </Button>
                        </Stack>
                    </Grid>

                    {/* Right: Hero image with floating stat cards */}
                    {/* Parent Grid: The "Stage" */}
                    <Grid
                        size={{ xs: 12, md: 5, xl: 6 }}
                        sx={{
                            position: 'relative',
                            display: 'flex',           // Make grid item a flex container
                            alignItems: 'center',       // Vertical center
                            justifyContent: 'center',    // Horizontal center
                            minHeight: { md: 400 }      // Ensure there's height to center in
                        }}
                    >
                        {/* Inner Box: The "Anchor" (Matches Image Width) */}
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: 520,           // Tightly wraps the image
                                display: 'inline-block'   // Shrink-wrap to content
                            }}
                        >
                            <Box
                                component="img"
                                src={heroImage}
                                alt="Student learning with AI"
                                sx={{
                                    width: '100%',
                                    display: 'block',       // Remove image bottom gap
                                    height: 'auto',
                                    borderRadius: '24px',
                                    objectFit: 'cover',
                                }}
                            />

                            {/* Top-left stat card - Now anchored exactly to image top-left */}
                            <Box sx={{ position: 'absolute', top: { xs: 20, md: 40 }, left: { xs: -10, md: -24 } }}>
                                <motion.div style={{ y: topCardParallaxY }}>
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <StatCard
                                            icon={<BarChartIcon />}
                                            label="Study Progress"
                                            value="87% Completed"
                                        />
                                    </motion.div>
                                </motion.div>
                            </Box>

                            {/* Bottom-right stat card - Anchored exactly to image bottom-right */}
                            <Box sx={{ position: 'absolute', bottom: { xs: 20, md: 40 }, right: { xs: -10, md: -24 } }}>
                                <motion.div style={{ y: bottomCardParallaxY }}>
                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                    >
                                        <StatCard
                                            icon={<SchoolIcon />}
                                            label="AI Generated"
                                            value="50+ Flashcards"
                                        />
                                    </motion.div>
                                </motion.div>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Hero;
