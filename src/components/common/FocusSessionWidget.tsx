import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Stack,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  InputAdornment,
  Chip,
} from '@mui/material';

// Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsIcon from '@mui/icons-material/Settings';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SearchIcon from '@mui/icons-material/Search';
import TimerIcon from '@mui/icons-material/Timer';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import YouTube from 'react-youtube';

const RADIO_STATIONS = [
  { id: "jfKfPfyJRdk", name: "Lofi Girl Radio", desc: "Beats to relax/study to" },
  { id: "4xDzrJKXOOY", name: "Synthwave Radio", desc: "Beats to chill/game to" },
  { id: "DXHf0XJtqJw", name: "Quiet Rain", desc: "Nature sounds for focus" },
  { id: "lTRiuFIWV54", name: "Classical Piano", desc: "Mozart for studying" },
  { id: "5qap5aO4i9A", name: "Lofi Hip Hop", desc: "Chill beats mix" },
  { id: "DWcJFNfaw9c", name: "Ambient Space", desc: "Deep focus atmosphere" },
];

const ALARM_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";
const PRESET_DURATIONS = [5, 10, 25, 30, 45, 60]; 

function FocusSessionWidget(): React.JSX.Element {
  
  // States Dialog
  const [openSettings, setOpenSettings] = useState(false);
  const [openMusicSearch, setOpenMusicSearch] = useState(false);
  const [openTimeUpDialog, setOpenTimeUpDialog] = useState(false);

  // Timer States
  const [focusDuration, setFocusDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Audio Ref
  const alarmAudio = useRef(new Audio(ALARM_SOUND_URL));

  // --- LOGIKA SETTINGS ---
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(event.target.value, 10);
    if (isNaN(val)) val = 0;
    if (val > 180) val = 180; 
    setFocusDuration(val);
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setFocusDuration(newValue as number);
  };

  const applySettings = () => {
    if (!isTimerRunning) {
      setTimeLeft(focusDuration * 60);
    }
    setOpenSettings(false);
  };

  useEffect(() => {
  let interval: ReturnType<typeof setInterval>;

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } 
    else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      triggerAlarm();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // --- LOGIKA ALARM ---
  const triggerAlarm = () => {
    alarmAudio.current.loop = true;
    alarmAudio.current.play().catch(e => console.error("Audio play failed:", e));
    setOpenTimeUpDialog(true);
    if (Notification.permission === "granted") {
      new Notification("⏰ Time's Up!", { body: "Focus session completed. Take a break!" });
    }
  };

  const stopAlarmAndReset = () => {
    alarmAudio.current.pause();
    alarmAudio.current.currentTime = 0;
    setOpenTimeUpDialog(false);
    setTimeLeft(focusDuration * 60);
  };

  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(focusDuration * 60);
  };

  // --- LOGIKA MUSIC PLAYER ---
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState(RADIO_STATIONS[0].id);
  const [currentInfo, setCurrentInfo] = useState({ name: RADIO_STATIONS[0].name, desc: RADIO_STATIONS[0].desc });
  
  const [inputVideoUrl, setInputVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  const onPlayerReady = (event: any) => setPlayer(event.target);

  const toggleMusic = () => {
    if (!player) return;
    isPlaying ? player.pauseVideo() : player.playVideo();
    setIsPlaying(!isPlaying);
  };

  const toggleTimer = () => {
    if (!isTimerRunning) {
      if (player && !isPlaying) {
        player.playVideo();
        setIsPlaying(true);
      }
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleSkip = () => {
    const nextIndex = (currentStationIndex + 1) % RADIO_STATIONS.length;
    const nextStation = RADIO_STATIONS[nextIndex];
    setCurrentStationIndex(nextIndex);
    setCurrentVideoId(nextStation.id);
    setCurrentInfo({ name: nextStation.name, desc: nextStation.desc });
    setIsPlaying(true);
  };

  const handleChangeMusic = () => {
    let videoId = inputVideoUrl;
    try {
      const urlObj = new URL(inputVideoUrl);
      if (urlObj.hostname.includes('youtube.com')) videoId = urlObj.searchParams.get('v') || videoId;
      else if (urlObj.hostname.includes('youtu.be')) videoId = urlObj.pathname.slice(1) || videoId;
    } catch (e) {}

    if (videoId) {
      setCurrentVideoId(videoId);
      setCurrentInfo({ name: "Custom Video", desc: "Youtube Selection" });
      setIsPlaying(true);
      setOpenMusicSearch(false);
      setInputVideoUrl('');
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        bgcolor: 'background.paper',
        borderColor: 'divider',
        display: 'flex', 
        flexDirection: 'column', // Force column layout untuk sidebar
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 2,
        position: 'relative', 
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <Box sx={{ display: 'none' }}>
        <YouTube key={currentVideoId} videoId={currentVideoId} opts={{ height: '0', width: '0', playerVars: { autoplay: isPlaying ? 1 : 0, controls: 0 } }} onReady={onPlayerReady} />
      </Box>

      {/* === TIMER SECTION === */}
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        
        {/* Header Widget */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: 'primary.main', letterSpacing: 1 }}>
            Focus Timer
          </Typography>
          {isTimerRunning && (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', animation: 'pulse 1.5s infinite' }} />
          )}
          <IconButton size="small" onClick={() => setOpenSettings(true)} sx={{ color: 'primary.main', p: 0.5 }}>
            <SettingsIcon fontSize="small" sx={{ color: 'primary.main' }} />
          </IconButton>
        </Box>

        {/* Big Timer */}
        <Typography variant="h4" fontWeight="500" sx={{ color: 'text.primary', letterSpacing: 2, fontSize: '3.5rem', lineHeight: 1 }}>
          {formatTime(timeLeft)}
        </Typography>

        {/* Controls */}
        <Stack direction="row" spacing={1} sx={{ mt: 3, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            fullWidth
            onClick={toggleTimer} 
            startIcon={isTimerRunning ? <PauseIcon /> : <PlayArrowIcon />} 
            sx={{ 
              bgcolor: 'secondary.main', color: 'white', fontWeight: 'bold', 
              borderRadius: '12px', py: 1, textTransform: 'none', 
              boxShadow: 4,
              '&:hover': { bgcolor: 'secondary.dark' } 
            }}
          >
            {isTimerRunning ? 'Pause' : 'Start Focus'}
          </Button>
          
          <IconButton 
            onClick={handleResetTimer} 
            sx={{ 
              color: 'text.secondary', 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: '12px',
              width: 42,
              height: 42,
              '&:hover': { bgcolor: 'action.hover', color: 'text.primary' }
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* === MUSIC PLAYER SECTION (COMPACT CARD) === */}
      <Box 
        sx={{ 
          width: '90%', 
          p:1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
          {/* Album Art / Icon */}
          <Box sx={{ 
            width: 48, height: 48, borderRadius: '10px', 
            bgcolor: 'background.paper', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <VolumeUpIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentInfo.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentInfo.desc}
            </Typography>
          </Box>
        </Box>

        {/* Music Controls */}
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: 1.5 }}>
           <IconButton 
             onClick={toggleMusic} 
             size="small"
             sx={{ 
               color: 'white', 
               bgcolor: 'text.primary', 
               '&:hover': { bgcolor: 'text.secondary' }, 
               width: 32, height: 32 
             }}
           >
             {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
           </IconButton>

          <LinearProgress
            variant="determinate"
            value={isPlaying ? 100 : 0}
            sx={{
              flexGrow: 1,
              height: 6,
              borderRadius: 999,
              bgcolor: 'rgba(0, 0, 0, 0.12)',
              '& .MuiLinearProgress-bar': { bgcolor: 'text.primary' },
            }}
          />

          <IconButton onClick={handleSkip} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
            <SkipNextIcon />
          </IconButton>
        </Box>

        <Button
          fullWidth
          size="small"
          onClick={() => setOpenMusicSearch(true)}
          startIcon={<MusicNoteIcon fontSize="small" />}
          sx={{ mt: 1.5, fontSize: '0.7rem', color: 'primary.main', textTransform: 'none', py: 0.5, '&:hover': { color: 'text.secondary', bgcolor: 'transparent' } }}
        >
          Change Station
        </Button>
      </Box>

      {/* === 1. MODAL WAKTU HABIS (ALARM) === */}
      <Dialog 
        open={openTimeUpDialog} 
        onClose={() => {}} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: { 
            bgcolor: 'background.paper', 
            color: 'text.primary',
            textAlign: 'center',
            p: 2,
            border: '2px solid',
            borderColor: 'secondary.main',
            boxShadow: 10 
          }
        }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ animation: 'shake 0.5s infinite' }}>
            <AccessAlarmIcon sx={{ fontSize: 80, color: 'secondary.main' }} />
          </Box>
          <Typography variant="h4" fontWeight="bold">Time's Up!</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Great job focusing! Take a short break now.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={stopAlarmAndReset}
            startIcon={<CheckCircleIcon />}
            sx={{ 
              bgcolor: 'secondary.main', color: 'white', fontWeight: 'bold', 
              borderRadius: 50, px: 4,
              '&:hover': { bgcolor: 'secondary.dark' } 
            }}
          >
            Stop Alarm
          </Button>
        </DialogActions>
      </Dialog>

      {/* === 2. MODAL SETTINGS === */}
      <Dialog open={openSettings} onClose={() => setOpenSettings(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { bgcolor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'divider' } }}>
        <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <TimerIcon sx={{ color: 'secondary.main' }} /> Set Duration
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
          <Box sx={{ my: 4, position: 'relative', display: 'inline-block' }}>
            <TextField variant="standard" type="number" value={focusDuration} onChange={handleInputChange} inputProps={{ min: 1, max: 180, style: { textAlign: 'center', fontSize: '3.5rem', fontWeight: '600', padding: 0 } }} sx={{ width: '120px', '& .MuiInput-underline:before': { borderBottom: 'none' }, '& .MuiInput-underline:after': { borderBottom: 'none' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' } }} />
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', position: 'absolute', bottom: 10, right: -40, fontWeight: 'bold' }}>min</Typography>
          </Box>
          <Box sx={{ px: 2, mb: 4 }}>
            <Slider value={typeof focusDuration === 'number' ? focusDuration : 0} onChange={handleSliderChange} min={5} max={120} step={1} sx={{ color: 'secondary.main', height: 6, '& .MuiSlider-thumb': { width: 20, height: 20, bgcolor: 'background.paper', border: '4px solid', borderColor: 'secondary.main' }, '& .MuiSlider-rail': { bgcolor: 'divider', opacity: 1 } }} />
          </Box>
          <Typography variant="caption" sx={{ color: 'text.primary', mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>Quick Presets</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            {PRESET_DURATIONS.map((preset) => (
              <Chip key={preset} label={`${preset}m`} onClick={() => setFocusDuration(preset)} sx={{ bgcolor: focusDuration === preset ? 'secondary.main' : 'action.selected', color: focusDuration === preset ? 'white' : 'text.secondary', fontWeight: 'bold', border: 'none', '&:hover': { bgcolor: focusDuration === preset ? 'secondary.dark' : 'action.hover' } }} />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button onClick={applySettings} fullWidth variant="contained" size="large" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 'bold', borderRadius: '10px', px: 4, py: 1, textTransform: 'none', '&:hover': { bgcolor: 'secondary.dark' } }}>Start Focus</Button>
        </DialogActions>
      </Dialog>

      {/* === 3. MODAL MUSIC SEARCH === */}
      <Dialog open={openMusicSearch} onClose={() => setOpenMusicSearch(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Change Background Music</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="YouTube URL / ID" placeholder="e.g. jfKfPfyJRdk" fullWidth variant="outlined" value={inputVideoUrl} onChange={(e) => setInputVideoUrl(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMusicSearch(false)}>Cancel</Button>
          <Button onClick={handleChangeMusic} variant="contained" sx={{color:'white'}}>Play</Button>
        </DialogActions>
      </Dialog>

      <style>{`
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        @keyframes shake { 0% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } 100% { transform: rotate(0deg); } }
      `}</style>
    </Paper>
  );
}

export default FocusSessionWidget;