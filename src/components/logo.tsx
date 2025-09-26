import { Wallet } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold font-headline"
    >
      <Wallet className="h-6 w-6 text-primary" />
      <span className="">Kart-I-Quo</span>
    </Link>
  );
}
