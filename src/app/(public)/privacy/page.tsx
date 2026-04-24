import type { Metadata } from "next";
import { schoolConfig } from "@/config/school";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${schoolConfig.name} collects, uses, and protects personal information under the Ghana Data Protection Act (Act 843).`,
};

export default function PrivacyPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <section className="border-b border-border py-12">
        <div className="container-wide max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-muted">
            Last updated: January {year}. This policy explains how{" "}
            {schoolConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
            uses, and protects personal information.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-wide max-w-3xl prose">
          <h2>1. Who we are</h2>
          <p>
            {schoolConfig.name} is an educational institution located at{" "}
            {schoolConfig.contact.address}. You can reach our data protection
            contact at{" "}
            <a href={`mailto:${schoolConfig.contact.email}`}>
              {schoolConfig.contact.email}
            </a>
            .
          </p>

          <h2>2. What information we collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li>
              <strong>Application data</strong> — applicant name, date of
              birth, grade applied for, parent/guardian contact details and any
              attachments submitted via our admissions form.
            </li>
            <li>
              <strong>Contact messages</strong> — name, email, phone number
              (optional), and the content of any message you send us via the
              contact form.
            </li>
            <li>
              <strong>Technical data</strong> — IP address, browser and device
              information, collected automatically via standard web server
              logs.
            </li>
          </ul>

          <h2>3. How we use your information</h2>
          <ul>
            <li>To process and respond to admissions applications.</li>
            <li>To respond to questions you send us.</li>
            <li>To send you news or announcements you have subscribed to.</li>
            <li>
              To comply with legal obligations under the Ghana Education
              Service (GES) and Ghana Revenue Authority (GRA).
            </li>
            <li>To detect and prevent fraud or abuse of our systems.</li>
          </ul>

          <h2>4. Legal basis</h2>
          <p>
            Under the{" "}
            <strong>Data Protection Act, 2012 (Act 843)</strong>, we process
            personal data where you have given consent (e.g. submitting an
            enquiry), where processing is necessary for a contract with you
            (admissions), or where it is required for compliance with a legal
            obligation.
          </p>

          <h2>5. Who we share data with</h2>
          <p>
            We do not sell your personal data. We share it only with
            sub-processors necessary to run the school and this website,
            including:
          </p>
          <ul>
            <li>Our hosting and database providers (Supabase, Vercel).</li>
            <li>Email and messaging services we use to reply to you.</li>
            <li>
              Government authorities when legally compelled to disclose (e.g.
              court order).
            </li>
          </ul>

          <h2>6. Data retention</h2>
          <p>
            Admission applications are retained for at least one academic year
            after the decision. Contact messages are retained for up to two
            years unless needed for an ongoing matter. Server logs are
            retained for up to 90 days.
          </p>

          <h2>7. Your rights</h2>
          <p>Under Act 843 you have the right to:</p>
          <ul>
            <li>Ask what personal data we hold about you.</li>
            <li>
              Ask us to correct or erase personal data that is inaccurate or no
              longer necessary.
            </li>
            <li>
              Object to or withdraw consent for certain processing (e.g.
              newsletter).
            </li>
            <li>
              Lodge a complaint with the Data Protection Commission of Ghana.
            </li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href={`mailto:${schoolConfig.contact.email}`}>
              {schoolConfig.contact.email}
            </a>
            .
          </p>

          <h2>8. Security</h2>
          <p>
            We use encrypted connections (HTTPS) for all traffic, row-level
            security on our database, and restricted access for staff. No
            online system is 100% secure, however, and we encourage you not to
            send sensitive information by email.
          </p>

          <h2>9. Children&rsquo;s data</h2>
          <p>
            Because we are a school, we intentionally process data about
            minors. In all cases this is provided by a parent or legal
            guardian, who controls the consent and may request deletion at any
            time.
          </p>

          <h2>10. Changes to this policy</h2>
          <p>
            We may update this policy as our practices or the law evolves. The
            &ldquo;last updated&rdquo; date at the top of this page reflects
            the most recent change.
          </p>

          <p>
            <em>
              This page is provided for information and does not constitute
              legal advice. For questions about your rights, consult a
              qualified lawyer or the Data Protection Commission.
            </em>
          </p>
        </div>
      </section>
    </>
  );
}
