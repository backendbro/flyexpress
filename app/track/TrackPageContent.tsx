"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { OpenEnquiryButton } from "@/components/OpenEnquiryButton";
import toast from 'react-hot-toast';

// Dynamically import components that might use browser APIs
const PageEnquiryModal = dynamic(
  () => import("@/components/QuickEnquiryModal").then(mod => mod.PageEnquiryModal),
  { ssr: false }
);

const RealTimeTracker = dynamic(
  () => import("@/components/RealTimeTracker").then(mod => mod.RealTimeTracker),
  { ssr: false }
);

const RealTimeMapTracker = dynamic(
  () => import("@/components/RealTimeMapTracker").then(mod => mod.RealTimeMapTracker),
  { ssr: false }
);

export function TrackPageContent() {
  const [trackOpen, setTrackOpen] = useState(false);
  const [awbDisplay, setAwbDisplay] = useState("");
  const [podOpen, setPodOpen] = useState(false);
  const [currentAWB, setCurrentAWB] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onTrackSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = String(fd.get("awbno") ?? "").trim();
    if (!raw) {
      toast.error("Please enter an Airway Bill Number");
      return;
    }
    const first = raw.split("\n")[0].substring(0, 30);
    setAwbDisplay(first);
    setCurrentAWB(first);
    setTrackOpen(true);
  }

  function onPodSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = String(fd.get("awbPod") ?? "").trim();
    if (!raw) {
      toast.error("Please enter AWB number to fetch Proof of Delivery");
      return;
    }
    setPodOpen(true);
  }

  // Don't render components that need browser APIs until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageEnquiryModal autoOpenMs={1400} />
      {/* Rest of your JSX remains the same */}
      <style jsx>{`
        .track-hero {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          position: relative;
          overflow: hidden;
        }
        
        .track-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="rgba(255,255,255,0.05)" d="M10,50 L90,50 M50,10 L50,90"/></svg>');
          opacity: 0.1;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
        }
        
        .track-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }
        
        .track-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transform: translateY(-2px);
        }
        
        .track-input {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          width: 100%;
        }
        
        .track-input:focus {
          outline: none;
          border-color: #ef4444;
          ring: 2px solid #fecaca;
        }
        
        .btn-track {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          width: 100%;
          justify-content: center;
        }
        
        .btn-track:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
        }
        
        .btn-outline-track {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: #ef4444;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          border: 2px solid #ef4444;
          transition: all 0.3s ease;
          cursor: pointer;
          width: 100%;
          justify-content: center;
        }
        
        .btn-outline-track:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-2px);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .live-indicator {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @media (max-width: 768px) {
          .timeline-item {
            padding: 0.75rem 0;
          }
        }
      `}</style>
      
      <section className="track-hero pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-start">
            <div className="hero-badge mb-4">
              <i className="fas fa-search-location text-red-400 mr-2"></i>
              <span className="text-white text-sm font-medium">
                Real-Time Tracking
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Track & Trace
            </h1>
            <div className="flex items-center gap-2 text-gray-300 text-sm mt-3">
              <Link href="/" className="hover:text-red-400 transition">
                Home
              </Link>
              <i className="fas fa-chevron-right text-[10px]"></i>
              <span className="text-red-300 font-medium">Track & Trace</span>
            </div>
            <p className="text-gray-200 max-w-2xl mt-5 text-base">
              Monitor your shipment in real-time. Enter your Airway Bill Number
              for status updates and delivery proof.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="track-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-box-open text-red-500 text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Track Shipment
                </h2>
                <p className="text-gray-500 text-sm">
                  Get real-time status updates
                </p>
              </div>
            </div>
            <form onSubmit={onTrackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Airway Bill Number / AWB No.
                </label>
                <textarea
                  name="awbno"
                  rows={2}
                  className="track-input"
                  placeholder="Enter AWB (e.g. FFE-2024001), one per line"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Single or multiple AWB numbers (one per line)
                </p>
              </div>
              <button type="submit" className="btn-track">
                <i className="fas fa-search"></i> Track Now
              </button>
            </form>

            {trackOpen && currentAWB && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <RealTimeTracker awb={currentAWB} />
                <RealTimeMapTracker awb={currentAWB} />
              </div>
            )}
          </div>

          <div className="track-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-file-signature text-green-600 text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">View POD</h2>
                <p className="text-gray-500 text-sm">Proof of Delivery</p>
              </div>
            </div>
            <form onSubmit={onPodSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Airway Bill Number
                </label>
                <input
                  type="text"
                  name="awbPod"
                  className="track-input"
                  placeholder="Enter AWB for POD"
                />
              </div>
              <button
                type="submit"
                className="btn-outline-track"
              >
                <i className="fas fa-file-pdf"></i> View POD
              </button>
            </form>
            {podOpen ? (
              <div className="mt-5">
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                  <i className="fas fa-check-circle text-green-600 text-3xl mb-2"></i>
                  <p className="text-gray-700 font-medium">POD Available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Delivery completed. Signature captured.
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-red-600 text-sm font-semibold underline hover:text-red-700 transition"
                  >
                    Download PDF <i className="fas fa-download"></i>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  * POD will be available once shipment is delivered
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-4">
            <i className="fas fa-headset text-red-500 text-4xl"></i>
            <div>
              <h3 className="font-bold text-gray-800">
                Need help with tracking?
              </h3>
              <p className="text-gray-600 text-sm">
                Contact our support team for assistance
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="tel:+919643326207"
              className="bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-red-700 transition shadow"
            >
              <i className="fas fa-phone-alt mr-2"></i> Call Support
            </a>
            <Link
              href="/contact"
              className="border border-red-400 text-red-600 px-5 py-2.5 rounded-full font-semibold hover:bg-red-50 transition"
            >
              <i className="fas fa-envelope mr-2"></i> Email Us
            </Link>
            <OpenEnquiryButton className="bg-gray-800 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-gray-900 transition">
              <i className="fas fa-comment-dots mr-2"></i> Quick Enquiry
            </OpenEnquiryButton>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5 text-center">
          <div className="p-4">
            <i className="fas fa-qrcode text-red-400 text-3xl mb-2"></i>
            <p className="font-semibold">AWB Format</p>
            <p className="text-sm text-gray-500">FFE-XXXXXXXXX or numeric ID</p>
          </div>
          <div className="p-4">
            <i className="fas fa-clock text-red-400 text-3xl mb-2"></i>
            <p className="font-semibold">Live Updates</p>
            <p className="text-sm text-gray-500">Real-time tracking events</p>
          </div>
          <div className="p-4">
            <i className="fas fa-mobile-alt text-red-400 text-3xl mb-2"></i>
            <p className="font-semibold">Track on Mobile</p>
            <p className="text-sm text-gray-500">Responsive & fast interface</p>
          </div>
        </div>
      </div>
    </>
  );
}