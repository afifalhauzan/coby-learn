export const COLORS = {
  bgLight: '#F8FAFC',
  bgCard: '#FFFFFF',
  primary: '#3B82F6',
  primaryGlow: 'rgba(59, 130, 246, 0.3)',
  accent: 'primary.main',
  accentGlow: 'rgba(249, 115, 22, 0.3)',
  textMain: '#1E293B',
  textMuted: '#64748B',
  border: 'rgba(15, 23, 42, 0.1)',
} as const;

export const LANDING_NAV_ITEMS = [
  { label: 'Features', id: 'features' },
  { label: 'How it Works', id: 'how-it-works' },
  { label: 'FAQ', id: 'faq' },
] as const;
