import type { Metadata } from "next";
import { PageEnquiryModal } from "@/components/QuickEnquiryModal";
import { FaqView } from "./FaqView";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about First Fly Express shipping, delivery, prohibited items, and tracking.",
};

export default function FaqPage() {
  return (
    <>
      <PageEnquiryModal autoOpenMs={1200} />
      <FaqView />
    </>
  );
}
