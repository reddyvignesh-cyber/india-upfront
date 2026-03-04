import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IndiaUpfront - Know Your Politicians' Criminal Records",
  description:
    "40% of Indian politicians face criminal charges. Explore interactive maps, criminal records, scam amounts, and more. Hold your leaders accountable.",
  keywords: [
    "India politicians criminal records",
    "Indian politician crimes",
    "MyNeta",
    "ADR",
    "election data",
    "political transparency",
    "criminal politicians India",
  ],
  openGraph: {
    title: "IndiaUpfront - The Truth About Your Politicians",
    description:
      "40% of Indian politicians face criminal charges. Murder, rape, fraud, scams — see the data.",
    type: "website",
    locale: "en_IN",
    siteName: "IndiaUpfront",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndiaUpfront - Know Your Politicians' Criminal Records",
    description:
      "40% of Indian politicians face criminal charges. Explore the data.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-black text-white selection:bg-red-500/30`}
      >
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
