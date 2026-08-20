import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import FinalCTA from "../../components/final-cta";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PageHero from "../../components/page-hero";
import SectionHeader from "../../components/section-header";
import {
  ShieldCheck,
  Boxes,
  Workflow,
  Handshake,
  CircuitBoard,
  Cpu,
  Smartphone,
  Cloud,
  FlaskConical,
} from "lucide-react";
import {} from "lucide-react";

const whyProtonestIcons = [ShieldCheck, Boxes, Workflow, Handshake];

const serviceIcons = [
  CircuitBoard,
  Cpu,
  Smartphone,
  Cloud,
  ShieldCheck,
  FlaskConical,
];

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
    question:
      "Who will be our main point of contact during the access control project?",
    answer:
      "A Project Manager will be assigned to ensure smooth communication between your team and ours",
  },
  {
    question:
      "How do you provide visibility into the ongoing work of our access control project?",
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
    question:
      "How is post-development support given for access control projects?",
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

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative flex min-h-[80svh] w-full items-center overflow-hidden bg-[#F8F7FC] px-4 py-12 sm:px-8 sm:py-14 lg:px-[60px] lg:py-16 xl:px-[133px] 2xl:px-[180px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-[320px] w-[320px] rounded-full bg-[#5530FA]/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-[#F51DA5]/10 blur-[110px]"
      />

      <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <h1 className="max-w-2xl font-montserrat text-[30px] font-medium leading-tight text-[#6C6C6C] sm:text-[34px] lg:text-[38px] xl:text-[45px]">
            IoT Product Development for{" "}
            <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
              Access Control Systems
            </span>
          </h1>

          <p className="mt-6 max-w-xl font-poppins text-[15px] font-normal leading-relaxed text-[#6C6C6C] lg:text-[17px]">
            Protonest provides IoT product development services to help
            companies in the access control industry build security-first smart
            systems.
          </p>

          <Link
            href="/contact-us#book-a-call"
            className="mt-8 inline-flex h-[56px] items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5530FA] to-[#F51DA5] px-8 font-poppins text-[15px] font-medium text-white transition-all duration-300 hover:shadow-[0_12px_30px_rgba(85,48,250,0.20)]"
          >
            Book a Call
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[680px] lg:max-w-none">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] sm:rounded-[30px]">
            <Image
              src="/access-control.png"
              alt="Access control IoT product development by Protonest"
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Introduction                                                               */
/* -------------------------------------------------------------------------- */

function Intro() {
  return (
    <section className="w-full px-4 py-14 sm:px-8 md:py-16 lg:px-[60px] lg:py-20 xl:px-[133px] 2xl:px-[180px]">
      <div className="mx-auto grid max-w-[1280px] gap-8 border-y border-[#E7E3F0] py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-14">
        <h2 className="max-w-xl font-montserrat text-[28px] font-medium leading-tight text-[#333333] sm:text-[34px] lg:text-[42px]">
          Build{" "}
          <span className="bg-gradient-to-r from-[#5530FA] to-[#F51DA5] bg-clip-text text-transparent">
            secure access control products
          </span>{" "}
          all in one place
        </h2>

        <div className="flex items-center">
          <p className="font-poppins text-[15px] font-normal leading-relaxed text-[#6C6C6C] lg:text-[17px]">
            Smart access control systems need to bring together hardware,
            software, and cloud systems, with adequate security planning.
            Protonest helps product teams bring all these functions together to
            transform prototypes into usable products.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Client proof                                                               */
/* -------------------------------------------------------------------------- */

function ClientProof() {
  return (
    <section className="w-full px-4 py-12 sm:px-8 md:py-16 lg:px-[60px] lg:py-20 xl:px-[133px] 2xl:px-[180px]">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#211347_0%,#5530FA_55%,#F51DA5_130%)] p-6 sm:p-8 lg:rounded-[36px] lg:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <h2 className="max-w-lg font-montserrat text-[30px] font-medium leading-tight text-white sm:text-[36px] lg:text-[46px]">
            Access Control Projects
          </h2>

          <div className="rounded-[22px] bg-white p-6 sm:p-8 lg:rounded-[28px] lg:p-10">
            <div className="relative h-[42px] w-[150px]">
              <Image
                src="/client4.svg"
                alt=""
                aria-hidden="true"
                fill
                sizes="150px"
                className="object-contain object-left"
              />
            </div>

            <span className="mt-8 block font-poppins text-[13px] font-medium uppercase tracking-wide text-[#999999]">
              Related project
            </span>

            <h3 className="mt-3 font-montserrat text-[21px] font-medium leading-snug text-[#333333] sm:text-[25px]">
              Smart Door Lock System for Entryphone UK
            </h3>

            <p className="mt-4 font-poppins text-[14px] font-normal leading-relaxed text-[#6C6C6C]">
              Protonest worked on a smart door lock system for Entryphone UK.
              Read more about the work we did to help them build connected
              access control devices.
            </p>

            <a
              href="/portfolio/smart-door-lock-system-for-entryphone-uk"
              className="group mt-7 inline-flex items-center gap-2 font-poppins text-[14px] font-medium text-[#5530FA]"
            >
              <span>View project</span>

              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Problems                                                                   */
/* -------------------------------------------------------------------------- */

function ProblemsWeSolve() {
  return (
    <section className="w-full px-4 py-14 sm:px-8 md:py-16 lg:px-[60px] lg:py-20 xl:px-[133px] 2xl:px-[180px]">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div>
          <div className="lg:sticky lg:top-28">
            <h2 className="font-montserrat text-[28px] font-medium leading-tight text-[#333333] sm:text-[34px] lg:text-[42px]">
              Access control problems we help solve
            </h2>

            <div className="mt-6 space-y-4">
              <p className="font-poppins text-[14px] font-normal leading-relaxed text-[#6C6C6C] lg:text-[16px]">
                When the critical components of a smart access control system
                are developed separately by different service partners, it can
                create friction when they work together as one system.
              </p>

              <p className="font-poppins text-[14px] font-normal leading-relaxed text-[#6C6C6C] lg:text-[16px]">
                We provide you with full-stack IoT development services to help
                you bridge this gap.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DDD8EC]">
          {PROBLEMS.map((item) => (
            <article
              key={item.title}
              className="relative grid gap-4 border-b border-[#DDD8EC] py-7 pl-6 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8 sm:py-8"
            >
              <div
                aria-hidden="true"
                className="absolute left-0 top-8 h-8 w-[3px] rounded-full bg-gradient-to-b from-[#5530FA] to-[#F51DA5]"
              />

              <h3 className="font-montserrat text-[18px] font-medium leading-snug text-[#333333] sm:text-[20px]">
                {item.title}
              </h3>

              <p className="font-poppins text-[14px] font-normal leading-relaxed text-[#6C6C6C]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

function Services() {
  return (
    <section className="w-full bg-[#F7F5FC] px-4 py-14 sm:px-8 md:py-16 lg:px-[60px] lg:py-20 xl:px-[133px] 2xl:px-[180px]">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="max-w-3xl font-montserrat text-[28px] font-medium leading-tight text-[#333333] sm:text-[34px] lg:text-[42px]">
          <span className="bg-gradient-to-r from-[#5530FA] to-[#F51DA5] bg-clip-text text-transparent">
            Services{" "}
          </span>
          we provide
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
          {SERVICES.map((item, index) => {
            const isWide = index % 4 === 0 || index % 4 === 3;
            const Icon = serviceIcons[index % serviceIcons.length];

            return (
              <article
                key={item.title}
                className={`group relative min-h-[250px] overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 ${
                  isWide ? "lg:col-span-7" : "lg:col-span-5"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#5530FA]/10 via-[#F51DA5]/10 to-[#6C9AE1]/10 transition-transform duration-500 group-hover:scale-125"
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#F3EFFF] transition-colors duration-300 group-hover:bg-[#ECE6FF]">
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6 text-[#5530FA]"
                      strokeWidth={1.7}
                    />
                  </div>

                  <div className="mt-auto pt-10">
                    <h3 className="font-montserrat text-[20px] font-medium leading-snug text-[#333333] sm:text-[23px]">
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-xl font-poppins text-[14px] font-normal leading-relaxed text-[#6C6C6C]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Workflow                                                                   */
/* -------------------------------------------------------------------------- */

function HowWeWork() {
  return (
    <section className="w-full px-4 py-14 sm:px-8 md:py-16 lg:px-[60px] lg:py-20 xl:px-[133px] 2xl:px-[180px]">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="max-w-3xl font-montserrat text-[28px] font-medium leading-tight text-[#333333] sm:text-[34px] lg:text-[42px]">
          Our IoT product development workflow
        </h2>

        <ol className="relative mt-12 grid gap-0 before:absolute before:bottom-6 before:left-[21px] before:top-6 before:w-px before:bg-[#DDD8EC] lg:grid-flow-col lg:auto-cols-fr lg:before:hidden">
          {HOW_WE_WORK_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative pb-10 pl-16 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-8 lg:after:absolute lg:after:left-11 lg:after:right-0 lg:after:top-5 lg:after:h-px lg:after:bg-[#DDD8EC] lg:last:after:hidden"
            >
              <span className="absolute left-0 top-0 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gradient-to-r from-[#5530FA] to-[#F51DA5] font-montserrat text-[13px] font-medium text-white lg:relative lg:mb-6">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="font-montserrat text-[18px] font-medium leading-snug text-[#333333] lg:text-[20px]">
                {step.title}
              </h3>

              <p className="mt-3 font-poppins text-[14px] font-normal leading-relaxed text-[#6C6C6C]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Why Protonest                                                              */
/* -------------------------------------------------------------------------- */

function WhyProtonest() {
  return (
    <section className="w-full px-4 py-14 sm:px-8 md:py-16 lg:px-[60px] lg:py-20 xl:px-[133px] 2xl:px-[180px]">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-[#18151F] px-6 py-10 sm:px-8 sm:py-12 lg:rounded-[36px] lg:px-12 lg:py-16">
        <h2 className="max-w-3xl font-montserrat text-[28px] font-medium leading-tight text-white sm:text-[34px] lg:text-[42px]">
          Why access control teams work with Protonest
        </h2>

        <div className="mt-10 grid border-t border-white/10 sm:grid-cols-2">
          {WHY_PROTONEST.map((item, index) => {
            const Icon = whyProtonestIcons[index % whyProtonestIcons.length];

            return (
              <article
                key={item.title}
                className={`flex flex-col gap-5 border-b border-white/10 py-7 sm:p-8 lg:flex-row lg:items-start lg:gap-6 ${
                  index % 2 === 0 ? "sm:border-r" : ""
                }`}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[14px] bg-white/[0.07]">
                  <Icon
                    aria-hidden="true"
                    className="h-6 w-6 text-[#B9AEFF]"
                    strokeWidth={1.7}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-montserrat text-[20px] font-medium leading-snug text-white sm:text-[23px]">
                    {item.title}
                  </h3>

                  <p className="mt-3 font-poppins text-[14px] font-normal leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Resources                                                                  */
/* -------------------------------------------------------------------------- */

function UsefulResources() {
  return (
    <section className="w-full px-4 py-14 sm:px-8 md:py-16 lg:px-[60px] lg:py-20 xl:px-[133px] 2xl:px-[180px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <h2 className="max-w-2xl font-montserrat text-[28px] font-medium leading-tight text-[#333333] sm:text-[34px] lg:text-[42px]">
            Useful resources
          </h2>

          <p className="max-w-2xl font-poppins text-[14px] font-normal leading-relaxed text-[#6C6C6C] lg:justify-self-end lg:text-[16px]">
            These articles may help if you are planning a connected access
            control device, smart lock, or embedded IoT product.
          </p>
        </div>

        <ul className="mt-10 border-t border-[#DDD8EC]">
          {RESOURCES.map((resource) => (
            <li key={resource.href} className="border-b border-[#DDD8EC]">
              <Link
                href={resource.href}
                className="group grid grid-cols-[1fr_auto] items-center gap-5 py-6 transition-colors duration-300 hover:bg-[#F8F6FD] sm:px-5 sm:py-8"
              >
                <h3 className="font-montserrat text-[17px] font-medium leading-snug text-[#333333] transition-colors duration-300 group-hover:text-[#5530FA] sm:text-[20px]">
                  {resource.title}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="hidden whitespace-nowrap font-poppins text-[14px] font-medium text-[#5530FA] sm:inline">
                    View article
                  </span>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 text-[#5530FA] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.8}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQs                                                                       */
/* -------------------------------------------------------------------------- */

function FAQs() {
  return (
    <section className="w-full bg-[#F8F7FC] px-4 py-14 sm:px-8 md:py-16 lg:px-[60px] lg:py-20 xl:px-[133px] 2xl:px-[180px]">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <h2 className="max-w-xl font-montserrat text-[28px] font-medium leading-tight text-[#333333] sm:text-[34px] lg:text-[42px]">
          Frequently asked questions
        </h2>

        <div>
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group border-b border-[#DDD8EC] first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-montserrat text-[17px] font-medium leading-snug text-[#333333] sm:text-[19px]">
                  {item.question}
                </h3>

                <ChevronDown
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#5530FA] transition-transform duration-300 group-open:rotate-180"
                  strokeWidth={1.8}
                />
              </summary>

              <div className="pb-6 pr-8">
                <p className="font-poppins text-[14px] font-normal leading-relaxed text-[#6C6C6C]">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
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
      <FinalCTA
        highlightedText="IoT Development Project"
        description="Book a free call to discuss your product idea or the technical challenge. We can help you review the scope, architecture, and next steps."
      />
      <Footer />
    </div>
  );
}
