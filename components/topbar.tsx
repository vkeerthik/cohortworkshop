"use client";
import { Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

const titles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview of workshop activity and engagement" },
  "/workshops": { title: "Workshops", subtitle: "All upcoming and past patient education sessions" },
  "/workshops/new": { title: "New workshop", subtitle: "Configure session details and reminder cadence" },
  "/participants": { title: "Participants", subtitle: "Manage cohort rosters and communication" },
  "/participants/import": { title: "Import participants", subtitle: "Upload a CSV roster from intake or referral systems" },
  "/templates": { title: "Communication templates", subtitle: "Email, SMS, and voice content for campaigns" },
  "/campaigns/new": { title: "New campaign", subtitle: "Build a multi-channel reminder or invitation campaign" },
  "/voice-config": { title: "Voice reminder configuration", subtitle: "Script, retries, and keypad confirmation" },
  "/registration-preview": { title: "Registration form preview", subtitle: "Participant-facing flow" },
  "/feedback-preview": { title: "Feedback survey preview", subtitle: "Post-session collection" },
  "/attendance": { title: "Attendance", subtitle: "Mark attended and no-show participants" },
  "/reports": { title: "Reports", subtitle: "Engagement, delivery, and feedback analytics" },
};

export function Topbar() {
  const pathname = usePathname();
  const key = Object.keys(titles)
    .filter((k) => pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  const meta = titles[key] ?? { title: "Cohort" };

  return (
    <header className="h-[68px] shrink-0 bg-surface border-b border-border flex items-center justify-between px-7">
      <div>
        <h1 className="text-[19px] font-semibold text-ink leading-tight tracking-tight">{meta.title}</h1>
        {meta.subtitle && <p className="text-[13px] text-ink-muted mt-0.5">{meta.subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle" />
          <input
            type="search"
            placeholder="Search participants, workshops…"
            className="h-9 w-[280px] rounded-md border border-border bg-canvas pl-8 pr-3 text-sm placeholder:text-ink-subtle focus-ring"
          />
        </div>
        <button className="h-9 w-9 rounded-md border border-border bg-surface text-ink-muted hover:text-ink focus-ring relative">
          <Bell className="h-4 w-4 mx-auto" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-status-warn" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
            CS
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-medium text-ink">Claude S.</p>
            <p className="text-[11px] text-ink-subtle">Patient Education</p>
          </div>
        </div>
      </div>
    </header>
  );
}
