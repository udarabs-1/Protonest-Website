import type { Metadata } from "next";

const description =
  "Protonest is an IoT product development company helping startups, companies, and product teams turn connected product ideas into reliable systems.";

export const metadata: Metadata = {
  title: "About | Protonest",
  description,
  alternates: {
    canonical: "https://protonest.co/about",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://protonest.co/about",
    siteName: "Protonest",
    title: "About | Protonest",
    description,
    images: [
      {
        url: "/og-image-home.png",
        width: 1200,
        height: 630,
        alt: "About Protonest IoT product development company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Protonest",
    description,
    images: ["/og-image-home.png"],
  },
};

const aboutJsonLd = {
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
      description,
      foundingDate: "2023",
      sameAs: [
        "https://lk.linkedin.com/company/protonestiot",
        "https://www.youtube.com/channel/UCe-RO03jOqiEAClVACUno2A/about",
        "https://x.com/ProtonestIoT",
        "https://www.facebook.com/profile.php?id=61562590660146",
      ],
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
      "@type": "AboutPage",
      "@id": "https://protonest.co/about#webpage",
      url: "https://protonest.co/about",
      name: "About | Protonest",
      description,
      isPartOf: {
        "@id": "https://protonest.co/#website",
      },
      about: {
        "@id": "https://protonest.co/#organization",
      },
      mainEntity: {
        "@id": "https://protonest.co/#organization",
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://protonest.co/og-image-home.png",
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        "@id": "https://protonest.co/about#breadcrumb",
      },
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": "https://protonest.co/about#udara-kumarasena",
      name: "Udara Kumarasena",
      jobTitle: "Chief Executive Officer",
      worksFor: {
        "@id": "https://protonest.co/#organization",
      },
      image: {
        "@type": "ImageObject",
        url: "https://protonest.co/profile.jpg",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://protonest.co/about#breadcrumb",
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
          name: "About Protonest",
          item: "https://protonest.co/about",
        },
      ],
    },
  ],
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
