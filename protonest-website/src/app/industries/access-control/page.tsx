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
      description={
        <>
          <span className="block">
            Protonest provides IoT product development services to help
            companies in the access control industry build security-first smart
            systems.
          </span>
          <span className="block mt-3">
            A defining feature of any access control system is its ability to
            consistently maintain a high level of security. By collaborating
            closely with expert security partners, we are well equipped to
            ensure that security is integrated into the system from the very
            earliest stages of development.
          </span>
        </>
      }
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
      <SectionHeader highlight="Build secure access control products all in one place" />
      <div className="max-w-4xl">
        <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed">
          Smart access control systems need to bring together hardware,
          software, and cloud systems, with adequate security planning.
          Protonest helps product teams bring all these functions together to
          transform prototypes into usable products.
        </p>
      </div>
    </section>
  );
}

function ClientProof() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader highlight="Access Control Projects" />
      <div className="max-w-4xl rounded-[24px] overflow-hidden bg-white shadow-lg">
        <div className="p-6 sm:p-8 flex flex-col gap-3">
          <span className="text-[13px] font-medium font-poppins uppercase tracking-wide text-[#999999]">
            Related project
          </span>
          <h3 className="text-[18px] font-medium font-montserrat bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
            Smart Door Lock System for Entryphone UK
          </h3>
          <p className="text-[14px] font-normal font-poppins text-[#6C6C6C] leading-relaxed">
            Protonest worked on a smart door lock system for Entryphone UK. Read
            more about the work we did to help them build connected access
            control devices.
          </p>
          <a
            href="https://www.protonest.co/portfolio/project/smart-door-lock-system-for-entryphone,-uk"
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
    body: "Plan and test stable communication between the device, app, and backend.",
  },
  {
    title: "Firmware and recovery failures",
    body: "Build and test firmware for lock states, access rules, alerts, and recovery.",
  },
  {
    title: "App and device sync issues",
    body: "Connect access permissions, device status, and logs through a clear data flow.",
  },
  {
    title: "Security considered too late",
    body: "Bring security input into product decisions early through our security partnership.",
  },
  {
    title: "Missing product management tools",
    body: "Build dashboards for devices, users, permissions, logs, alerts, and settings.",
  },
  {
    title: "Weak prototype handoff",
    body: "Improve prototypes for stability, testing, and real use.",
  },
];

const SERVICES = [
  {
    title: "Hardware design",
    body: "Design or improve existing smart locks, sensor inputs, and enclosures.",
  },
  {
    title: "Embedded firmware development",
    body: "Develop firmware logic for device control, connectivity, and alerts.",
  },
  {
    title: "Web dashboard development",
    body: "Build dashboards to control locks remotely, update devices, manage user access, view device status, and receive alerts.",
  },
  {
    title: "Mobile app development",
    body: "Build mobile apps with features for controlling locks, viewing access options, device status, and product settings",
  },
  {
    title: "Cloud and backend development",
    body: "Develop the cloud backend and deploy to connect devices with apps and dashboards.",
  },
  {
    title: "Security input",
    body: "Embed security-related measures in the relevant stages of product development.",
  },
  {
    title: "Testing and product improvement",
    body: "Test device behaviour, firmware, app flows, connectivity, and failure cases, then improve the product.",
  },
];

const HOW_WE_WORK_STEPS = [
  {
    title: "Understand the product",
    body: "We review the use case, device needs, and security needs thoroughly to understand the client's product goals.",
  },
  {
    title: "Plan the system",
    body: "We map how the hardware, firmware, software, and security requirements should work together.",
  },
  {
    title: "Build and test",
    body: "We build the required product parts and test for functionality and any possible failure cases.",
  },
  {
    title: "Improve for real use",
    body: "We refine the product through testing, feedback, and end-user needs.",
  },
];

const WHY_PROTONEST = [
  {
    title: "One product team",
    body: "We handle the full-stack IoT development lifecycle, starting from hardware design to backend development and testing.",
  },
  {
    title: "Security-first input",
    body: "Our expert security partners bring valuable insights to the product development process from the early stages",
  },
  {
    title: "Relevant experience",
    body: "We have previous experience catering to the requirements of international clients working on access control projects.",
  },
  {
    title: "Built past the demo",
    body: "Our team will support you in moving your product from the prototype stage to a production-grade output.",
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
    question: "Who will be our main point of contact during the access control project?",
    answer:
      "A Project Manager will be assigned to ensure smooth communication between your team and ours",
  },
  {
    question: "How do you provide visibility into the ongoing work of our access control project?",
    answer:
      "We can provide you with weekly progress updates, demo builds, and read-only access to repositories.",
  },
  {
    question: "Do you work under NDAs?",
    answer:
      "Yes, we can enter into a non-disclosure agreement depending on your requirement.",
  },
  {
    question: "How does your revision policy work?",
    answer:
      "We provide up to 2 major revisions during projects and minor adjustments as part of ongoing development cycles.",
  },
  {
    question: "How is post-development support given for access control projects?",
    answer:
      "We will provide short term scopes on an adhoc basis and long term support on a contract basis.",
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
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed max-w-4xl">
        When the critical components of a smart access control system are
        developed separately by different service partners, it can create
        friction when they work together as one system.
      </p>
      <p className="text-[14px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed max-w-4xl mb-10">
        We provide you with full-stack IoT development services to help you
        bridge this gap.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {PROBLEMS.map((item) => (
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
      <SectionHeader highlight="Our IoT product development workflow" />
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
      <Services />
      <HowWeWork />
      <WhyProtonest />
      <UsefulResources />
      <FAQs />
      <Footer />
    </div>
  );
}
