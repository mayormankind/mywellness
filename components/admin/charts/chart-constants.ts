export const SEVERITY_COLORS: Record<string, string> = {
  normal: '#22c55e',
  mild: '#84cc16',
  moderate: '#f59e0b',
  severe: '#f97316',
  extremely_severe: '#ef4444',
};

export const SEVERITY_LABELS: Record<string, string> = {
  normal: 'Normal',
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  extremely_severe: 'Extremely Severe',
};

export const SUBSCALE_COLORS = {
  depression: '#8b5cf6',
  anxiety: '#f59e0b',
  stress: '#ef4444',
};

export const PRIMARY = '#20ADA0';

export const SEVERITY_ORDER = [
  'normal',
  'mild',
  'moderate',
  'severe',
  'extremely_severe',
] as const;
