import React, { useRef } from 'react';
import { Box, Container, Grid, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { COLORS } from './landingPage.constants';
import { useTranslation } from 'react-i18next';

const SOFT_BLUE_SHADOW = '0 24px 60px rgba(26, 43, 94, 0.1)';
const SOFT_BLUE_SHADOW_STRONG = '0 26px 64px rgba(26, 43, 94, 0.16)';

function SummaryVisual(): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: '16px',
                bgcolor: '#F8FAFC',
                border: '1px solid rgba(15, 23, 42, 0.06)',
                boxShadow: SOFT_BLUE_SHADOW,
            }}
        >
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#F97316' }} />
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#FBBF24' }} />
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#4ADE80' }} />
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: '10px',
                    p: 1.5,
                    mb: 1.8,
                    border: '1px solid rgba(15, 23, 42, 0.05)',
                    bgcolor: '#FFFFFF',
                }}
            >
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#243B63', mb: 1.3, fontFamily: 'Poppins, sans-serif' }}>
                    {t('landing:howItWorks.summaryVisual.originalDocument')}
                </Typography>

                {[84, 58, 52].map((w, idx) => (
                    <motion.div
                        key={w}
                        animate={{ opacity: [1, 0.45, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.12 }}
                    >
                        <Box
                            sx={{
                                height: 7,
                                borderRadius: 10,
                                mb: idx === 2 ? 0 : 0.9,
                                width: `${w}%`,
                                bgcolor: '#E8EEF7',
                            }}
                        />
                    </motion.div>
                ))}
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.6 }}>
                <KeyboardDoubleArrowDownRoundedIcon sx={{ color: '#3B82F6', fontSize: 24 }} />
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: '10px',
                    p: 1.5,
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    bgcolor: '#F1F6FF',
                }}
            >
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#3B82F6', mb: 1.3, fontFamily: 'Poppins, sans-serif' }}>
                    {t('landing:howItWorks.summaryVisual.aiSummary')}
                </Typography>

                {[96, 70, 56].map((w, idx) => (
                    <motion.div
                        key={w}
                        animate={{ opacity: [1, 0.45, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.12 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                            <RadioButtonUncheckedRoundedIcon sx={{ color: '#60A5FA', fontSize: 11 }} />
                            <Box sx={{ height: 7, borderRadius: 10, width: `${w}%`, bgcolor: '#DBEAFE' }} />
                        </Box>
                    </motion.div>
                ))}
            </Paper>
        </Paper>
    );
}

function QuizVisual({
    flashOpacity,
    flashX,
    flashY,
}: {
    flashOpacity: any;
    flashX: any;
    flashY: any;
}): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <Box sx={{ position: 'relative' }}>
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: '#F8FAFC',
                    border: '1px solid rgba(15, 23, 42, 0.06)',
                    boxShadow: SOFT_BLUE_SHADOW,
                }}
            >
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: '#94A3B8', mb: 1, letterSpacing: '0.08em', fontWeight: 700 }}>
                    {t('landing:howItWorks.quizVisual.questionProgress')}
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#1E3A66', mb: 2, lineHeight: 1.28 }}>
                    {t('landing:howItWorks.quizVisual.questionTitle')}
                </Typography>

                {[
                    { label: t('landing:howItWorks.quizVisual.options.option1'), active: true },
                    { label: t('landing:howItWorks.quizVisual.options.option2'), active: false },
                    { label: t('landing:howItWorks.quizVisual.options.option3'), active: false },
                ].map((item) => (
                    <Box
                        component={motion.div}
                        key={item.label}
                        animate={
                            item.active
                                ? {
                                    borderColor: ['#3B82F6', '#22C55E', '#3B82F6'],
                                    boxShadow: [
                                        '0 0 0px rgba(59,130,246,0)',
                                        '0 0 14px rgba(34,197,94,0.45)',
                                        '0 0 0px rgba(59,130,246,0)',
                                    ],
                                    backgroundColor: ['#EFF6FF', '#ECFDF3', '#EFF6FF'],
                                }
                                : undefined
                        }
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        sx={{
                            py: 1.6,
                            px: 1.8,
                            borderRadius: '10px',
                            border: item.active ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                            mb: 1.1,
                            bgcolor: item.active ? '#EFF6FF' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', color: '#334155', fontWeight: 500 }}>
                            {item.label}
                        </Typography>
                        {item.active ? (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <CheckCircleRoundedIcon sx={{ color: '#22C55E', fontSize: 16 }} />
                                <Typography sx={{ color: '#16A34A', fontWeight: 700, fontSize: '0.75rem' }}>
                                    {t('landing:howItWorks.quizVisual.correctLabel')}
                                </Typography>
                            </Stack>
                        ) : (
                            <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #CBD5E1' }} />
                        )}
                    </Box>
                ))}
            </Paper>

            <motion.div
                style={{ opacity: flashOpacity, x: flashX, y: flashY }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        position: 'absolute',
                        left: { xs: -12, md: -22 },
                        bottom: { xs: -26, md: -34 },
                        width: { xs: 208, md: 232 },
                        p: 2,
                        bgcolor: '#1A2B5E',
                        color: 'white',
                        borderRadius: '12px',
                        boxShadow: SOFT_BLUE_SHADOW_STRONG,
                        transform: 'rotate(-4deg)',
                        zIndex: 4,
                    }}
                >
                    <Typography sx={{ fontSize: '0.68rem', opacity: 0.75, mb: 1, fontFamily: 'Poppins, sans-serif' }}>
                        {t('landing:howItWorks.quizVisual.flashcardLabel')}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, lineHeight: 1.5 }}>
                        {t('landing:howItWorks.quizVisual.flashcardQuestion')}
                    </Typography>
                    <Typography sx={{ mt: 1.2, color: '#60A5FA', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>
                        {t('landing:howItWorks.quizVisual.showAnswer')}
                    </Typography>
                </Paper>
            </motion.div>
        </Box>
    );
}

function HowItWorksSection(): React.JSX.Element {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const trackRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ['start start', 'end end'],
    });

    const visualAOpacity = useSpring(useTransform(scrollYProgress, [0.45, 0.55], [1, 0]), {
        stiffness: 100,
        damping: 20,
    });
    const visualAScale = useSpring(useTransform(scrollYProgress, [0.45, 0.55], [1, 0.9]), {
        stiffness: 100,
        damping: 20,
    });

    const visualBOpacity = useSpring(useTransform(scrollYProgress, [0.45, 0.55], [0, 1]), {
        stiffness: 100,
        damping: 20,
    });
    const visualBScale = useSpring(useTransform(scrollYProgress, [0.45, 0.55], [0.9, 1]), {
        stiffness: 100,
        damping: 20,
    });

    const flashOpacity = useSpring(useTransform(scrollYProgress, [0.58, 0.74], [0, 1]), {
        stiffness: 100,
        damping: 20,
    });
    const flashX = useSpring(useTransform(scrollYProgress, [0.58, 0.74], [-24, 0]), {
        stiffness: 100,
        damping: 20,
    });
    const flashY = useSpring(useTransform(scrollYProgress, [0.58, 0.74], [24, 0]), {
        stiffness: 100,
        damping: 20,
    });

    // const textTrackY = useTransform(scrollYProgress, [0, 0.5, 1], ['16vh', '-8vh', '-52vh']);
    const textTrackY = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        ['30vh', '-20vh', '-115vh'] // Increased negative value pulls the 2nd section up faster
    );

    if (isMobile) {
        return (
            <Box
                id="how-it-works"
                sx={{
                    bgcolor: COLORS.bgCard,
                    borderTop: `1px solid ${COLORS.border}`,
                    borderBottom: `1px solid ${COLORS.border}`,
                    py: 5,
                    px: 3,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="700"
                    textAlign="center"
                    sx={{ mb: 7, color: '#1E3A66', fontFamily: 'Poppins, sans-serif' }}
                >
                    {t('landing:howItWorks.title')}
                </Typography>

                <Stack spacing={8}>
                    {/* Section 1: Summarization */}
                    <Box>
                        <SummaryVisual />
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{ color: '#3B82F6', fontFamily: 'Poppins, sans-serif', mb: 1, fontWeight: 500 }}>
                                {t('landing:howItWorks.sections.summary.eyebrow')}
                            </Typography>
                            <Typography sx={{ color: '#1E3A66', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3, mb: 1.5 }}>
                                {t('landing:howItWorks.sections.summary.mobileTitle')}
                            </Typography>
                            <Typography sx={{ color: COLORS.textMuted, fontFamily: 'Poppins, sans-serif' }}>
                                {t('landing:howItWorks.sections.summary.mobileDescription')}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Section 2: Quiz */}
                    <Box>
                        {/* Extra bottom padding to give room for the absolute-positioned flashcard */}
                        <Box sx={{ pb: '60px' }}>
                            <QuizVisual flashOpacity={1} flashX={0} flashY={0} />
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{ color: '#3B82F6', fontFamily: 'Poppins, sans-serif', mb: 1, fontWeight: 500 }}>
                                {t('landing:howItWorks.sections.quiz.eyebrow')}
                            </Typography>
                            <Typography sx={{ color: '#1E3A66', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3, mb: 1.5 }}>
                                {t('landing:howItWorks.sections.quiz.mobileTitle')}
                            </Typography>
                            <Typography sx={{ color: COLORS.textMuted, fontFamily: 'Poppins, sans-serif' }}>
                                {t('landing:howItWorks.sections.quiz.mobileDescription')}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        );
    }

    return (
        <Box
            id="how-it-works"
            ref={trackRef}
            sx={{
                height: isMobile ? 'auto' : '300vh', // Mobile usually doesn't need the 300vh track
                position: 'relative',
                bgcolor: COLORS.bgCard,
                borderTop: `1px solid ${COLORS.border}`,
                borderBottom: `1px solid ${COLORS.border}`,
                overflowX: 'clip'
            }}
        >
            <Box
                sx={{
                    // This is the "Stage" that stays visible
                    position: isMobile ? 'relative' : 'sticky',
                    top: 0,
                    height: isMobile ? 'auto' : '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden', // Keeps the moving text track contained
                    overflowX: 'clip'
                }}
            >
                <Container maxWidth="lg" sx={{ py: isMobile ? 8 : 0 }}>
                    <Grid container spacing={5} alignItems="center">
                        {/* Visual Column */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            {isMobile && (
                                <Typography
                                    variant="h3"
                                    fontWeight="700"
                                    textAlign="center"
                                    sx={{ mb: 4, color: '#1E3A66', fontFamily: 'Poppins' }}
                                >
                                    {t('landing:howItWorks.title')}
                                </Typography>
                            )}

                            <Box sx={{
                                display: 'grid',
                                '& > *': { gridArea: '1 / 1' }, // Stack visuals on top of each other
                                perspective: '1000px'
                            }}>
                                <motion.div
                                    style={{
                                        opacity: isMobile ? 1 : visualAOpacity,
                                        scale: isMobile ? 1 : visualAScale,
                                        zIndex: 2,
                                    }}
                                >
                                    <SummaryVisual />
                                </motion.div>

                                {!isMobile && (
                                    <motion.div
                                        style={{
                                            opacity: visualBOpacity,
                                            scale: visualBScale,
                                            zIndex: 3,
                                        }}
                                    >
                                        <QuizVisual flashOpacity={flashOpacity} flashX={flashX} flashY={flashY} />
                                    </motion.div>
                                )}
                            </Box>
                        </Grid>

                        {/* Text Column */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            {!isMobile ? (
                                <Box sx={{ height: '70vh', overflow: 'hidden', position: 'relative' }}>
                                    <motion.div style={{ y: textTrackY }}>
                                        {/* Section 1 */}
                                        <Box sx={{ py: '35vh' }}>
                                            <Typography sx={{ color: '#3B82F6', fontWeight: 500, mb: 1 }}>{t('landing:howItWorks.sections.summary.eyebrow')}</Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 600, color: '#1E3A66', mb: 2 }}>
                                                {t('landing:howItWorks.sections.summary.desktopTitle')}
                                            </Typography>
                                            <Typography sx={{ color: COLORS.textMuted }}>
                                                {t('landing:howItWorks.sections.summary.desktopDescription')}
                                            </Typography>
                                        </Box>

                                        {/* Section 2 */}
                                        <Box sx={{ py: '35vh' }}>
                                            <Typography sx={{ color: '#3B82F6', fontWeight: 500, mb: 1 }}>{t('landing:howItWorks.sections.quiz.eyebrow')}</Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 600, color: '#1E3A66', mb: 2 }}>
                                                {t('landing:howItWorks.sections.quiz.desktopTitle')}
                                            </Typography>
                                            <Typography sx={{ color: COLORS.textMuted }}>
                                                {t('landing:howItWorks.sections.quiz.desktopDescription')}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Box>
                            ) : (
                                /* Mobile fallback: Simple vertical stack */
                                <Stack spacing={4} sx={{ mt: 4 }}>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700}>{t('landing:howItWorks.sections.summary.eyebrow')}</Typography>
                                        <Typography sx={{ color: COLORS.textMuted }}>{t('landing:howItWorks.sections.summary.fallbackDescription')}</Typography>
                                    </Box>
                                    <Box>
                                        <QuizVisual flashOpacity={1} flashX={0} flashY={0} />
                                        <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>{t('landing:howItWorks.sections.quiz.eyebrow')}</Typography>
                                        <Typography sx={{ color: COLORS.textMuted }}>{t('landing:howItWorks.sections.quiz.fallbackDescription')}</Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}

export default HowItWorksSection;