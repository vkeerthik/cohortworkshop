"use client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { participants, workshops, commEventsByParticipant } from "@/lib/mock-data";
import { statusTone, formatDate, relativeTime } from "@/lib/format";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft, Mail, MessageSquare, Phone, Calendar, MapPin, Video, Accessibility, Send, History,
} from "lucide-react";

const channelIcon = { Email: Mail, SMS: MessageSquare, Voice: Phone };
const channelTone: Record<string, "info" | "primary" | "neutral"> = {
  Email: "info", SMS: "primary", Voice: "neutral",
};

export default function ParticipantProfileClient() {
  const params = useParams<{ id: string }>();
  const p = participants.find((x) => x.id === params.id);
  if (!p) notFound();

  const ws = workshops.find((w) => w.id === p.workshopId);
  const events = (commEventsByParticipant[p.id] || []).slice().reverse();
  const [pref, setPref] = useState(p.commPreference);

  return (
    <AppShell>
      <div className="max-w-[1200px] space-y-5">
        <Link href="/participants" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to participants
        </Link>

        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-primary-soft text-primary flex items-center justify-center text-lg font-medium border border-primary/15">
              {p.firstName[0]}{p.lastName[0]}
            </div>
            <div>
              <h2 className="font-serif text-[28px] tracking-tight text-ink">{p.firstName} {p.lastName}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge tone={statusTone[p.registrationStatus]} dot>{p.registrationStatus}</Badge>
                {p.attendanceStatus !== "Pending" && (
                  <Badge tone={p.attendanceStatus === "Attended" ? "success" : "error"}>{p.attendanceStatus}</Badge>
                )}
                <span className="text-xs text-ink-subtle">Last contact {relativeTime(p.lastCommunication)}</span>
              </div>
            </div>
          </div>
          <Button><Send className="h-4 w-4" /> Send message</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-1">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Participant information</h3>
            </div>
            <div className="p-5 space-y-4">
              <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={p.email} />
              <Field icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={p.phone} mono />
              {p.accessibilityNeeds && (
                <Field icon={<Accessibility className="h-3.5 w-3.5" />} label="Accessibility" value={p.accessibilityNeeds} />
              )}
              <div className="pt-3 border-t border-border">
                <p className="label">Enrolled workshop</p>
                {ws && (
                  <Link href={`/workshops/${ws.id}`} className="block mt-1.5 group">
                    <p className="text-sm font-medium text-ink group-hover:text-primary">{ws.name}</p>
                    <p className="text-xs text-ink-muted mt-0.5 inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> {formatDate(ws.date, { withTime: true })}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5 inline-flex items-center gap-1.5">
                      {ws.isVirtual ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                      {ws.location}
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Communication preference</h3>
              <p className="text-xs text-ink-muted mt-0.5">How this participant prefers to be contacted</p>
            </div>
            <div className="p-5">
              <div className="max-w-sm">
                <Select value={pref} onValueChange={(v) => setPref(v as typeof pref)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Email only","SMS only","Voice only","Email + SMS","Email + Voice","Email + SMS + Voice"] as const).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 flex gap-2">
                {pref.includes("Email") && <Badge tone="primary"><Mail className="h-3 w-3" /> Email</Badge>}
                {pref.includes("SMS") && <Badge tone="primary"><MessageSquare className="h-3 w-3" /> SMS</Badge>}
                {pref.includes("Voice") && <Badge tone="primary"><Phone className="h-3 w-3" /> Voice</Badge>}
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <History className="h-4 w-4 text-ink-muted" />
            <h3 className="font-semibold text-ink">Communication timeline</h3>
          </div>
          <ol className="p-5 space-y-5">
            {events.length === 0 && (
              <p className="text-sm text-ink-muted">No communications sent yet.</p>
            )}
            {events.map((e, i) => {
              const Icon = channelIcon[e.channel];
              return (
                <li key={e.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <span className="h-7 w-7 rounded-md bg-canvas border border-border flex items-center justify-center text-ink-muted">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {i < events.length - 1 && (
                      <span className="absolute top-7 w-px h-full bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-ink">{e.type}</p>
                      <Badge tone={channelTone[e.channel]}>{e.channel}</Badge>
                      <Badge tone={
                        e.outcome === "Completed" || e.outcome === "Opened" || e.outcome === "Clicked" || e.outcome === "Delivered" ? "success" :
                        e.outcome === "Failed" ? "error" : "neutral"
                      }>{e.outcome}</Badge>
                    </div>
                    <p className="text-xs text-ink-subtle mt-1">{formatDate(e.timestamp, { withTime: true })}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="label inline-flex items-center gap-1.5">{icon} {label}</p>
      <p className={`text-sm text-ink mt-0.5 ${mono ? "num" : ""}`}>{value}</p>
    </div>
  );
}
