"use client";
import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info" | "error";
type Toast = { id: number; title: string; description?: string; tone: ToastTone };

type ToastCtx = { toast: (t: Omit<Toast, "id">) => void };
const ToastContext = React.createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const idRef = React.useRef(0);

  const toast = React.useCallback((t: Omit<Toast, "id">) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px]">
        {toasts.map((t) => {
          const Icon = t.tone === "success" ? CheckCircle2 : t.tone === "error" ? AlertCircle : Info;
          const accent =
            t.tone === "success" ? "text-status-success" :
            t.tone === "error" ? "text-status-error" : "text-status-info";
          return (
            <div key={t.id} className="card shadow-pop p-4 flex gap-3 items-start animate-fade-in">
              <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", accent)} />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{t.title}</p>
                {t.description && <p className="text-xs text-ink-muted mt-0.5">{t.description}</p>}
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="text-ink-subtle hover:text-ink"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
