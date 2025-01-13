import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Footer from "@/components/footer";
import { Navbar } from "@/components/nav";

import { baseUrl } from "./sitemap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Next.js Portfolio Starter",
    template: "%s | Next.js Portfolio Starter",
  },
  description: "This is my portfolio.",
  openGraph: {
    title: "My Portfolio",
    description: "This is my portfolio.",
    url: baseUrl,
    siteName: "My Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-white text-black dark:bg-black dark:text-white"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} mx-4 mt-8 max-w-xl antialiased lg:mx-auto`}
      >
        <main className="mt-6 flex min-w-0 flex-auto flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </main>
      </body>
    </html>
  );
}
