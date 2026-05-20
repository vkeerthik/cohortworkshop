"use client";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { workshops, participants, commEventsByParticipant } from "@/lib/mock-data";
import {
  Mail,
  MessageSquare,
  Phone,
  TrendingUp,
  TrendingDown,
  Download,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Reports() {
  const [range, setRange] = useState("90d");

  // Aggregated metrics across all participants in scope. Mock figures.
  const stats = useMemo(() => {
    const total = participants.length;
    const registered = participants.filter((p) =>
      ["Registered", "Reminder Sent", "Attended", "Feedback Completed"].includes(p.registrationStatus)
    ).length;
    const attended = participants.filter((p) => p.attendanceStatus === "Attended").length;
    const noShow = participants.filter((p) => p.attendanceStatus === "No Show").length;
    const feedback = participants.filter((p) => p.registrationStatus === "Feedback Completed").length;

    const eligibleForAttendance = attended + noShow;
    const attendanceRate = eligibleForAttendance ? Math.round((attended / eligibleForAttendance) * 100) : 0;
    const noShowRate = eligibleForAttendance ? Math.round((noShow / eligibleForAttendance) * 100) : 0;
    const feedbackRate = attended ? Math.round((feedback / attended) * 100) : 0;

    return { total, registered, attended, noShow, feedback, attendanceRate, noShowRate, feedbackRate };
  }, []);

  // Per-workshop registration counts
  const perWorkshop = useMemo(() => {
    return workshops.map((w) => {
      const cohort = participants.filter((p) => p.workshopId === w.id);
      const registered = cohort.filter((p) =>
        ["Registered", "Reminder Sent", "Attended", "Feedback Completed"].includes(p.registrationStatus)
      ).length;
      const attended = cohort.filter((p) => p.attendanceStatus === "Attended").length;
      return {
        id: w.id,
        name: w.name,
        cohort: w.cohort,
        capacity: w.capacity,
        registered,
        attended,
        total: cohort.length,
        status: w.status,
      };
    });
  }, []);

  const maxReg = Math.max(...perWorkshop.map((w) => w.registered), 1);

  // Channel delivery breakdown
  const channelStats = useMemo(() => {
    const buckets: Record<string, { sent: number; engaged: number; failed: number }> = {
      Email: { sent: 0, engaged: 0, failed: 0 },
      SMS: { sent: 0, engaged: 0, failed: 0 },
      Voice: { sent: 0, engaged: 0, failed: 0 },
    };
    Object.values(commEventsByParticipant).forEach((events) => {
      events.forEach((e) => {
        if (!buckets[e.channel]) return;
        buckets[e.channel].sent++;
        if (e.outcome === "Opened" || e.outcome === "Clicked" || e.outcome === "Completed") {
          buckets[e.channel].engaged++;
        }
        if (e.outcome === "Failed") buckets[e.channel].failed++;
      });
    });
    return buckets;
  }, []);

  // Feedback summary — mocked from completed feedback count
  const feedbackDist = [
    { stars: 5, count: Math.round(stats.feedback * 0.42) },
    { stars: 4, count: Math.round(stats.feedback * 0.34) },
    { stars: 3, count: Math.round(stats.feedback * 0.16) },
    { stars: 2, count: Math.round(stats.feedback * 0.05) },
    { stars: 1, count: Math.round(stats.feedback * 0.03) },
  ];
  const feedbackTotal = feedbackDist.reduce((a, b) => a + b.count, 0);
  const avgRating = feedbackTotal
    ? (feedbackDist.reduce((a, b) => a + b.count * b.stars, 0) / feedbackTotal).toFixed(1)
    : "0.0";

  const channelMeta = {
    Email: { icon: Mail, label: "Email", color: "primary" },
    SMS: { icon: MessageSquare, label: "SMS", color: "info" },
    Voice: { icon: Phone, label: "Voice", color: "ochre" },
  } as const;

  return (
    <AppShell>
      <div className="max-w-[1240px]">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <p className="label text-ink-subtle mb-2">Reports</p>
            <h1 className="font-serif text-[26px] text-ink leading-tight">Workshop performance</h1>
            <p className="text-[13px] text-ink-muted mt-1">
              Registration, attendance, communication delivery, and feedback across the program.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Top metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MetricCard
            label="Total registrations"
            value={stats.registered}
            trend="up"
            delta="+18%"
            footnote={`of ${stats.total} invited`}
          />
          <MetricCard
            label="Attendance rate"
            value={`${stats.attendanceRate}%`}
            trend="up"
            delta="+4.2 pts"
            footnote={`${stats.attended} attended`}
            accent="success"
          />
          <MetricCard
            label="No-show rate"
            value={`${stats.noShowRate}%`}
            trend="down"
            delta="-2.1 pts"
            footnote={`${stats.noShow} no-shows`}
            accent="error"
          />
          <MetricCard
            label="Feedback response rate"
            value={`${stats.feedbackRate}%`}
            trend="up"
            delta="+11 pts"
            footnote={`${stats.feedback} responses`}
            accent="primary"
          />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Registrations by workshop */}
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-medium text-ink text-[14px]">Registrations by workshop</h3>
                <p className="text-[11.5px] text-ink-subtle mt-0.5">Registered participants per session</p>
              </div>
              <span className="text-[11px] text-ink-subtle uppercase tracking-[0.1em]">{perWorkshop.length} workshops</span>
            </div>
            <div className="p-5 space-y-4">
              {perWorkshop.map((w) => {
                const pct = (w.registered / maxReg) * 100;
                const capPct = Math.min((w.registered / w.capacity) * 100, 100);
                return (
                  <div key={w.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium text-ink text-[13px] truncate">{w.name}</span>
                        <span className="text-[11px] text-ink-subtle shrink-0">{w.cohort}</span>
                      </div>
                      <div className="text-[12px] text-ink num shrink-0">
                        <span className="font-medium">{w.registered}</span>
                        <span className="text-ink-subtle"> / {w.capacity} cap</span>
                      </div>
                    </div>
                    <div className="relative h-2.5 rounded-full bg-canvas border border-border overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                      {/* capacity tick */}
                      <div
                        className="absolute inset-y-0 w-px bg-ink/30"
                        style={{ left: `${capPct}%` }}
                        aria-hidden
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Funnel */}
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-medium text-ink text-[14px]">Engagement funnel</h3>
              <p className="text-[11.5px] text-ink-subtle mt-0.5">Across all participants in range</p>
            </div>
            <div className="p-5 space-y-3">
              <FunnelRow label="Invited" value={stats.total} pct={100} tone="info" />
              <FunnelRow
                label="Registered"
                value={stats.registered}
                pct={Math.round((stats.registered / stats.total) * 100)}
                tone="primary"
              />
              <FunnelRow
                label="Attended"
                value={stats.attended}
                pct={Math.round((stats.attended / stats.total) * 100)}
                tone="success"
              />
              <FunnelRow
                label="Feedback"
                value={stats.feedback}
                pct={Math.round((stats.feedback / stats.total) * 100)}
                tone="primary"
              />
            </div>
          </Card>
        </div>

        {/* Channels + Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Channels */}
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-medium text-ink text-[14px]">Channel delivery</h3>
              <p className="text-[11.5px] text-ink-subtle mt-0.5">Across email, SMS, and voice reminders</p>
            </div>
            <div className="divide-y divide-border">
              {(Object.keys(channelStats) as Array<keyof typeof channelStats>).map((ch) => {
                const s = channelStats[ch];
                const meta = channelMeta[ch as keyof typeof channelMeta];
                const Icon = meta.icon;
                const engagedPct = s.sent ? Math.round((s.engaged / s.sent) * 100) : 0;
                const failedPct = s.sent ? Math.round((s.failed / s.sent) * 100) : 0;
                return (
                  <div key={ch} className="px-5 py-4 grid grid-cols-[180px_1fr_auto] gap-6 items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-canvas border border-border flex items-center justify-center">
                        <Icon className="h-4 w-4 text-ink-muted" />
                      </div>
                      <div>
                        <div className="font-medium text-ink text-[13px]">{meta.label}</div>
                        <div className="text-[11px] text-ink-subtle num">{s.sent} sent</div>
                      </div>
                    </div>
                    <div>
                      <div className="flex h-2.5 rounded-full overflow-hidden bg-canvas border border-border">
                        <div className="bg-status-success" style={{ width: `${engagedPct}%` }} />
                        <div className="bg-canvas" style={{ width: `${100 - engagedPct - failedPct}%` }} />
                        <div className="bg-status-error" style={{ width: `${failedPct}%` }} />
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-ink-muted">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-status-success" /> Engaged <span className="num font-medium text-ink">{s.engaged}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-canvas border border-border" /> Delivered no action <span className="num font-medium text-ink">{Math.max(s.sent - s.engaged - s.failed, 0)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-status-error" /> Failed <span className="num font-medium text-ink">{s.failed}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-[22px] text-ink num">{engagedPct}<span className="text-[14px] text-ink-subtle">%</span></div>
                      <div className="text-[10px] text-ink-subtle uppercase tracking-[0.1em]">engagement</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Feedback summary */}
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-medium text-ink text-[14px]">Participant feedback</h3>
              <p className="text-[11.5px] text-ink-subtle mt-0.5">Across completed surveys</p>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-3 mb-5">
                <div className="font-serif text-[42px] leading-none text-ink num">{avgRating}</div>
                <div className="pb-1">
                  <div className="flex items-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3.5 w-3.5 ${
                          n <= Math.round(Number(avgRating))
                            ? "fill-accent-ochre text-accent-ochre"
                            : "fill-transparent text-ink-subtle/40"
                        }`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-ink-subtle num">{feedbackTotal} response{feedbackTotal === 1 ? "" : "s"}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                {feedbackDist.map((d) => {
                  const pct = feedbackTotal ? (d.count / feedbackTotal) * 100 : 0;
                  return (
                    <div key={d.stars} className="flex items-center gap-3 text-[12px]">
                      <div className="w-10 text-ink-muted num flex items-center gap-1">
                        {d.stars}<Star className="h-3 w-3 fill-accent-ochre text-accent-ochre" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-canvas border border-border overflow-hidden">
                        <div className="h-full bg-accent-ochre" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="w-8 text-right text-ink num text-[11.5px]">{d.count}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-border">
                <div className="text-[11px] text-ink-subtle uppercase tracking-[0.1em] mb-2">Top topics requested next</div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="primary">Sleep and recovery</Badge>
                  <Badge tone="primary">Movement</Badge>
                  <Badge tone="neutral">Nutrition</Badge>
                  <Badge tone="neutral">Mental health</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer note */}
        <div className="mt-6 px-4 py-3 rounded-md bg-surface border border-border text-[11.5px] text-ink-subtle flex items-center justify-between">
          <span>All figures reflect activity within the selected range. Data is stored in a PHIPA-conscious Canadian-hosted environment.</span>
          <a className="text-primary hover:underline flex items-center gap-1" href="#">
            View methodology <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </AppShell>
  );
}

function MetricCard({
  label,
  value,
  trend,
  delta,
  footnote,
  accent = "default",
}: {
  label: string;
  value: string | number;
  trend: "up" | "down";
  delta: string;
  footnote: string;
  accent?: "default" | "success" | "error" | "primary";
}) {
  const accentColor =
    accent === "success"
      ? "text-status-success"
      : accent === "error"
      ? "text-status-error"
      : accent === "primary"
      ? "text-primary"
      : "text-ink";
  const Trend = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-status-success" : "text-status-error";
  return (
    <Card className="px-5 py-4">
      <div className="flex items-start justify-between">
        <div className="label text-ink-subtle">{label}</div>
        <span className={`flex items-center gap-1 text-[11px] ${trendColor}`}>
          <Trend className="h-3 w-3" />
          <span className="num">{delta}</span>
        </span>
      </div>
      <div className={`font-serif text-display num mt-2 ${accentColor}`}>{value}</div>
      <div className="text-[11px] text-ink-subtle mt-0.5 num">{footnote}</div>
    </Card>
  );
}

function FunnelRow({
  label,
  value,
  pct,
  tone,
}: {
  label: string;
  value: number;
  pct: number;
  tone: "info" | "primary" | "success";
}) {
  const fill =
    tone === "primary" ? "bg-primary" : tone === "success" ? "bg-status-success" : "bg-status-info";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-[12px]">
        <span className="text-ink-muted">{label}</span>
        <span className="num">
          <span className="font-medium text-ink">{value}</span>
          <span className="text-ink-subtle"> · {pct}%</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-canvas border border-border overflow-hidden">
        <div className={`h-full ${fill} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
