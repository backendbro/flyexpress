import type { Metadata } from "next";
import { TrackPageContent } from "./TrackPageContent";

export const metadata: Metadata = {
  title: "Track & Trace",
  description:
    "Track your First Fly Express shipment. Enter your Airway Bill Number for status and POD.",
};

export default function TrackPage() {
  return <TrackPageContent />;
}
