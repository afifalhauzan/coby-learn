import React, { useMemo, useState } from 'react';
import {
    Box,
    LinearProgress,
    Paper,
    Stack,
    Typography,
    IconButton,
    useTheme,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DocumentIcon from '@mui/icons-material/Description';
import TimerIcon from '@mui/icons-material/Timer';
import { AnimatePresence, motion } from 'framer-motion';

type Mission = {
    id: 'early-bird' | 'researcher' | 'focus-master';
    title: string;
    target: string;
    Icon: typeof WbTwilightIcon;
};

interface DailyMissionsPanelProps {
    dailyQuizDone?: boolean;
}

const missions: Mission[] = [
    {
        id: 'early-bird',
        title: 'The Task Master',
        target: 'Complete 1 Task for Today',
        Icon: DocumentIcon,
    },
    {
        id: 'researcher',
        title: 'The Researcher',
        target: 'Upload 1 new study material',
        Icon: UploadFileIcon,
    },
    {
        id: 'focus-master',
        title: 'Focus Master',
        target: 'Complete a 25-minute Pomodoro session',
        Icon: TimerIcon,
    },
];

function DailyMissionsPanel({ dailyQuizDone = false }: DailyMissionsPanelProps): React.JSX.Element {
    const theme = useTheme();
    const [completed, setCompleted] = useState<Record<Mission['id'], boolean>>({
        'early-bird': dailyQuizDone,
        'researcher': false,
        'focus-master': false,
    });

    const mergedCompleted = {
        ...completed,
        'early-bird': completed['early-bird'] || dailyQuizDone,
    };

    const completedCount = useMemo(
        () => missions.filter((mission) => mergedCompleted[mission.id]).length,
        [mergedCompleted]
    );
    const progress = (completedCount / missions.length) * 100;

    const toggleMission = (id: Mission['id']) => {
        if (id === 'early-bird' && dailyQuizDone) {
            return;
        }

        setCompleted((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <Paper
            sx={{
                p: 2.5,
                borderRadius: '16px',
                bgcolor: 'background.paper',
                boxShadow: '0 10px 26px rgba(59, 130, 246, 0.18)',
                border: '1px solid',
                borderColor: 'rgba(59, 130, 246, 0.2)',
            }}
        >
            <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 2 }}>
                Daily Missions
            </Typography>

            <Stack spacing={1.25}>
                {missions.map((mission) => {
                    const isDone = mergedCompleted[mission.id];

                    return (
                        <Box
                            key={mission.id}
                            component={motion.div}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.995 }}
                            onClick={() => toggleMission(mission.id)}
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: isDone ? 'primary.main' : 'divider',
                                bgcolor: isDone ? 'rgba(59, 130, 246, 0.08)' : 'background.default',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.25,
                                cursor: 'pointer',
                                transition: theme.transitions.create(['border-color', 'background-color'], {
                                    duration: theme.transitions.duration.shorter,
                                }),
                            }}
                        >
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: isDone ? 'rgba(59, 130, 246, 0.28)' : 'action.hover',
                                    color: isDone ? 'primary.main' : 'text.secondary',
                                }}
                            >
                                <mission.Icon fontSize="small" />
                            </Box>

                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Box sx={{ position: 'flex',flexDirection: 'row', alignItems: 'center', display: 'flex', gap: 0.5 }}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: isDone ? 'text.secondary' : 'text.primary' }}>
                                        {mission.title}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: isDone ? 'text.secondary' : 'text.primary' }}>
                                    {mission.target}
                                </Typography>
                            </Box>

                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    toggleMission(mission.id);
                                }}
                                sx={{ p: 0.5 }}
                                aria-label={`Toggle ${mission.title} mission`}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {isDone ? (
                                        <Box
                                            key="done"
                                            component={motion.div}
                                            initial={{ scale: 0.35, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.7, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                                        >
                                            <CheckCircleRoundedIcon sx={{ color: 'primary.main' }} />
                                        </Box>
                                    ) : (
                                        <Box
                                            key="todo"
                                            component={motion.div}
                                            initial={{ scale: 0.7, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.7, opacity: 0 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            <CheckCircleRoundedIcon sx={{ color: 'action.disabled' }} />
                                        </Box>
                                    )}
                                </AnimatePresence>
                            </IconButton>
                        </Box>
                    );
                })}
            </Stack>

            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                        Daily Progress
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
                        {completedCount}/{missions.length}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 9,
                        borderRadius: 99,
                        bgcolor: 'rgba(59, 130, 246, 0.14)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 99,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                        },
                    }}
                />
            </Box>
        </Paper>
    );
}

export default DailyMissionsPanel;
