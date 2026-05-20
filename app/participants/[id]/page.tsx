import { participants } from "@/lib/mock-data";
import ParticipantProfileClient from "./client";

export function generateStaticParams() {
  return participants.map((p) => ({ id: p.id }));
}

export default function ParticipantProfilePage() {
  return <ParticipantProfileClient />;
}
