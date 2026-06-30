'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BrainIcon,
  LayoutDashboardIcon,
  UsersIcon,
  ClipboardListIcon,
  BarChart3Icon,
  FileTextIcon,
  LogOutIcon,
  ExternalLinkIcon,
  MenuIcon,
  XIcon,
  ShieldIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboardIcon, exact: true },
  { href: '/admin/users', label: 'Users', icon: UsersIcon, exact: false },
  { href: '/admin/assessments', label: 'Assessments', icon: ClipboardListIcon, exact: false },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3Icon, exact: false },
  { href: '/admin/reports', label: 'Reports', icon: FileTextIcon, exact: false },
];

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setMobileOpen(false);

  const handleLogout = async () => {
    close();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const logoBlock = (onClose?: () => void) => (
    <div className="px-4 h-16 flex items-center border-b border-border shrink-0 gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <BrainIcon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-foreground leading-none">
          My<span className="text-primary">Wellness</span>
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <ShieldIcon className="w-2.5 h-2.5 text-primary" />
          <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">
            Admin Panel
          </span>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const navLinks = (onClose?: () => void) => (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        Menu
      </p>
      {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive(href, exact)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );

  const footerLinks = (onClose?: () => void) => (
    <div className="px-3 py-4 border-t border-border space-y-0.5 shrink-0">
      <Link
        href="/dashboard"
        onClick={onClose}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <ExternalLinkIcon className="w-4 h-4 shrink-0" />
        Back to App
      </Link>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <LogOutIcon className="w-4 h-4 shrink-0" />
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex lg:flex-col w-60 border-r border-border bg-white shrink-0">
        {logoBlock()}
        {navLinks()}
        {footerLinks()}
      </aside>

      {/* ── Mobile: fixed top bar + drawer ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-border flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open admin menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <BrainIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-foreground">
            My<span className="text-primary">Wellness</span>
          </span>
          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold uppercase">
            Admin
          </span>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-white flex flex-col shadow-2xl lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {logoBlock(close)}
              {navLinks(close)}
              {footerLinks(close)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
