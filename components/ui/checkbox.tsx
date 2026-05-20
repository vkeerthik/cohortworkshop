"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, ...props }, ref) => (
    <label className={cn("inline-flex items-center gap-2 cursor-pointer", className)}>
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="peer appearance-none h-4 w-4 rounded-sm border border-border bg-surface checked:bg-primary checked:border-primary focus-ring transition-colors"
          {...props}
        />
        <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
      </span>
      {label && <span className="text-sm text-ink">{label}</span>}
    </label>
  )
);
Checkbox.displayName = "Checkbox";
