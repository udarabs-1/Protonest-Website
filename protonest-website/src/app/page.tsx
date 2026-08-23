import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ClientMarquee from "./components/client-marquee";
import ClientsMap from "./components/clients-map";
import FinalCTA from "./components/final-cta";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import NewsAndBlogs from "./components/news-and-blogs";
import ProjectSlider from "./components/projects-slider";
import SectionHeader from "./components/section-header";
import ServicesSection from "./components/services";
import StatsSection from "./components/stats-section";
import TestimonialSection from "./components/testimonials";
import TestimonialVideoPlayer from "./components/testimonial-video-player";
import WhyChooseProtonest from "./components/why-choose";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://protonest.co",
  ),
  title: "Protonest | Your Reliable Partner in IoT Development Services",
  description:
    "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, and other industries.",
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
    title: "Protonest | Your Reliable Partner in IoT Development Services",
    description:
      "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, and other industries.",
    images: [
      {
        url: "/og-image-home.png",
        width: 1200,
        height: 630,
        alt: "Protonest IoT development services for global product teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IoT Development Services for Global Product Teams",
    description:
      "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, and other industries.",
    images: ["/og-image-home.png"],
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
        "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, and other industries.",
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
      "@type": "WebPage",
      "@id": "https://protonest.co/#webpage",
      url: "https://protonest.co/",
      name: "Protonest | Your Reliable Partner in IoT Development Services",
      description:
        "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, and other industries.",
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
        caption: "Protonest IoT development services for global product teams",
      },
      mainEntity: {
        "@id": "https://protonest.co/#iot-development-services",
      },
      inLanguage: "en",
    },
    {
      "@type": "Service",
      "@id": "https://protonest.co/#iot-development-services",
      name: "IoT Development Services",
      serviceType: "IoT development services",
      description:
        "Protonest provides IoT development services for global startups, companies, and businesses across access control, manufacturing, and other industries.",
      provider: {
        "@id": "https://protonest.co/#organization",
      },
      areaServed: {
        "@type": "Place",
        name: "Global",
      },
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
                "We will work with you to turn an early idea into a clear IoT product development plan that feels achievable and grounded from day one.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "IoT Hardware Development",
              description:
                "We design PCBs, enclosures, and product architecture that is reliable and easy to support in real use.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Firmware Development",
              description:
                "We develop reliable firmware for embedded products, including device logic, sensor and actuator integration, communication protocols, and testing for real operating conditions.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Software Development",
              description:
                "We build clean, dependable front-end and backend software that supports your IoT product.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Testing and Product Validation",
              description:
                "We test your products for reliability and performance under realistic conditions before launch.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "IoT Consulting and Support",
              description:
                "We provide IoT consulting to help you make better product decisions, along with post-development support, updates, and improvements.",
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

const industries = [
  {
    slug: "access-control",
    title: "Access Control",
    image: "/access-control.png",
    alt: "Protonest access control IoT development services",
    description:
      "We help you build smart access control systems that are secure and reliable.",
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    image: "/manufacturing.png",
    alt: "Protonest industrial IoT monitoring and factory automation support",
    description:
      "We support industrial monitoring and predictive maintenance to help teams track factory performance.",
  },
  {
    slug: "automotive",
    title: "Automotive",
    image: "/automobile.png",
    alt: "Protonest automotive IoT and vehicle telematics development",
    description:
      "We build automotive IoT, vehicle telematics, and GPS tracking for your vehicles and fleets.",
  },
  {
    slug: "sports",
    title: "Sports",
    image: "/sports.png",
    alt: "Protonest wearable IoT and sports technology development",
    description:
      "We develop wearable IoT, athlete tracking, and smart sports equipment for physical sports and training.",
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

        <div className="flex flex-col items-center justify-center h-full px-[60px] xl:px-[133px] 2xl:px-[180px] relative z-10 pt-8 xl:pt-10 pb-20 xl:pb-24">
          <h1 className="text-center lg:text-[38px] xl:text-[45px] font-medium font-montserrat leading-tight">
            <span className="text-[rgba(108,108,108,1)]">
              Your Reliable Partner in IoT
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
              Development Services
            </span>
          </h1>

          <p className="text-center text-[16px] xl:text-[18px] font-normal font-poppins mt-8 px-[200px] xl:px-[320px] text-[rgba(108,108,108,1)]">
            At Protonest, we design, build, and connect scalable IoT solutions.
            <br /> <br />
            Built fast. Built right.
          </p>

          <div className="flex justify-center space-x-[33px] mt-8 h-[60px] xl:h-[65px] font-poppins font-medium text-[15px] xl:text-[16px]">
            <Link
              href="/contact-us"
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
            prefix="Trusted by Pioneers in"
            highlight="Innovation"
            description="We provide services for companies with smart product ideas. When they build, they build with us."
            linkLabel="About Us"
            linkHref="/about"
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
          <h1 className="text-center text-[28px] sm:text-[30px] md:text-[32px] font-medium font-montserrat leading-tight">
            <span className="text-[rgba(108,108,108,1)]">
              Your Reliable Partner in IoT
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
              Development Services
            </span>
          </h1>

          <p className="text-center text-[14px] font-normal font-poppins mt-5 sm:mt-6 px-4 sm:px-8 text-[rgba(108,108,108,1)]">
            At Protonest, we design, build, and connect scalable IoT solutions.
            <br /> <br />
            Built fast. Built right.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 font-poppins font-medium text-[14px]">
            <Link href="/contact-us">
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
                Trusted by Pioneers in{" "}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Innovation
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start w-full mb-8 gap-4">
            <p className="text-[14px] font-normal font-poppins text-[rgba(108,108,108,1)]">
              We provide services for companies with smart product ideas. When
              they build, they build with us.
            </p>
            <Link href="/about">
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
      <SectionHeader
        prefix="Client"
        highlight="Success Stories"
        align="center"
      />
      <div className="max-w-5xl mx-auto rounded-[24px] lg:rounded-[32px] bg-gradient-to-br from-[#5530FA]/12 via-[#F51DA5]/8 to-[#6C9AE1]/12 p-2 sm:p-3 lg:p-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center rounded-[20px] lg:rounded-[28px] bg-white px-6 py-8 sm:p-8 lg:p-10 shadow-[0_12px_40px_rgba(85,48,250,0.08)]">
          <div className="w-full lg:w-2/5">
            <div className="w-full max-w-xs mx-auto lg:mx-0">
              <TestimonialVideoPlayer
                src="/entryphone-testimonial.mp4"
                ariaLabel="Oliver Ashby of the Entryphone Company shares his experience working with Protonest"
                name="Oliver Ashby"
                company="Entryphone Company, UK"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">
            <div className="relative h-[48px] w-[140px]">
              <Image
                src="/protonest-client-entryphone.svg"
                alt="Entryphone logo"
                fill
                quality={85}
                sizes="140px"
                className="object-contain object-left"
              />
            </div>

            <blockquote>
              <p className="text-[15px] lg:text-[17px] font-normal font-poppins text-[#333333] leading-relaxed italic">
                &#8220;We&#8217;ve worked with Udara and the Protonest team on
                cloud and mobile-based access control and intercom projects.
                What stands out most is how easy they are to work with.
                They&#8217;re collaborative, flexible, and genuinely invested in
                the product and business goals.
                <br /> <br />
                Communication has been excellent, the work consistently strong,
                and they&#8217;ve become a trusted partner in our development
                process. I&#8217;m happy to recommend Udara and the Protonest
                team as reliable development partners.&#8221;
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  return (
    <section className="w-full overflow-hidden px-4 py-12 sm:px-8 md:py-16 lg:px-[60px] lg:py-20 xl:px-[133px] 2xl:px-[180px]">
      <SectionHeader
        prefix="Industries We "
        highlight="Support"
        description="Our IoT development services support the engineering of access control, manufacturing, automotive, and sports products."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        {industries.map((industry, index) => {
          const isClickable = industry.slug === "access-control";

          const cardContent = (
            <>
              <Image
                src={industry.image}
                alt={industry.alt}
                fill
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />

              <div className="absolute left-4 top-4 flex h-9 min-w-9 items-center justify-center rounded-full bg-white/90 px-3 font-poppins text-[12px] font-medium text-[#5530FA] shadow-sm backdrop-blur-sm">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="absolute inset-x-3 bottom-3 flex h-[180px] flex-col overflow-hidden rounded-[20px] bg-white/95 p-5 shadow-[0_12px_35px_rgba(23,23,23,0.12)] backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex flex-shrink-0 items-start justify-between gap-4">
                  <h3 className="line-clamp-1 bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text font-montserrat text-[18px] font-medium text-transparent">
                    {industry.title}
                  </h3>

                  {isClickable && (
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-5 w-5 flex-shrink-0 text-[#5530FA] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.8}
                    />
                  )}
                </div>

                <p className="mt-3 line-clamp-4 overflow-hidden font-poppins text-[13px] font-normal leading-relaxed text-[#6C6C6C]">
                  {industry.description}
                </p>
              </div>
            </>
          );

          const cardClasses =
            "group relative aspect-[3/4] min-h-[460px] w-full overflow-hidden rounded-[26px] bg-[#F5F3FF]";

          return isClickable ? (
            <Link
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              className={cardClasses}
              aria-label={`Learn more about ${industry.title}`}
            >
              {cardContent}
            </Link>
          ) : (
            <article key={industry.slug} className={cardClasses}>
              {cardContent}
            </article>
          );
        })}
      </div>
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
