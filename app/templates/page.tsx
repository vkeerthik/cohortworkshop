"use client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { defaultTemplates } from "@/lib/mock-data";
import { useState } from "react";
import { Mail, MessageSquare, Phone, Eye, Save, Smartphone } from "lucide-react";

const MERGE_FIELDS = [
  "{{first_name}}",
  "{{workshop_name}}",
  "{{workshop_date}}",
  "{{workshop_time}}",
  "{{registration_link}}",
  "{{feedback_link}}",
];

const sampleValues = {
  "{{first_name}}": "Margaret",
  "{{workshop_name}}": "Osteoporosis Education Workshop",
  "{{workshop_date}}": "May 26, 2026",
  "{{workshop_time}}": "2:00 PM",
  "{{registration_link}}": "cohort.health/r/ab2x9",
  "{{feedback_link}}": "cohort.health/f/ab2x9",
};

function render(text: string) {
  let out = text;
  for (const [k, v] of Object.entries(sampleValues)) out = out.replaceAll(k, v);
  return out;
}

export default function TemplatesPage() {
  const { toast } = useToast();
  const [emailSubject, setEmailSubject] = useState(defaultTemplates.emailSubject);
  const [emailBody, setEmailBody] = useState(defaultTemplates.emailBody);
  const [sms, setSms] = useState(defaultTemplates.sms);
  const [voice, setVoice] = useState(defaultTemplates.voiceScript);

  const insertMerge = (field: string, set: (s: string) => void, current: string) => {
    set(current + " " + field);
  };

  const save = () => toast({ title: "Templates saved", description: "Changes apply to future campaigns.", tone: "success" });

  return (
    <AppShell>
      <div className="max-w-[1320px] space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-muted">
            Use merge fields to personalize. Templates apply to all campaigns unless overridden per workshop.
          </p>
          <Button onClick={save}><Save className="h-4 w-4" /> Save changes</Button>
        </div>

        <Tabs defaultValue="email">
          <TabsList>
            <TabsTrigger value="email"><Mail className="h-3.5 w-3.5 mr-1.5" /> Email</TabsTrigger>
            <TabsTrigger value="sms"><MessageSquare className="h-3.5 w-3.5 mr-1.5" /> SMS</TabsTrigger>
            <TabsTrigger value="voice"><Phone className="h-3.5 w-3.5 mr-1.5" /> Voice</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <Card className="lg:col-span-3">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-semibold text-ink">Email template</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label>Subject line</Label>
                    <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Body</Label>
                    <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="min-h-[280px] font-mono text-[13px]" />
                  </div>
                  <MergeFields onInsert={(f) => insertMerge(f, setEmailBody, emailBody)} />
                </div>
              </Card>

              <Card className="lg:col-span-2 self-start">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Eye className="h-4 w-4 text-ink-muted" />
                  <h3 className="font-semibold text-ink">Preview</h3>
                  <Badge tone="neutral" className="ml-auto">Sample data</Badge>
                </div>
                <div className="p-5">
                  <div className="border border-border rounded-md overflow-hidden bg-white">
                    <div className="px-4 py-3 border-b border-border bg-canvas">
                      <p className="text-[11px] text-ink-subtle">From: Patient Education &lt;workshops@cohort.health&gt;</p>
                      <p className="text-[11px] text-ink-subtle">To: margaret.whitfield@example.ca</p>
                      <p className="text-sm font-medium text-ink mt-1">{render(emailSubject)}</p>
                    </div>
                    <div className="p-4 text-sm text-ink whitespace-pre-wrap leading-relaxed">
                      {render(emailBody)}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sms">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <Card className="lg:col-span-3">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-ink">SMS template</h3>
                  <span className={`text-xs num ${sms.length > 160 ? "text-status-warn" : "text-ink-subtle"}`}>
                    {sms.length}/160 chars · {Math.ceil(sms.length / 160)} segment{sms.length > 160 ? "s" : ""}
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <Textarea value={sms} onChange={(e) => setSms(e.target.value)} className="min-h-[120px] font-mono text-[13px]" />
                  <MergeFields onInsert={(f) => insertMerge(f, setSms, sms)} />
                </div>
              </Card>

              <Card className="lg:col-span-2 self-start">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-ink-muted" />
                  <h3 className="font-semibold text-ink">Preview</h3>
                </div>
                <div className="p-5 flex justify-center">
                  <div className="w-full max-w-[260px] rounded-[28px] border-[8px] border-ink/90 bg-ink/95 p-3 shadow-pop">
                    <div className="rounded-[18px] bg-[#0F1620] p-3 min-h-[220px]">
                      <p className="text-[10px] text-white/40 text-center mb-3">Patient Education · now</p>
                      <div className="bg-[#1F2A38] text-white text-[13px] rounded-2xl rounded-bl-sm px-3 py-2 leading-snug max-w-[85%]">
                        {render(sms)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="voice">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <Card className="lg:col-span-3">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-semibold text-ink">Voice script</h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Read aloud by text-to-speech or recorded with a clinician's voice. Configure delivery in voice settings.
                  </p>
                </div>
                <div className="p-5 space-y-4">
                  <Textarea value={voice} onChange={(e) => setVoice(e.target.value)} className="min-h-[260px] font-mono text-[13px]" />
                  <MergeFields onInsert={(f) => insertMerge(f, setVoice, voice)} />
                </div>
              </Card>

              <Card className="lg:col-span-2 self-start">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Phone className="h-4 w-4 text-ink-muted" />
                  <h3 className="font-semibold text-ink">Spoken preview</h3>
                </div>
                <div className="p-5">
                  <div className="rounded-md border border-border bg-canvas p-4">
                    <p className="text-[11px] text-ink-subtle uppercase tracking-wider">Played to participant</p>
                    <p className="text-sm text-ink mt-2 whitespace-pre-wrap leading-relaxed">{render(voice)}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="secondary" size="sm">▶ Listen to TTS sample</Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function MergeFields({ onInsert }: { onInsert: (field: string) => void }) {
  return (
    <div className="pt-4 border-t border-border">
      <p className="label mb-2">Merge fields</p>
      <div className="flex flex-wrap gap-1.5">
        {MERGE_FIELDS.map((f) => (
          <button
            key={f}
            onClick={() => onInsert(f)}
            className="text-[11px] font-mono px-2 py-1 rounded border border-border bg-canvas text-ink-muted hover:text-primary hover:border-primary transition-colors"
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
