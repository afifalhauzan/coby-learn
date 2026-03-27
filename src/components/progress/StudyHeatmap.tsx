import { useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface HeatmapDay {
  level: number;
  tasks: number;
  date: string;
}

// Dummy data generator
const generateHeatmapData = (year: number, month: number): HeatmapDay[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data: HeatmapDay[] = [];

  // Real world limits for this specific user scenario
  const today = new Date();
  // Reset time to start of day for accurate comparison
  today.setHours(23, 59, 59, 999);

  // User started 12 days ago
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 12);
  startDate.setHours(0, 0, 0, 0);

  // Create a seed based on year/month
  const seed = year * 12 + month;

  for (let i = 1; i <= 35; i++) {
    let currentDay = i;
    let isCurrentMonth = true;

    // Simple logic for grid: 1-daysInMonth are current month
    // Just for visual grid filler
    if (i > daysInMonth) {
      currentDay = i - daysInMonth;
      isCurrentMonth = false;
    }

    // Construct precise date for this cell
    // Note: We are visualizing the month passed in arguments
    const cellDate = new Date(year, isCurrentMonth ? month : month + 1, currentDay);

    // 1. Basic formatting
    const dateStr = cellDate.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    // 2. Determine Level based on constraints
    let level = 0;
    let tasks = 0;

    // Check bounds: Future dates OR Dates before start date
    const isFuture = cellDate > today;
    const isBeforeStart = cellDate < startDate;

    if (!isFuture && !isBeforeStart) {
      // Valid active range
      const pseudoRandom = Math.sin(i * seed * 123.45);
      level = Math.floor((pseudoRandom + 1) * 2.5); // 0 to 4
      if (level > 4) level = 4;
      if (level < 0) level = 0;

      // Ensure at least level 1 if it's within the active 12 days to look populated
      if (level === 0) level = 1;

      // Tasks based on level
      if (level === 1) tasks = Math.floor(Math.random() * 2) + 1;
      else if (level === 2) tasks = Math.floor(Math.random() * 3) + 3;
      else if (level === 3) tasks = Math.floor(Math.random() * 3) + 6;
      else if (level === 4) tasks = Math.floor(Math.random() * 3) + 9;
    }

    // If it's next month filler or filtered out, ensure 0
    if (!isCurrentMonth) {
      level = 0;
      tasks = 0;
    }

    data.push({
      level,
      tasks,
      date: dateStr
    });
  }
  return data;
};

const getCrystalForLevel = (level: number): string | null => {
  if (level <= 0) {
    return null;
  }

  return `/crystal${Math.min(level, 3)}.svg`;
};

interface CrystalTileProps {
  activityCount: number;
}

function CrystalTile({ activityCount }: CrystalTileProps): React.JSX.Element | null {
  const { t } = useTranslation();
  const level = Math.min(Math.max(activityCount, 0), 4);

  if (level === 0) {
    return null;
  }

  if (activityCount > 6) {
    return (
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <Box
          component="img"
          src="/crystal4_bg.svg"
          alt={t('progress:labels.crystalLevelBackground', { level: 4 })}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />

        <Box
          component={motion.img}
          src="/crystal4_isolate.svg"
          alt={t('progress:labels.crystalLevel', { level: 4 })}
          animate={{
            y: [0, -3, 0],
            filter: [
              'drop-shadow(0 0 8px rgba(0, 255, 255, 0.35))',
              'drop-shadow(0 0 15px rgba(0, 255, 255, 0.7))',
              'drop-shadow(0 0 8px rgba(0, 255, 255, 0.35))',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            inset: 0,
            top: '8%',
            left: '8%',
            width: '85%',
            height: '85%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      component={motion.img}
      src={getCrystalForLevel(level) || undefined}
      alt={t('progress:labels.crystalLevel', { level })}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        pointerEvents: 'none',
      }}
    />
  );
}

function StudyHeatmap(): React.JSX.Element {
  const { t } = useTranslation();
  // State for current month view
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = [
    t('progress:labels.sun'),
    t('progress:labels.mon'),
    t('progress:labels.tue'),
    t('progress:labels.wed'),
    t('progress:labels.thu'),
    t('progress:labels.fri'),
    t('progress:labels.sat'),
  ];

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate((prev: Date) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Generate data based on current view
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const displayData = generateHeatmapData(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <Box>
      {/* Header Heatmap */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: '600' }}>
          {t('progress:labels.studyHeatmap')}
        </Typography>
      </Box>

      {/* Month Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, bgcolor: 'action.hover', p: 1, borderRadius: 2 }}>
        <Box
          component="button"
          onClick={() => handleMonthChange('prev')}
          sx={{ border: 'none', bgcolor: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: 'primary.main' }}
        >
          &lt; {t('progress:actions.previous')}
        </Box>
        <Typography variant="body2" fontWeight="600">{currentMonthName}</Typography>
        <Box
          component="button"
          onClick={() => handleMonthChange('next')}
          sx={{ border: 'none', bgcolor: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: 'primary.main' }}
        >
          {t('progress:actions.next')} &gt;
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', mb: 1 }}>
        {daysOfWeek.map(day => (
          <Typography key={day} variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
            {day}
          </Typography>
        ))}

        {displayData.slice(0, 35).map((dayData, index) => (
          <Tooltip
            key={index}
            title={
              dayData.tasks === 0
                ? t('progress:heatmap.noActivity', { date: dayData.date })
                : t('progress:heatmap.studyActivity', { count: dayData.tasks, date: dayData.date })
            }
            arrow
            placement="top"
          >
            <Box
              sx={{
                width: '100%',
                paddingBottom: '100%',
                bgcolor: dayData.level === 0 ? '#E5F4F9' : '#E5F4F9',
                border: '1px solid',
                borderColor: dayData.level === 0 ? 'divider' : 'rgba(59, 130, 246, 0.15)',
                position: 'relative',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <CrystalTile key={`${dayData.level}-${dayData.tasks}`} activityCount={dayData.tasks} />
              </AnimatePresence>
            </Box>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">{t('progress:labels.less')}</Typography>
        <Box sx={{ width: 15, height: 15, borderRadius: '3px', bgcolor: 'rgba(0,0,0,0.04)', border: '1px solid', borderColor: 'divider' }} />
        {[1, 2, 3, 4].map((level) => (
          <Box
            key={level}
            component="img"
            src={`/crystal${level}.svg`}
            alt={t('progress:labels.legendCrystalLevel', { level })}
            sx={{ width: 15, height: 15, objectFit: 'contain' }}
          />
        ))}
        <Typography variant="body2" color="text.secondary">{t('progress:labels.more')}</Typography>
      </Box>
    </Box>
  );
}

export default StudyHeatmap;
