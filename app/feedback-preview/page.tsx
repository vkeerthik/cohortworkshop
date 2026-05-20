"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { workshops } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { ArrowLeft, Check, X, Star, ShieldCheck } from "lucide-react";

const INTERESTS = [
  "Bone health",
  "Pain management",
  "Mental health and resilience",
  "Nutrition",
  "Movement and exercise",
  "Sleep and recovery",
];

const USEFULNESS = [
  { value: "1", label: "Not at all useful" },
  { value: "2", label: "Slightly useful" },
  { value: "3", label: "Moderately useful" },
  { value: "4", label: "Very useful" },
  { value: "5", label: "Extremely useful" },
];

const NO_SHOW_REASONS = [
  "Schedule conflict",
  "Illness or health reason",
  "Transportation difficulty",
  "Forgot or lost track of the date",
  "No longer interested in the topic",
  "Technical issues joining (virtual)",
  "Cost or other barrier",
  "Other",
];

type Attendance = "yes" | "no" | null;

export default function FeedbackPreview() {
  const workshop = workshops[4]; // Completed osteoporosis workshop
  const [submitted, setSubmitted] = useState(false);
  const [attended, setAttended] = useState<Attendance>(null);

  // Attended branch
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [usefulness, setUsefulness] = useState("");
  const [comments, setComments] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  // No-show branch
  const [reason, setReason] = useState("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [wantsReschedule, setWantsReschedule] = useState(false);

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  // Simulate survey submission — no real backend
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const canSubmit =
    attended === "yes" ? rating > 0 && !!usefulness : attended === "no" ? !!reason : false;

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-ink text-white px-6 py-2.5 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-ochre" />
          <span className="text-white/80">Preview mode — participant-facing feedback survey</span>
        </div>
        <Link href="/dashboard" className="text-white/70 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to platform
        </Link>
      </div>

      <div className="border-b border-border bg-surface">
        <div className="max-w-[1080px] mx-auto px-6 py-5 flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </div>
          <div>
            <div className="font-serif text-[15px] font-semibold text-ink">Northbridge Health Education</div>
            <div className="text-[10px] text-ink-subtle uppercase tracking-[0.12em]">Patient workshops</div>
          </div>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-6 py-10">
        {!submitted ? (
          <div>
            <p className="label text-primary mb-3">Workshop feedback</p>
            <h1 className="font-serif text-display text-ink mb-2">Tell us about your workshop</h1>
            <p className="text-ink-muted text-[15px] leading-relaxed">
              Your feedback helps us improve future sessions. This survey takes about two minutes.
            </p>

            <div className="mt-6 px-4 py-3 rounded-md bg-surface border border-border text-[13px]">
              <div className="font-medium text-ink">{workshop.name}</div>
              <div className="text-ink-subtle text-[12px] mt-0.5">{formatDate(workshop.date)} · {workshop.facilitator}</div>
            </div>

            {/* Attendance gate */}
            <div className="mt-8">
              <Label className="text-[13px]">Did you attend this workshop?</Label>
              <div className="mt-3 grid grid-cols-2 gap-3 max-w-[420px]">
                <button
                  type="button"
                  onClick={() => setAttended("yes")}
                  className={`px-4 py-3 rounded-md border text-left transition-colors flex items-center gap-3 ${
                    attended === "yes"
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-surface hover:border-ink-subtle"
                  }`}
                >
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    attended === "yes" ? "bg-status-success text-white" : "bg-canvas border border-border text-ink-subtle"
                  }`}>
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-[13px] font-medium text-ink">Yes, I attended</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttended("no")}
                  className={`px-4 py-3 rounded-md border text-left transition-colors flex items-center gap-3 ${
                    attended === "no"
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-surface hover:border-ink-subtle"
                  }`}
                >
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    attended === "no" ? "bg-status-error text-white" : "bg-canvas border border-border text-ink-subtle"
                  }`}>
                    <X className="h-4 w-4" />
                  </span>
                  <span className="text-[13px] font-medium text-ink">No, I missed it</span>
                </button>
              </div>
            </div>

            {/* ATTENDED branch */}
            {attended === "yes" && (
              <form onSubmit={submit} className="mt-10 space-y-10 animate-fade-in">
                <div>
                  <Label className="text-[13px]">Overall satisfaction</Label>
                  <p className="text-[12px] text-ink-subtle mt-0.5 mb-3">How satisfied were you with this workshop?</p>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus-ring rounded transition-colors"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            (hoverRating || rating) >= n
                              ? "fill-accent-ochre text-accent-ochre"
                              : "fill-transparent text-ink-subtle/40"
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-3 text-[12px] text-ink-muted num">{rating} of 5</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-[13px]">Workshop usefulness</Label>
                  <p className="text-[12px] text-ink-subtle mt-0.5 mb-3">How useful did you find the information shared?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {USEFULNESS.map((u) => (
                      <button
                        key={u.value}
                        type="button"
                        onClick={() => setUsefulness(u.value)}
                        className={`px-3 py-3 rounded-md border text-[12px] text-left transition-colors ${
                          usefulness === u.value
                            ? "border-primary bg-primary-soft text-primary"
                            : "border-border bg-surface text-ink-muted hover:border-ink-subtle"
                        }`}
                      >
                        <div className="font-serif text-[20px] num mb-0.5">{u.value}</div>
                        <div className="leading-tight">{u.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments" className="text-[13px]">Comments</Label>
                  <p className="text-[12px] text-ink-subtle mt-0.5 mb-3">
                    What worked well? What could be better? Anything the facilitator should know?
                  </p>
                  <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label className="text-[13px]">Future workshop interests</Label>
                  <p className="text-[12px] text-ink-subtle mt-0.5 mb-3">Which topics would you like to see next? Select all that apply.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INTERESTS.map((i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md border cursor-pointer transition-colors ${
                          interests.includes(i)
                            ? "border-primary bg-primary-soft"
                            : "border-border bg-surface hover:border-ink-subtle"
                        }`}
                      >
                        <Checkbox
                          checked={interests.includes(i)}
                          onChange={() => toggleInterest(i)}
                        />
                        <span className="text-[13px] text-ink">{i}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-ink-subtle">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Responses are stored in a PHIPA-conscious Canadian-hosted environment.
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Button type="submit" size="lg" disabled={!canSubmit}>
                    Submit feedback
                  </Button>
                  <Button type="button" variant="ghost">Skip for now</Button>
                </div>
              </form>
            )}

            {/* NO-SHOW branch */}
            {attended === "no" && (
              <form onSubmit={submit} className="mt-10 space-y-8 animate-fade-in">
                <div>
                  <Label className="text-[13px]">What kept you from attending?</Label>
                  <p className="text-[12px] text-ink-subtle mt-0.5 mb-3">
                    This helps us reduce barriers and schedule sessions that work better for participants.
                  </p>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger className="max-w-[460px]"><SelectValue placeholder="Select a reason" /></SelectTrigger>
                    <SelectContent>
                      {NO_SHOW_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reasonDetail" className="text-[13px]">Anything you'd like to add? (optional)</Label>
                  <p className="text-[12px] text-ink-subtle mt-0.5 mb-3">
                    Tell us more so we can improve future sessions.
                  </p>
                  <Textarea
                    id="reasonDetail"
                    value={reasonDetail}
                    onChange={(e) => setReasonDetail(e.target.value)}
                    placeholder="Optional details..."
                    className="min-h-[100px]"
                  />
                </div>

                <label
                  className={`flex items-center gap-3 px-4 py-3 rounded-md border cursor-pointer transition-colors max-w-[460px] ${
                    wantsReschedule
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-surface hover:border-ink-subtle"
                  }`}
                >
                  <Checkbox checked={wantsReschedule} onChange={() => setWantsReschedule(!wantsReschedule)} />
                  <span className="text-[13px] text-ink">Yes, I'd like to be invited to the next available session</span>
                </label>

                <div className="flex items-center gap-2 text-[11px] text-ink-subtle">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Responses are stored in a PHIPA-conscious Canadian-hosted environment.
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Button type="submit" size="lg" disabled={!canSubmit}>
                    Submit
                  </Button>
                  <Button type="button" variant="ghost">Skip for now</Button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Thank-you screen */
          <div className="pt-8 text-center">
            <div className="h-14 w-14 rounded-full bg-primary-soft border border-primary/20 flex items-center justify-center mb-6 mx-auto">
              <Check className="h-6 w-6 text-primary" strokeWidth={2.5} />
            </div>
            <p className="label text-primary mb-3">{attended === "no" ? "Response received" : "Feedback received"}</p>
            <h1 className="font-serif text-display text-ink mb-3">Thank you.</h1>
            <p className="text-ink-muted text-[15px] leading-relaxed max-w-[480px] mx-auto mb-8">
              {attended === "no"
                ? wantsReschedule
                  ? "We'll reach out with the next available session. Thanks for letting us know what got in the way."
                  : "Thanks for letting us know what got in the way. It helps us plan sessions that work better for everyone."
                : "Your responses will help shape the next round of patient workshops. We appreciate the time you took to share them."}
            </p>

            <Card className="overflow-hidden max-w-[480px] mx-auto text-left">
              <div className="px-5 py-4 border-b border-border">
                <p className="label text-ink-subtle">Summary of your response</p>
              </div>
              <div className="p-5 space-y-3 text-[13.5px]">
                {attended === "yes" ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Overall satisfaction</span>
                      <span className="font-medium text-ink num">{rating} of 5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Usefulness</span>
                      <span className="font-medium text-ink">{USEFULNESS.find((u) => u.value === usefulness)?.label || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Topics of interest</span>
                      <span className="font-medium text-ink num">{interests.length}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between gap-6">
                      <span className="text-ink-muted shrink-0">Attendance</span>
                      <span className="font-medium text-ink text-right">Did not attend</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-ink-muted shrink-0">Reason</span>
                      <span className="font-medium text-ink text-right">{reason || "—"}</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-ink-muted shrink-0">Wants to reschedule</span>
                      <span className="font-medium text-ink text-right">{wantsReschedule ? "Yes" : "No"}</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <div className="flex items-center justify-center gap-3 mt-8">
              <Link href="/dashboard">
                <Button variant="secondary">Return to platform</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
