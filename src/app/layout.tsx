import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { schoolConfig } from "@/config/school";
import { Background } from "@/components/ui/Background";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${schoolConfig.name} — ${schoolConfig.tagline}`,
    template: `%s | ${schoolConfig.name}`,
  },
  description: schoolConfig.description,
  keywords: [
    schoolConfig.name,
    "school",
    "education",
    "admissions",
    "academics",
  ],
  openGraph: {
    title: schoolConfig.name,
    description: schoolConfig.description,
    type: "website",
  },
  alternates: {
    types: {
      "application/rss+xml": [
        {
          url: "/news/rss.xml",
          title: `${schoolConfig.name} — News`,
        },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-hydration theme resolver. Must run synchronously before any
  // styled content paints to avoid flash of wrong theme. Reads
  // localStorage("theme") first, falls back to the OS preference.
  const themeInit = `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className="font-sans min-h-screen flex flex-col bg-background text-text"
        suppressHydrationWarning
      >
        <Background />
        {children}
      </body>
    </html>
  );
}
