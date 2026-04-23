import { schoolConfig } from "@/config/school";

/**
 * Emits JSON-LD structured data for the school using schema.org's
 * EducationalOrganization type. Renders as a non-blocking <script>
 * tag, invisible in the UI, consumed by search engines to build
 * rich snippets and knowledge panels.
 */
export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? schoolConfig.siteUrl;

  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: schoolConfig.name,
    alternateName: schoolConfig.shortName,
    description: schoolConfig.description,
    url: siteUrl,
    logo: `${siteUrl}${schoolConfig.logo}`,
    image: schoolConfig.images.heroStudents,
    foundingDate: String(schoolConfig.foundedYear),
    slogan: schoolConfig.tagline,
    email: schoolConfig.contact.email,
    telephone: schoolConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: schoolConfig.contact.address,
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    sameAs: Object.values(schoolConfig.social).filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
