'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SEVERITY_COLORS, SEVERITY_LABELS, SEVERITY_ORDER } from './chart-constants';

interface SeverityDonutProps {
  data: Record<string, number>;
}

const renderCustomLabel = ({ percent }: { percent: number }) => {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(0)}%`;
};

export default function SeverityDonut({ data }: SeverityDonutProps) {
  const total = Object.values(data).reduce((s, n) => s + n, 0);

  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  const chartData = SEVERITY_ORDER.filter(s => (data[s] ?? 0) > 0).map(s => ({
    name: SEVERITY_LABELS[s],
    value: data[s] ?? 0,
    color: SEVERITY_COLORS[s],
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={45}
          outerRadius={72}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, 'Count']}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
