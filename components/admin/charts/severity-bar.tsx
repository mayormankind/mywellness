'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SEVERITY_COLORS, SEVERITY_LABELS, SEVERITY_ORDER } from './chart-constants';
import { cn } from '@/lib/utils';

type SeverityEntry = Record<string, number>;

interface SeverityTrendEntry {
  month: string;
  depression: SeverityEntry;
  anxiety: SeverityEntry;
  stress: SeverityEntry;
}

interface SeverityBarProps {
  data: SeverityTrendEntry[];
}

type Subscale = 'depression' | 'anxiety' | 'stress';

function formatMonth(month: string): string {
  const [year, m] = month.split('-');
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
}

export default function SeverityBar({ data }: SeverityBarProps) {
  const [subscale, setSubscale] = useState<Subscale>('depression');

  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  const chartData = data.map(d => ({
    label: formatMonth(d.month),
    ...d[subscale],
  }));

  const tabs: { key: Subscale; label: string }[] = [
    { key: 'depression', label: 'Depression' },
    { key: 'anxiety', label: 'Anxiety' },
    { key: 'stress', label: 'Stress' },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-4">
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
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span style={{ fontSize: 11 }}>{SEVERITY_LABELS[v] ?? v}</span>}
          />
          {SEVERITY_ORDER.map(s => (
            <Bar key={s} dataKey={s} stackId="a" fill={SEVERITY_COLORS[s]} name={s} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
