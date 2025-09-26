
'use client';

import { usePathname } from 'next/navigation';
import AppLayout from './app-layout';

const publicPages = ['/', '/login', '/signup', '/onboarding'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = publicPages.includes(pathname);

  if (isPublicPage) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        {children}
      </main>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
