import type { Metadata } from "next";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageHero from "../../components/page-hero";
import SectionHeader from "../../components/section-header";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://protonest.co"
  ),
  title: "Access Control IoT Development Services | Protonest",
  description:
    "Protonest designs and develops secure, reliable access control IoT products — smart locks, door access control, and connected access systems.",
  alternates: {
    canonical: "https://protonest.co/industries/access-control",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://protonest.co/industries/access-control",
    siteName: "Protonest",
    title: "Access Control IoT Development Services | Protonest",
    description:
      "Protonest designs and develops secure, reliable access control IoT products — smart locks, door access control, and connected access systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Access Control IoT Development Services | Protonest",
    description:
      "Protonest designs and develops secure, reliable access control IoT products — smart locks, door access control, and connected access systems.",
  },
};

const accessControlJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://protonest.co/industries/access-control#service",
  name: "Access Control IoT Development Services",
  serviceType: "Access control IoT development",
  provider: {
    "@id": "https://protonest.co/#organization",
  },
  url: "https://protonest.co/industries/access-control",
  areaServed: {
    "@type": "Place",
    name: "Global",
  },
  audience: {
    "@type": "BusinessAudience",
    audienceType:
      "Global startups, companies, product teams, and engineering teams building access control IoT products",
  },
  description:
    "Protonest helps you build smart lock, door access control, and connected access control system products that are secure, reliable, and easy to manage.",
};

function Hero() {
  return (
    <PageHero
      backgroundImage="/access-control.png"
      heading={{
        beforeGradient: "Access Control",
        gradientText: "IoT Development Services",
      }}
      description="Secure, reliable, and easy-to-manage connected access control products built end to end."
      height="h-[400px] sm:h-[480px] lg:h-[553px]"
    />
  );
}

function Intro() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="Access Control" highlight="IoT Solutions" />
      <div className="max-w-4xl">
        <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed">
          Intro content coming soon.
        </p>
      </div>
    </section>
  );
}

function ClientProof() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="Trusted by Teams Building" highlight="Access Control Products" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)]">
        Client proof content coming soon.
      </p>
    </section>
  );
}

function ProblemsWeSolve() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="Problems" highlight="We Solve" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)]">
        Problems we solve content coming soon.
      </p>
    </section>
  );
}

function WhatWeBuild() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="What" highlight="We Build" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)]">
        What we build content coming soon.
      </p>
    </section>
  );
}

function Services() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="Services for" highlight="Access Control" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)]">
        Services content coming soon.
      </p>
    </section>
  );
}

function HowWeWork() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="How" highlight="We Work" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)]">
        How we work content coming soon.
      </p>
    </section>
  );
}

function WhyProtonest() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="Why" highlight="Protonest" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)]">
        Why Protonest content coming soon.
      </p>
    </section>
  );
}

function UsefulResources() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="Useful" highlight="Resources" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)]">
        Useful resources content coming soon.
      </p>
    </section>
  );
}

function FAQs() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="Frequently Asked" highlight="Questions" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)]">
        FAQs content coming soon.
      </p>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="w-full py-16 md:py-20 lg:py-24 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] text-center">
      <h2 className="text-[24px] lg:text-[30px] xl:text-[36px] font-medium font-montserrat mb-4">
        <span className="text-[rgba(108,108,108,1)]">Let&apos;s Talk About Your </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
          Access Control Project
        </span>
      </h2>
      <p className="text-[15px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] max-w-2xl mx-auto mb-8">
        Book a free call to discuss your product idea or the technical challenge.
      </p>
      <a
        href="/contact-us#book-a-call"
        className="inline-flex items-center justify-center w-[220px] h-[55px] lg:h-[60px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 font-poppins font-medium text-[15px] lg:text-[16px]"
      >
        Book a Free Call
      </a>
    </section>
  );
}

export default function AccessControlPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(accessControlJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <Hero />
      <Intro />
      <ClientProof />
      <ProblemsWeSolve />
      <WhatWeBuild />
      <Services />
      <HowWeWork />
      <WhyProtonest />
      <UsefulResources />
      <FAQs />
      <FinalCTA />
      <Footer />
    </div>
  );
}
