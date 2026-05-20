"use client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { defaultTemplates } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import { Phone, Play, Save, Mic, Volume2 } from "lucide-react";

export default function VoiceConfig() {
  const { toast } = useToast();
  const [script, setScript] = useState(defaultTemplates.voiceScript);
  const [tts, setTts] = useState(true);
  const [voicemail, setVoicemail] = useState(true);
  const [keypad, setKeypad] = useState(true);
  const [retries, setRetries] = useState("2");
  const [voiceProfile, setVoiceProfile] = useState("en-CA-female-warm");

  const save = () => toast({ title: "Voice configuration saved", tone: "success" });

  return (
    <AppShell>
      <div className="max-w-[1200px] grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-5">
          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Script</h3>
              <p className="text-xs text-ink-muted mt-0.5">Spoken to the participant or left on voicemail</p>
            </div>
            <div className="p-5">
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="min-h-[220px] font-mono text-[13px]"
              />
            </div>
          </Card>

          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Delivery method</h3>
            </div>
            <div className="p-5 space-y-3">
              <ToggleRow
                title="Text-to-speech"
                desc="Auto-generated voice. No recording required."
                checked={tts}
                onCheck={() => setTts(true)}
                tag="Default"
              />
              <ToggleRow
                title="Pre-recorded audio"
                desc="Upload a clinician's recording for a more personal touch."
                checked={!tts}
                onCheck={() => setTts(false)}
              />

              {tts && (
                <div className="pt-3 border-t border-border space-y-1.5">
                  <Label>Voice profile</Label>
                  <div className="max-w-sm">
                    <Select value={voiceProfile} onValueChange={setVoiceProfile}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-CA-female-warm">English (CA) — Warm female</SelectItem>
                        <SelectItem value="en-CA-male-warm">English (CA) — Warm male</SelectItem>
                        <SelectItem value="fr-CA-female-warm">Français (CA) — Voix chaleureuse</SelectItem>
                        <SelectItem value="en-CA-neutral">English (CA) — Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {!tts && (
                <div className="pt-3 border-t border-border">
                  <button className="border border-dashed border-border rounded-md p-6 w-full text-center bg-canvas hover:border-primary transition-colors">
                    <Mic className="h-6 w-6 text-ink-muted mx-auto" />
                    <p className="text-sm font-medium text-ink mt-2">Upload audio file</p>
                    <p className="text-xs text-ink-muted mt-0.5">MP3 or WAV, up to 90 seconds</p>
                  </button>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Call behavior</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Retry attempts</p>
                  <p className="text-xs text-ink-muted">If the call fails or goes unanswered</p>
                </div>
                <div className="w-[120px]">
                  <Select value={retries} onValueChange={setRetries}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["0","1","2","3"].map((n) => <SelectItem key={n} value={n}>{n} retries</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Voicemail-friendly playback</p>
                  <p className="text-xs text-ink-muted">Adds a pause and slower delivery if voicemail is detected</p>
                </div>
                <Switch checked={voicemail} onCheckedChange={setVoicemail} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Keypad confirmation</p>
                  <p className="text-xs text-ink-muted">Capture responses during the call</p>
                </div>
                <Switch checked={keypad} onCheckedChange={setKeypad} />
              </div>

              {keypad && (
                <div className="pt-4 border-t border-border space-y-2">
                  <p className="label">Keypad responses</p>
                  <div className="rounded-md border border-border bg-canvas p-3 space-y-2">
                    <KeyOption number="1" label="Confirm attendance" />
                    <KeyOption number="2" label="Request a callback" />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="secondary"><Play className="h-4 w-4" /> Test call my phone</Button>
            <Button onClick={save}><Save className="h-4 w-4" /> Save configuration</Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-6">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Phone className="h-4 w-4 text-ink-muted" />
              <h3 className="font-semibold text-ink">Call preview</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded-md bg-canvas border border-border p-4">
                <div className="flex items-center gap-2 text-xs text-ink-muted mb-3">
                  <Volume2 className="h-3.5 w-3.5" /> Voice: {voiceProfile.split("-").slice(2).join(" ")}
                </div>
                <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">{script}</p>
              </div>

              <div className="space-y-2">
                <p className="label">If voicemail</p>
                <div className="rounded-md border border-border p-3 text-xs text-ink-muted">
                  {voicemail
                    ? "Slower delivery, longer pause at start. Voicemail-friendly playback enabled."
                    : "Standard playback. May begin before greeting completes."}
                </div>
              </div>

              <div className="space-y-2">
                <p className="label">If no answer</p>
                <div className="rounded-md border border-border p-3 text-xs text-ink-muted">
                  Retries up to {retries} time{retries !== "1" ? "s" : ""} at 4-hour intervals.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function ToggleRow({ title, desc, checked, onCheck, tag }: {
  title: string; desc: string; checked: boolean; onCheck: () => void; tag?: string;
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
        <p className="text-sm font-medium text-ink flex items-center gap-2">
          {title}
          {tag && <Badge tone="neutral">{tag}</Badge>}
        </p>
        <p className="text-xs text-ink-muted mt-0.5">{desc}</p>
      </div>
    </button>
  );
}

function KeyOption({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-md bg-surface border border-border flex items-center justify-center text-sm font-medium num text-ink">
        {number}
      </div>
      <Input defaultValue={label} className="flex-1" />
    </div>
  );
}
