'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { SUBSCALE_COLORS } from './chart-constants';
import { cn } from '@/lib/utils';

interface QuestionEntry {
  id: string;
  text: string;
  subscale: 'depression' | 'anxiety' | 'stress';
  avgScore: number;
}

interface QuestionBarProps {
  data: QuestionEntry[];
}

type Subscale = 'depression' | 'anxiety' | 'stress' | 'all';

const MAX_ITEM_SCORE = 3;

export default function QuestionBar({ data }: QuestionBarProps) {
  const [subscale, setSubscale] = useState<Subscale>('all');

  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  const filtered =
    subscale === 'all' ? data : data.filter(q => q.subscale === subscale);

  const chartData = filtered.map(q => ({
    id: q.id.toUpperCase(),
    avgScore: q.avgScore,
    subscale: q.subscale,
    text: q.text,
  }));

  const tabs: { key: Subscale; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'depression', label: 'Depression' },
    { key: 'anxiety', label: 'Anxiety' },
    { key: 'stress', label: 'Stress' },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setSubscale(t.key)}
            className={cn(
              'px-3 py-1 rounded text-xs font-medium transition-colors',
              subscale === t.key
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, MAX_ITEM_SCORE]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="id"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(v: number, _name, props) => [
              `${v.toFixed(2)} / 3`,
              props.payload?.text ?? 'Avg Score',
            ]}
          />
          <Bar dataKey="avgScore" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={SUBSCALE_COLORS[entry.subscale as keyof typeof SUBSCALE_COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
