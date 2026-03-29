import Image from "next/image";
import Link from "next/link";
import { PageEnquiryModal } from "@/components/QuickEnquiryModal";

export default function HomePage() {
  return (
    <>
      <PageEnquiryModal autoOpenMs={500} />
      <section id="home">
        <div className="hero-bg">
          <Image
            src="/images/bg1.jpg"
            alt="Cargo plane"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="hero-content">
          <div
            className="max-w-7xl mx-auto px-5 md:px-8"
            style={{ paddingTop: 100, paddingBottom: 70 }}
          >
            <div className="flex-container flex w-full">
              <div className="hero-text-wrapper">
                <span className="hero-welcome fade-up d1">
                  <i className="fas fa-globe-americas mr-3" /> WELCOME TO
                </span>
                <div className="hero-brand fade-up d2">
                  <div>FIRST FLY</div>
                  <div>EXPRESS</div>
                </div>
                <p className="hero-tagline fade-up d3">
                  The Wonderful Logistic Solution... <br />
                  Seamless. Fast. Reliable.
                </p>
                <div className="hero-phone fade-up d4">
                  <span>
                    +91 11 45851031 &nbsp;|&nbsp; +91 9643326207
                  </span>
                  <span className="icon-wrap">
                    <i className="fas fa-phone-alt" />
                  </span>
                </div>
                <div className="hero-buttons fade-up d5 flex flex-col sm:flex-row gap-5 mt-8">
                  <Link href="/track" className="hero-btn">
                    <i className="fas fa-search-location" /> Track n Trace
                  </Link>
                  <Link href="/contact" className="hero-btn hero-btn-outline">
                    <i className="fas fa-map-marker-alt" /> Locate Us
                  </Link>
                  <Link href="/services" className="hero-btn">
                    <i className="fas fa-cogs" /> Service Guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        style={{ background: "#eeeeee", padding: "50px 15px" }}
      >
        <div className="container mx-auto max-w-[1140px]">
          <div className="flex flex-wrap gap-0">
            <div className="slide-in-left flex-[1_1_300px] px-[30px] py-[15px] pl-[15px]">
              <h2
                className="mb-[18px] font-bold text-[#333]"
                style={{ fontSize: "2rem" }}
              >
                About us
              </h2>
              <Image
                src="/images/6.jpg"
                alt="About First Fly Express"
                width={800}
                height={500}
                className="w-full h-auto block"
              />
              <p
                className="mt-[18px] text-[#555] text-justify"
                style={{ lineHeight: 1.75 }}
              >
                <strong>First Fly Express</strong>&nbsp;assists your organization
                steer towards its corporate vision and goals by providing value
                added services to cater to your needs.
              </p>
            </div>
            <div className="slide-in-right flex-[1_1_300px] px-[30px] py-[15px] pr-[15px]">
              <h2
                className="mb-[18px] font-bold text-[#333]"
                style={{ fontSize: "2rem" }}
              >
                First Fly Express
              </h2>
              <p className="text-[#555] text-justify" style={{ lineHeight: 1.75 }}>
                <strong>First Fly Express&nbsp;</strong>is promoted in India by
                a group of experienced professionals committed to achieve
                business objectives by delivering value and building long term
                customer relationships.
                <br />
                <br />
                Formed with a vision to become &quot;leading logistics and
                courier solution partners&quot; we are committed to working in
                partnership with clients and provide them a platform to deliver
                value to the end consumers / beneficiaries.
                <br />
                <br />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-widest uppercase text-gray-800">
              Our Services
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="service-card">
              <Image
                src="/images/S1.jpg"
                alt="Air freight"
                width={600}
                height={400}
                className="w-full h-auto mb-6"
              />
              <div className="px-5 pb-6">
                <h3 className="text-lg font-bold tracking-[0.25em] uppercase text-gray-800 mb-4">
                  AIR FREIGHT
                </h3>
                <p className="text-gray-600 leading-relaxed text-justify text-sm">
                  We have delivery arrangements for international courier with
                  all the major companies like FedEx, DHL, TNT, UPS and Aramex.
                  Tracking facility available through this website.
                </p>
              </div>
            </div>
            <div className="service-card">
              <Image
                src="/images/S2.jpg"
                alt="Ground shipping"
                width={600}
                height={400}
                className="w-full h-auto mb-6"
              />
              <div className="px-5 pb-6">
                <h3 className="text-lg font-bold tracking-[0.25em] uppercase text-gray-800 mb-4">
                  GROUND SHIPPING
                </h3>
                <p className="text-gray-600 leading-relaxed text-justify text-sm">
                  The fastest, most reliable, door-to-door day-definite delivery
                  service across India for documents and small parcels. Ideal
                  for customers who need urgent shipping solutions.
                </p>
              </div>
            </div>
            <div className="service-card">
              <Image
                src="/images/S3.jpg"
                alt="Rail cargo"
                width={600}
                height={400}
                className="w-full h-auto mb-6"
              />
              <div className="px-5 pb-6">
                <h3 className="text-lg font-bold tracking-[0.25em] uppercase text-gray-800 mb-4">
                  RAIL CARGO
                </h3>
                <p className="text-gray-600 leading-relaxed text-justify text-sm">
                  We provide Rail Cargo for bulk consignments. This service
                  proves cost-effective and ensures delivery within 48–72 hours
                  depending on destination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-info" className="bg-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/contact.png"
            alt=""
            className="absolute right-0 top-1/2 -translate-y-1/2 max-w-[380px] pr-8"
          />
        </div>
        <div
          className="max-w-6xl mx-auto px-6 relative z-10"
          style={{ paddingRight: "clamp(1rem, 20%, 380px)" }}
        >
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 mt-1">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black text-red-600 text-2xl">
                <i className="fa fa-phone" />
              </span>
            </div>
            <div className="max-w-2xl">
              <h2 className="text-gray-900 text-[1.45rem] leading-relaxed font-semibold">
                Call Us 24 X 7 : +91 964 332 6207 / 964 332 6208
                <br />
                096 433 26208
              </h2>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                Feel free to contact. Your call will be always welcome.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="mapContainer" className="my-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <iframe
            title="First Fly Express map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.584496616303!2d77.13165780000001!3d28.552206199999993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1d4242dab857%3A0x3dfd699f2ddbb1e9!2sFirst%20fly%20express!5e0!3m2!1sen!2sin!4v1761998163530!5m2!1sen!2sin"
            width="100%"
            height={450}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
