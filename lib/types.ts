export type RegistrationStatus =
  | "Imported"
  | "Invitation Sent"
  | "Awaiting RSVP"
  | "Registered"
  | "Reminder Sent"
  | "Attended"
  | "No Show"
  | "Feedback Completed";

export type Channel = "Email" | "SMS" | "Voice";
export type CommPreference =
  | "Email only"
  | "SMS only"
  | "Voice only"
  | "Email + SMS"
  | "Email + Voice"
  | "Email + SMS + Voice";

export interface Workshop {
  id: string;
  name: string;
  description: string;
  facilitator: string;
  date: string;           // ISO
  durationMin: number;
  location: string;
  isVirtual: boolean;
  capacity: number;
  cohort: string;         // e.g. "May 2026"
  reminderSchedule: ("7d" | "1d" | "2h")[];
  status: "Draft" | "Scheduled" | "In Progress" | "Completed";
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workshopId: string;
  registrationStatus: RegistrationStatus;
  attendanceStatus: "Pending" | "Attended" | "No Show";
  commPreference: CommPreference;
  lastCommunication: string; // ISO or empty
  accessibilityNeeds?: string;
}

export interface CommEvent {
  id: string;
  participantId: string;
  channel: Channel;
  type: "Invitation" | "Reminder" | "Confirmation" | "Feedback Request";
  timestamp: string;
  outcome: "Delivered" | "Opened" | "Clicked" | "Completed" | "Failed" | "Voicemail";
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: string;
  message: string;
  type: "campaign" | "registration" | "attendance" | "import" | "feedback";
}
