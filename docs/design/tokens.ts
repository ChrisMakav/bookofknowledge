/**
 * Book of Knowledge — Design Tokens (TypeScript)
 *
 * Mirror of tokens.css for programmatic use: dynamic styles,
 * chart libraries (recharts), animation libraries (framer-motion),
 * test assertions, and Storybook theming.
 *
 * CSS variables remain the canonical source of truth.
 * Keep this file in sync with tokens.css.
 */

export const colors = {
  brand: {
    50:  '#F0EEFF',
    100: '#E4DDFF',
    200: '#C9BBFF',
    300: '#AD98FF',
    400: '#9276FF',
    500: '#7755FF',
    600: '#5B3BF5', // primary — CTA, active, progress
    700: '#4A2FCC',
    800: '#3A24A3',
    900: '#2A1A7A',
    950: '#1A0F52',
  },
  accent: {
    300: '#67F0F5',
    400: '#34E4EB',
    500: '#00C8D4', // CTA in dark panels
    600: '#00A3AD',
  },
  surface: {
    page:    '#F7F5FF',
    card:    '#FFFFFF',
    subtle:  '#F0EEFF',
    dark:    '#1E1B3A',
    darker:  '#13112B',
  },
  text: {
    primary:      '#0F0D26',
    secondary:    '#5A5870',
    muted:        '#9795A8',
    inverse:      '#FFFFFF',
    inverseMuted: '#B8B5D0',
  },
  border: {
    default: '#E8E5F5',
    subtle:  '#F0EDF8',
    strong:  '#C9C4E8',
    dark:    '#2E2A50',
  },
  /** Fixed genre identifiers — never remap */
  genre: {
    scifi:     '#00B8C8',
    romance:   '#F09335',
    thriller:  '#E8458A',
    fantasy:   '#7B5CF5',
    lifestyle: '#3CB97E',
    tech:      '#4F7EF5',
  },
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error:   '#EF4444',
  },
} as const;

export const typography = {
  fontFamily: {
    display: "'Plus Jakarta Sans', var(--font-sans)",
    sans:    'var(--font-geist-sans), Inter, system-ui, sans-serif',
    mono:    'var(--font-geist-mono), Fira Code, monospace',
  },
  /**
   * Font size scale in rem.
   * Use with line-heights below — pair them explicitly.
   */
  fontSize: {
    xs:   '0.75rem',
    sm:   '0.875rem',
    base: '1rem',
    lg:   '1.125rem',
    xl:   '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  fontWeight: {
    normal:    400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },
  lineHeight: {
    tight:   1.2,
    snug:    1.35,
    normal:  1.5,
    relaxed: 1.65,
  },
  letterSpacing: {
    tight:   '-0.025em', // large display text
    normal:   '0em',
    wide:     '0.05em',
    wider:    '0.1em',
    widest:   '0.15em', // all-caps labels
  },
} as const;

export const radii = {
  sm:     '0.375rem',
  md:     '0.5rem',
  lg:     '0.75rem',
  xl:     '1rem',
  '2xl':  '1.25rem',
  '3xl':  '1.5rem',
  full:   '9999px',
  // semantic aliases
  button: '0.75rem',
  card:   '1rem',
  panel:  '1.25rem',
  banner: '1.5rem',
  badge:  '9999px',
  input:  '0.75rem',
} as const;

export const shadows = {
  xs:    '0 1px 2px rgba(15, 13, 38, 0.04)',
  sm:    '0 2px 6px rgba(91, 59, 245, 0.08)',
  md:    '0 4px 16px rgba(91, 59, 245, 0.12)',
  lg:    '0 8px 32px rgba(91, 59, 245, 0.16)',
  xl:    '0 16px 48px rgba(91, 59, 245, 0.20)',
  // semantic aliases
  card:  '0 2px 6px rgba(91, 59, 245, 0.08)',
  hover: '0 4px 16px rgba(91, 59, 245, 0.12)',
  panel: '0 8px 32px rgba(91, 59, 245, 0.16)',
  modal: '0 16px 48px rgba(91, 59, 245, 0.20)',
} as const;

export const animation = {
  duration: {
    fast:   150,  // ms — hover color changes, focus rings
    base:   200,  // ms — button press, dropdown open
    slow:   300,  // ms — card hover lift, sidebar slide
    slower: 500,  // ms — progress bar fill on mount, chart draw
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)', // card lift, FAB appear
    out:     'cubic-bezier(0, 0, 0.2, 1)',
  },
} as const;

export const layout = {
  navHeight:    '4rem',    // 64px
  sidebarWidth: '15rem',   // 240px
  contentMax:   '80rem',   // 1280px
  containerSm:  '40rem',   // 640px
  containerMd:  '48rem',   // 768px
  containerLg:  '64rem',   // 1024px
  containerXl:  '80rem',   // 1280px
} as const;

/**
 * Reading progress bar color mapping.
 * Used in BookCard to reflect completion status.
 */
export const progressColor = (percent: number): string => {
  if (percent >= 100) return colors.semantic.success;
  if (percent >= 75)  return colors.brand[600];
  if (percent >= 25)  return colors.brand[400];
  return colors.brand[200];
};
