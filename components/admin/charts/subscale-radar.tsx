'use client';

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PRIMARY } from './chart-constants';

interface SubscaleRadarProps {
  scores: {
    depression: number;
    anxiety: number;
    stress: number;
  };
}

const MAX_SCORE = 42;

export default function SubscaleRadar({ scores }: SubscaleRadarProps) {
  const data = [
    { subject: 'Depression', score: scores.depression, fullMark: MAX_SCORE },
    { subject: 'Anxiety', score: scores.anxiety, fullMark: MAX_SCORE },
    { subject: 'Stress', score: scores.stress, fullMark: MAX_SCORE },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, MAX_SCORE]}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickCount={4}
        />
        <Radar
          name="Avg Score"
          dataKey="score"
          stroke={PRIMARY}
          fill={PRIMARY}
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip formatter={(v: number) => [`${v} / ${MAX_SCORE}`, 'Avg Score']} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
