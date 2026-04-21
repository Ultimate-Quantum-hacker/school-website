import type { Metadata } from "next";
import Image from "next/image";
import { schoolConfig } from "@/config/school";
import { SectionHeader } from "@/components/ui/Card";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${schoolConfig.name}. Contact us for enquiries, visits, or admissions information.`,
};

export default function ContactPage() {
  return (
    <>
      {/* ─── Page Header ───────────────────────────────────────── */}
      <section className="relative gradient-hero text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={schoolConfig.images.campus}
            alt="Campus"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
        </div>
        <div className="relative container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4 animate-fade-in">
            Contact Us
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in-up">
            We&apos;d love to hear from you. Reach out with any questions or
            schedule a campus visit.
          </p>
        </div>
      </section>

      {/* ─── Contact Content ───────────────────────────────────── */}
      <section className="section-padding bg-base">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 reveal-left">
              <SectionHeader
                title="Get in Touch"
                subtitle="We're here to help"
                centered={false}
              />
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Our Address</h3>
                    <p className="text-sm text-gray-600">{schoolConfig.contact.address}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href={`mailto:${schoolConfig.contact.email}`} className="text-sm text-primary hover:underline">
                      {schoolConfig.contact.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <a href={`tel:${schoolConfig.contact.phone}`} className="text-sm text-primary hover:underline block">
                      {schoolConfig.contact.phone}
                    </a>
                    <a href={`tel:${schoolConfig.contact.phone2}`} className="text-sm text-primary hover:underline block">
                      {schoolConfig.contact.phone2}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                    <p className="text-sm text-gray-600">Mon – Fri: 7:30 AM – 4:00 PM</p>
                    <p className="text-sm text-gray-600">Sat: 9:00 AM – 12:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 reveal-right">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="font-heading text-xl font-bold text-gray-900 mb-1">
                  Send Us a Message
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Map ───────────────────────────────────────────────── */}
      <section className="bg-soft">
        <div className="container-wide py-2">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 reveal-scale">
            <iframe
              src={schoolConfig.contact.mapEmbedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${schoolConfig.name} Location`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
