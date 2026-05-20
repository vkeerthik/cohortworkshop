"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Simulate login. No real auth — this is a demo.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] bg-canvas">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-ink text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </div>
            <div>
              <div className="font-serif text-[15px] font-semibold">Cohort</div>
              <div className="text-[10px] text-white/50 uppercase tracking-[0.12em]">Workshop Platform</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-serif text-[34px] leading-[1.15] tracking-tight">
            Workshop coordination, calmly orchestrated.
          </p>
          <p className="mt-4 text-white/60 text-[15px] leading-relaxed">
            Plan recurring patient education sessions, send multi-channel reminders,
            and capture feedback without the admin overhead.
          </p>

          <div className="mt-10 flex items-center gap-2 text-[13px] text-white/70">
            <ShieldCheck className="h-4 w-4" />
            <span>PHIPA-conscious. Canadian-hosted. Patient data stays in-country.</span>
          </div>
        </div>

        <div className="relative z-10 text-[12px] text-white/40">
          v0.9 · Demo build · For proposal review
        </div>

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }} />
        <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/15 blur-3xl" />
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <h2 className="font-serif text-[26px] tracking-tight text-ink">Sign in</h2>
          <p className="text-sm text-ink-muted mt-1.5">
            Use any credentials — this is a click-through demo.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" defaultValue="test@cabotsolutions.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="••••••••••" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-ink-muted">
                <input type="checkbox" className="h-3.5 w-3.5 accent-primary" defaultChecked />
                Remember this device
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password</a>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-[12px] text-ink-subtle">
            By signing in you agree to demo terms. No real PHI is stored in this environment.
          </div>
        </div>
      </div>
    </div>
  );
}
