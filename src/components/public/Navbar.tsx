"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { schoolConfig } from "@/config/school";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/FormElements";
import { SearchDialog } from "@/components/public/SearchDialog";
import { ThemeToggle } from "@/components/public/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-border">
      <nav className="container-wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-sm">
              {schoolConfig.shortName[0]}
            </div>
            <div className="hidden md:block">
              <p className="text-base xl:text-lg font-bold tracking-tight text-text leading-tight whitespace-nowrap">
                {schoolConfig.name}
              </p>
              <p className="text-xs xl:text-sm text-muted leading-tight whitespace-nowrap">
                {schoolConfig.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "after:absolute after:left-3 after:right-3 after:bottom-1 after:h-px",
                  "after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-200",
                  pathname === link.href
                    ? "text-primary bg-primary/10 after:scale-x-0"
                    : "text-muted hover:text-text hover:after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <SearchDialog />
            <ThemeToggle />
            <Link href="/admissions" className="hidden sm:block">
              <Button size="sm">Apply Now</Button>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-lg text-muted hover:bg-background transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted hover:text-text hover:bg-background"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 px-4">
                <Link href="/admissions" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
