"use client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { participants, workshops } from "@/lib/mock-data";
import { statusTone, relativeTime } from "@/lib/format";
import Link from "next/link";
import { Search, Upload, Send, Filter, Mail, MessageSquare, Phone } from "lucide-react";
import { useState, useMemo } from "react";

export default function ParticipantsPage() {
  const [q, setQ] = useState("");
  const [workshopFilter, setWorkshopFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const matchQ =
        !q ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q.toLowerCase()) ||
        p.email.toLowerCase().includes(q.toLowerCase());
      const matchW = workshopFilter === "all" || p.workshopId === workshopFilter;
      const matchS = statusFilter === "all" || p.registrationStatus === statusFilter;
      return matchQ && matchW && matchS;
    });
  }, [q, workshopFilter, statusFilter]);

  const channels = (pref: string) => ({
    email: pref.includes("Email"),
    sms: pref.includes("SMS"),
    voice: pref.includes("Voice"),
  });

  return (
    <AppShell>
      <div className="max-w-[1400px] space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-muted">
            <span className="text-ink font-medium num">{filtered.length}</span> of {participants.length} participants
          </p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" className="pl-8 w-[280px]" />
            </div>
            <div className="w-[200px]">
              <Select value={workshopFilter} onValueChange={setWorkshopFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All workshops</SelectItem>
                  {workshops.map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name.length > 32 ? w.name.slice(0, 32) + "…" : w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[160px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {["Imported","Invitation Sent","Awaiting RSVP","Registered","Reminder Sent","Attended","No Show","Feedback Completed"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/participants/import"><Upload className="h-3.5 w-3.5" /> Import</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/campaigns/new"><Send className="h-3.5 w-3.5" /> Send campaign</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left bg-canvas/40">
                <th className="px-5 py-3 label">Name</th>
                <th className="px-5 py-3 label">Email</th>
                <th className="px-5 py-3 label">Phone</th>
                <th className="px-5 py-3 label">Workshop</th>
                <th className="px-5 py-3 label">Channels</th>
                <th className="px-5 py-3 label">Status</th>
                <th className="px-5 py-3 label">Last contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => {
                const ws = workshops.find((w) => w.id === p.workshopId);
                const ch = channels(p.commPreference);
                return (
                  <tr key={p.id} className="hover:bg-canvas transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/participants/${p.id}`} className="font-medium text-ink hover:text-primary">
                        {p.firstName} {p.lastName}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{p.email}</td>
                    <td className="px-5 py-3 text-ink-muted num">{p.phone}</td>
                    <td className="px-5 py-3 text-ink-muted truncate max-w-[200px]">{ws?.name}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        {ch.email && <span className="h-6 w-6 rounded bg-primary-soft text-primary flex items-center justify-center" title="Email"><Mail className="h-3 w-3" /></span>}
                        {ch.sms && <span className="h-6 w-6 rounded bg-primary-soft text-primary flex items-center justify-center" title="SMS"><MessageSquare className="h-3 w-3" /></span>}
                        {ch.voice && <span className="h-6 w-6 rounded bg-primary-soft text-primary flex items-center justify-center" title="Voice"><Phone className="h-3 w-3" /></span>}
                      </div>
                    </td>
                    <td className="px-5 py-3"><Badge tone={statusTone[p.registrationStatus]} dot>{p.registrationStatus}</Badge></td>
                    <td className="px-5 py-3 text-ink-muted">{relativeTime(p.lastCommunication)}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <p className="text-sm text-ink-muted">No participants match the current filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}
