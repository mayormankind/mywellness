'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, UsersIcon } from 'lucide-react';

interface UserRow {
  id: string;
  anonymousId: string;
  assessmentCount: number;
  lastAssessmentAt: string | null;
  joinedAt: string;
}

interface UsersResponse {
  users: UserRow[];
  total: number;
  page: number;
  totalPages: number;
}

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback((p: number) => {
    setLoading(true);
    fetch(`/api/admin/users?page=${p}&limit=20`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const rows = data?.users ?? [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
        <div>
          <h1 className="text-lg font-bold text-foreground">Users</h1>
          <p className="text-xs text-muted-foreground font-light">
            {data ? `${data.total} registered participants` : 'Loading…'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <UsersIcon className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Card className="bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Anonymous ID
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Assessments
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Last Assessment
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-5 py-3" colSpan={5}>
                            <Skeleton className="h-4 w-full rounded" />
                          </td>
                        </tr>
                      ))
                    : rows.map(u => (
                        <tr
                          key={u.id}
                          className="border-b border-border/50 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                              {u.anonymousId}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <Badge
                              variant={u.assessmentCount === 0 ? 'secondary' : 'default'}
                              className="text-xs"
                            >
                              {u.assessmentCount}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">
                            {fmt(u.lastAssessmentAt)}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">
                            {fmt(u.joinedAt)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs gap-1"
                              onClick={() => router.push(`/admin/users/${u.id}`)}
                            >
                              <EyeIcon className="w-3 h-3" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                  {!loading && rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">
                        No participants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Page {data.page} of {data.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="h-7 px-2"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= data.totalPages}
                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                    className="h-7 px-2"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
