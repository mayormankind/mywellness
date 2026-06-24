import { Severity, SubscaleClassifications } from './scoring';

export interface FeedbackItem {
  title: string;
  message: string;
  recommendations: string[];
  severity: 'info' | 'warning' | 'danger';
}

export interface FeedbackResult {
  overall: FeedbackItem;
  depression: FeedbackItem;
  anxiety: FeedbackItem;
  stress: FeedbackItem;
  requiresProfessionalHelp: boolean;
}

const FEEDBACK_MATRIX: Record<Severity, FeedbackItem> = {
  normal: {
    title: 'Normal Range',
    message: 'Your scores indicate that you are within the normal range for this subscale. Continue maintaining healthy habits and self-care practices.',
    recommendations: [
      'Continue regular physical activity',
      'Maintain social connections',
      'Practice stress management techniques',
      'Get adequate sleep and nutrition',
    ],
    severity: 'info',
  },
  mild: {
    title: 'Mild Symptoms',
    message: 'Your scores indicate mild symptoms. Consider implementing self-care strategies to address these concerns.',
    recommendations: [
      'Practice relaxation techniques (deep breathing, meditation)',
      'Increase physical activity',
      'Talk to friends or family about your feelings',
      'Consider journaling to track your mood',
    ],
    severity: 'info',
  },
  moderate: {
    title: 'Moderate Symptoms',
    message: 'Your scores indicate moderate symptoms that may benefit from additional support and self-care strategies.',
    recommendations: [
      'Consider speaking with a counselor or mental health professional',
      'Practice regular stress management techniques',
      'Maintain a consistent sleep schedule',
      'Limit caffeine and alcohol intake',
      'Engage in regular exercise',
    ],
    severity: 'warning',
  },
  severe: {
    title: 'Severe Symptoms',
    message: 'Your scores indicate severe symptoms. It is strongly recommended that you seek professional support.',
    recommendations: [
      'Schedule an appointment with a mental health professional',
      'Contact your university counseling center',
      'Reach out to a trusted friend or family member',
      'Practice self-compassion and avoid self-criticism',
    ],
    severity: 'danger',
  },
  extremely_severe: {
    title: 'Extremely Severe Symptoms',
    message: 'Your scores indicate extremely severe symptoms. Professional support is strongly recommended.',
    recommendations: [
      'Seek immediate professional help',
      'Contact your university counseling center or health services',
      'Consider reaching out to crisis support services if needed',
      'Do not face this alone - support is available',
    ],
    severity: 'danger',
  },
};

const SAFETY_RESOURCES = [
  'If you are in immediate distress, please contact emergency services',
  'FUTA Counseling Services: [Contact information to be added]',
  'National Mental Health Helpline: [Contact information to be added]',
];

function getFeedbackForSeverity(severity: Severity): FeedbackItem {
  return FEEDBACK_MATRIX[severity];
}

function checkRequiresProfessionalHelp(classifications: SubscaleClassifications): boolean {
  return (
    classifications.depression === 'severe' ||
    classifications.depression === 'extremely_severe' ||
    classifications.anxiety === 'severe' ||
    classifications.anxiety === 'extremely_severe' ||
    classifications.stress === 'severe' ||
    classifications.stress === 'extremely_severe'
  );
}

function generateOverallFeedback(
  classifications: SubscaleClassifications,
  requiresProfessionalHelp: boolean
): FeedbackItem {
  const hasAnySymptoms = Object.values(classifications).some(c => c !== 'normal');

  if (requiresProfessionalHelp) {
    return {
      title: 'Professional Support Recommended',
      message: 'Your assessment indicates significant symptoms across one or more areas. Professional support can help you develop effective coping strategies.',
      recommendations: [
        ...SAFETY_RESOURCES,
        'Schedule an appointment with a mental health professional',
        'Reach out to your university counseling center',
      ],
      severity: 'danger',
    };
  }

  if (hasAnySymptoms) {
    return {
      title: 'Self-Care Recommended',
      message: 'Your assessment indicates some symptoms that may benefit from self-care strategies and increased awareness.',
      recommendations: [
        'Practice regular self-care activities',
        'Monitor your symptoms and track patterns',
        'Consider speaking with a counselor if symptoms persist',
        'Maintain healthy lifestyle habits',
      ],
      severity: 'warning',
    };
  }

  return {
    title: 'Good Mental Well-Being',
    message: 'Your assessment indicates good mental well-being across all areas. Continue maintaining healthy habits.',
    recommendations: [
      'Continue your current self-care practices',
      'Stay connected with supportive relationships',
      'Maintain work-life balance',
      'Regular check-ins with yourself about your mental state',
    ],
    severity: 'info',
  };
}

export function generateFeedback(classifications: SubscaleClassifications): FeedbackResult {
  const requiresProfessionalHelp = checkRequiresProfessionalHelp(classifications);

  return {
    overall: generateOverallFeedback(classifications, requiresProfessionalHelp),
    depression: getFeedbackForSeverity(classifications.depression),
    anxiety: getFeedbackForSeverity(classifications.anxiety),
    stress: getFeedbackForSeverity(classifications.stress),
    requiresProfessionalHelp,
  };
}
