'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  FileTextIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  CalendarIcon,
} from 'lucide-react';

interface OverviewStats {
  totalUsers: number;
  totalAssessments: number;
  flaggedCount: number;
  avgScores: { depression: number; anxiety: number; stress: number };
  distributions: {
    depression: Record<string, number>;
    anxiety: Record<string, number>;
    stress: Record<string, number>;
  };
  assessmentsByMonth: Array<{ month: string; count: number }>;
}

const SEVERITY_ORDER = ['normal', 'mild', 'moderate', 'severe', 'extremely_severe'];
const SEVERITY_LABELS: Record<string, string> = {
  normal: 'Normal',
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  extremely_severe: 'Extremely Severe',
};

function fmt(s: Record<string, number>, total: number) {
  return SEVERITY_ORDER.map(k => {
    const n = s[k] ?? 0;
    const pct = total > 0 ? ((n / total) * 100).toFixed(1) : '0.0';
    return `  ${SEVERITY_LABELS[k].padEnd(18)} ${String(n).padStart(5)}  (${pct}%)`;
  }).join('\n');
}

function fmtMonth(month: string) {
  const [year, m] = month.split('-');
  const d = new Date(parseInt(year), parseInt(m) - 1);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

async function generatePDF(stats: OverviewStats, dateFrom: string, dateTo: string) {
  const jsPDF = (await import('jspdf')).default;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210;
  const margin = 20;
  const lineH = 6;
  let y = margin;

  const section = (title: string) => {
    y += 4;
    doc.setFillColor(32, 173, 160);
    doc.rect(margin, y, W - margin * 2, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), margin + 3, y + 5);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    y += 12;
  };

  const line = (text: string, size = 9, bold = false) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(text, margin, y);
    y += lineH;
  };

  const blankLine = () => { y += 3; };

  const total = stats.totalAssessments;
  const flagRate = total > 0 ? ((stats.flaggedCount / total) * 100).toFixed(1) : '0.0';
  const avgPer = stats.totalUsers > 0 ? (total / stats.totalUsers).toFixed(1) : '0';
  const dateRange = dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : 'All time';
  const generatedAt = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // Header
  doc.setFillColor(32, 173, 160);
  doc.rect(0, 0, W, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MyWellness Research Report', margin, 13);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Mental Well-Being Monitoring System — FUTA', margin, 20);
  doc.text(`Population Cohort Report — Anonymized Data`, margin, 26);
  doc.setTextColor(30, 30, 30);
  y = 38;

  line(`Date Range : ${dateRange}`, 8);
  line(`Generated  : ${generatedAt}`, 8);
  line(`Status     : ANONYMIZED — No individual identifiers included`, 8);
  blankLine();

  section('Executive Summary');
  line(`Total Registered Participants  : ${stats.totalUsers}`);
  line(`Total Assessments Completed    : ${total}`);
  line(`Avg Assessments per Participant: ${avgPer}`);
  line(`Flagged Cases (Severe+)        : ${stats.flaggedCount}  (${flagRate}% of assessments)`);
  blankLine();

  section('Population Average Scores');
  line(`Subscale          Avg Score   / 42`);
  line(`Depression        ${String(stats.avgScores.depression).padEnd(10)}  ${((stats.avgScores.depression / 42) * 100).toFixed(1)}%`);
  line(`Anxiety           ${String(stats.avgScores.anxiety).padEnd(10)}  ${((stats.avgScores.anxiety / 42) * 100).toFixed(1)}%`);
  line(`Stress            ${String(stats.avgScores.stress).padEnd(10)}  ${((stats.avgScores.stress / 42) * 100).toFixed(1)}%`);
  blankLine();

  section('Depression Severity Distribution');
  doc.setFontSize(9);
  fmt(stats.distributions.depression, total).split('\n').forEach(l => { doc.text(l, margin, y); y += lineH; });
  blankLine();

  section('Anxiety Severity Distribution');
  fmt(stats.distributions.anxiety, total).split('\n').forEach(l => { doc.text(l, margin, y); y += lineH; });
  blankLine();

  section('Stress Severity Distribution');
  fmt(stats.distributions.stress, total).split('\n').forEach(l => { doc.text(l, margin, y); y += lineH; });
  blankLine();

  if (stats.assessmentsByMonth.length) {
    section('Assessment Volume (Last 12 Months)');
    line(`Month                    Count`);
    stats.assessmentsByMonth.forEach(m => {
      line(`${fmtMonth(m.month).padEnd(25)}  ${m.count}`);
    });
    blankLine();
  }

  section('Research Ethics Statement');
  doc.setFontSize(8);
  const ethics = [
    'This report contains anonymized aggregate data only. No individual student',
    'identifiers (names, email addresses, or usernames) are included.',
    'Data was collected under informed consent in accordance with research',
    'ethics guidelines. All participant IDs are system-generated anonymous codes.',
    'This document is intended for authorized research personnel only.',
  ];
  ethics.forEach(l => { doc.text(l, margin, y); y += 5; });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated by MyWellness Research Platform  |  ${generatedAt}`,
    margin,
    290
  );

  const dateTag = new Date().toISOString().slice(0, 10);
  doc.save(`mywellness-cohort-report-${dateTag}.pdf`);
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePDF = async () => {
    if (!stats) return;
    setGenerating(true);
    try {
      await generatePDF(stats, dateFrom, dateTo);
    } finally {
      setGenerating(false);
    }
  };

  const csvUrl = `/api/admin/reports/export${dateFrom || dateTo ? `?from=${dateFrom}&to=${dateTo}` : ''}`;

  const flagRate =
    stats && stats.totalAssessments > 0
      ? ((stats.flaggedCount / stats.totalAssessments) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
        <div>
          <h1 className="text-lg font-bold text-foreground">Reports</h1>
          <p className="text-xs text-muted-foreground font-light">
            Population cohort report — anonymized export
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileTextIcon className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Date range filter */}
        <Card className="bg-white">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              Date Range Filter
            </CardTitle>
            <p className="text-xs text-muted-foreground font-light">
              Applies to both CSV export and PDF report. Leave blank for all-time data.
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground font-medium block mb-1.5">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground font-medium block mb-1.5">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-9 text-muted-foreground"
                onClick={() => { setDateFrom(''); setDateTo(''); }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report preview */}
        <Card className="bg-white">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium">Report Preview</CardTitle>
            <p className="text-xs text-muted-foreground font-light">
              Summary of data that will be included in the export
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full rounded" />
                ))}
              </div>
            ) : (
              <div className="font-mono text-xs bg-slate-50 border border-border rounded-lg p-5 space-y-1 text-slate-700 leading-relaxed">
                <p className="text-primary font-bold text-sm mb-3">
                  MYWELLNESS RESEARCH REPORT — ANONYMIZED COHORT DATA
                </p>
                <p>─────────────────────────────────────────</p>
                <p className="font-semibold text-slate-800">EXECUTIVE SUMMARY</p>
                <p>─────────────────────────────────────────</p>
                <p>Total Registered Participants : <strong>{stats?.totalUsers}</strong></p>
                <p>Total Assessments Completed   : <strong>{stats?.totalAssessments}</strong></p>
                <p>Avg Assessments per Student   : <strong>
                  {stats && stats.totalUsers > 0
                    ? (stats.totalAssessments / stats.totalUsers).toFixed(1)
                    : '—'}
                </strong></p>
                <p>Flagged Cases (Severe+)       : <strong className="text-amber-700">
                  {stats?.flaggedCount} ({flagRate}% of assessments)
                </strong></p>
                <p className="mt-2">─────────────────────────────────────────</p>
                <p className="font-semibold text-slate-800">POPULATION AVERAGE SCORES</p>
                <p>─────────────────────────────────────────</p>
                <p>Depression  : <strong>{stats?.avgScores.depression}</strong> / 42</p>
                <p>Anxiety     : <strong>{stats?.avgScores.anxiety}</strong> / 42</p>
                <p>Stress      : <strong>{stats?.avgScores.stress}</strong> / 42</p>
                <p className="mt-2">─────────────────────────────────────────</p>
                <p className="font-semibold text-slate-800">SEVERITY DISTRIBUTIONS</p>
                <p>─────────────────────────────────────────</p>
                {(['depression', 'anxiety', 'stress'] as const).map(sub => (
                  <div key={sub} className="mt-1">
                    <p className="font-semibold capitalize">{sub}:</p>
                    {SEVERITY_ORDER.map(s => {
                      const n = stats?.distributions[sub][s] ?? 0;
                      const pct = stats && stats.totalAssessments > 0
                        ? ((n / stats.totalAssessments) * 100).toFixed(1)
                        : '0.0';
                      return (
                        <p key={s} className="pl-4">
                          {SEVERITY_LABELS[s].padEnd(18)}: {n} ({pct}%)
                        </p>
                      );
                    })}
                  </div>
                ))}
                <p className="mt-3 text-slate-500 text-[10px]">
                  ⓘ No individual student names, emails, or usernames are included.
                  All data is anonymized per research ethics guidelines.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export actions */}
        <Card className="bg-white">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium">Export</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handlePDF}
                disabled={generating || loading || !stats}
                className="gap-2"
              >
                <FileTextIcon className="w-4 h-4" />
                {generating ? 'Generating PDF…' : 'Download PDF Report'}
              </Button>

              <a href={csvUrl} download>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <FileSpreadsheetIcon className="w-4 h-4" />
                  Download CSV Data
                </Button>
              </a>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              CSV includes: assessment_id, user_id (anonymous), scores, severities, date.
              No names or email addresses.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
