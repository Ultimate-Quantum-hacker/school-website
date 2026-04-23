import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { schoolConfig } from "@/config/school";
import { Background } from "@/components/ui/Background";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? schoolConfig.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${schoolConfig.name} — ${schoolConfig.tagline}`,
    template: `%s | ${schoolConfig.name}`,
  },
  description: schoolConfig.description,
  applicationName: schoolConfig.name,
  keywords: [
    schoolConfig.name,
    "school in Ghana",
    "school in Accra",
    "basic school",
    "JHS",
    "BECE",
    "admissions",
    "academics",
    "education",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: schoolConfig.name,
    title: `${schoolConfig.name} — ${schoolConfig.tagline}`,
    description: schoolConfig.description,
    url: siteUrl,
    locale: "en_GH",
    images: [
      {
        url: schoolConfig.images.heroStudents,
        width: 1400,
        height: 900,
        alt: `${schoolConfig.name} students`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${schoolConfig.name} — ${schoolConfig.tagline}`,
    description: schoolConfig.description,
    images: [schoolConfig.images.heroStudents],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className="font-sans min-h-screen flex flex-col bg-background text-text"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:shadow-md"
        >
          Skip to content
        </a>
        <Background />
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
