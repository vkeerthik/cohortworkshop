import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workshops, participants, commEventsByParticipant, activityFeed } from "@/lib/mock-data";
import { formatDate, relativeTime } from "@/lib/format";
import Link from "next/link";
import {
  ArrowUpRight, CalendarPlus, Upload, Send, FileText,
  Mail, MessageSquare, Phone, TrendingUp, Users, Activity,
} from "lucide-react";

export default function DashboardPage() {
  const upcoming = workshops
    .filter((w) => w.status === "Scheduled" || w.status === "In Progress")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const allEvents = Object.values(commEventsByParticipant).flat();
  const emailEvents = allEvents.filter((e) => e.channel === "Email");
  const smsEvents = allEvents.filter((e) => e.channel === "SMS");
  const voiceEvents = allEvents.filter((e) => e.channel === "Voice");

  const totalRegistered = participants.filter((p) =>
    ["Registered", "Reminder Sent", "Attended", "Feedback Completed"].includes(p.registrationStatus)
  ).length;

  return (
    <AppShell>
      <div className="max-w-[1320px] space-y-6">
        {/* Greeting */}
        <div className="flex items-end justify-between">
          <div>
            <p className="label">{new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}</p>
            <h2 className="font-serif text-display text-ink mt-1">Good afternoon, Test user.</h2>
            <p className="text-ink-muted text-[15px] mt-1.5">
              {upcoming.length} workshops scheduled this week. {totalRegistered} participants registered overall.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" asChild>
              <Link href="/participants/import"><Upload className="h-4 w-4" /> Import Roster</Link>
            </Button>
            <Button asChild>
              <Link href="/workshops/new"><CalendarPlus className="h-4 w-4" /> New workshop</Link>
            </Button>
          </div>
        </div>

        {/* Metric strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            label="Active participants"
            value="184"
            delta="+12 this week"
            tone="up"
            icon={<Users className="h-4 w-4" />}
          />
          <MetricCard
            label="Registration rate"
            value="78%"
            delta="+4 pts vs April"
            tone="up"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricCard
            label="Reminder delivery"
            value="96.4%"
            delta="Across all channels"
            tone="neutral"
            icon={<Activity className="h-4 w-4" />}
          />
          <MetricCard
            label="Avg. attendance"
            value="82%"
            delta="May cohort"
            tone="up"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming workshops */}
          <Card className="lg:col-span-2">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-ink">Upcoming workshops</h3>
                <p className="text-xs text-ink-muted mt-0.5">Next sessions across all cohorts</p>
              </div>
              <Link href="/workshops" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {upcoming.map((w) => {
                const registered = participants.filter(
                  (p) => p.workshopId === w.id &&
                  ["Registered", "Reminder Sent", "Attended", "Feedback Completed"].includes(p.registrationStatus)
                ).length;
                const pct = Math.round((registered / w.capacity) * 100);
                return (
                  <Link
                    key={w.id}
                    href={`/workshops/${w.id}`}
                    className="flex items-center gap-5 p-5 hover:bg-canvas transition-colors"
                  >
                    <div className="text-center w-14 shrink-0">
                      <div className="font-serif text-[22px] font-semibold text-ink leading-none">
                        {new Date(w.date).getDate()}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-ink-subtle mt-1">
                        {new Date(w.date).toLocaleDateString("en-CA", { month: "short" })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-ink truncate">{w.name}</p>
                        {w.isVirtual && <Badge tone="info">Virtual</Badge>}
                        {w.status === "In Progress" && <Badge tone="warn" dot>In progress</Badge>}
                      </div>
                      <p className="text-[13px] text-ink-muted mt-0.5">
                        {w.facilitator} · {new Date(w.date).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}
                        {" · "}{w.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0 w-32">
                      <div className="num text-[13px] font-medium text-ink">{registered} / {w.capacity}</div>
                      <div className="mt-1 h-1 w-full rounded-full bg-canvas border border-border overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-[10px] text-ink-subtle mt-1">{pct}% filled</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Quick actions */}
          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Quick actions</h3>
              <p className="text-xs text-ink-muted mt-0.5">Common workflows</p>
            </div>
            <div className="p-3 space-y-1">
              <QuickAction href="/campaigns/new" icon={<Send className="h-4 w-4" />} title="Send a campaign" desc="Invite or remind a cohort" />
              <QuickAction href="/participants/import" icon={<Upload className="h-4 w-4" />} title="Import participants" desc="From CSV or intake export" />
              <QuickAction href="/templates" icon={<MessageSquare className="h-4 w-4" />} title="Edit templates" desc="Email, SMS, voice scripts" />
              <QuickAction href="/voice-config" icon={<Phone className="h-4 w-4" />} title="Configure voice" desc="Retry rules, keypad confirmation" />
              <QuickAction href="/reports" icon={<FileText className="h-4 w-4" />} title="Generate report" desc="Engagement + feedback metrics" />
            </div>
          </Card>
        </div>

        {/* Communication channels + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Communication channels</h3>
              <p className="text-xs text-ink-muted mt-0.5">Last 7 days</p>
            </div>
            <div className="p-5 space-y-4">
              <ChannelRow icon={<Mail className="h-4 w-4" />} name="Email" delivered={emailEvents.length} rate={98} />
              <ChannelRow icon={<MessageSquare className="h-4 w-4" />} name="SMS" delivered={smsEvents.length} rate={94} />
              <ChannelRow icon={<Phone className="h-4 w-4" />} name="Voice" delivered={voiceEvents.length} rate={86} />
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-ink">Recent activity</h3>
                <p className="text-xs text-ink-muted mt-0.5">Across your team and automations</p>
              </div>
              <Badge tone="neutral" dot>Live</Badge>
            </div>
            <ol className="p-5 space-y-4">
              {activityFeed.map((a, i) => (
                <li key={a.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <span className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    {i < activityFeed.length - 1 && (
                      <span className="absolute top-3 w-px h-full bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4 border-b border-border last:border-b-0 last:pb-0">
                    <p className="text-sm text-ink leading-snug">{a.message}</p>
                    <p className="text-xs text-ink-subtle mt-1">
                      {a.actor} · {relativeTime(a.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function MetricCard({
  label, value, delta, tone, icon,
}: { label: string; value: string; delta: string; tone: "up" | "down" | "neutral"; icon: React.ReactNode }) {
  const deltaColor =
    tone === "up" ? "text-status-success" : tone === "down" ? "text-status-error" : "text-ink-subtle";
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="label">{label}</p>
        <span className="text-ink-subtle">{icon}</span>
      </div>
      <p className="font-serif text-[30px] tracking-tight text-ink mt-2 num">{value}</p>
      <p className={`text-xs mt-1 ${deltaColor}`}>{delta}</p>
    </Card>
  );
}

function QuickAction({
  href, icon, title, desc,
}: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-2.5 rounded-md hover:bg-canvas transition-colors group"
    >
      <div className="h-9 w-9 rounded-md bg-primary-soft text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-[11px] text-ink-muted">{desc}</p>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-ink-subtle opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

function ChannelRow({
  icon, name, delivered, rate,
}: { icon: React.ReactNode; name: string; delivered: number; rate: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-ink-muted">{icon}</span>
          <span className="text-sm font-medium text-ink">{name}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-ink num">{delivered}</span>
          <span className="text-xs text-ink-subtle ml-1.5">delivered</span>
        </div>
      </div>
      <div className="h-1 rounded-full bg-canvas border border-border overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${rate}%` }} />
      </div>
      <p className="text-[11px] text-ink-subtle mt-1">{rate}% success rate</p>
    </div>
  );
}
