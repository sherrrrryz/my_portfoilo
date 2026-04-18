'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './nav';
import Footer from './footer';

const FULL_BLEED_PREFIXES = ['/scroll-lab', '/flashlight'];

export default function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const fullBleed = FULL_BLEED_PREFIXES.some((p) => pathname.startsWith(p));

  if (fullBleed) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center mx-auto mb-12">
      <main className="flex-auto min-w-0 flex flex-col px-6 md:px-16 max-w-[1600px] w-full">
        <Navbar />
        {children}
        <Footer />
      </main>
    </div>
  );
}
