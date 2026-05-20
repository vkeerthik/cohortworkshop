"use client";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workshops, participants } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { Calendar, MapPin, ChevronRight, ClipboardCheck, Users } from "lucide-react";

export default function AttendanceLanding() {
  const eligible = workshops
    .filter((w) => w.status === "Scheduled" || w.status === "In Progress")
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const completed = workshops.filter((w) => w.status === "Completed");

  const countFor = (id: string) => participants.filter((p) => p.workshopId === id).length;
  const markedFor = (id: string) =>
    participants.filter(
      (p) => p.workshopId === id && (p.attendanceStatus === "Attended" || p.attendanceStatus === "No Show")
    ).length;

  return (
    <AppShell>
      <div className="max-w-[1080px]">
        <p className="label text-ink-subtle mb-2">Attendance</p>
        <h1 className="font-serif text-[26px] text-ink mb-1">Mark attendance</h1>
        <p className="text-[13px] text-ink-muted">
          Select a workshop to record who attended. Reminders for upcoming sessions are sent automatically based on each campaign.
        </p>

        {/* Eligible */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-medium text-ink">Active and upcoming</h2>
            <span className="text-[12px] text-ink-subtle num">{eligible.length} session{eligible.length === 1 ? "" : "s"}</span>
          </div>

          {eligible.length === 0 ? (
            <Card className="p-8 text-center bg-dotgrid">
              <ClipboardCheck className="h-7 w-7 text-ink-subtle mx-auto mb-3" />
              <p className="text-[13px] text-ink-muted">No active or upcoming workshops to take attendance for.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {eligible.map((w) => {
                const total = countFor(w.id);
                const marked = markedFor(w.id);
                return (
                  <Link
                    key={w.id}
                    href={`/attendance/${w.id}`}
                    className="group block"
                  >
                    <Card className="px-5 py-4 hover:border-ink-subtle transition-colors">
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[11px] text-ink-subtle uppercase tracking-[0.1em]">{w.cohort}</span>
                            <Badge tone={w.status === "In Progress" ? "primary" : "info"} dot>
                              {w.status}
                            </Badge>
                          </div>
                          <div className="font-medium text-ink text-[15px] truncate">{w.name}</div>
                          <div className="mt-2 flex items-center gap-5 text-[12px] text-ink-muted">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="num">{formatDate(w.date, { withTime: true })}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {w.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              <span className="num">{total}</span> registered
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] text-ink-subtle uppercase tracking-[0.1em] mb-1">Marked</div>
                          <div className="font-serif text-[22px] text-ink num">
                            {marked}<span className="text-ink-subtle">/{total}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-ink-subtle group-hover:text-ink shrink-0" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed (review only) */}
        {completed.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-medium text-ink">Recently completed</h2>
              <span className="text-[12px] text-ink-subtle">Review or amend records</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {completed.map((w) => {
                const total = countFor(w.id);
                const marked = markedFor(w.id);
                return (
                  <Link key={w.id} href={`/attendance/${w.id}`} className="group block">
                    <Card className="px-5 py-3.5 hover:border-ink-subtle transition-colors opacity-90">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-ink-subtle uppercase tracking-[0.1em]">{w.cohort}</span>
                            <Badge tone="neutral">{w.status}</Badge>
                          </div>
                          <div className="font-medium text-ink text-[14px] truncate mt-1">{w.name}</div>
                        </div>
                        <div className="text-[12px] text-ink-muted num">
                          {marked} of {total} marked
                        </div>
                        <ChevronRight className="h-4 w-4 text-ink-subtle group-hover:text-ink" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
