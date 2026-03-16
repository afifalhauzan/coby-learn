import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface SpotlightCalloutProps {
  open: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
  onOverlayClick: () => void;
  title?: string;
  description?: string;
  dismissAriaLabel?: string;
}

interface SpotlightRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function SpotlightCallout({
  open,
  targetRef,
  onOverlayClick,
  title = 'Start here: Add your first task',
  description = 'Tap the Add Task button to create your next study step. Click the dark area to dismiss this message.',
  dismissAriaLabel = 'Dismiss spotlight',
}: SpotlightCalloutProps): React.JSX.Element | null {
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isFadedIn, setIsFadedIn] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowOverlay(false);
      setIsFadedIn(false);
      return;
    }

    let rafId = 0;
    const timerId = window.setTimeout(() => {
      setShowOverlay(true);
      rafId = window.requestAnimationFrame(() => {
        setIsFadedIn(true);
      });
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const el = targetRef.current;
      if (!el) {
        setRect(null);
        return;
      }
      const bounds = el.getBoundingClientRect();
      setRect({
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      });
    };

    updateRect();

    const rafId = window.requestAnimationFrame(updateRect);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    const el = targetRef.current;
    const observer = el ? new ResizeObserver(() => updateRect()) : null;
    if (el && observer) {
      observer.observe(el);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
      observer?.disconnect();
    };
  }, [open, targetRef]);

  useEffect(() => {
    if (!open) return;

    const targetEl = targetRef.current;
    if (!targetEl) return;

    const handleTargetClick = () => {
      onOverlayClick();
    };

    targetEl.addEventListener('click', handleTargetClick);
    return () => {
      targetEl.removeEventListener('click', handleTargetClick);
    };
  }, [open, targetRef, onOverlayClick]);

  const spotlight = useMemo(() => {
    if (!rect) return null;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padX = 10;
    const padY = 8;
    const left = Math.max(8, rect.left - padX);
    const top = Math.max(8, rect.top - padY);
    const right = Math.min(viewportWidth - 8, rect.left + rect.width + padX);
    const bottom = Math.min(viewportHeight - 8, rect.top + rect.height + padY);
    const centerX = left + (right - left) / 2;
    const centerY = top + (bottom - top) / 2;

    return {
      centerX,
      centerY,
      left,
      top,
      right,
      bottom,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
      borderRadius: 12,
    };
  }, [rect]);

  if (!open || !spotlight || !showOverlay) {
    return null;
  }

  const viewportWidth = window.innerWidth;
  const calloutTop = Math.min(spotlight.bottom + 18, window.innerHeight - 170);
  const preferLeft = spotlight.centerX > viewportWidth * 0.58;
  const calloutLeft = preferLeft
    ? Math.max(16, spotlight.centerX - 280)
    : Math.min(viewportWidth - 296, Math.max(16, spotlight.centerX - 8));

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal + 20,
        pointerEvents: 'none',
        opacity: isFadedIn ? 1 : 0,
        transition: 'opacity 240ms ease',
      }}
    >
      <Box
        onClick={onOverlayClick}
        role="button"
        aria-label={dismissAriaLabel}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: spotlight.top,
          bgcolor: 'rgba(0, 0, 0, 0.26)',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      />
      <Box
        onClick={onOverlayClick}
        role="button"
        aria-label={dismissAriaLabel}
        sx={{
          position: 'fixed',
          top: spotlight.top,
          left: 0,
          width: spotlight.left,
          height: spotlight.height,
          bgcolor: 'rgba(0, 0, 0, 0.26)',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      />
      <Box
        onClick={onOverlayClick}
        role="button"
        aria-label={dismissAriaLabel}
        sx={{
          position: 'fixed',
          top: spotlight.top,
          left: spotlight.right,
          right: 0,
          height: spotlight.height,
          bgcolor: 'rgba(0, 0, 0, 0.26)',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      />
      <Box
        onClick={onOverlayClick}
        role="button"
        aria-label={dismissAriaLabel}
        sx={{
          position: 'fixed',
          top: spotlight.bottom,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.26)',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          top: spotlight.top,
          left: spotlight.left,
          width: spotlight.width,
          height: spotlight.height,
          borderRadius: 2,
          pointerEvents: 'none',
        }}
      />

      <Paper
        elevation={8}
        onClick={(event) => event.stopPropagation()}
        sx={{
          position: 'fixed',
          top: calloutTop,
          left: calloutLeft,
          pointerEvents: 'auto',
          width: { xs: 'min(92vw, 280px)', sm: 280 },
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary', mb: 0.75 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.45 }}>
          {description}
        </Typography>
      </Paper>
    </Box>
  );
}

export default SpotlightCallout;
