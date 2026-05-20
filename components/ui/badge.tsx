"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "primary" | "success" | "warn" | "error" | "info" | "neutral" | "ochre";

const toneStyles: Record<Tone, string> = {
  default: "bg-canvas border-border text-ink-muted",
  primary: "bg-primary-soft border-primary/20 text-primary",
  success: "bg-[#E8F1EA] border-[#C5D9C9] text-status-success",
  warn: "bg-[#F5EBD8] border-[#E3D2B0] text-status-warn",
  error: "bg-[#F5E2E2] border-[#E2C0C0] text-status-error",
  info: "bg-[#E0EAF1] border-[#BFD2E0] text-status-info",
  neutral: "bg-[#EEEDEA] border-[#DAD7CF] text-ink-muted",
  ochre: "bg-[#F4EBD8] border-[#DFC993] text-accent-ochre",
};

export function Badge({
  children,
  tone = "default",
  className,
  dot,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span className={cn("pill", toneStyles[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}
