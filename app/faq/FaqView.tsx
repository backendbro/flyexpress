"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OpenEnquiryButton } from "@/components/OpenEnquiryButton";

const items = [
  {
    id: "safety",
    title: "How safe are my shipments with First Fly Express?",
    icon: "fas fa-shield-alt",
    body: (
      <p className="text-gray-600 leading-relaxed">
        While all efforts are made to ensure zero error service, we also have a{" "}
        <strong>‘Comprehensive Risk Coverage Policy’</strong>, which insures
        your shipment against unforeseen loss or damage during transit.
      </p>
    ),
  },
  {
    id: "timeline",
    title: "How many days will it take to deliver my shipment?",
    icon: "fas fa-clock",
    body: (
      <>
        <p className="text-gray-600 mb-4">
          Delivery timelines vary by destination. Estimated schedule:
        </p>
        <div className="overflow-x-auto">
          <table className="delivery-table">
            <thead>
              <tr>
                <th>Town Category</th>
                <th>Delivery Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>International</td>
                <td>2-3 Working Days</td>
              </tr>
              <tr>
                <td>All Major Metros</td>
                <td>Before 10:30 hours (Next day)</td>
              </tr>
              <tr>
                <td>All Main Cities & Towns</td>
                <td>Within 24 hours</td>
              </tr>
              <tr>
                <td>Small Towns</td>
                <td>24 to 48 hours</td>
              </tr>
              <tr>
                <td>Satellite Stations</td>
                <td>48 to 72 hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "prohibited",
    title: "What shipments cannot be carried by you?",
    icon: "fas fa-ban",
    body: (
      <>
        <p className="text-gray-600 mb-3 font-medium">
          We do not carry the following items:
        </p>
        <ul className="prohibited-list grid md:grid-cols-2 gap-x-6">
          <li>Stamped and prepaid postal envelopes and parcels</li>
          <li>Precious stones, gems and jewelry</li>
          <li>Uncrossed (bearer) drafts / cheque, currency and coins</li>
          <li>Poison</li>
          <li>Firearms, explosives and military equipment</li>
          <li>Hazardous and radioactive material</li>
          <li>Foodstuff and liquor</li>
          <li>Any pornographic material</li>
          <li>Hazardous chemical items</li>
        </ul>
        <p className="text-gray-500 text-sm mt-4">
          All items that infringe the Indian Postal Act of 1898 and restricted
          items per IATA guidelines.
        </p>
      </>
    ),
  },
  {
    id: "valuables",
    title: "Can I book cash, precious stones or jewellery?",
    icon: "fas fa-gem",
    body: (
      <p className="text-gray-600 leading-relaxed">
        Carrying or booking such valuables is illegal under the{" "}
        <strong>‘Postal Regulation Act’</strong>. We do not carry them and hold
        no responsibility if booked without our knowledge.
      </p>
    ),
  },
  {
    id: "visit",
    title: "Can your representative visit me for a discussion?",
    icon: "fas fa-user-tie",
    body: (
      <p className="text-gray-600">
        Email{" "}
        <a
          href="mailto:sales@firstflyexpress.com"
          className="text-red-600 hover:underline font-medium"
        >
          sales@firstflyexpress.com
        </a>{" "}
        with subject &apos;Business Call&apos;, your preferred time, and contact
        details. Our representative will visit you promptly.
      </p>
    ),
  },
  {
    id: "address",
    title:
      "Can I change the address of a shipment that is not yet delivered?",
    icon: "fas fa-map-marker-alt",
    body: (
      <p className="text-gray-600">
        Yes — contact the booking branch if not yet delivered. Provide written
        intimation within 48 hours, or email{" "}
        <a href="mailto:sales@firstflyexpress.com" className="text-red-600">
          sales@firstflyexpress.com
        </a>{" "}
        with subject &apos;Change Address&apos; and your new details.
      </p>
    ),
  },
  {
    id: "track",
    title: "How can I track my shipment in real-time?",
    icon: "fas fa-truck",
    body: (
      <p className="text-gray-600">
        Use our{" "}
        <Link href="/track" className="text-red-600 font-medium">
          Track n Trace
        </Link>{" "}
        page and enter your Airway Bill Number or reference ID.
      </p>
    ),
  },
];

export function FaqView() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  return (
    <>
      <section className="faq-hero pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-start">
            <div className="hero-badge mb-4">
              <i className="fas fa-question-circle text-red-400 mr-2" />
              <span className="text-white text-sm font-medium">
                Knowledge Base
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h1>
            <div className="flex items-center gap-2 text-gray-300 text-sm mt-3">
              <Link href="/" className="hover:text-red-400 transition">
                Home
              </Link>
              <i className="fas fa-chevron-right text-[10px]" />
              <span className="text-red-300 font-medium">FAQ</span>
            </div>
            <p className="text-gray-200 max-w-2xl mt-5 text-base">
              Quick answers on shipping, delivery timelines, prohibited items,
              and safe delivery.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 mb-16 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/71.jpg"
              alt="Customer support FAQ"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              <i className="fas fa-headset text-red-500 mr-2" /> Your Questions
              Matter
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We answer queries on our logistics services. If you don&apos;t
              find what you need, contact support.
            </p>
            <div className="mt-5 flex gap-3 flex-wrap">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
              >
                <i className="fas fa-envelope" /> Contact Support
              </Link>
              <Link
                href="/track"
                className="inline-flex items-center gap-2 border border-red-300 text-red-700 hover:bg-red-50 px-5 py-2 rounded-full text-sm font-semibold transition"
              >
                <i className="fas fa-search-location" /> Track Shipment
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const active = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-item p-0 overflow-hidden ${active ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question w-full flex justify-between items-center p-5 md:p-6 text-left"
                  onClick={() => toggle(item.id)}
                  aria-expanded={active}
                >
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 pr-4">
                    <i className={`${item.icon} text-red-500 mr-3`} />
                    {item.title}
                  </h3>
                  <div className="faq-icon text-red-500 shrink-0">
                    <i className="fas fa-chevron-down" />
                  </div>
                </button>
                <div className="faq-answer px-5 md:px-6 pb-5 md:pb-6">
                  {item.body}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 bg-gray-100 rounded-2xl p-6 md:p-8 text-center">
          <i className="fas fa-life-ring text-red-500 text-3xl mb-3 inline-block" />
          <h3 className="text-xl font-bold text-gray-800">
            Still have questions?
          </h3>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            We&apos;re happy to help — contact customer support anytime.
          </p>
          <div className="flex justify-center gap-4 mt-5 flex-wrap">
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition shadow"
            >
              <i className="fas fa-phone-alt mr-2" /> Contact Us
            </Link>
            <OpenEnquiryButton className="border border-red-400 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-full text-sm font-semibold transition">
              <i className="fas fa-envelope-open-text mr-2" /> Quick Enquiry
            </OpenEnquiryButton>
          </div>
        </div>
      </div>
    </>
  );
}
