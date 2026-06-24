import { questions, Subscale } from './questions';

export type Severity = 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';

export interface SubscaleScores {
  depression: number;
  anxiety: number;
  stress: number;
}

export interface SubscaleClassifications {
  depression: Severity;
  anxiety: Severity;
  stress: Severity;
}

export interface ScoringResult {
  scores: SubscaleScores;
  classifications: SubscaleClassifications;
}

const DEPRESSION_CUTOFFS = {
  normal: 9,
  mild: 13,
  moderate: 20,
  severe: 27,
};

const ANXIETY_CUTOFFS = {
  normal: 7,
  mild: 9,
  moderate: 14,
  severe: 19,
};

const STRESS_CUTOFFS = {
  normal: 14,
  mild: 18,
  moderate: 25,
  severe: 33,
};

export function calculateSubscaleScores(answers: Record<string, number>): SubscaleScores {
  const depressionSum = questions
    .filter(q => q.subscale === 'depression')
    .reduce((sum, q) => sum + (answers[q.id] || 0), 0);
  
  const anxietySum = questions
    .filter(q => q.subscale === 'anxiety')
    .reduce((sum, q) => sum + (answers[q.id] || 0), 0);
  
  const stressSum = questions
    .filter(q => q.subscale === 'stress')
    .reduce((sum, q) => sum + (answers[q.id] || 0), 0);

  return {
    depression: depressionSum * 2,
    anxiety: anxietySum * 2,
    stress: stressSum * 2,
  };
}

export function classifyDepression(score: number): Severity {
  if (score <= DEPRESSION_CUTOFFS.normal) return 'normal';
  if (score <= DEPRESSION_CUTOFFS.mild) return 'mild';
  if (score <= DEPRESSION_CUTOFFS.moderate) return 'moderate';
  if (score <= DEPRESSION_CUTOFFS.severe) return 'severe';
  return 'extremely_severe';
}

export function classifyAnxiety(score: number): Severity {
  if (score <= ANXIETY_CUTOFFS.normal) return 'normal';
  if (score <= ANXIETY_CUTOFFS.mild) return 'mild';
  if (score <= ANXIETY_CUTOFFS.moderate) return 'moderate';
  if (score <= ANXIETY_CUTOFFS.severe) return 'severe';
  return 'extremely_severe';
}

export function classifyStress(score: number): Severity {
  if (score <= STRESS_CUTOFFS.normal) return 'normal';
  if (score <= STRESS_CUTOFFS.mild) return 'mild';
  if (score <= STRESS_CUTOFFS.moderate) return 'moderate';
  if (score <= STRESS_CUTOFFS.severe) return 'severe';
  return 'extremely_severe';
}

export function classifySeverity(subscale: Subscale, score: number): Severity {
  switch (subscale) {
    case 'depression':
      return classifyDepression(score);
    case 'anxiety':
      return classifyAnxiety(score);
    case 'stress':
      return classifyStress(score);
  }
}

export function calculateScoringResult(answers: Record<string, number>): ScoringResult {
  const scores = calculateSubscaleScores(answers);
  
  const classifications: SubscaleClassifications = {
    depression: classifyDepression(scores.depression),
    anxiety: classifyAnxiety(scores.anxiety),
    stress: classifyStress(scores.stress),
  };

  return {
    scores,
    classifications,
  };
}
