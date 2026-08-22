import type { Metadata } from "next";

const description = "Share your IoT product requirement with us.";

export const metadata: Metadata = {
  title: "Contact | Protonest",
  description,
  alternates: {
    canonical: "https://protonest.co/contact-us",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://protonest.co/contact-us",
    siteName: "Protonest",
    title: "Contact | Protonest",
    description,
    images: [
      {
        url: "/og-image-home.png",
        width: 1200,
        height: 630,
        alt: "Contact Protonest IoT product development company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Protonest",
    description,
    images: ["/og-image-home.png"],
  },
};

const organizationDescription =
  "Protonest is an IoT product development company helping startups, companies, and product teams turn connected product ideas into reliable systems.";

const contactJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://protonest.co/#organization",
      name: "Protonest",
      url: "https://protonest.co/",
      logo: {
        "@type": "ImageObject",
        url: "https://protonest.co/logo.webp",
      },
      description: organizationDescription,
      email: "info@protonest.co",
      telephone: "+94771482755",
      address: {
        "@type": "PostalAddress",
        streetAddress: "503/A, Welivita Road",
        addressLocality: "Kaduwela",
        addressRegion: "Colombo",
        postalCode: "10640",
        addressCountry: "LK",
      },
      sameAs: [
        "https://lk.linkedin.com/company/protonestiot",
        "https://www.youtube.com/channel/UCe-RO03jOqiEAClVACUno2A/about",
        "https://x.com/ProtonestIoT",
        "https://www.facebook.com/profile.php?id=61562590660146",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "info@protonest.co",
        telephone: "+94771482755",
        availableLanguage: "en",
        areaServed: "Global",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://protonest.co/#website",
      url: "https://protonest.co/",
      name: "Protonest",
      publisher: {
        "@id": "https://protonest.co/#organization",
      },
      inLanguage: "en",
    },
    {
      "@type": "ContactPage",
      "@id": "https://protonest.co/contact-us#webpage",
      url: "https://protonest.co/contact-us",
      name: "Contact | Protonest",
      description: "Share your product idea, technical requirement, or project scope.",
      isPartOf: {
        "@id": "https://protonest.co/#website",
      },
      about: {
        "@id": "https://protonest.co/#organization",
      },
      mainEntity: {
        "@id": "https://protonest.co/#organization",
      },
      breadcrumb: {
        "@id": "https://protonest.co/contact-us#breadcrumb",
      },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://protonest.co/contact-us#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://protonest.co/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: "https://protonest.co/contact-us",
        },
      ],
    },
  ],
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
