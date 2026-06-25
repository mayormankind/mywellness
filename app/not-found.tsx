import Link from 'next/link';
import { BrainIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <BrainIcon className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg text-foreground">
          My<span className="text-primary">Wellness</span>
        </span>
      </div>

      <div className="max-w-md w-full text-center space-y-5">
        <p className="text-8xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">Go to Dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
