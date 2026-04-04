import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageEnquiryModal } from "@/components/QuickEnquiryModal";
import { OpenEnquiryButton } from "@/components/OpenEnquiryButton";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | First Fly Express – Houston",
  description:
    "Get in touch with First Fly Express in Houston, Texas. Call, email, or visit our office for reliable logistics and freight services.",
};

export default function ContactPage() {
  return (
    <>
      <PageEnquiryModal autoOpenMs={1300} />
      <section className="contact-hero pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-start">
            <div className="hero-badge mb-4">
              <i className="fas fa-map-marker-alt text-red-400 mr-2" />
              <span className="text-white text-sm font-medium">
                Get in Touch
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Contact Us
            </h1>
            <div className="flex items-center gap-2 text-gray-300 text-sm mt-3">
              <Link href="/" className="hover:text-red-400 transition">
                Home
              </Link>
              <i className="fas fa-chevron-right text-[10px]" />
              <span className="text-red-300 font-medium">Contact Us</span>
            </div>
            <p className="text-gray-200 max-w-2xl mt-5 text-base">
              Reach out for logistics support, business partnerships, or any
              queries. We're available 24/7 to assist you.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left column: Map + Head Office */}
          <div>
            {/* Houston Map (embed) */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
              <div className="w-full h-[320px] bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221065.85137693288!2d-95.59314617431636!3d29.763281399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1743700000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Houston Map"
                />
              </div>
              <div className="p-5 border-t border-gray-100">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <i className="fas fa-map-pin text-red-500" /> Serving the
                  Greater Houston area
                </p>
              </div>
            </div>

            {/* Head Office Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="info-icon">
                  <i className="fas fa-building" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Houston Head Office
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                123 Main Street, Suite 400<br />
                Houston, TX 77002<br />
                United States
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3">
                  <i className="fas fa-phone-alt text-red-500 w-5" />
                  <span className="text-gray-700">+1 (323) 347-4758</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-red-500 w-5" />
                  <a
                    href="mailto:support@firstflyexpres.com"
                    className="text-red-600 hover:underline"
                  >
                    support@firstflyexpres.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-globe w-5 text-gray-400" />
                  <span className="text-gray-600">www.firstflyexpres.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Contact Form */}
          <ContactForm />
        </div>

        {/* Branch Offices Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-800">
              Our Houston Locations
            </h2>
            <div className="w-16 h-1 bg-red-500 mx-auto mt-3 rounded-full" />
            <p className="text-gray-500 mt-3">
              Conveniently located branches across the Houston metro area
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {[
              {
                title: "Houston - Downtown",
                address:
                  "900 Smith Street, Suite 200, Houston, TX 77002, USA",
                tel: "+1 (323) 347-4758",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3465.540359412435!2d-95.369001!3d29.758939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640bf50a05e30b1%3A0x6c0f4e8c4b3c2a0f!2sDowntown%20Houston!5e0!3m2!1sen!2sus!4v1743700000001",
              },
              {
                title: "Houston - Hobby Airport",
                address:
                  "7800 Airport Blvd, Houston, TX 77061, USA",
                tel: "+1 (323) 347-4758",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.828303472529!2d-95.274084!3d29.654634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c7b8c5f2c0a1%3A0x4a2f9c8b5d6e7f8a!2sWilliam%20P.%20Hobby%20Airport!5e0!3m2!1sen!2sus!4v1743700000002",
              },
              {
                title: "Houston - Energy Corridor",
                address:
                  "11700 Katy Freeway, Suite 500, Houston, TX 77079, USA",
                tel: "+1 (323) 347-4758",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3461.173469822975!2d-95.593146!3d29.763281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c5b8f2a0b0c1%3A0x7b8f2c4a5d6e7f0a!2sEnergy%20Corridor%2C%20Houston%2C%20TX!5e0!3m2!1sen!2sus!4v1743700000003",
              },
            ].map((branch) => (
              <div key={branch.title} className="branch-card p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <i className="fas fa-map-marker-alt text-red-500 text-xl" />
                  <h3 className="font-bold text-lg">{branch.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{branch.address}</p>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <i className="fas fa-phone-alt text-red-500" />
                  <a href="tel:+13233474758" className="hover:text-red-600">
                    {branch.tel}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm mb-3">
                  <i className="fas fa-envelope text-red-500" />
                  <span className="text-gray-600">support@firstflyexpres.com</span>
                </div>
                <iframe
                  title={branch.title}
                  className="rounded-xl mt-2 w-full h-44 border-0"
                  src={branch.map}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>

        {/* 24/7 Support Section */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 text-center">
          <i className="fas fa-headset text-red-500 text-4xl mb-3" />
          <h3 className="text-2xl font-bold text-gray-800">
            24/7 Customer Support
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            For urgent queries, tracking, or shipment assistance, reach us via
            phone or email.
          </p>
          <div className="flex justify-center gap-5 mt-5 flex-wrap">
            <a
              href="tel:+13233474758"
              className="bg-red-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-red-700 transition shadow"
            >
              <i className="fas fa-phone-alt mr-2" /> Call Now
            </a>
            <a
              href="mailto:support@firstflyexpres.com"
              className="border border-red-400 text-red-600 px-6 py-2.5 rounded-full font-semibold hover:bg-red-50 transition"
            >
              <i className="fas fa-envelope mr-2" /> Email Support
            </a>
            <OpenEnquiryButton className="bg-gray-800 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-gray-900 transition">
              <i className="fas fa-comment-dots mr-2" /> Quick Enquiry
            </OpenEnquiryButton>
          </div>
        </div>
      </div>
    </>
  );
}