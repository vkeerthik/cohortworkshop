"use client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { workshops, participants } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { CalendarPlus, Search, Filter, MapPin, Video } from "lucide-react";
import { useState } from "react";

const statusTone = {
  "Draft": "neutral",
  "Scheduled": "info",
  "In Progress": "warn",
  "Completed": "success",
} as const;

export default function WorkshopsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "scheduled" | "completed">("all");

  const filtered = workshops.filter((w) => {
    const matchQ = !q || w.name.toLowerCase().includes(q.toLowerCase()) || w.facilitator.toLowerCase().includes(q.toLowerCase());
    const matchF =
      filter === "all" ? true :
      filter === "scheduled" ? (w.status === "Scheduled" || w.status === "In Progress") :
      w.status === "Completed";
    return matchQ && matchF;
  });

  return (
    <AppShell>
      <div className="max-w-[1320px] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant={filter === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("all")}>
              All <span className="text-ink-subtle ml-1.5">{workshops.length}</span>
            </Button>
            <Button variant={filter === "scheduled" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("scheduled")}>
              Active <span className="text-ink-subtle ml-1.5">{workshops.filter(w => w.status !== "Completed").length}</span>
            </Button>
            <Button variant={filter === "completed" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("completed")}>
              Completed <span className="text-ink-subtle ml-1.5">{workshops.filter(w => w.status === "Completed").length}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search workshops" className="pl-8 w-[260px]" />
            </div>
            <Button variant="secondary" size="sm"><Filter className="h-3.5 w-3.5" /> Filters</Button>
            <Button size="sm" asChild>
              <Link href="/workshops/new"><CalendarPlus className="h-4 w-4" /> New workshop</Link>
            </Button>
          </div>
        </div>

        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 label">Workshop</th>
                <th className="px-5 py-3 label">Facilitator</th>
                <th className="px-5 py-3 label">Date</th>
                <th className="px-5 py-3 label">Location</th>
                <th className="px-5 py-3 label">Cohort</th>
                <th className="px-5 py-3 label">Capacity</th>
                <th className="px-5 py-3 label">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((w) => {
                const registered = participants.filter(
                  (p) => p.workshopId === w.id &&
                  ["Registered", "Reminder Sent", "Attended", "Feedback Completed"].includes(p.registrationStatus)
                ).length;
                return (
                  <tr key={w.id} className="hover:bg-canvas transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/workshops/${w.id}`} className="font-medium text-ink hover:text-primary">
                        {w.name}
                      </Link>
                      <p className="text-xs text-ink-subtle mt-0.5 truncate max-w-[280px]">{w.description}</p>
                    </td>
                    <td className="px-5 py-3.5 text-ink-muted">{w.facilitator}</td>
                    <td className="px-5 py-3.5 text-ink-muted num">{formatDate(w.date, { withTime: true })}</td>
                    <td className="px-5 py-3.5 text-ink-muted">
                      <span className="inline-flex items-center gap-1.5">
                        {w.isVirtual ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        {w.location}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-ink-muted">{w.cohort}</td>
                    <td className="px-5 py-3.5 num text-ink-muted">{registered} / {w.capacity}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={statusTone[w.status]} dot>{w.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}
