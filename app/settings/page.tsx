'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserIcon, MailIcon, LockIcon, SaveIcon, Loader2Icon,
  ShieldIcon, Trash2Icon, BadgeCheckIcon, CalendarIcon,
  HashIcon, EyeIcon, EyeOffIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import AppNav from '@/components/app-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

type User = {
  id: string;
  fullName: string;
  email: string;
  matricNumber: string;
  isVerified: boolean;
  createdAt: string;
};

type Tab = 'profile' | 'security' | 'account';

function PasswordInput({
  id, value, onChange, placeholder, required, minLength,
}: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const [profileForm, setProfileForm] = useState({ fullName: '', email: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/auth/verify', { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) { router.push('/login'); return; }
        const data = await r.json();
        setUser(data.user);
        setProfileForm({ fullName: data.user.fullName, email: data.user.email });
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: profileForm.fullName, email: profileForm.email }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to update profile'); return; }
      setUser((u) => u ? { ...u, ...data } : u);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('An error occurred');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to update password'); return; }
      toast.success('Password changed successfully');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('An error occurred');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { toast.error('Enter your password to confirm'); return; }
    setDeleting(true);
    try {
      const res = await fetch('/api/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to delete account'); return; }
      toast.success('Account deleted');
      router.push('/');
    } catch {
      toast.error('An error occurred');
    } finally {
      setDeleting(false);
    }
  };

  const initials = user?.fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : '';

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile',  label: 'Profile',  icon: <UserIcon className="w-4 h-4" /> },
    { key: 'security', label: 'Security', icon: <ShieldIcon className="w-4 h-4" /> },
    { key: 'account',  label: 'Account',  icon: <Trash2Icon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNav userName={user?.fullName} />

      <main className="flex-1 max-w-2xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Account Settings</h1>
          <p className="text-sm text-muted-foreground font-light">Manage your profile, security and account preferences</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        ) : user && (
          <>
            {/* Avatar card */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-primary/20">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-foreground truncate">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground font-light truncate">{user.email}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${user.isVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        <BadgeCheckIcon className="w-3 h-3" />
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-light">
                        <CalendarIcon className="w-3 h-3" />
                        Member since {memberSince}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-light">
                        <HashIcon className="w-3 h-3" />
                        {user.matricNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-border/40 rounded-xl mb-6">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === t.key
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Profile tab ── */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
                  <CardDescription className="font-light">Update your display name and email address</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSave} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className="pl-10"
                          required
                          minLength={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                      {!user.isVerified && (
                        <p className="text-xs text-yellow-600 font-light">Changing your email will require re-verification</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="matricNumber">Matric Number</Label>
                      <div className="relative">
                        <HashIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="matricNumber"
                          value={user.matricNumber}
                          disabled
                          className="pl-10 bg-muted cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground font-light">Matric number cannot be changed</p>
                    </div>

                    <Button type="submit" disabled={savingProfile} className="w-full gap-2">
                      {savingProfile ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <SaveIcon className="w-4 h-4" />}
                      {savingProfile ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* ── Security tab ── */}
            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Change Password</CardTitle>
                  <CardDescription className="font-light">Use a strong password you don&apos;t use elsewhere</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSave} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <PasswordInput
                        id="currentPassword"
                        value={securityForm.currentPassword}
                        onChange={(v) => setSecurityForm({ ...securityForm, currentPassword: v })}
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <PasswordInput
                        id="newPassword"
                        value={securityForm.newPassword}
                        onChange={(v) => setSecurityForm({ ...securityForm, newPassword: v })}
                        placeholder="Minimum 6 characters"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <PasswordInput
                        id="confirmPassword"
                        value={securityForm.confirmPassword}
                        onChange={(v) => setSecurityForm({ ...securityForm, confirmPassword: v })}
                        placeholder="Repeat new password"
                        required
                      />
                      {securityForm.confirmPassword && securityForm.newPassword !== securityForm.confirmPassword && (
                        <p className="text-xs text-destructive font-light">Passwords do not match</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={savingPassword || (!!securityForm.confirmPassword && securityForm.newPassword !== securityForm.confirmPassword)}
                      className="w-full gap-2"
                    >
                      {savingPassword ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <ShieldIcon className="w-4 h-4" />}
                      {savingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* ── Account tab ── */}
            {activeTab === 'account' && (
              <div className="space-y-4">
                {/* Account info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'Account ID', value: user.id },
                      { label: 'Email status', value: user.isVerified ? 'Verified' : 'Not verified' },
                      { label: 'Member since', value: memberSince },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-muted-foreground font-light">{label}</span>
                        <span className="text-sm text-foreground font-medium truncate max-w-[60%] text-right">{value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Danger zone */}
                <Card className="border-destructive/30">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-destructive">Danger Zone</CardTitle>
                    <CardDescription className="font-light">
                      Permanently delete your account and all assessment data. This cannot be undone.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!showDeleteConfirm ? (
                      <Button
                        variant="outline"
                        className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white gap-2"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2Icon className="w-4 h-4" />
                        Delete My Account
                      </Button>
                    ) : (
                      <div className="space-y-4 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                        <p className="text-sm text-destructive font-medium">
                          Enter your password to permanently delete your account and all data.
                        </p>
                        <PasswordInput
                          id="deletePassword"
                          value={deletePassword}
                          onChange={setDeletePassword}
                          placeholder="Your current password"
                        />
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            disabled={deleting || !deletePassword}
                            className="flex-1 bg-destructive hover:bg-destructive/90 text-white gap-2"
                            onClick={handleDeleteAccount}
                          >
                            {deleting ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <Trash2Icon className="w-4 h-4" />}
                            {deleting ? 'Deleting...' : 'Confirm Delete'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
