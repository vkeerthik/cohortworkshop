import type { RegistrationStatus } from "./types";

export const statusTone: Record<RegistrationStatus, "default" | "primary" | "success" | "warn" | "error" | "info" | "neutral" | "ochre"> = {
  "Imported": "neutral",
  "Invitation Sent": "info",
  "Awaiting RSVP": "ochre",
  "Registered": "primary",
  "Reminder Sent": "info",
  "Attended": "success",
  "No Show": "error",
  "Feedback Completed": "success",
};

export function formatDate(iso: string, opts?: { withTime?: boolean }) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
  if (!opts?.withTime) return date;
  const time = d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
  return `${date}, ${time}`;
}

export function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}
