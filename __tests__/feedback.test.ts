import { describe, it, expect } from 'vitest';
import { generateFeedback } from '../lib/feedback';
import type { SubscaleClassifications } from '../lib/scoring';

describe('generateFeedback', () => {
  it('should return feedback for all normal classifications', () => {
    const classifications: SubscaleClassifications = {
      depression: 'normal',
      anxiety: 'normal',
      stress: 'normal',
    };
    
    const result = generateFeedback(classifications);
    
    expect(result.overall.title).toBe('Good Mental Well-Being');
    expect(result.depression.title).toBe('Normal Range');
    expect(result.anxiety.title).toBe('Normal Range');
    expect(result.stress.title).toBe('Normal Range');
    expect(result.requiresProfessionalHelp).toBe(false);
  });

  it('should return feedback for mild symptoms', () => {
    const classifications: SubscaleClassifications = {
      depression: 'mild',
      anxiety: 'normal',
      stress: 'normal',
    };
    
    const result = generateFeedback(classifications);
    
    expect(result.overall.title).toBe('Self-Care Recommended');
    expect(result.depression.title).toBe('Mild Symptoms');
    expect(result.requiresProfessionalHelp).toBe(false);
  });

  it('should return feedback for moderate symptoms', () => {
    const classifications: SubscaleClassifications = {
      depression: 'moderate',
      anxiety: 'moderate',
      stress: 'normal',
    };
    
    const result = generateFeedback(classifications);
    
    expect(result.overall.title).toBe('Self-Care Recommended');
    expect(result.depression.title).toBe('Moderate Symptoms');
    expect(result.anxiety.title).toBe('Moderate Symptoms');
    expect(result.requiresProfessionalHelp).toBe(false);
  });

  it('should return feedback for severe symptoms and flag professional help', () => {
    const classifications: SubscaleClassifications = {
      depression: 'severe',
      anxiety: 'normal',
      stress: 'normal',
    };
    
    const result = generateFeedback(classifications);
    
    expect(result.overall.title).toBe('Professional Support Recommended');
    expect(result.depression.title).toBe('Severe Symptoms');
    expect(result.requiresProfessionalHelp).toBe(true);
  });

  it('should return feedback for extremely severe symptoms and flag professional help', () => {
    const classifications: SubscaleClassifications = {
      depression: 'extremely_severe',
      anxiety: 'extremely_severe',
      stress: 'normal',
    };
    
    const result = generateFeedback(classifications);
    
    expect(result.overall.title).toBe('Professional Support Recommended');
    expect(result.depression.title).toBe('Extremely Severe Symptoms');
    expect(result.anxiety.title).toBe('Extremely Severe Symptoms');
    expect(result.requiresProfessionalHelp).toBe(true);
  });

  it('should include safety resources when professional help is required', () => {
    const classifications: SubscaleClassifications = {
      depression: 'severe',
      anxiety: 'normal',
      stress: 'normal',
    };
    
    const result = generateFeedback(classifications);
    
    expect(result.overall.recommendations).toContain('If you are in immediate distress, please contact emergency services');
    expect(result.overall.recommendations).toContain('FUTA Counseling Services: [Contact information to be added]');
  });

  it('should include recommendations for each subscale', () => {
    const classifications: SubscaleClassifications = {
      depression: 'mild',
      anxiety: 'mild',
      stress: 'mild',
    };
    
    const result = generateFeedback(classifications);
    
    expect(result.depression.recommendations.length).toBeGreaterThan(0);
    expect(result.anxiety.recommendations.length).toBeGreaterThan(0);
    expect(result.stress.recommendations.length).toBeGreaterThan(0);
  });
});
