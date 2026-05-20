import type { Workshop, Participant, CommEvent, ActivityEvent } from "./types";

// All names, contacts, and details are fictional. No PHI.

export const workshops: Workshop[] = [
  {
    id: "ws-001",
    name: "Osteoporosis Education Workshop",
    description:
      "Four-session program covering bone health, nutrition for bone density, fall prevention, and exercise. Co-led with a registered dietitian.",
    facilitator: "Dr. Mireille Tremblay",
    date: "2026-05-26T14:00:00-04:00",
    durationMin: 90,
    location: "St. Michael's Health Centre, Room 2B",
    isVirtual: false,
    capacity: 24,
    cohort: "May 2026",
    reminderSchedule: ["7d", "1d", "2h"],
    status: "Scheduled",
  },
  {
    id: "ws-002",
    name: "Fibromyalgia Self-Management",
    description:
      "Six-week peer-led series focused on pacing strategies, sleep, gentle movement, and cognitive reframing for chronic pain.",
    facilitator: "Janelle Okoye, RN",
    date: "2026-05-28T18:30:00-04:00",
    durationMin: 75,
    location: "Zoom",
    isVirtual: true,
    capacity: 18,
    cohort: "May 2026",
    reminderSchedule: ["7d", "1d", "2h"],
    status: "Scheduled",
  },
  {
    id: "ws-003",
    name: "Inflammatory Arthritis Virtual Session",
    description:
      "Single 60-minute session for newly diagnosed patients. Q&A with a rheumatology nurse practitioner.",
    facilitator: "Priya Raman, NP",
    date: "2026-06-02T13:00:00-04:00",
    durationMin: 60,
    location: "Microsoft Teams",
    isVirtual: true,
    capacity: 40,
    cohort: "June 2026",
    reminderSchedule: ["7d", "1d"],
    status: "Scheduled",
  },
  {
    id: "ws-004",
    name: "Chronic Pain Management Workshop",
    description:
      "Eight-week in-person program. Multidisciplinary team. Covers medication strategies, physiotherapy, and mental health.",
    facilitator: "Dr. Stephen Halloran",
    date: "2026-05-12T10:00:00-04:00",
    durationMin: 120,
    location: "Northbridge Community Health, Studio A",
    isVirtual: false,
    capacity: 16,
    cohort: "May 2026",
    reminderSchedule: ["7d", "1d", "2h"],
    status: "In Progress",
  },
  {
    id: "ws-005",
    name: "Osteoporosis Education Workshop",
    description: "April cohort, completed series.",
    facilitator: "Dr. Mireille Tremblay",
    date: "2026-04-22T14:00:00-04:00",
    durationMin: 90,
    location: "St. Michael's Health Centre, Room 2B",
    isVirtual: false,
    capacity: 24,
    cohort: "April 2026",
    reminderSchedule: ["7d", "1d", "2h"],
    status: "Completed",
  },
];

const firstNames = [
  "Margaret", "Henrietta", "David", "Linh", "Yusuf", "Beatrice", "Olamide", "Carlos",
  "Hannah", "Robert", "Joanne", "Mei", "Theo", "Aisha", "Frederick", "Sandrine",
  "Patrick", "Noelle", "Gurpreet", "Eleanor", "Marcus", "Iris", "Tomás", "Wendy",
];
const lastNames = [
  "Whitfield", "Bergeron", "Cartwright", "Nguyen", "Al-Rashid", "Donnelly", "Adebayo",
  "Mendoza", "Klein", "Lalonde", "O'Connor", "Tan", "Beaumont", "Hassan", "Sutherland",
  "Roy", "Murphy", "Faulkner", "Singh", "Pemberton", "Reeves", "Doucet", "Silva", "Park",
];

function makePhone(seed: number) {
  const a = 200 + (seed * 17) % 700;
  const b = 100 + (seed * 31) % 800;
  return `+1 (${String(a).padStart(3, "0")}) 555-${String(b).padStart(4, "0")}`;
}

const commPrefs: Participant["commPreference"][] = [
  "Email only", "Email + SMS", "Email + SMS + Voice", "SMS only", "Email + Voice", "Voice only",
];

const statusByCohort: Record<string, Participant["registrationStatus"][]> = {
  "ws-001": ["Registered", "Reminder Sent", "Registered", "Awaiting RSVP", "Invitation Sent", "Reminder Sent", "Registered", "Awaiting RSVP"],
  "ws-002": ["Registered", "Reminder Sent", "Invitation Sent", "Awaiting RSVP", "Imported", "Registered"],
  "ws-003": ["Imported", "Invitation Sent", "Awaiting RSVP", "Registered", "Imported"],
  "ws-004": ["Attended", "Attended", "Attended", "No Show", "Attended", "Attended", "Attended"],
  "ws-005": ["Feedback Completed", "Feedback Completed", "Attended", "Feedback Completed", "No Show", "Feedback Completed"],
};

export const participants: Participant[] = (() => {
  const out: Participant[] = [];
  let pid = 1;
  for (const ws of workshops) {
    const statuses = statusByCohort[ws.id] || ["Imported"];
    statuses.forEach((status, i) => {
      const fn = firstNames[(pid * 7) % firstNames.length];
      const ln = lastNames[(pid * 13) % lastNames.length];
      const attendance =
        status === "Attended" || status === "Feedback Completed" ? "Attended" :
        status === "No Show" ? "No Show" : "Pending";
      out.push({
        id: `p-${String(pid).padStart(4, "0")}`,
        firstName: fn,
        lastName: ln,
        email: `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, "")}@example.ca`,
        phone: makePhone(pid),
        workshopId: ws.id,
        registrationStatus: status,
        attendanceStatus: attendance,
        commPreference: commPrefs[(pid * 5) % commPrefs.length],
        lastCommunication: new Date(Date.now() - (pid * 9) * 3600 * 1000).toISOString(),
        accessibilityNeeds: i === 2 ? "Closed captions" : undefined,
      });
      pid++;
    });
  }
  return out;
})();

export const commEventsByParticipant: Record<string, CommEvent[]> = (() => {
  const out: Record<string, CommEvent[]> = {};
  participants.forEach((p, idx) => {
    const baseT = Date.now() - (10 - (idx % 10)) * 24 * 3600 * 1000;
    const events: CommEvent[] = [];
    let t = baseT;
    if (p.registrationStatus !== "Imported") {
      events.push({
        id: `ce-${p.id}-1`,
        participantId: p.id,
        channel: "Email",
        type: "Invitation",
        timestamp: new Date(t).toISOString(),
        outcome: "Opened",
      });
      t += 6 * 3600 * 1000;
    }
    if (["Registered", "Reminder Sent", "Attended", "No Show", "Feedback Completed"].includes(p.registrationStatus)) {
      events.push({
        id: `ce-${p.id}-2`,
        participantId: p.id,
        channel: "Email",
        type: "Confirmation",
        timestamp: new Date(t).toISOString(),
        outcome: "Delivered",
      });
      t += 48 * 3600 * 1000;
    }
    if (["Reminder Sent", "Attended", "No Show", "Feedback Completed"].includes(p.registrationStatus)) {
      events.push({
        id: `ce-${p.id}-3`,
        participantId: p.id,
        channel: "SMS",
        type: "Reminder",
        timestamp: new Date(t).toISOString(),
        outcome: "Delivered",
      });
      t += 12 * 3600 * 1000;
      events.push({
        id: `ce-${p.id}-4`,
        participantId: p.id,
        channel: "Voice",
        type: "Reminder",
        timestamp: new Date(t).toISOString(),
        outcome: idx % 4 === 0 ? "Voicemail" : "Completed",
      });
    }
    if (p.registrationStatus === "Feedback Completed") {
      events.push({
        id: `ce-${p.id}-5`,
        participantId: p.id,
        channel: "Email",
        type: "Feedback Request",
        timestamp: new Date(t + 24 * 3600 * 1000).toISOString(),
        outcome: "Clicked",
      });
    }
    out[p.id] = events;
  });
  return out;
})();

export const activityFeed: ActivityEvent[] = [
  { id: "a1", timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), actor: "Ikshit A.", message: "Sent reminder campaign to Fibromyalgia Self-Management cohort", type: "campaign" },
  { id: "a2", timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), actor: "System", message: "12 new registrations confirmed for Osteoporosis Education", type: "registration" },
  { id: "a3", timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), actor: "Anand A.", message: "Imported 38 participants from intake-may-2026.csv", type: "import" },
  { id: "a4", timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), actor: "System", message: "Attendance recorded for Chronic Pain Management, Session 3", type: "attendance" },
  { id: "a5", timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), actor: "Priya R.", message: "Feedback responses received from April cohort (32 of 41)", type: "feedback" },
  { id: "a6", timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), actor: "System", message: "Voice reminder campaign completed: 24 delivered, 6 voicemail, 2 failed", type: "campaign" },
];

// Default communication templates
export const defaultTemplates = {
  emailSubject: "You're invited: {{workshop_name}}",
  emailBody: `Hi {{first_name}},

You're invited to join our upcoming workshop:

{{workshop_name}}
{{workshop_date}} at {{workshop_time}}

This session is part of our patient education series. Your participation helps us tailor the program to your needs.

Please confirm your spot:
{{registration_link}}

If you have questions or accessibility needs, reply to this email and we will follow up.

Warmly,
Patient Education Team`,
  sms: "Hi {{first_name}}, reminder: {{workshop_name}} on {{workshop_date}} at {{workshop_time}}. Confirm: {{registration_link}}",
  voiceScript: `Hello {{first_name}}. This is a reminder from your care team about the {{workshop_name}} on {{workshop_date}} at {{workshop_time}}.

To confirm your attendance, press 1.
To request a callback, press 2.

Thank you, and we look forward to seeing you.`,
};
