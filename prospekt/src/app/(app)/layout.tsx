import { Sidebar } from '@/components/layout/sidebar';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main content */}
      <main
        className={cn(
          'flex-1 overflow-y-auto',
          'transition-all duration-300 ease-in-out'
        )}
      >
        {children}
      </main>

      {/* Mobile sidebar overlay - TODO: implement mobile menu */}
    </div>
  );
}
