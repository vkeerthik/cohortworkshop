"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { workshops } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { ArrowLeft, Check, Calendar, MapPin, User, ShieldCheck } from "lucide-react";

export default function RegistrationPreview() {
  const workshop = workshops[0]; // Osteoporosis Education
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    commPreference: "Email + SMS",
    accessibility: "",
  });

  // Simulate form submission — no real backend
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Preview-mode banner */}
      <div className="bg-ink text-white px-6 py-2.5 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-ochre" />
          <span className="text-white/80">Preview mode — participant-facing registration form</span>
        </div>
        <Link href="/dashboard" className="text-white/70 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to platform
        </Link>
      </div>

      {/* Public-facing header */}
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

      <div className="max-w-[1080px] mx-auto px-6 py-10">
        {!submitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            {/* Form */}
            <div>
              <p className="label text-primary mb-3">Workshop registration</p>
              <h1 className="font-serif text-display text-ink mb-2">{workshop.name}</h1>
              <p className="text-ink-muted text-[15px] leading-relaxed max-w-[560px]">
                {workshop.description}
              </p>

              <form onSubmit={submit} className="mt-8 space-y-5 max-w-[560px]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Margaret"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Chen"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (416) 555-0123"
                  />
                  <p className="text-[11px] text-ink-subtle mt-1.5">Used for SMS and voice reminders only.</p>
                </div>

                <div>
                  <Label>Preferred communication method</Label>
                  <Select value={form.commPreference} onValueChange={(v) => setForm({ ...form, commPreference: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email only">Email only</SelectItem>
                      <SelectItem value="SMS only">SMS only</SelectItem>
                      <SelectItem value="Voice only">Voice only</SelectItem>
                      <SelectItem value="Email + SMS">Email and SMS</SelectItem>
                      <SelectItem value="Email + Voice">Email and voice</SelectItem>
                      <SelectItem value="Email + SMS + Voice">All three</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="accessibility">Accessibility needs (optional)</Label>
                  <Textarea
                    id="accessibility"
                    value={form.accessibility}
                    onChange={(e) => setForm({ ...form, accessibility: e.target.value })}
                    placeholder="Closed captions, large print materials, mobility access, interpreter, etc."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-ink-subtle">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Your information is stored in a PHIPA-conscious Canadian-hosted environment.
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" size="lg">Register for this workshop</Button>
                  <Button type="button" variant="ghost">Cancel</Button>
                </div>
              </form>
            </div>

            {/* Workshop sidebar */}
            <aside>
              <Card className="overflow-hidden">
                <div className="bg-primary-soft px-5 py-4 border-b border-primary/15">
                  <p className="label text-primary">Session details</p>
                </div>
                <div className="p-5 space-y-4 text-[13.5px]">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-ink-muted mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-ink">{formatDate(workshop.date, { withTime: true })}</div>
                      <div className="text-ink-subtle text-[12px] mt-0.5">{workshop.durationMin} minutes</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-ink-muted mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-ink">{workshop.location}</div>
                      <div className="text-ink-subtle text-[12px] mt-0.5">{workshop.isVirtual ? "Virtual session" : "In person"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-ink-muted mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-ink">{workshop.facilitator}</div>
                      <div className="text-ink-subtle text-[12px] mt-0.5">Facilitator</div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="text-[11px] text-ink-subtle uppercase tracking-[0.1em] mb-1">Cohort</div>
                    <div className="font-medium text-ink">{workshop.cohort}</div>
                  </div>
                </div>
              </Card>

              <div className="mt-5 px-5 py-4 rounded-md border border-border bg-surface text-[12px] text-ink-muted leading-relaxed">
                You will receive a confirmation email after registering, plus reminders before the session.
                You can adjust your communication preferences any time using the link in your confirmation email.
              </div>
            </aside>
          </div>
        ) : (
          /* Confirmation screen */
          <div className="max-w-[640px] mx-auto pt-8">
            <div className="h-14 w-14 rounded-full bg-primary-soft border border-primary/20 flex items-center justify-center mb-6">
              <Check className="h-6 w-6 text-primary" strokeWidth={2.5} />
            </div>
            <p className="label text-primary mb-3">You're registered</p>
            <h1 className="font-serif text-display text-ink mb-3">Thank you, {form.firstName || "Margaret"}.</h1>
            <p className="text-ink-muted text-[15px] leading-relaxed mb-8">
              We've sent a confirmation to <span className="text-ink font-medium">{form.email || "you@example.com"}</span>.
              You'll receive reminders before the session based on your selected communication preferences.
            </p>

            <Card className="overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <p className="label text-ink-subtle">Your session</p>
              </div>
              <div className="p-5 space-y-3 text-[13.5px]">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Workshop</span>
                  <span className="font-medium text-ink text-right">{workshop.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">When</span>
                  <span className="font-medium text-ink num">{formatDate(workshop.date, { withTime: true })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Where</span>
                  <span className="font-medium text-ink text-right">{workshop.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Facilitator</span>
                  <span className="font-medium text-ink">{workshop.facilitator}</span>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-3 mt-8">
              <Button onClick={() => setSubmitted(false)} variant="secondary">Register another participant</Button>
              <Link href="/dashboard">
                <Button variant="ghost">Return to platform</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
