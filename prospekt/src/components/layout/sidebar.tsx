'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble'
  },
  {
    name: 'Prospects',
    href: '/prospects',
    icon: Users,
    description: 'Gestion des prospects'
  },
  {
    name: 'Docs',
    href: '/docs',
    icon: FileText,
    description: 'Documentation'
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { profile, loading } = useUser();

  return (
    <aside
      className={cn(
        'flex flex-col w-64 border-r bg-sidebar border-sidebar-border',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground group-hover:text-primary transition-colors">
            Prospekt
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg',
                'transition-all duration-200 ease-in-out',
                'hover:bg-sidebar-accent relative',
                isActive && 'bg-sidebar-accent shadow-sm'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
              )}

              <Icon
                className={cn(
                  'w-5 h-5 transition-colors',
                  isActive
                    ? 'text-sidebar-primary'
                    : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
                )}
              />

              <div className="flex-1 min-w-0">
                <div className={cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-sidebar-primary'
                    : 'text-sidebar-foreground group-hover:text-sidebar-foreground'
                )}>
                  {item.name}
                </div>
                {!isActive && (
                  <div className="text-xs text-sidebar-foreground/40 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </div>
                )}
              </div>

              {isActive && (
                <ChevronRight className="w-4 h-4 text-sidebar-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        {!loading && profile && (
          <div className="space-y-3">
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent">
                <span className="text-sm font-semibold text-primary-foreground">
                  {profile.name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">
                  {profile.name || profile.email.split('@')[0]}
                </div>
                <div className="text-xs mt-0.5">
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className={cn(
                'w-full justify-start gap-2 text-sidebar-foreground/80',
                'hover:text-destructive hover:bg-destructive/10'
              )}
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
