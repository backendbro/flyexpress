import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageEnquiryModal } from "@/components/QuickEnquiryModal";
import { OpenEnquiryButton } from "@/components/OpenEnquiryButton";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore First Fly Express logistics: domestic express, international courier, airport cargo, time-bound delivery, and lead logistics across India.",
};

export default function ServicesPage() {
  return (
    <>
      <PageEnquiryModal autoOpenMs={1500} />
      <section className="services-hero pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-start">
            <div className="hero-badge mb-4">
              <i className="fas fa-cogs text-red-400 mr-2" />
              <span className="text-white text-sm font-medium">
                What We Offer
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Our Services
            </h1>
            <div className="flex items-center gap-2 text-gray-300 text-sm mt-3">
              <Link href="/" className="hover:text-red-400 transition">
                Home
              </Link>
              <i className="fas fa-chevron-right text-[10px]" />
              <span className="text-red-300 font-medium">Services</span>
            </div>
            <p className="text-gray-200 max-w-2xl mt-5 text-base">
              Comprehensive logistics and courier solutions tailored to your
              business needs — from domestic express to international freight.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="rounded-2xl overflow-hidden shadow-xl mb-16">
          <Image
            src="/images/serv.jpg"
            alt="First Fly Express services"
            width={1200}
            height={400}
            className="w-full h-auto max-h-[320px] object-cover"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: "fa-truck-fast",
              title: "Domestic Express",
              body: "The fastest, most reliable door-to-door day-definite delivery across India for documents and shipments under 32 kgs. First choice for urgent parcels nationwide.",
            },
            {
              icon: "fa-chart-line",
              title: "Lead Logistics",
              body: "Custom supply chain solutions tailored to your business goals. Reduce inventory costs, improve productivity with end-to-end logistics consulting.",
            },
            {
              icon: "fa-stopwatch",
              title: "Time Bound Delivery",
              body: "Guaranteed time-sensitive deliveries for critical shipments. Our time-definite solutions ensure your urgent cargo reaches on schedule, every time.",
            },
            {
              icon: "fa-plane-departure",
              title: "Airport to Airport",
              body: "Air freight service between major Indian airports: Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Ahmedabad, Kolkata. Fast and reliable cargo transfers.",
            },
            {
              icon: "fa-globe-americas",
              title: "International Shipping",
              body: "Global delivery partnerships with FedEx, DHL, TNT, UPS & Aramex. Seamless international courier with end-to-end tracking. Pickup available anywhere in India.",
            },
            {
              icon: "fa-boxes",
              title: "Home Shifting & Packing",
              body: "Complete relocation solutions — from professional packing to safe delivery. We handle your belongings with care, ensuring a stress-free move.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="service-card-modern p-6 text-center group"
            >
              <div className="flex justify-center mb-5">
                <div className="service-icon-wrapper">
                  <i
                    className={`fas ${s.icon} text-red-500 text-3xl group-hover:text-white transition-colors`}
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="text-center mb-10">
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">
              Service Deep Dive
            </span>
            <h2 className="text-3xl font-extrabold text-gray-800 mt-2">
              Comprehensive Logistics Solutions
            </h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mt-3 rounded-full" />
          </div>
          <div className="space-y-5">
            <div className="media-service-item">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-truck-fast text-red-500 text-2xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Domestic Courier
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The fastest, most reliable, door-to-door day-definite delivery
                  service across India for documents and small shipments under
                  32 kgs per package.
                </p>
              </div>
            </div>
            <div className="media-service-item">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-chalkboard-user text-red-500 text-2xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Lead Logistics Concept
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  When you have a committed logistics partner planning and
                  implementing a supply chain solution tailored to your specific
                  needs, you have First Fly Express&apos; brand of Personal
                  Service. Our supply chain experts consult with you to
                  understand your business goals, finding more innovative and
                  cost-effective ways to bring goods to market. We take high
                  personal responsibility to ensure success, reducing inventory
                  and supply chain costs while improving productivity.
                </p>
              </div>
            </div>
            <div className="media-service-item">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-hourglass-half text-red-500 text-2xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Time Bound Service
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Reliable &quot;TIME BOUND SERVICE&quot; courier solutions for
                  both domestic and international needs — guaranteed delivery
                  windows.
                </p>
              </div>
            </div>
            <div className="media-service-item">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-plane text-red-500 text-2xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Airport to Airport Cargo
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Available on flights between Kolkata, Delhi, Mumbai,
                  Bangalore, Chennai, Hyderabad, and Ahmedabad. Fast air freight
                  for time-critical cargo.
                </p>
              </div>
            </div>
            <div className="media-service-item">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <i className="fab fa-fedex text-red-500 text-2xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  International Courier Network
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We have delivery arrangements with{" "}
                  <strong>FedEx, DHL, TNT, UPS and Aramex</strong>. Tracking
                  through our website; pickups anywhere in India.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 text-center">
          <i className="fas fa-headset text-red-500 text-4xl mb-3" />
          <h3 className="text-2xl font-bold text-gray-800">
            Need a Customized Logistics Plan?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            Our experts are ready to design a supply chain solution that fits
            your unique business requirements.
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition shadow-md"
            >
              <i className="fas fa-envelope mr-2" /> Contact Sales
            </Link>
            <OpenEnquiryButton className="border border-red-400 text-red-600 hover:bg-red-50 px-6 py-3 rounded-full font-semibold transition">
              <i className="fas fa-comment-dots mr-2" /> Quick Enquiry
            </OpenEnquiryButton>
            <Link
              href="/download"
              className="bg-gray-800 text-white hover:bg-gray-900 px-6 py-3 rounded-full font-semibold transition"
            >
              <i className="fas fa-download mr-2" /> Download Brochure
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
