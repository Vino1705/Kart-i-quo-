'use client';

import { Wallet } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export function Logo() {
  const { user } = useAuth();
  const href = user ? '/dashboard' : '/';

  return (
    <Link
      href={href}
      className="flex items-center gap-2 font-semibold font-headline"
    >
      <Wallet className="h-6 w-6 text-primary" />
      <span className="">Kart-I-Quo</span>
    </Link>
  );
}
