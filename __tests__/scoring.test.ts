import { describe, it, expect } from 'vitest';
import {
  calculateSubscaleScores,
  classifyDepression,
  classifyAnxiety,
  classifyStress,
  calculateScoringResult,
} from '../lib/scoring';

describe('calculateSubscaleScores', () => {
  it('should calculate scores correctly for all zeros', () => {
    const answers: Record<string, number> = {};
    for (let i = 1; i <= 21; i++) {
      answers[`q${i}`] = 0;
    }
    
    const result = calculateSubscaleScores(answers);
    expect(result.depression).toBe(0);
    expect(result.anxiety).toBe(0);
    expect(result.stress).toBe(0);
  });

  it('should multiply subscale sums by 2', () => {
    const answers: Record<string, number> = {
      d1: 1, d2: 1, d3: 1, d4: 1, d5: 1, d6: 1, d7: 1,
      a1: 1, a2: 1, a3: 1, a4: 1, a5: 1, a6: 1, a7: 1,
      s1: 1, s2: 1, s3: 1, s4: 1, s5: 1, s6: 1, s7: 1,
    };
    
    const result = calculateSubscaleScores(answers);
    expect(result.depression).toBe(14);
    expect(result.anxiety).toBe(14);
    expect(result.stress).toBe(14);
  });

  it('should handle missing answers as zero', () => {
    const answers: Record<string, number> = { d1: 3 };
    
    const result = calculateSubscaleScores(answers);
    expect(result.depression).toBe(6);
    expect(result.anxiety).toBe(0);
    expect(result.stress).toBe(0);
  });
});

describe('classifyDepression', () => {
  it('should classify normal depression correctly', () => {
    expect(classifyDepression(9)).toBe('normal');
    expect(classifyDepression(5)).toBe('normal');
  });

  it('should classify mild depression correctly', () => {
    expect(classifyDepression(10)).toBe('mild');
    expect(classifyDepression(13)).toBe('mild');
  });

  it('should classify moderate depression correctly', () => {
    expect(classifyDepression(14)).toBe('moderate');
    expect(classifyDepression(20)).toBe('moderate');
  });

  it('should classify severe depression correctly', () => {
    expect(classifyDepression(21)).toBe('severe');
    expect(classifyDepression(27)).toBe('severe');
  });

  it('should classify extremely severe depression correctly', () => {
    expect(classifyDepression(28)).toBe('extremely_severe');
    expect(classifyDepression(42)).toBe('extremely_severe');
  });
});

describe('classifyAnxiety', () => {
  it('should classify normal anxiety correctly', () => {
    expect(classifyAnxiety(7)).toBe('normal');
    expect(classifyAnxiety(3)).toBe('normal');
  });

  it('should classify mild anxiety correctly', () => {
    expect(classifyAnxiety(8)).toBe('mild');
    expect(classifyAnxiety(9)).toBe('mild');
  });

  it('should classify moderate anxiety correctly', () => {
    expect(classifyAnxiety(10)).toBe('moderate');
    expect(classifyAnxiety(14)).toBe('moderate');
  });

  it('should classify severe anxiety correctly', () => {
    expect(classifyAnxiety(15)).toBe('severe');
    expect(classifyAnxiety(19)).toBe('severe');
  });

  it('should classify extremely severe anxiety correctly', () => {
    expect(classifyAnxiety(20)).toBe('extremely_severe');
    expect(classifyAnxiety(42)).toBe('extremely_severe');
  });
});

describe('classifyStress', () => {
  it('should classify normal stress correctly', () => {
    expect(classifyStress(14)).toBe('normal');
    expect(classifyStress(8)).toBe('normal');
  });

  it('should classify mild stress correctly', () => {
    expect(classifyStress(15)).toBe('mild');
    expect(classifyStress(18)).toBe('mild');
  });

  it('should classify moderate stress correctly', () => {
    expect(classifyStress(19)).toBe('moderate');
    expect(classifyStress(25)).toBe('moderate');
  });

  it('should classify severe stress correctly', () => {
    expect(classifyStress(26)).toBe('severe');
    expect(classifyStress(33)).toBe('severe');
  });

  it('should classify extremely severe stress correctly', () => {
    expect(classifyStress(34)).toBe('extremely_severe');
    expect(classifyStress(42)).toBe('extremely_severe');
  });
});

describe('calculateScoringResult', () => {
  it('should return complete scoring result', () => {
    const answers: Record<string, number> = {
      d1: 1, d2: 1, d3: 1, d4: 1, d5: 1, d6: 1, d7: 1,
      a1: 1, a2: 1, a3: 1, a4: 1, a5: 1, a6: 1, a7: 1,
      s1: 1, s2: 1, s3: 1, s4: 1, s5: 1, s6: 1, s7: 1,
    };
    
    const result = calculateScoringResult(answers);
    
    expect(result.scores.depression).toBe(14);
    expect(result.scores.anxiety).toBe(14);
    expect(result.scores.stress).toBe(14);
    
    expect(result.classifications.depression).toBe('mild');
    expect(result.classifications.anxiety).toBe('moderate');
    expect(result.classifications.stress).toBe('normal');
  });

  it('should handle edge case of all maximum scores', () => {
    const answers: Record<string, number> = {};
    for (let i = 1; i <= 21; i++) {
      answers[`q${i}`] = 3;
    }
    
    const result = calculateScoringResult(answers);
    
    expect(result.scores.depression).toBe(42);
    expect(result.scores.anxiety).toBe(42);
    expect(result.scores.stress).toBe(42);
    
    expect(result.classifications.depression).toBe('extremely_severe');
    expect(result.classifications.anxiety).toBe('extremely_severe');
    expect(result.classifications.stress).toBe('extremely_severe');
  });
});
