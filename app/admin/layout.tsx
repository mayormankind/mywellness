import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwt } from '@/lib/auth';
import AdminNav from '@/components/admin/admin-nav';

export const metadata = {
  title: 'Admin — MyWellness',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) redirect('/login');

  const payload = await verifyJwt(token);
  if (!payload || payload.role !== 'admin') redirect('/dashboard');

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminNav />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
