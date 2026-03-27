import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import heroImage from '../../assets/hero_image.png';
import { COLORS } from './landingPage.constants';
import { useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const heroWords = [
        t('landing:hero.words.smarter'),
        t('landing:hero.words.better'),
    ];
    const { scrollY } = useScroll();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setWordIndex((prev) => (prev + 1) % heroWords.length);
        }, 4500); // Change word every 4.8 seconds

        return () => window.clearInterval(timer);
    }, [heroWords.length]);

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
                minHeight: '90vh',
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
                                color: 'secondary.dark',
                            }}
                        >
                            {t('landing:hero.titlePrefix')}{' '}
                            <Box
                                component="span"
                                sx={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    width: { xs: '190px', md: '260px' },
                                    height: '1.13em',
                                    overflow: 'hidden',
                                    verticalAlign: 'bottom',
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={heroWords[wordIndex]}
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -18 }}
                                        transition={{ duration: 0.35, ease: 'easeOut' }}
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            display: 'inline-block',
                                            color: 'primary.main',
                                            font: 'inherit',
                                            lineHeight: 'inherit',
                                        }}
                                    >
                                        {heroWords[wordIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </Box>
                            
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
                            {t('landing:hero.titleSuffix')}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ color: '#4A5568', maxWidth: 480, mb: 4, lineHeight: 1.75, fontSize: '1rem' }}
                        >
                            {t('landing:hero.subtitleLine1')} <br /> {t('landing:hero.subtitleLine2')}
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
                                {isLoggedIn ? t('common:actions.goToDashboard') : t('common:actions.startLearning')}
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
                                {t('common:actions.viewFeatures')}
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
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 0px rgba(37, 99, 235, 0)',   // Start: No glow
                                        '0 0 40px rgba(37, 99, 235, 0.5)', // Middle: Full glow
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "mirror", // This is the secret to "smooth infinite in and out"
                                    ease: "easeInOut",    // Prevents the mechanical/blocked linear speed
                                }}
                                style={{ borderRadius: 24, overflow: 'visible' }} // Ensure overflow is visible!
                            >
                                <Box
                                    component="img"
                                    src={heroImage}
                                    alt={t('landing:hero.imageAlt')}
                                    sx={{
                                        width: '100%',
                                        display: 'block',       // Remove image bottom gap
                                        height: 'auto',
                                        borderRadius: '24px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </motion.div>

                            {/* Top-left stat card - Now anchored exactly to image top-left */}
                            <Box sx={{ position: 'absolute', top: { xs: 20, md: 40 }, left: { xs: -10, md: -24 } }}>
                                <motion.div style={{ y: topCardParallaxY }}>
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <StatCard
                                            icon={<BarChartIcon />}
                                            label={t('landing:hero.stats.studyProgress.label')}
                                            value={t('landing:hero.stats.studyProgress.value')}
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
                                            label={t('landing:hero.stats.aiGenerated.label')}
                                            value={t('landing:hero.stats.aiGenerated.value')}
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
