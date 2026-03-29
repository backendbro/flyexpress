import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import 'leaflet/dist/leaflet.css'
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "First Fly Express - Logistic Solution",
    template: "%s | First Fly Express",
  },
  description:
    "First Fly Express - Leading logistics and courier solution partner in India. Domestic & international shipping, air freight, ground shipping, rail cargo.",
  icons: {
    icon: [{ url: "/images/favicon1.png", sizes: "32x32", type: "image/png" }],
    apple: "/images/favicon1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-800 antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
