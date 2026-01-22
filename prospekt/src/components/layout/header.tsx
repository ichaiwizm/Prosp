"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  description?: string;
  className?: string;
}

export function Header({
  title,
  breadcrumbs,
  actions,
  description,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex-1 min-w-0">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 mb-1 text-sm">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Title & Description */}
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 ml-4">{actions}</div>
        )}
      </div>
    </header>
  );
}
