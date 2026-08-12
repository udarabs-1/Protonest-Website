import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageHero from "../../components/page-hero";
import SectionHeader from "../../components/section-header";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.protonest.co"),
  title: "Access Control IoT Development | Protonest",
  description:
    "Build smart locks, access control devices, firmware, mobile apps, cloud dashboards, and connected security products with Protonest.",
  alternates: {
    canonical: "https://www.protonest.co/industries/access-control",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://www.protonest.co/industries/access-control",
    siteName: "Protonest",
    title: "Access Control IoT Development | Protonest",
    description:
      "Build smart locks, access control devices, firmware, mobile apps, cloud dashboards, and connected security products with Protonest.",
    images: [
      {
        url: "https://www.protonest.co/protonest-opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Protonest access control IoT development services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Access Control IoT Development | Protonest",
    description:
      "Build smart locks, access control devices, firmware, mobile apps, cloud dashboards, and connected security products with Protonest.",
    images: ["https://www.protonest.co/protonest-opengraph-image.jpg"],
  },
};

function Hero() {
  return (
    <PageHero
      backgroundImage="/access-control.png"
      backgroundAlt="Access control IoT product development by Protonest"
      heading={{
        gradientText: "IoT Product Development for Access Control Systems",
      }}
      description="Protonest helps access control companies build smart locks, connected access devices, firmware, mobile apps, cloud dashboards, and product testing systems."
      darkOverlay
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

const SERVICES = [
  {
    title: "Hardware design",
    body: "We help design and improve connected lock devices, controllers, sensor inputs, and enclosures.",
  },
  {
    title: "Embedded firmware development",
    body: "We develop firmware for device control, lock states, connectivity, power use, alerts, and product logic.",
  },
  {
    title: "Mobile app development",
    body: "We build app features for setup, lock control, user access, device status, and notifications.",
  },
  {
    title: "Web dashboard development",
    body: "We build dashboards for access logs, device status, user roles, permissions, alerts, and product settings.",
  },
  {
    title: "Cloud and backend development",
    body: "We build backend systems that connect devices, apps, dashboards, access events, and users.",
  },
  {
    title: "Testing",
    body: "We test device behaviour, firmware stability, app flows, connectivity, and failure cases.",
  },
  {
    title: "Product improvement",
    body: "We help improve existing prototypes so they work better in real use.",
  },
];

const HOW_WE_WORK_STEPS = [
  {
    title: "Understand the product",
    body: "We review the use case, users, access flow, device needs, power limits, and product goals.",
  },
  {
    title: "Plan the system",
    body: "We map how the hardware, firmware, app, backend, dashboard, and data should work together.",
  },
  {
    title: "Build the prototype",
    body: "We build the hardware, firmware, app, backend, or dashboard needed for the first working version.",
  },
  {
    title: "Test the behaviour",
    body: "We test lock control, connectivity, access states, alerts, logs, app flows, and failure cases.",
  },
  {
    title: "Improve the product",
    body: "We refine the product based on testing, feedback, and real use needs.",
  },
];

const WHY_PROTONEST = [
  {
    title: "One team across the product",
    body: "We can support hardware, firmware, embedded systems, mobile apps, dashboards, backend systems, and testing.",
  },
  {
    title: "Relevant access control work",
    body: "We have worked on smart door lock and access control product work for an international client.",
  },
  {
    title: "Prototype support",
    body: "We help teams move past the demo stage and improve the product for real use.",
  },
  {
    title: "Practical engineering",
    body: "We focus on device control, connection stability, power use, access logs, and user experience.",
  },
];

const RESOURCES = [
  {
    title: "Selecting a perfect battery for an IoT project",
    href: "/blog/selecting-a-perfect-battery-for-an-iot-project",
  },
  {
    title: "Communication method for an IoT project: selection guide",
    href: "/blog/communication-method-for-an-iot-project-selection-guide",
  },
  {
    title: "Selecting the perfect cloud backend for an IoT project",
    href: "/blog/selecting-the-perfect-cloud-backend-for-an-iot-project",
  },
  {
    title: "PCB component management system",
    href: "/blog/pcb-component-management-system",
  },
];

const FAQ_ITEMS = [
  {
    question: "Can Protonest build custom IoT hardware for access control systems?",
    answer:
      "Yes. Protonest can support custom hardware for smart locks, controllers, sensors, and connected access devices.",
  },
  {
    question: "Do you develop firmware for smart locks and access control devices?",
    answer:
      "Yes. We develop firmware for lock control, device states, connectivity, power use, alerts, and access logic.",
  },
  {
    question: "Can you connect access control devices to mobile apps?",
    answer:
      "Yes. We can build app features for setup, lock control, user access, device status, notifications, and settings.",
  },
  {
    question: "Can you build a dashboard for access logs and device monitoring?",
    answer:
      "Yes. We can build backend systems and dashboards for logs, device status, users, alerts, roles, and permissions.",
  },
  {
    question: "Do you work with biometric access control systems?",
    answer:
      "Yes. We can support biometric access products where hardware, firmware, backend, and user software need to work together.",
  },
  {
    question: "Can you improve an existing access control prototype?",
    answer:
      "Yes. We can review the hardware, firmware, app, backend, and testing gaps, then help improve the product.",
  },
];

const accessControlJsonLd = {
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
      description:
        "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, automobile, and other industries.",
      sameAs: [
        "https://lk.linkedin.com/company/protonestiot",
        "https://www.youtube.com/channel/UCe-RO03jOqiEAClVACUno2A/about",
        "https://x.com/ProtonestIoT",
        "https://www.facebook.com/profile.php?id=61562590660146",
      ],
      knowsAbout: [
        "IoT development services",
        "IoT product development",
        "IoT hardware development",
        "embedded systems development",
        "firmware development",
        "custom software solutions",
        "IoT consulting services",
        "access control IoT",
        "industrial IoT monitoring",
        "automotive IoT",
        "wearable IoT",
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
      "@type": "WebPage",
      "@id": "https://protonest.co/industries/access-control#webpage",
      url: "https://protonest.co/industries/access-control",
      name: "Access Control IoT Development | Protonest",
      description:
        "Build smart locks, access control devices, firmware, mobile apps, cloud dashboards, and connected security products with Protonest.",
      isPartOf: {
        "@id": "https://protonest.co/#website",
      },
      about: {
        "@id": "https://protonest.co/#organization",
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://protonest.co/protonest-opengraph-image.jpg",
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        "@id": "https://protonest.co/industries/access-control#breadcrumb",
      },
    },
    {
      "@type": "Service",
      "@id": "https://protonest.co/industries/access-control#service",
      name: "Access Control IoT Development",
      serviceType: "IoT product development for access control systems",
      provider: {
        "@id": "https://protonest.co/#organization",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Access Control IoT Development Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Smart lock product development",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Embedded firmware development",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Mobile app development for access control products",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Dashboard development for access control products",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "IoT product testing",
            },
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://protonest.co/industries/access-control#breadcrumb",
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
          name: "Industries",
          item: "https://protonest.co/industries",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Access Control",
          item: "https://protonest.co/industries/access-control",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

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
      <SectionHeader highlight="Services for access control products" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed max-w-4xl mb-10">
        Protonest can support the main technical parts of an access control
        product, from device hardware to connected software.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {SERVICES.map((item) => (
          <Card key={item.title} title={item.title} body={item.body} />
        ))}
      </div>
    </section>
  );
}

function HowWeWork() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader highlight="How we build access control IoT products" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed max-w-4xl mb-10">
        We help teams move from product idea or prototype to tested connected
        product.
      </p>
      <ol className="space-y-6">
        {HOW_WE_WORK_STEPS.map((step, index) => (
          <li
            key={step.title}
            className="rounded-[24px] overflow-hidden bg-white shadow-lg flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 p-6 sm:p-8"
          >
            <span className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] text-white text-[16px] font-medium font-montserrat flex items-center justify-center">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-[18px] font-medium font-montserrat bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent mb-3">
                {step.title}
              </h3>
              <p className="text-[14px] font-normal font-poppins text-[#6C6C6C] leading-relaxed">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function WhyProtonest() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader highlight="Why access control teams work with Protonest" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed max-w-4xl mb-10">
        Protonest is useful when your product needs hardware, firmware,
        software, and testing to work together.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
        {WHY_PROTONEST.map((item) => (
          <Card key={item.title} title={item.title} body={item.body} />
        ))}
      </div>
    </section>
  );
}

function UsefulResources() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader highlight="Useful resources for access control product teams" />
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed max-w-4xl mb-10">
        These articles may help if you are planning a connected access control
        device, smart lock, or embedded IoT product.
      </p>
      <ul className="space-y-6">
        {RESOURCES.map((resource) => (
          <li key={resource.href}>
            <Link
              href={resource.href}
              className="group rounded-[24px] overflow-hidden bg-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8"
            >
              <h3 className="text-[18px] font-medium font-montserrat bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                {resource.title}
              </h3>
              <span className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] transition-all duration-300 whitespace-nowrap">
                <span className="underline">View article</span> &gt;
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FAQs() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader highlight="FAQs about access control IoT development" />
      <div className="space-y-6">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="rounded-[24px] overflow-hidden bg-white shadow-lg p-6 sm:p-8"
          >
            <h3 className="text-[18px] font-medium font-montserrat bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent mb-3">
              {item.question}
            </h3>
            <p className="text-[14px] font-normal font-poppins text-[#6C6C6C] leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
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
