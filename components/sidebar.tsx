"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarRange, Users, MessageSquare, Send,
  Phone, ClipboardList, BarChart3, FileText, Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Workshops", href: "/workshops", icon: CalendarRange },
  { label: "Participants", href: "/participants", icon: Users },
  { label: "Templates", href: "/templates", icon: MessageSquare },
  { label: "Campaigns", href: "/campaigns/new", icon: Send },
  { label: "Voice config", href: "/voice-config", icon: Phone },
  { label: "Attendance", href: "/attendance", icon: ClipboardList },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

const preview = [
  { label: "Registration form", href: "/registration-preview", icon: FileText },
  { label: "Feedback survey", href: "/feedback-preview", icon: Headphones },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[244px] shrink-0 bg-surface border-r border-border min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            {/* simple monogram: stacked lines suggesting a cohort */}
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="font-serif text-[15px] font-semibold text-ink">Cohort</div>
            <div className="text-[10px] text-ink-subtle uppercase tracking-[0.12em]">Workshop Platform</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        <div className="label px-2 mb-2 mt-1">Workspace</div>
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary-soft text-primary font-medium"
                  : "text-ink-muted hover:text-ink hover:bg-canvas"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="label px-2 mb-2 mt-5">Previews</div>
        {preview.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary-soft text-primary font-medium"
                  : "text-ink-muted hover:text-ink hover:bg-canvas"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 p-3 rounded-md bg-canvas border border-border">
        <div className="flex items-start gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-status-success mt-1.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-ink">PHIPA-conscious workflow</p>
            <p className="text-[11px] text-ink-muted leading-snug mt-0.5">
              Canadian-hosted. Patient data stays in-country.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
