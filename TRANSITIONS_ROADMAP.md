# Project Transition Rollout Roadmap

This roadmap standardizes motion across the codebase using MUI transition primitives and theme tokens.

## Source of truth

- MUI customization transitions: https://mui.com/material-ui/customization/transitions/
- MUI transition components: https://mui.com/material-ui/transitions/

## Principles

- Use `theme.transitions.create(...)` for CSS transitions instead of ad-hoc strings.
- Use MUI transition components (`Fade`, `Grow`, `Slide`, `Collapse`, `Zoom`) for mount/unmount and state-driven motion.
- Keep motion subtle and purposeful: short durations for hover and medium durations for layout/context changes.
- Prefer consistency over novelty. If unsure, use `duration.shorter` and `easing.easeInOut`.

## Phase plan

1. Phase 1 (started): Tasks calendar and cards
- Replace raw transition literals with theme transitions.
- Add light entrance transition for task card list.
- Add month-grid transition when changing month.

2. Phase 2: Reusable transition helpers
- Add shared helpers in `src/theme` or `src/utils` for common motion patterns:
  - interactiveHover
  - emphasisEntry
  - surfaceStateChange
- Refactor high-traffic widgets to use helpers.

3. Phase 3: Dialogs and overlays
- Normalize `TransitionComponent` usage in dialogs.
- Standardize timeout values and `mountOnEnter`/`unmountOnExit` for heavy content.

4. Phase 4: Global theme overrides
- Refactor existing theme component overrides to use `theme.transitions.create` consistently.
- Remove remaining hardcoded transition strings.

5. Phase 5: Accessibility and polish
- Add reduced-motion handling for non-essential animations.
- Validate UX on mobile and low-end devices.

## Tracking

- Search target: `transition:` string literals in `src/**`.
- Completion target: all interactive transitions use theme tokens or MUI transition components.
