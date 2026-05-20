import { workshops } from "@/lib/mock-data";
import AttendanceDetailClient from "./client";

export function generateStaticParams() {
  return workshops.map((w) => ({ workshopId: w.id }));
}

export default function AttendanceDetailPage() {
  return <AttendanceDetailClient />;
}
