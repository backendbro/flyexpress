"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track n Trace" },
  { href: "/contact", label: "Contact Us" },
  { href: "/download", label: "download" },
  { href: "/faq", label: "Faq" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavShadow(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/#about") return false;
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  return (
    <nav
      className={`navbar-shadow fixed w-full z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 ${
        navShadow ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/ffelogo.png"
              alt="First Fly Express"
              width={160}
              height={42}
              className="h-[42px] w-auto rounded-md"
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-7 font-medium text-sm uppercase tracking-wide">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  isActive(href)
                    ? "text-red-600 border-b-2 border-red-600 pb-1"
                    : "text-gray-700 hover:text-red-600 transition"
                }
              >
                {label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="md:hidden border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <i
              className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-xl text-gray-700`}
            />
          </button>
        </div>
      </div>
      <div className={`mobile-menu-panel md:hidden ${menuOpen ? "open" : ""}`}>
        <div className="flex flex-col gap-1 px-5 py-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={
                isActive(href)
                  ? "text-red-600 bg-red-50 py-3 px-2 rounded-lg"
                  : "text-gray-800 hover:text-red-600 hover:bg-gray-50 py-3 px-2 rounded-lg transition"
              }
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
