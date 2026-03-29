"use client";

import { useEffect, useState } from "react";

function QuickEnquiryModalUI({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = (e.nativeEvent as SubmitEvent).submitter as
      | HTMLButtonElement
      | null;
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      window.setTimeout(() => {
        window.alert(
          "Enquiry received. We will contact you shortly. (Demo — wire to email/API in the next phase.)",
        );
        onClose();
        form.reset();
        btn.innerHTML = orig;
        btn.disabled = false;
      }, 1200);
    }
  }

  if (!open) return null;

  return (
    <div
      className="modal-scale fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner bg-white w-full max-w-2xl mx-5 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-red-600 text-xl font-extrabold tracking-tight">
            <i className="fas fa-bolt mr-2" /> Get Call In A Minute!
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl leading-5"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Pickup Location"
              required
              className="col-span-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-300 outline-none text-sm"
            />
            <input
              type="text"
              placeholder="Delivery Location"
              required
              className="col-span-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-red-400 outline-none text-sm"
            />
            <input
              type="tel"
              placeholder="Contact Number"
              required
              className="col-span-1 px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm"
            />
            <input
              type="text"
              placeholder="Weight (Kg)"
              required
              className="col-span-1 px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm"
            />
            <input
              type="text"
              placeholder="Content Type"
              required
              className="col-span-1 px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm md:col-span-2"
            />
            <textarea
              rows={2}
              placeholder="Additional Information"
              className="col-span-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm"
            />
            <div className="col-span-full flex flex-wrap justify-center gap-4 mt-2">
              <button
                type="submit"
                name="action"
                value="email"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md transition flex items-center gap-2"
              >
                <i className="fas fa-envelope" /> Send Email
              </button>
              <button
                type="submit"
                name="action"
                value="whatsapp"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md transition flex items-center gap-2"
              >
                <i className="fab fa-whatsapp" /> Send WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EnquiryTriggerBridge({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const handler = () => onOpen();
    window.addEventListener("ffe:open-enquiry", handler);
    return () => window.removeEventListener("ffe:open-enquiry", handler);
  }, [onOpen]);
  return null;
}

/** Dispatch this from buttons to open the modal (see PageEnquiryModal on each layout). */
export function openEnquiryModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ffe:open-enquiry"));
  }
}

type Props = {
  /** If set, opens automatically once after this many ms */
  autoOpenMs?: number;
};

export function PageEnquiryModal({ autoOpenMs }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (autoOpenMs == null) return;
    const t = window.setTimeout(() => setOpen(true), autoOpenMs);
    return () => window.clearTimeout(t);
  }, [autoOpenMs]);

  return (
    <>
      <QuickEnquiryModalUI open={open} onClose={() => setOpen(false)} />
      <EnquiryTriggerBridge onOpen={() => setOpen(true)} />
    </>
  );
}
