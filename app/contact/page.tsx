import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageEnquiryModal } from "@/components/QuickEnquiryModal";
import { OpenEnquiryButton } from "@/components/OpenEnquiryButton";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with First Fly Express: Delhi head office, branches, phone, email, and enquiry form.",
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
              queries. We&apos;re available 24/7 to assist you.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
              <Image
                src="/images/india_map2.jpg"
                alt="India map — service locations"
                width={900}
                height={320}
                className="w-full h-auto object-contain bg-gray-50 p-2 max-h-[320px]"
              />
              <div className="p-5 border-t border-gray-100">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <i className="fas fa-map-pin text-red-500" /> Major branches
                  across India
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="info-icon">
                  <i className="fas fa-building" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Delhi Head Office
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Shop #2, Ground Floor, GDITL Tower, B-8, Netaji Subhash Place,
                Pitampura, Delhi (INDIA) PIN Code - 110034
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3">
                  <i className="fas fa-phone-alt text-red-500 w-5" />
                  <span className="text-gray-700">
                    +91-11-42471031, 27357031, 9643326207, 9643326208
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-red-500 w-5" />
                  <a
                    href="mailto:sales@firstflyexpress.com"
                    className="text-red-600 hover:underline"
                  >
                    sales@firstflyexpress.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-globe w-5 text-gray-400" />
                  <span className="text-gray-600">www.firstflyexpress.com</span>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-800">
              Our Branch Offices
            </h2>
            <div className="w-16 h-1 bg-red-500 mx-auto mt-3 rounded-full" />
            <p className="text-gray-500 mt-3">
              Serving customers across Delhi NCR with dedicated support
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {[
              {
                title: "Delhi Office - Rohini",
                address:
                  "Fountain Chowk, A1/52, near M2K Road, Pocket 1, Sector 7, Rohini, Delhi, 110085",
                tel: "093502 62060",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.5857296049153!2d77.11877059999999!3d28.702036500000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0234789aaaab%3A0xe1f22fcd1c36340f!2sFirst%20Fly%20Express!5e0!3m2!1sen!2sin!4v1761283272177",
              },
              {
                title: "Delhi Office - Mahipalpur",
                address:
                  "ROAD NO-6, A-BLOCK, KH NO-1033, PLOT NO-258, NEAR MUKESH TEMPO SERVICE, Mahipalpur, New Delhi 110037",
                tel: "093509 31234",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.598246507795!2d77.12898237533251!3d28.551793075708954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1c414ee02e21%3A0xc8d4786526e5f467!2sFirst%20fly%20express!5e0!3m2!1sen!2sin!4v1762152750578",
              },
              {
                title: "Delhi Office - Pitampura",
                address:
                  "S. No. 2, GD-ITL Tower, Netaji Subhash Place, Pitampura, Delhi, 110034",
                tel: "096433 26208",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.9335134114203!2d77.1520744!3d28.691635400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0233dc68cb5d%3A0xd1786cc7bfd3793a!2sFirst%20fly%20express!5e0!3m2!1sen!2sin!4v1761283205664",
              },
            ].map((b) => (
              <div key={b.title} className="branch-card p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <i className="fas fa-map-marker-alt text-red-500 text-xl" />
                  <h3 className="font-bold text-lg">{b.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{b.address}</p>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <i className="fas fa-phone-alt text-red-500" />
                  <a href={`tel:${b.tel.replace(/\s/g, "")}`} className="hover:text-red-600">
                    {b.tel}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm mb-3">
                  <i className="fas fa-envelope text-red-500" />
                  <span className="text-gray-600">sales@firstflyexpress.com</span>
                </div>
                <iframe
                  title={b.title}
                  className="rounded-xl mt-2 w-full h-44 border-0"
                  src={b.map}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>

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
              href="tel:+919643326207"
              className="bg-red-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-red-700 transition shadow"
            >
              <i className="fas fa-phone-alt mr-2" /> Call Now
            </a>
            <a
              href="mailto:sales@firstflyexpress.com"
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
