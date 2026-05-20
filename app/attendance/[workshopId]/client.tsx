"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { workshops, participants } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Search,
  Check,
  X,
  RotateCcw,
  Save,
  ClipboardCheck,
} from "lucide-react";

type Mark = "Attended" | "No Show" | "Pending";

export default function AttendanceDetailClient() {
  const params = useParams<{ workshopId: string }>();
  const { toast } = useToast();
  const workshop = workshops.find((w) => w.id === params.workshopId);
  if (!workshop) notFound();

  const initial = useMemo(
    () => participants.filter((p) => p.workshopId === workshop!.id),
    [workshop]
  );

  // Local attendance state — simulates roster updates, no real backend
  const [marks, setMarks] = useState<Record<string, Mark>>(() =>
    Object.fromEntries(initial.map((p) => [p.id, p.attendanceStatus as Mark]))
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    if (!search) return initial;
    const q = search.toLowerCase();
    return initial.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
    );
  }, [initial, search]);

  const total = initial.length;
  const attended = Object.values(marks).filter((m) => m === "Attended").length;
  const noShow = Object.values(marks).filter((m) => m === "No Show").length;
  const pending = Object.values(marks).filter((m) => m === "Pending").length;

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAllVisible = () => {
    const allChecked = visible.every((p) => selected.has(p.id));
    const next = new Set(selected);
    if (allChecked) visible.forEach((p) => next.delete(p.id));
    else visible.forEach((p) => next.add(p.id));
    setSelected(next);
  };

  const setMark = (id: string, m: Mark) => setMarks((prev) => ({ ...prev, [id]: m }));

  const bulkMark = (m: Mark) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setMarks((prev) => {
      const next = { ...prev };
      ids.forEach((id) => (next[id] = m));
      return next;
    });
    toast({
      title: `${ids.length} marked as ${m === "Attended" ? "attended" : m === "No Show" ? "no-show" : "pending"}`,
      tone: "success",
    });
    setSelected(new Set());
  };

  const save = () => {
    toast({
      title: "Attendance saved",
      description: `${attended} attended · ${noShow} no-show · ${pending} pending`,
      tone: "success",
    });
  };

  const allVisibleChecked = visible.length > 0 && visible.every((p) => selected.has(p.id));

  return (
    <AppShell>
      <div className="max-w-[1200px]">
        {/* Back link */}
        <Link
          href="/attendance"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted hover:text-ink mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All attendance
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="label text-ink-subtle">{workshop.cohort}</span>
              <Badge
                tone={
                  workshop.status === "In Progress"
                    ? "primary"
                    : workshop.status === "Completed"
                    ? "neutral"
                    : "info"
                }
                dot
              >
                {workshop.status}
              </Badge>
            </div>
            <h1 className="font-serif text-[26px] text-ink leading-tight">{workshop.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-5 text-[12.5px] text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span className="num">{formatDate(workshop.date, { withTime: true })}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {workshop.location}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {workshop.facilitator}
              </span>
            </div>
          </div>

          <Button onClick={save} size="lg">
            <Save className="h-4 w-4" /> Save attendance
          </Button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card className="px-5 py-4">
            <div className="label text-ink-subtle">Registered</div>
            <div className="font-serif text-display text-ink num mt-1">{total}</div>
          </Card>
          <Card className="px-5 py-4">
            <div className="label text-status-success">Attended</div>
            <div className="font-serif text-display text-status-success num mt-1">{attended}</div>
          </Card>
          <Card className="px-5 py-4">
            <div className="label text-status-error">No-show</div>
            <div className="font-serif text-display text-status-error num mt-1">{noShow}</div>
          </Card>
          <Card className="px-5 py-4">
            <div className="label text-accent-ochre">Pending</div>
            <div className="font-serif text-display text-accent-ochre num mt-1">{pending}</div>
          </Card>
        </div>

        {/* Toolbar */}
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search participants"
                className="pl-9 h-9"
              />
            </div>
            <div className="text-[12px] text-ink-subtle num">
              Showing {visible.length} of {total}
            </div>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="px-4 py-2.5 bg-primary-soft border-b border-primary/15 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[12.5px]">
                <span className="font-medium text-primary num">{selected.size} selected</span>
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-ink-muted hover:text-ink text-[11px] underline-offset-2 hover:underline"
                >
                  Clear
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => bulkMark("Attended")}>
                  <Check className="h-3.5 w-3.5" /> Mark attended
                </Button>
                <Button size="sm" variant="secondary" onClick={() => bulkMark("No Show")}>
                  <X className="h-3.5 w-3.5" /> Mark no-show
                </Button>
                <Button size="sm" variant="ghost" onClick={() => bulkMark("Pending")}>
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          {visible.length === 0 ? (
            <div className="p-10 text-center bg-dotgrid">
              <ClipboardCheck className="h-7 w-7 text-ink-subtle mx-auto mb-3" />
              <p className="text-[13px] text-ink-muted">No participants match that search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-canvas/60 border-b border-border">
                  <tr className="text-left text-ink-subtle">
                    <th className="px-4 py-2.5 w-10">
                      <Checkbox checked={allVisibleChecked} onChange={toggleAllVisible} />
                    </th>
                    <th className="px-4 py-2.5 font-medium text-[11px] uppercase tracking-[0.08em]">Participant</th>
                    <th className="px-4 py-2.5 font-medium text-[11px] uppercase tracking-[0.08em]">Email</th>
                    <th className="px-4 py-2.5 font-medium text-[11px] uppercase tracking-[0.08em]">Registration</th>
                    <th className="px-4 py-2.5 font-medium text-[11px] uppercase tracking-[0.08em] text-right">Mark</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => {
                    const mark = marks[p.id];
                    const isSel = selected.has(p.id);
                    return (
                      <tr
                        key={p.id}
                        className={`border-b border-border/60 last:border-b-0 ${
                          isSel ? "bg-primary-soft/40" : "hover:bg-canvas/50"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <Checkbox checked={isSel} onChange={() => toggleOne(p.id)} />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/participants/${p.id}`}
                            className="font-medium text-ink hover:text-primary"
                          >
                            {p.firstName} {p.lastName}
                          </Link>
                          {p.accessibilityNeeds && (
                            <div className="text-[11px] text-accent-ochre mt-0.5">
                              Accessibility: {p.accessibilityNeeds}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-ink-muted num text-[12px]">{p.email}</td>
                        <td className="px-4 py-3">
                          <Badge
                            tone={
                              p.registrationStatus === "Registered" ||
                              p.registrationStatus === "Attended" ||
                              p.registrationStatus === "Feedback Completed"
                                ? "primary"
                                : "neutral"
                            }
                          >
                            {p.registrationStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => setMark(p.id, "Attended")}
                              className={`h-7 px-2.5 text-[11.5px] rounded border transition-colors flex items-center gap-1 ${
                                mark === "Attended"
                                  ? "bg-[#E8F1EA] border-[#C5D9C9] text-status-success font-medium"
                                  : "border-border text-ink-muted hover:border-ink-subtle"
                              }`}
                            >
                              <Check className="h-3 w-3" /> Attended
                            </button>
                            <button
                              onClick={() => setMark(p.id, "No Show")}
                              className={`h-7 px-2.5 text-[11.5px] rounded border transition-colors flex items-center gap-1 ${
                                mark === "No Show"
                                  ? "bg-[#F5E2E2] border-[#E2C0C0] text-status-error font-medium"
                                  : "border-border text-ink-muted hover:border-ink-subtle"
                              }`}
                            >
                              <X className="h-3 w-3" /> No-show
                            </button>
                            <button
                              onClick={() => setMark(p.id, "Pending")}
                              className={`h-7 px-2.5 text-[11.5px] rounded border transition-colors ${
                                mark === "Pending"
                                  ? "bg-[#F4EBD8] border-[#DFC993] text-accent-ochre font-medium"
                                  : "border-border text-ink-muted hover:border-ink-subtle"
                              }`}
                            >
                              Pending
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <p className="text-[11px] text-ink-subtle mt-4">
          Changes are kept locally in this preview. In production, attendance is saved to the PHIPA-conscious Canadian-hosted record.
        </p>
      </div>
    </AppShell>
  );
}
