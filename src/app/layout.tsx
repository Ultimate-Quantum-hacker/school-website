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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col bg-background text-text">
        <Background />
        {children}
      </body>
    </html>
  );
}
