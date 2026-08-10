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
        gradientText: "IoT Product Development for Access Control Systems",
      }}
      description="Protonest helps access control companies build smart locks, connected access devices, firmware, mobile apps, cloud dashboards, and product testing systems."
      cta={{
        label: "Book a Call",
        href: "/book-a-call",
      }}
      height="h-[400px] sm:h-[480px] lg:h-[553px]"
    />
  );
}

function Intro() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader highlight="Build access control products without splitting the work across teams" />
      <div className="max-w-4xl">
        <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed">
          Access control products need hardware, firmware, software, cloud
          systems, and testing to work together. Protonest helps product teams
          build smart locks, access devices, dashboards, and mobile app
          features from prototype to usable product.
        </p>
      </div>
    </section>
  );
}

function ClientProof() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader highlight="Access control product work" />
      <div className="max-w-4xl rounded-[24px] overflow-hidden bg-white shadow-lg">
        <div className="p-6 sm:p-8 flex flex-col gap-3">
          <span className="text-[13px] font-medium font-poppins uppercase tracking-wide text-[#999999]">
            Related project
          </span>
          <h3 className="text-[18px] font-medium font-montserrat bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
            Smart Door Lock System for Entryphone UK
          </h3>
          <p className="text-[14px] font-normal font-poppins text-[#6C6C6C] leading-relaxed">
            Protonest worked on a smart door lock system for Entryphone UK. The
            project is relevant to access control product teams building
            connected devices, firmware, and system-level product features.
          </p>
          <a
            href="/portfolio/smart-door-lock-system-for-entryphone-uk"
            className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] transition-all duration-300"
          >
            <span className="underline">View project</span> &gt;
          </a>
        </div>
      </div>
    </section>
  );
}

const PROBLEMS = [
  {
    title: "Device connection issues",
    body: "Smart locks and access devices need stable communication between the device, app, and backend. We help plan and test that connection.",
  },
  {
    title: "Battery drain",
    body: "Access devices often need to run for long periods without charging. We help improve power use through hardware and firmware decisions.",
  },
  {
    title: "Firmware bugs",
    body: "Lock states, access rules, alerts, and recovery flows depend on reliable firmware. We help build and test firmware for real product use.",
  },
  {
    title: "App and device sync issues",
    body: "Access permissions, device status, and logs need to update correctly. We help connect the app, device, and backend with clear data flow.",
  },
  {
    title: "Missing dashboards",
    body: "Product teams often need dashboards for devices, users, logs, alerts, and settings. We help build those systems.",
  },
  {
    title: "Weak prototype handoff",
    body: "A working demo is not the same as a usable product. We help improve prototypes for stability, testing, and real use.",
  },
];

const BUILDS = [
  {
    title: "Smart lock systems",
    body: "We help build smart lock products across hardware, firmware, app features, cloud connection, and testing.",
  },
  {
    title: "Door access control devices",
    body: "We support connected devices for doors, shared spaces, commercial buildings, and controlled entry points.",
  },
  {
    title: "Mobile access systems",
    body: "We build app features for device setup, lock control, user access, lock status, and product settings.",
  },
  {
    title: "Cloud-connected controllers",
    body: "We help connect access control hardware to backend systems for remote control, alerts, users, and device updates.",
  },
  {
    title: "Access monitoring dashboards",
    body: "We build dashboards for device status, access logs, users, permissions, alerts, and product settings.",
  },
  {
    title: "Biometric access control systems",
    body: "We support biometric access products where hardware, firmware, software, and backend logic need to work together.",
  },
];

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] overflow-hidden bg-white shadow-lg flex flex-col h-full">
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[18px] font-medium font-montserrat bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent mb-3">
          {title}
        </h3>
        <p className="text-[14px] font-normal font-poppins text-[#6C6C6C] leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}

function ProblemsWeSolve() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader highlight="Access control problems we help solve" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed max-w-4xl mb-10">
        Many access control products fail because the device, app, and backend
        are built separately. We help product teams fix these gaps before they
        become real user problems.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {PROBLEMS.map((item) => (
          <Card key={item.title} title={item.title} body={item.body} />
        ))}
      </div>
    </section>
  );
}

function WhatWeBuild() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader highlight="What we build for access control companies" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed max-w-4xl mb-10">
        Protonest helps access control companies build connected devices and
        software for entry control, device monitoring, user access, and product
        management.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {BUILDS.map((item) => (
          <Card key={item.title} title={item.title} body={item.body} />
        ))}
      </div>
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
      <Footer />
    </div>
  );
}
