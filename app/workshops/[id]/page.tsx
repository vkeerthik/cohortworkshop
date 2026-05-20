import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workshops, participants } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { statusTone } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Calendar, Clock, MapPin, Video, User, Users, Send, ClipboardList, BellRing,
} from "lucide-react";

export function generateStaticParams() {
  return workshops.map((w) => ({ id: w.id }));
}

export default function WorkshopDetail({ params }: { params: { id: string } }) {
  const w = workshops.find((x) => x.id === params.id);
  if (!w) notFound();

  const cohort = participants.filter((p) => p.workshopId === w.id);
  const registered = cohort.filter((p) =>
    ["Registered", "Reminder Sent", "Attended", "Feedback Completed"].includes(p.registrationStatus)
  ).length;

  return (
    <AppShell>
      <div className="max-w-[1200px] space-y-5">
        <Link href="/workshops" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to workshops
        </Link>

        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="primary">{w.cohort}</Badge>
              <Badge tone={w.status === "In Progress" ? "warn" : w.status === "Completed" ? "success" : "info"} dot>{w.status}</Badge>
              {w.isVirtual && <Badge tone="info">Virtual</Badge>}
            </div>
            <h2 className="font-serif text-display text-ink mt-3">{w.name}</h2>
            <p className="text-ink-muted text-[15px] mt-2 max-w-2xl">{w.description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" asChild>
              <Link href={`/attendance/${w.id}`}><ClipboardList className="h-4 w-4" /> Take attendance</Link>
            </Button>
            <Button asChild>
              <Link href={`/campaigns/new?workshop=${w.id}`}><Send className="h-4 w-4" /> Send campaign</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Session details</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailRow icon={<Calendar className="h-4 w-4" />} label="Date" value={formatDate(w.date)} />
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Time"
                value={`${new Date(w.date).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })} · ${w.durationMin} min`}
              />
              <DetailRow
                icon={w.isVirtual ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                label={w.isVirtual ? "Platform" : "Location"}
                value={w.location}
              />
              <DetailRow icon={<User className="h-4 w-4" />} label="Facilitator" value={w.facilitator} />
              <DetailRow icon={<Users className="h-4 w-4" />} label="Capacity" value={`${registered} / ${w.capacity} filled`} />
              <DetailRow
                icon={<BellRing className="h-4 w-4" />}
                label="Reminder schedule"
                value={w.reminderSchedule.map((r) => (r === "7d" ? "7 days" : r === "1d" ? "1 day" : "2 hours")).join(" · ")}
              />
            </div>
          </Card>

          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Cohort snapshot</h3>
            </div>
            <div className="p-5 space-y-3">
              <StatLine label="Total in cohort" value={cohort.length} />
              <StatLine label="Registered" value={registered} accent />
              <StatLine label="Awaiting RSVP" value={cohort.filter(p => p.registrationStatus === "Awaiting RSVP").length} />
              <StatLine label="Attended" value={cohort.filter(p => p.attendanceStatus === "Attended").length} />
              <StatLine label="No-shows" value={cohort.filter(p => p.attendanceStatus === "No Show").length} />
            </div>
          </Card>
        </div>

        <Card>
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-ink">Roster</h3>
            <Link href="/participants" className="text-xs text-primary hover:underline">Manage all participants</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 label">Participant</th>
                <th className="px-5 py-3 label">Contact</th>
                <th className="px-5 py-3 label">Preference</th>
                <th className="px-5 py-3 label">Status</th>
                <th className="px-5 py-3 label">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cohort.slice(0, 8).map((p) => (
                <tr key={p.id} className="hover:bg-canvas">
                  <td className="px-5 py-3">
                    <Link href={`/participants/${p.id}`} className="font-medium text-ink hover:text-primary">
                      {p.firstName} {p.lastName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink-muted">
                    <div>{p.email}</div>
                    <div className="text-xs text-ink-subtle">{p.phone}</div>
                  </td>
                  <td className="px-5 py-3 text-ink-muted">{p.commPreference}</td>
                  <td className="px-5 py-3"><Badge tone={statusTone[p.registrationStatus]} dot>{p.registrationStatus}</Badge></td>
                  <td className="px-5 py-3">
                    {p.attendanceStatus === "Pending" ? (
                      <span className="text-ink-subtle text-xs">—</span>
                    ) : (
                      <Badge tone={p.attendanceStatus === "Attended" ? "success" : "error"}>{p.attendanceStatus}</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-md bg-canvas border border-border flex items-center justify-center text-ink-muted shrink-0">
        {icon}
      </div>
      <div>
        <p className="label">{label}</p>
        <p className="text-sm text-ink mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function StatLine({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className={`text-sm num font-medium ${accent ? "text-primary" : "text-ink"}`}>{value}</span>
    </div>
  );
}
