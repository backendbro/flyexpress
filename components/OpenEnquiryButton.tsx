"use client";

import { openEnquiryModal } from "@/components/QuickEnquiryModal";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function OpenEnquiryButton({ className, children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openEnquiryModal()}
    >
      {children}
    </button>
  );
}
