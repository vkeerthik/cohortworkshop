"use client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewWorkshopPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isVirtual, setIsVirtual] = useState(false);
  const [reminders, setReminders] = useState({ d7: true, d1: true, h2: false });

  // Simulated save — no backend
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Workshop created",
      description: "Inflammatory Arthritis Follow-up scheduled for June 2026.",
      tone: "success",
    });
    setTimeout(() => router.push("/workshops"), 600);
  };

  return (
    <AppShell>
      <div className="max-w-3xl space-y-5">
        <Link href="/workshops" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to workshops
        </Link>

        <form onSubmit={save} className="space-y-5">
          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Workshop details</h3>
              <p className="text-xs text-ink-muted mt-0.5">Required fields are marked with an asterisk</p>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="name">Workshop name *</Label>
                <Input id="name" placeholder="e.g. Osteoporosis Education Workshop" defaultValue="Inflammatory Arthritis Follow-up" />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" placeholder="Brief overview of the session, goals, and audience" defaultValue="One-hour follow-up Q&A for participants of the June virtual session." />
              </div>

              <div className="space-y-1.5">
                <Label>Facilitator *</Label>
                <Select defaultValue="priya">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mireille">Dr. Mireille Tremblay</SelectItem>
                    <SelectItem value="janelle">Janelle Okoye, RN</SelectItem>
                    <SelectItem value="priya">Priya Raman, NP</SelectItem>
                    <SelectItem value="stephen">Dr. Stephen Halloran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Cohort</Label>
                <Select defaultValue="jun-2026">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="may-2026">May 2026</SelectItem>
                    <SelectItem value="jun-2026">June 2026</SelectItem>
                    <SelectItem value="jul-2026">July 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" defaultValue="2026-06-16" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time">Start time *</Label>
                <Input id="time" type="time" defaultValue="13:00" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dur">Duration (minutes)</Label>
                <Input id="dur" type="number" defaultValue={60} className="num" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cap">Capacity</Label>
                <Input id="cap" type="number" defaultValue={40} className="num" />
              </div>

              <div className="md:col-span-2 flex items-center justify-between p-3 rounded-md border border-border bg-canvas">
                <div>
                  <p className="text-sm font-medium text-ink">Virtual session</p>
                  <p className="text-xs text-ink-muted">Toggle on for Zoom, Teams, or other video platforms</p>
                </div>
                <Switch checked={isVirtual} onCheckedChange={setIsVirtual} />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="loc">{isVirtual ? "Meeting platform / link" : "Location *"}</Label>
                <Input
                  id="loc"
                  placeholder={isVirtual ? "Zoom meeting URL" : "Building, room, address"}
                  defaultValue={isVirtual ? "https://us02web.zoom.us/j/000000000" : "St. Michael's Health Centre, Room 2B"}
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Reminder schedule</h3>
              <p className="text-xs text-ink-muted mt-0.5">Automated reminders before the workshop start time</p>
            </div>
            <div className="p-5 space-y-3">
              <Checkbox checked={reminders.d7} onChange={(e) => setReminders({ ...reminders, d7: e.target.checked })} label="7 days before" />
              <Checkbox checked={reminders.d1} onChange={(e) => setReminders({ ...reminders, d1: e.target.checked })} label="1 day before" />
              <Checkbox checked={reminders.h2} onChange={(e) => setReminders({ ...reminders, h2: e.target.checked })} label="2 hours before" />
            </div>
          </Card>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" asChild>
              <Link href="/workshops">Cancel</Link>
            </Button>
            <Button type="button" variant="secondary">Save as draft</Button>
            <Button type="submit">Create workshop</Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
