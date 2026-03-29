import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageEnquiryModal } from "@/components/QuickEnquiryModal";
import {
  AANS_BASE,
  downloadHref,
  otherDownloads,
  sliDownloads,
} from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download SLI forms, annexures, declarations, and logistics documents from First Fly Express.",
};

export default function DownloadPage() {
  return (
    <>
      <PageEnquiryModal autoOpenMs={1000} />
      <section className="breadcrumb-modern pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-start">
            <div className="download-icon-hero mb-4">
              <i className="fas fa-download text-red-400 mr-2" />
              <span className="text-white text-sm font-medium">
                Resource Center
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Document download
            </h1>
            <div className="flex items-center gap-2 text-gray-300 text-sm mt-3">
              <Link href="/" className="hover:text-red-400 transition">
                Home
              </Link>
              <i className="fas fa-chevron-right text-[10px]" />
              <span className="text-red-300 font-medium">download</span>
            </div>
            <p className="text-gray-200 max-w-2xl mt-5 text-base">
              Shipping forms, SLI documents, declarations, and regulatory
              paperwork for courier and logistics operations.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
        <div className="flex justify-center mb-10">
          <Image
            src="/images/download.png"
            alt="Download resources"
            width={960}
            height={320}
            className="rounded-2xl shadow-sm w-full max-w-3xl h-auto"
          />
        </div>

        <div className="download-section-card p-6 md:p-8 mb-12">
          <div className="flex items-center gap-3 flex-wrap">
            <i className="fas fa-file-alt text-red-500 text-3xl" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              SLI (Shipment Letter of Instructions)
            </h2>
          </div>
          <hr className="divider-light" />
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mt-4">
            Files are loaded from{" "}
            <code className="text-xs bg-white/80 px-1 rounded">{AANS_BASE}</code>
            . Copy your legacy <code className="text-xs">rworld/aans</code>{" "}
            folder into <code className="text-xs">public/</code> so downloads work
            offline.
          </p>
          <div className="grid gap-3 mt-4">
            {sliDownloads.map((d) => (
              <div key={d.file} className="download-list-item">
                <div className="flex items-center gap-3">
                  <i className={`${d.icon} ${d.iconColor} text-xl`} />
                  <span className="font-semibold text-gray-700">{d.label}</span>
                  <span className="file-badge">.xls</span>
                </div>
                <a
                  href={downloadHref(d.file)}
                  className="btn-download-sm"
                  download
                >
                  <i className="fas fa-download" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="download-section-card p-6 md:p-8">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <i className="fas fa-folder-open text-red-500 text-3xl" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Other Essential Documents
            </h2>
          </div>
          <hr className="divider-light" />
          <div className="grid md:grid-cols-2 gap-3 mt-6">
            {otherDownloads.map((d) => (
              <div key={d.file} className="download-list-item">
                <div className="flex gap-2 items-center">
                  <i className={`${d.icon} ${d.iconColor}`} />
                  <span>{d.label}</span>
                  <span className="file-badge">{d.badge}</span>
                </div>
                <a
                  href={downloadHref(d.file)}
                  className="btn-download-sm"
                  download
                >
                  <i className="fas fa-download" /> Get
                </a>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-amber-50 p-5 rounded-xl flex flex-wrap justify-between items-center gap-3">
            <span className="text-sm text-gray-700">
              <i className="fas fa-info-circle text-red-500 mr-2" />
              Need a different format or documentation help? Contact support.
            </span>
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition shadow-sm"
            >
              <i className="fas fa-headset" /> Get Help
            </Link>
          </div>
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm border-t pt-8">
          <i className="fas fa-lock mr-1" />
          Standard Excel/Word formats — click to download.
        </div>
      </div>
    </>
  );
}
