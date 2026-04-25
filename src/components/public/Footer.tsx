import Link from "next/link";
import { schoolConfig } from "@/config/school";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/staff", label: "Staff Directory" },
      { href: "/academics", label: "Academics" },
      { href: "/admissions", label: "Admissions" },
      { href: "/news", label: "News" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/gallery", label: "Gallery" },
      { href: "/contact", label: "Contact Us" },
      { href: "/admissions", label: "Apply Now" },
      { href: "/share-your-story", label: "Share Your Story" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border text-muted">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* School Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-semibold text-sm">
                {schoolConfig.shortName[0]}
              </div>
              <h3 className="text-sm font-semibold text-text">
                {schoolConfig.name}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted mb-6">
              {schoolConfig.tagline}
            </p>
            <div className="flex gap-2">
              {schoolConfig.social.facebook && (
                <a
                  href={schoolConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
              )}
              {schoolConfig.social.twitter && (
                <a
                  href={schoolConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
              )}
              {schoolConfig.social.instagram && (
                <a
                  href={schoolConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1.5" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-text mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-text mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {schoolConfig.contact.address}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${schoolConfig.contact.email}`} className="hover:text-primary transition-colors">
                  {schoolConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${schoolConfig.contact.phone}`} className="hover:text-primary transition-colors">
                  {schoolConfig.contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            © {currentYear} {schoolConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>{schoolConfig.accreditation}</span>
            <span className="text-border">•</span>
            <span>
              Built by{" "}
              <span className="text-text font-medium">
                {schoolConfig.developer}
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
