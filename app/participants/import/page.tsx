"use client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileText, AlertTriangle, CheckCircle2, FileSpreadsheet } from "lucide-react";

// Mock preview rows. Some have validation issues to demo the UX.
const previewRows = [
  { first_name: "Margaret", email: "margaret.whitfield@example.ca", phone: "+1 (416) 555-0142", ok: true },
  { first_name: "Henrietta", email: "henrietta.bergeron@example.ca", phone: "+1 (438) 555-0871", ok: true },
  { first_name: "David", email: "david.cartwright@example.ca", phone: "+1 (905) 555-0193", ok: true },
  { first_name: "Linh", email: "linh.nguyen@example", phone: "+1 (514) 555-0445", ok: false, issue: "Invalid email format" },
  { first_name: "Yusuf", email: "yusuf.alrashid@example.ca", phone: "", ok: false, issue: "Missing phone number" },
  { first_name: "Beatrice", email: "beatrice.donnelly@example.ca", phone: "+1 (613) 555-0218", ok: true },
  { first_name: "Olamide", email: "olamide.adebayo@example.ca", phone: "+1 (647) 555-0901", ok: true },
  { first_name: "Carlos", email: "carlos.mendoza@example.ca", phone: "+1 (519) 555-0376", ok: true },
];

export default function ImportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [stage, setStage] = useState<"upload" | "preview">("upload");
  const [filename, setFilename] = useState("");

  const validCount = previewRows.filter((r) => r.ok).length;
  const issueCount = previewRows.length - validCount;

  // Simulate file selection — no real parsing
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFilename(f.name);
      setTimeout(() => setStage("preview"), 400);
    }
  };

  const useSampleFile = () => {
    setFilename("intake-may-2026.csv");
    setStage("preview");
  };

  const completeImport = () => {
    toast({
      title: "Import complete",
      description: `${validCount} participants added to the May 2026 cohort. ${issueCount} rows skipped.`,
      tone: "success",
    });
    setTimeout(() => router.push("/participants"), 700);
  };

  return (
    <AppShell>
      <div className="max-w-3xl space-y-5">
        <Link href="/participants" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to participants
        </Link>

        {stage === "upload" && (
          <Card>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-ink">Upload CSV</h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Required columns: first_name, email, phone. Optional: workshop_id, accessibility_needs.
              </p>
            </div>
            <div className="p-5">
              <label className="block border border-dashed border-border rounded-md bg-canvas bg-dotgrid p-10 text-center cursor-pointer hover:border-primary transition-colors">
                <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
                <UploadCloud className="h-8 w-8 text-ink-muted mx-auto" />
                <p className="text-sm font-medium text-ink mt-3">Drop a CSV here, or click to browse</p>
                <p className="text-xs text-ink-muted mt-1">Up to 5,000 rows. UTF-8 encoded.</p>
              </label>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-xs text-ink-muted">
                  Don't have a file? <button onClick={useSampleFile} className="text-primary hover:underline">Use sample data</button>
                </p>
                <a href="#" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Download CSV template
                </a>
              </div>
            </div>
          </Card>
        )}

        {stage === "preview" && (
          <>
            <Card>
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-ink-muted" />
                  <div>
                    <h3 className="font-semibold text-ink">{filename}</h3>
                    <p className="text-xs text-ink-muted">{previewRows.length} rows detected · ready to review</p>
                  </div>
                </div>
                <button onClick={() => setStage("upload")} className="text-xs text-ink-muted hover:text-ink">
                  Replace file
                </button>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border">
                <Stat label="Total rows" value={previewRows.length} />
                <Stat label="Valid" value={validCount} tone="success" />
                <Stat label="Needs review" value={issueCount} tone={issueCount ? "warn" : "default"} />
              </div>
            </Card>

            <Card>
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-ink">Preview</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 label">First name</th>
                    <th className="px-5 py-3 label">Email</th>
                    <th className="px-5 py-3 label">Phone</th>
                    <th className="px-5 py-3 label">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {previewRows.map((r, i) => (
                    <tr key={i} className={!r.ok ? "bg-[#FBF6EC]" : ""}>
                      <td className="px-5 py-3 font-medium text-ink">{r.first_name}</td>
                      <td className="px-5 py-3 text-ink-muted">{r.email}</td>
                      <td className="px-5 py-3 text-ink-muted num">{r.phone || <span className="text-ink-subtle italic">—</span>}</td>
                      <td className="px-5 py-3">
                        {r.ok ? (
                          <Badge tone="success">
                            <CheckCircle2 className="h-3 w-3" /> Valid
                          </Badge>
                        ) : (
                          <Badge tone="warn">
                            <AlertTriangle className="h-3 w-3" /> {r.issue}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setStage("upload")}>Cancel</Button>
              <Button variant="secondary">Download issues</Button>
              <Button onClick={completeImport}>Import {validCount} valid rows</Button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "success" | "warn" }) {
  const color =
    tone === "success" ? "text-status-success" :
    tone === "warn" ? "text-status-warn" : "text-ink";
  return (
    <div className="p-5">
      <p className="label">{label}</p>
      <p className={`font-serif text-[28px] num mt-1 ${color}`}>{value}</p>
    </div>
  );
}
