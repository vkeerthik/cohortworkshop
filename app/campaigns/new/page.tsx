"use client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { workshops, participants } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Mail, MessageSquare, Phone, Send, CheckCircle2, Users, ArrowRight } from "lucide-react";

export default function CampaignBuilder() {
  const router = useRouter();
  const { toast } = useToast();

  const [workshopId, setWorkshopId] = useState(workshops[0].id);
  const [audience, setAudience] = useState<"all" | "unregistered" | "registered">("all");
  const [channels, setChannels] = useState({ email: true, sms: true, voice: false });
  const [schedule, setSchedule] = useState({ d7: true, d1: true, h2: false });
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);

  const cohort = participants.filter((p) => p.workshopId === workshopId);
  const audienceCount = useMemo(() => {
    if (audience === "all") return cohort.length;
    if (audience === "unregistered") return cohort.filter((p) => !["Registered","Reminder Sent","Attended","Feedback Completed"].includes(p.registrationStatus)).length;
    return cohort.filter((p) => ["Registered","Reminder Sent","Attended","Feedback Completed"].includes(p.registrationStatus)).length;
  }, [cohort, audience]);

  const reminderCount = Object.values(schedule).filter(Boolean).length;
  const channelCount = Object.values(channels).filter(Boolean).length;
  const estimatedMessages = audienceCount * channelCount * Math.max(reminderCount, 1);

  // Simulate send — no real API call
  const send = () => {
    setConfirmOpen(false);
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setDoneOpen(true);
      toast({ title: "Campaign queued", description: `${audienceCount} recipients · ${channelCount} channels`, tone: "success" });
    }, 1100);
  };

  return (
    <AppShell>
      <div className="max-w-[1200px] grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Step 1 · Choose workshop</h3>
            </div>
            <div className="p-5">
              <Select value={workshopId} onValueChange={setWorkshopId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {workshops.filter(w => w.status !== "Completed").map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name} — {w.cohort}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Step 2 · Select audience</h3>
            </div>
            <div className="p-5 space-y-2">
              <AudienceOption
                checked={audience === "all"}
                onCheck={() => setAudience("all")}
                title="Entire cohort"
                desc="Everyone in this workshop, regardless of status"
                count={cohort.length}
              />
              <AudienceOption
                checked={audience === "unregistered"}
                onCheck={() => setAudience("unregistered")}
                title="Not yet registered"
                desc="Imported, invited, or awaiting RSVP"
                count={cohort.filter((p) => !["Registered","Reminder Sent","Attended","Feedback Completed"].includes(p.registrationStatus)).length}
              />
              <AudienceOption
                checked={audience === "registered"}
                onCheck={() => setAudience("registered")}
                title="Confirmed registrants"
                desc="Send reminders or attendance prompts"
                count={cohort.filter((p) => ["Registered","Reminder Sent","Attended","Feedback Completed"].includes(p.registrationStatus)).length}
              />
            </div>
          </Card>

          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Step 3 · Choose channels</h3>
              <p className="text-xs text-ink-muted mt-0.5">Each participant only receives channels matching their preference</p>
            </div>
            <div className="p-5 grid grid-cols-3 gap-3">
              <ChannelToggle icon={<Mail className="h-4 w-4" />} name="Email" enabled={channels.email} onToggle={(v) => setChannels({ ...channels, email: v })} />
              <ChannelToggle icon={<MessageSquare className="h-4 w-4" />} name="SMS" enabled={channels.sms} onToggle={(v) => setChannels({ ...channels, sms: v })} />
              <ChannelToggle icon={<Phone className="h-4 w-4" />} name="Voice" enabled={channels.voice} onToggle={(v) => setChannels({ ...channels, voice: v })} />
            </div>
          </Card>

          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Step 4 · Reminder schedule</h3>
            </div>
            <div className="p-5 space-y-3">
              <Checkbox checked={schedule.d7} onChange={(e) => setSchedule({ ...schedule, d7: e.target.checked })} label="7 days before workshop" />
              <Checkbox checked={schedule.d1} onChange={(e) => setSchedule({ ...schedule, d1: e.target.checked })} label="1 day before workshop" />
              <Checkbox checked={schedule.h2} onChange={(e) => setSchedule({ ...schedule, h2: e.target.checked })} label="2 hours before workshop" />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Campaign summary</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="label">Workshop</p>
                <p className="text-sm text-ink font-medium mt-1">{workshops.find(w => w.id === workshopId)?.name}</p>
              </div>
              <div>
                <p className="label flex items-center gap-1.5"><Users className="h-3 w-3" /> Audience</p>
                <p className="font-serif text-[28px] num text-ink mt-1">{audienceCount}</p>
                <p className="text-xs text-ink-muted">recipients</p>
              </div>
              <div className="pt-3 border-t border-border space-y-2">
                <SummaryRow label="Channels" value={channelCount.toString()} />
                <SummaryRow label="Reminder waves" value={reminderCount.toString()} />
                <SummaryRow label="Est. messages" value={estimatedMessages.toLocaleString()} highlight />
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={audienceCount === 0 || channelCount === 0}
                onClick={() => setConfirmOpen(true)}
              >
                <Send className="h-4 w-4" /> Review &amp; send
              </Button>
              <p className="text-[11px] text-ink-subtle text-center">
                You'll review before anything is sent
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send this campaign?</DialogTitle>
            <DialogDescription>
              {audienceCount} participants will receive up to {channelCount} channel{channelCount !== 1 ? "s" : ""},
              across {reminderCount || 1} reminder wave{reminderCount !== 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-canvas border border-border p-4 my-2">
            <ul className="text-sm space-y-1.5 text-ink-muted">
              <li>· Each participant receives only their preferred channels</li>
              <li>· Quiet hours (9pm–7am local) are respected</li>
              <li>· Failed sends retry once before being logged</li>
            </ul>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={send} disabled={sending}>
              {sending ? "Queuing…" : "Send campaign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success modal */}
      <Dialog open={doneOpen} onOpenChange={setDoneOpen}>
        <DialogContent>
          <div className="text-center py-2">
            <div className="h-12 w-12 rounded-full bg-primary-soft text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogTitle className="mt-4">Campaign queued</DialogTitle>
            <DialogDescription>
              {audienceCount} recipients will begin receiving messages within the next 5 minutes.
            </DialogDescription>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="secondary" onClick={() => { setDoneOpen(false); router.push("/dashboard"); }}>
                Back to dashboard
              </Button>
              <Button onClick={() => { setDoneOpen(false); router.push("/reports"); }}>
                View delivery <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function AudienceOption({ checked, onCheck, title, desc, count }: {
  checked: boolean; onCheck: () => void; title: string; desc: string; count: number;
}) {
  return (
    <button
      onClick={onCheck}
      className={`w-full text-left rounded-md border p-3.5 flex items-center gap-3 transition-colors ${
        checked ? "border-primary bg-primary-soft/40" : "border-border bg-surface hover:bg-canvas"
      }`}
    >
      <div className={`h-4 w-4 rounded-full border-2 shrink-0 ${checked ? "border-primary bg-primary" : "border-border"}`}>
        {checked && <div className="h-1.5 w-1.5 rounded-full bg-white m-auto mt-[3px]" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-ink-muted mt-0.5">{desc}</p>
      </div>
      <span className="num text-sm font-medium text-ink">{count}</span>
    </button>
  );
}

function ChannelToggle({ icon, name, enabled, onToggle }: { icon: React.ReactNode; name: string; enabled: boolean; onToggle: (v: boolean) => void }) {
  return (
    <div className={`rounded-md border p-4 transition-colors ${enabled ? "border-primary bg-primary-soft/40" : "border-border bg-surface"}`}>
      <div className="flex items-center justify-between">
        <div className={`h-8 w-8 rounded-md flex items-center justify-center ${enabled ? "bg-primary text-white" : "bg-canvas text-ink-muted"}`}>
          {icon}
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      <p className="text-sm font-medium text-ink mt-3">{name}</p>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink-muted">{label}</span>
      <span className={`text-sm num font-medium ${highlight ? "text-primary" : "text-ink"}`}>{value}</span>
    </div>
  );
}
