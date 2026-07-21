import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ClientMarquee from "./components/client-marquee";
import ClientsMap from "./components/clients-map";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import NewsAndBlogs from "./components/news-and-blogs";
import ProjectSlider from "./components/projects-slider";
import SectionHeader from "./components/section-header";
import ServicesSection from "./components/services";
import StatsSection from "./components/stats-section";
import TestimonialSection from "./components/testimonials";
import WhyChooseProtonest from "./components/why-choose";

export const metadata: Metadata = {
  metadataBase: new URL("https://protonest.co"),
  title: "IoT Development Services for Global Product Teams | Protonest",
  description:
    "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, automobile, and other industries.",
  alternates: {
    canonical: "https://protonest.co/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://protonest.co/",
    siteName: "Protonest",
    title: "IoT Development Services for Global Product Teams | Protonest",
    description:
      "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, automobile, and other industries.",
    images: [
      {
        url: "https://protonest.co/og-image-home.png",
        width: 1200,
        height: 630,
        alt: "Protonest IoT development services for global product teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IoT Development Services for Global Product Teams | Protonest",
    description:
      "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, automobile, and other industries.",
    images: ["https://protonest.co/og-image-home.png"],
  },
};

const homeJsonLd = {
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
      "@id": "https://protonest.co/#webpage",
      url: "https://protonest.co/",
      name: "IoT Development Services for Global Product Teams | Protonest",
      description:
        "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, automobile, and other industries.",
      isPartOf: {
        "@id": "https://protonest.co/#website",
      },
      about: {
        "@id": "https://protonest.co/#organization",
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://protonest.co/og-image-home.png",
        width: 1200,
        height: 630,
      },
      mainEntity: {
        "@id": "https://protonest.co/#iot-development-services",
      },
    },
    {
      "@type": "Service",
      "@id": "https://protonest.co/#iot-development-services",
      name: "IoT Development Services",
      serviceType: "IoT development services",
      provider: {
        "@id": "https://protonest.co/#organization",
      },
      areaServed: {
        "@type": "Place",
        name: "Global",
      },
      audience: {
        "@type": "BusinessAudience",
        audienceType:
          "Global startups, companies, product teams, and engineering teams",
      },
      description:
        "Protonest provides IoT development services across IoT product strategy, IoT hardware development, embedded systems, firmware, custom software, testing, product validation, IoT consulting, and post-launch support.",
      serviceOutput: [
        "IoT product development plan",
        "IoT hardware design",
        "Firmware and embedded systems",
        "Cloud software and dashboards",
        "Product testing and validation",
        "IoT consulting and support",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Protonest IoT Development Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "IoT Product Strategy",
              description:
                "IoT product development planning, product design direction, feature scope, technical direction, and delivery roadmap support.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "IoT Hardware Development",
              description:
                "IoT hardware, sensors, electronics, enclosures, and system architecture for connected products.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Firmware and Embedded Systems Development",
              description:
                "Embedded systems, firmware, device logic, communication modules, and sensor integrations for real product use.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Software and Dashboard Development",
              description:
                "Custom software solutions that connect IoT devices to cloud platforms, dashboards, mobile apps, and monitoring systems.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Testing and Product Validation",
              description:
                "Connectivity, reliability, performance, power usage, and product readiness testing before launch.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "IoT Consulting and Support",
              description:
                "IoT consulting services for architecture decisions, product direction, troubleshooting, updates, and post-launch improvements.",
            },
          },
        ],
      },
    },
  ],
};

const HIGHLIGHT_STATS = [
  { value: 100, suffix: "+", label: "IoT Development Projects" },
  { value: 100, suffix: "+", label: "Satisfied Clients" },
  { value: 3, suffix: "+", label: "Years in the Industry" },
  { value: 7, suffix: "+", label: "Countries Around the World" },
];

const countryFlags = [
  { emoji: "🇬🇧", label: "Protonest client work in the United Kingdom" },
  { emoji: "🇩🇪", label: "Protonest client work in Germany" },
  { emoji: "🇫🇷", label: "Protonest client work in France" },
  { emoji: "🇮🇹", label: "Protonest client work in Italy" },
  { emoji: "🇺🇸", label: "Protonest client work in the United States" },
];

const industries = [
  {
    slug: "access-control",
    title: "Access Control",
    image: "/access-control.png",
    alt: "Protonest access control IoT development services",
    description:
      "We help you build smart lock, door access control, and connected access control system products that are secure, reliable, and easy to manage.",
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    image: "/manufacturing.png",
    alt: "Protonest industrial IoT monitoring and factory automation support",
    description:
      "We support factory automation, industrial IoT monitoring, and predictive maintenance systems that help teams track equipment, data, and performance.",
  },
  {
    slug: "automobile",
    title: "Automobile",
    image: "/automobile.png",
    alt: "Protonest automotive IoT and vehicle telematics development",
    description:
      "We build automotive IoT, vehicle telematics, GPS tracking, and connected mobility systems for vehicles, fleets, and transport products.",
  },
  {
    slug: "sports",
    title: "Sports",
    image: "/sports.png",
    alt: "Protonest wearable IoT and sports technology development",
    description:
      "We develop wearable IoT, athlete tracking, smart sports equipment, and connected performance systems for physical sports and training environments.",
  },
];

function LargeScreenHeroSection() {
  return (
    <div className="hidden lg:block">
      <div className="mt-[70px] h-full relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-1.webp"
            alt="Protonest IoT development services"
            fill
            priority={true}
            quality={75}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>

        <div className="flex flex-col items-center justify-center h-full px-[60px] xl:px-[133px] 2xl:px-[180px] relative z-10 py-20 xl:py-24">
          <div className="flex items-center justify-center mb-6">
            {countryFlags.map((flag, i) => (
              <span
                key={flag.label}
                role="img"
                aria-label={flag.label}
                className="text-4xl w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-md border-2 border-white select-none"
                style={{
                  zIndex: countryFlags.length - i,
                  marginLeft: i > 0 ? "-10px" : "0",
                }}
              >
                {flag.emoji}
              </span>
            ))}
          </div>

          <h1 className="text-center lg:text-[38px] xl:text-[45px] font-medium font-montserrat leading-tight">
            <span className="text-[rgba(108,108,108,1)]">
              Reliable IoT Development Partner
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
              for Global Teams
            </span>
          </h1>

          <p className="text-center text-[16px] xl:text-[18px] font-normal font-poppins mt-8 px-[200px] xl:px-[320px] text-[rgba(108,108,108,1)]">
            Protonest provides IoT development services for global startups,
            companies, and businesses across access control, manufacturing,
            automobile, and other industries.
          </p>

          <div className="flex justify-center space-x-[33px] mt-8 h-[60px] xl:h-[65px] font-poppins font-medium text-[15px] xl:text-[16px]">
            <Link
              href="/contact-us#get-in-touch"
              className="w-[280px] xl:w-[312px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 flex items-center justify-center"
            >
              Start Your IoT Project
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-[60px] h-[480px] relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-2.svg"
            alt=""
            fill
            priority={false}
            quality={70}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="flex flex-col items-start justify-start h-full px-[60px] xl:px-[133px] 2xl:px-[180px]">
          <SectionHeader
            prefix="Trusted by Companies Building"
            highlight="Connected Products"
            description="We've built IoT products for many innovative companies. When they build, they build with us."
            linkLabel="About Us"
            linkHref="/about-us"
          />
          <ClientMarquee />
        </div>
      </div>
    </div>
  );
}

function SmallScreenHeroSection() {
  return (
    <div className="lg:hidden">
      <div className="mt-14 sm:mt-[70px] h-[500px] sm:h-[560px] relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-1.webp"
            alt="Protonest IoT development services"
            fill
            priority={true}
            quality={70}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>

        <div className="flex flex-col items-center justify-center h-full px-4 sm:px-8 relative z-10">
          <div className="flex items-center justify-center mb-5">
            {countryFlags.map((flag, i) => (
              <span
                key={flag.label}
                role="img"
                aria-label={flag.label}
                className="text-3xl w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md border-2 border-white select-none"
                style={{
                  zIndex: countryFlags.length - i,
                  marginLeft: i > 0 ? "-8px" : "0",
                }}
              >
                {flag.emoji}
              </span>
            ))}
          </div>

          <h1 className="text-center text-[28px] sm:text-[30px] md:text-[32px] font-medium font-montserrat leading-tight">
            <span className="text-[rgba(108,108,108,1)]">
              Reliable IoT Development Partner
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
              for Global Teams
            </span>
          </h1>

          <p className="text-center text-[14px] font-normal font-poppins mt-5 sm:mt-6 px-4 sm:px-8 text-[rgba(108,108,108,1)]">
            Protonest provides IoT development services for global startups,
            companies, and businesses across access control, manufacturing,
            automobile, and other industries.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 font-poppins font-medium text-[14px]">
            <Link href="/contact-us#get-in-touch">
              <button className="w-[230px] sm:w-[280px] h-[50px] sm:h-[55px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[30px] sm:rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                Start Your IoT Project
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 min-h-[400px] relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-2.svg"
            alt=""
            fill
            priority={false}
            quality={65}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="flex flex-col items-start justify-start h-full px-4 sm:px-8 py-8">
          <div aria-hidden="true" className="flex justify-start mb-6">
            <div className="text-[24px] sm:text-[26px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Trusted by Companies Building{" "}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Connected Products
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start w-full mb-8 gap-4">
            <p className="text-[14px] font-normal font-poppins text-[rgba(108,108,108,1)]">
              We&#39;ve built IoT products for many innovative companies. When
              they build, they build with us.
            </p>
            <Link href="/about-us">
              <div className="text-[14px] lg:text-[18px] font-normal font-poppins cursor-pointer text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] transition-all duration-300">
                <span className="underline">About Us</span> &gt;
              </div>
            </Link>
          </div>
          <ClientMarquee />
        </div>
      </div>
    </div>
  );
}

function FeaturedTestimonial() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader prefix="Client" highlight="Success Stories" align="center" />
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
        <div className="w-full lg:w-2/5">
          <video
            controls
            playsInline
            className="w-full max-w-xs mx-auto lg:mx-0 rounded-[16px] lg:rounded-[20px] shadow-lg"
            aria-label="Entryphone client testimonial about Protonest IoT development services and high quality product delivery"
          >
            <source src="/entryphone-testimonial.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">
          <div className="relative h-[48px] w-[140px]">
            <Image
              src="/client4.svg"
              alt="Entryphone client testimonial for Protonest IoT development services"
              fill
              quality={85}
              sizes="140px"
              className="object-contain object-left"
            />
          </div>
          <blockquote>
            <p className="text-[15px] lg:text-[17px] font-normal font-poppins text-[#333333] leading-relaxed italic">
              &#8220;I&#8217;ve worked with Protonest on a development project
              and have been really impressed by their technical ability, clear
              communication, and professional approach. Everything has been
              handled carefully and to a high standard.&#8221;
            </p>
          </blockquote>
          <div>
            <p className="text-[15px] font-medium font-poppins text-[#333333]">
              Oliver Ashbee
            </p>
            <p className="text-[13px] font-normal font-poppins text-[#999999]">
              entryphone, UK
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader
        prefix="Industries We Support With"
        highlight="IoT Development Services"
        description="Protonest supports IoT engineering across access control, manufacturing, automobile, and sports products."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {industries.map((industry) => (
          <div
            key={industry.slug}
            className="rounded-[24px] overflow-hidden bg-white shadow-lg flex flex-col h-full"
          >
            <div className="relative w-full h-[200px] flex-shrink-0">
              <Image
                src={industry.image}
                alt={industry.alt}
                fill
                quality={80}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-[18px] font-medium font-montserrat bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent mb-3">
                {industry.title}
              </h3>
              <p className="text-[14px] font-normal font-poppins text-[#6C6C6C] leading-relaxed">
                {industry.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="w-full py-16 md:py-20 lg:py-24 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] text-center">
      <h2 className="text-[24px] lg:text-[30px] xl:text-[36px] font-medium font-montserrat mb-4">
        <span className="text-[rgba(108,108,108,1)]">
          Let&#39;s Talk About Your{" "}
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
          IoT Development Project
        </span>
      </h2>
      <p className="text-[15px] lg:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] max-w-2xl mx-auto mb-8">
        Book a free call to discuss your product idea or the technical
        challenge. We can help you review the scope, architecture, and next
        steps.
      </p>
      <Link
        href="/contact-us#book-a-call"
        className="inline-flex items-center justify-center w-[220px] h-[55px] lg:h-[60px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 font-poppins font-medium text-[15px] lg:text-[16px]"
      >
        Book a Free Call
      </Link>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <LargeScreenHeroSection />
      <SmallScreenHeroSection />
      <ServicesSection />
      <FeaturedTestimonial />
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          What We Have Achieved So Far
        </h2>
        <StatsSection stats={HIGHLIGHT_STATS} />
      </section>
      <ClientsMap />
      <IndustriesSection />
      <ProjectSlider />
      <div id="testimonials-section">
        <TestimonialSection />
      </div>
      <WhyChooseProtonest />
      <NewsAndBlogs />
      <FinalCTA />
      <Footer />
    </div>
  );
}
