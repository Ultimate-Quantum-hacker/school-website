import type { Metadata } from "next";
import { schoolConfig } from "@/config/school";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${schoolConfig.name} uses cookies and similar technologies on this website.`,
};

export default function CookiesPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <section className="border-b border-border py-12">
        <div className="container-wide max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Cookie Policy</h1>
          <p className="text-muted">
            Last updated: January {year}. This page explains the cookies and
            similar browser-storage technologies used by the{" "}
            {schoolConfig.name} website.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-wide max-w-3xl prose">
          <h2>1. What cookies are</h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They are used to remember preferences, keep you signed in,
            and measure how a site is used.
          </p>

          <h2>2. Cookies we use</h2>
          <p>
            We use the minimum number of cookies necessary to run this
            website. Specifically:
          </p>
          <ul>
            <li>
              <strong>Strictly necessary (session)</strong> — set by our
              authentication provider when an administrator signs into the
              admin panel. These expire when the browser closes or the session
              ends and cannot be turned off.
            </li>
            <li>
              <strong>Preferences (local storage)</strong> — a{" "}
              <code>theme</code> key is stored in <code>localStorage</code>{" "}
              (not a cookie) so your dark/light mode preference persists
              between visits. You can clear it by clearing site data in your
              browser.
            </li>
          </ul>

          <h2>3. Cookies we do <em>not</em> use</h2>
          <p>
            As of this writing the public site does not set any analytics,
            advertising, or cross-site tracking cookies. If that changes we
            will update this page and offer an opt-in banner before any
            non-essential cookie is set.
          </p>

          <h2>4. Third-party embeds</h2>
          <p>
            When a news post or page embeds content from a third party (for
            example a YouTube video or a Google Map), that third party may set
            its own cookies. We cannot control those cookies; please refer to
            the relevant provider&rsquo;s policy.
          </p>

          <h2>5. How to control cookies</h2>
          <p>
            You can delete cookies that have already been set and block future
            cookies via your browser&rsquo;s settings. Note that blocking
            strictly-necessary cookies will prevent administrators from
            signing into the admin panel.
          </p>

          <h2>6. Contact</h2>
          <p>
            Questions about this cookie policy? Email{" "}
            <a href={`mailto:${schoolConfig.contact.email}`}>
              {schoolConfig.contact.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
