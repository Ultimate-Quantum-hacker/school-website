import type { Metadata } from "next";
import { schoolConfig } from "@/config/school";
import { SectionHeader } from "@/components/ui/Card";
import { TestimonialForm } from "@/components/public/TestimonialForm";

export const metadata: Metadata = {
  title: "Share Your Story",
  description: `Tell us what makes ${schoolConfig.name} special to your family. Submissions are reviewed and may be featured on our home page.`,
};

export default function ShareYourStoryPage() {
  return (
    <>
      <section className="border-b border-border py-14">
        <div className="container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Share Your Story
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto animate-fade-in-up">
            Parents, alumni, and students — tell us what {schoolConfig.shortName}
            {" "}has meant to you. We feature approved stories on our home page.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeader
            title="Tell us about your experience"
            subtitle="Stories are reviewed by our team before they appear publicly. We&rsquo;ll never display your email address."
          />
          <div className="mt-8 bg-surface border border-border rounded-2xl p-6 md:p-10 shadow-sm">
            <TestimonialForm />
          </div>
        </div>
      </section>
    </>
  );
}
