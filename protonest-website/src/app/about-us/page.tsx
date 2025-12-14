"use client";
import { Icon } from "@iconify/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import ClientMarquee from "../components/client-marquee";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import OurTeamSection from "../components/our-team";
import PageHero from "../components/page-hero";
import { useOnScreen } from "../components/use-on-screen";
import SectionHeader from "../components/section-header";

type ValueType = {
  title: string;
  icon: string;
  description: string;
};

const ValueCard = ({ value }: { value: ValueType }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const shouldShowEffects = isMobile ? isVisible : false;

  return (
    <div
      ref={ref}
      className={`group w-[280px] sm:w-[200px] md:w-[220px] lg:w-64 h-[280px] sm:h-[320px] md:h-[340px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[30px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] flex flex-col items-center relative transition-all duration-300 md:hover:shadow-xl ${
        shouldShowEffects ? "shadow-xl" : ""
      }`}
    >
      <div
        className={`h-[180px] lg:h-[240px] flex items-center justify-center transition-transform duration-300 md:group-hover:-rotate-7 md:group-hover:scale-115 ${
          shouldShowEffects ? "-rotate-7 scale-115" : ""
        }`}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#5530FA] to-[#F51DA5] rounded-full">
          <Icon
            icon={value.icon}
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-2 px-4">
        <h3
          className={`text-sm sm:text-base font-normal font-poppins mb-3 text-center transition-all duration-300 md:text-[#4E4E4E] md:group-hover:text-transparent md:group-hover:bg-clip-text md:group-hover:bg-gradient-to-r md:from-[rgba(85,48,250,1)] md:to-[rgba(245,29,165,1)] ${
            shouldShowEffects
              ? "text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)]"
              : "text-[#4E4E4E]"
          }`}
        >
          {value.title}
        </h3>

        <p className="text-gray-500 text-[10px] sm:text-xs font-normal font-poppins text-center leading-relaxed">
          {value.description}
        </p>
      </div>
    </div>
  );
};

export default function About() {
  const values = [
    {
      title: "Innovation",
      icon: "solar:rocket-2-bold",
      description: "We push the edge of what's possible in connected tech.",
    },
    {
      title: "Collaboration",
      icon: "solar:users-group-two-rounded-bold",
      description: "Working side-by-side with our clients to co-create.",
    },
    {
      title: "Excellence",
      icon: "solar:target-bold",
      description: "Every detail matters, from concept to final delivery.",
    },
    {
      title: "Integrity",
      icon: "solar:shield-check-bold",
      description: "Transparent, honest, and always accountable.",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <Head>
        <title>About Us - Protonest</title>
        <meta
          name="description"
          content="Learn about Protonest - our IoT prototyping expertise, engineering team, and how we help innovators transform ideas into functional prototypes since 2023."
        />
        <meta
          name="keywords"
          content="IoT prototyping company, about Protonest, IoT engineering team, hardware prototyping experts"
        />

        <link rel="canonical" href="https://protonest.co/about-us" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protonest.co/about-us" />
        <meta property="og:title" content="About Us - Protonest" />
        <meta
          property="og:description"
          content="Discover our team's journey in IoT prototyping and how we turn visionary ideas into scalable systems since 2023."
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Protonest",
            description:
              "Learn about our IoT prototyping services and engineering team",
            url: "https://protonest.co/about-us",
            about: {
              "@type": "Organization",
              name: "Protonest",
              foundingDate: "2023-06",
              founder: {
                "@type": "Person",
                name: "Udara Kumarasena",
                jobTitle: "CEO",
              },
              numberOfEmployees: "20+",
              keywords: "IoT prototyping, hardware development",
            },
          })}
        </script>
      </Head>
      <Navbar />
      <div>
        <PageHero
          backgroundImage="/about-1.webp"
          heading={{
            beforeGradient: "Building the Future of",
            gradientText: "IoT Innovation",
          }}
          description="Protonest is a dynamic IoT engineering hub that transforms visionary ideas into scalable, working systems. Whether you're launching a new smart device or need rapid prototyping, we're here to help."
          height="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[553px]"
        />

        <div className="z-10 mt-[40px] md:-mt-[150px] relative w-full h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px] xl:h-[996px] overflow-visible">
          <div className="absolute inset-0 flex justify-center">
            <Image
              src="/about-2-mobile.svg"
              alt="Our Journey background mobile"
              width={768}
              height={500}
              priority={false}
              quality={65}
              sizes="(max-width: 1024px) 100vw, 768px"
              className="absolute w-[350px] md:w-[500px] right-0 h-auto lg:hidden"
              style={{ objectPosition: "right" }}
            />
            <Image
              src="/about-2.webp"
              alt="Our Journey background desktop"
              fill
              priority={false}
              quality={70}
              sizes="(min-width: 1024px) 100vw, 0px"
              className="absolute w-[90%] h-auto right-0 hidden lg:block"
              style={{ objectFit: "contain", objectPosition: "right" }}
            />
          </div>

          <div className="absolute left-1/2 top-[40px] sm:top-[60px] md:top-[80px] lg:top-[96px] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[1127px] -translate-x-1/2">
            <SectionHeader
              highlight="Our Journey"
              description="From an engineer’s vision to a collective force shaping connected products."
              align="center"
            />
          </div>

          <div className="absolute left-0 md:left-[5%] lg:left-[10%] 2xl:left-[11%] top-[150px] sm:top-[220px] md:top-[260px] lg:top-[318px] w-[60%] sm:w-[80%] md:w-[70%] lg:w-[45%] px-4 lg:px-0">
            <div className="relative flex gap-6">
              {/* Content */}
              <div className="flex flex-col gap-12 text-[#6c6c6c] text-[12px] md:text-[14px] lg:text-[15px] xl:text-[16px] font-normal font-poppins leading-[20px] sm:leading-[24px] md:leading-[28px] lg:leading-[30px]">
                {/* Item 1 */}
                <div className="relative">
                  <span className="absolute -left-[34px] top-2 w-3 h-3 rounded-full bg-[#5530FA]" />
                  Founded in June 2023 by an electronic engineer passionate
                  about innovation, Protonest began as a vision to simplify IoT
                  prototyping.
                </div>

                {/* Item 2 */}
                <div className="relative">
                  <span className="absolute -left-[34px] top-2 w-3 h-3 rounded-full bg-[#F51DA5]" />
                  Today, we&apos;re a growing team of 20+ members consisting of
                  engineers, designers, and thinkers, united by a shared goal.
                </div>

                {/* Item 3 */}
                <div className="relative">
                  <span className="absolute -left-[34px] top-2 w-3 h-3 rounded-full bg-[#6C9AE1]" />
                  What started as one idea has become a collaborative hub for
                  future-focused problem solvers in the IoT space.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[649px] overflow-hidden -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">
          <div className="absolute inset-0 flex justify-center">
            <Image
              src="/about-3.svg"
              alt="Trusted by pioneers background"
              fill
              priority={false}
              quality={70}
              sizes="100vw"
              className="w-full max-w-[1440px] h-auto object-contain"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="flex justify-center w-full pt-8 sm:pt-12 md:pt-16 lg:pt-20 relative z-10">
            <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[1124px] px-4">
              <SectionHeader
                prefix="Trusted by Pioneers in"
                highlight="Innovation"
                description="Teams and builders who rely on us to turn complex ideas into working systems."
                align="center"
              />
            </div>
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-15 relative z-10">
            <ClientMarquee />
          </div>
        </div>

        <div className="min-h-[800px] sm:min-h-[700px] md:min-h-[700px] lg:min-h-[649px] relative -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16">
          <div className="absolute inset-0">
            <Image
              src="/about-4.svg"
              alt="Our Mission background"
              fill
              priority={false}
              quality={65}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>

          <div className="flex flex-col items-start justify-start h-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-8 sm:py-12 md:py-16 relative z-10">
            <div className="flex justify-start w-full">
              <div className="text-left text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[30px] font-medium font-montserrat">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                  Our Mission
                </span>
              </div>
            </div>

            <div className="flex justify-start w-full my-6 sm:my-8 md:my-10 lg:my-12">
              <div className="text-[14px] sm:text-[16px] xl:text-[18px] w-full max-w-[780px] font-normal font-poppins text-left">
                <span className="text-[rgba(108,108,108,1)]">
                  Accelerate the design & development of sustainable,
                  cost-effective, and scalable IoT solutions, done right and
                  delivered fast.
                </span>
              </div>
            </div>

            <div className="text-left text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal font-poppins w-full">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                What Guides Us Every Day
              </span>
            </div>

            <div className="w-full my-8 sm:my-12 md:my-16 lg:my-20 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8">
              {values.map((value, index) => (
                <ValueCard key={index} value={value} />
              ))}
            </div>
          </div>
        </div>

        <div className="-mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16">
          <OurTeamSection />
        </div>

        <div className="mt-32 md:mt-22 lg:mt-24 flex justify-center w-full px-4">
          <div className="w-full max-w-[1100px] text-center">
            <h2 className="text-[24px] lg:text-[30px] xl:text-[40px] font-medium font-montserrat leading-[35px] sm:leading-[40px] md:leading-[50px] lg:leading-[55px]">
              <span className="text-[#6c6c6c]">
                Whether you&apos;re a founder, engineer, or a team lead,
                <br className="hidden sm:block" />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                {" "}
                Protonest
              </span>
              <span className="text-[#6c6c6c]">
                {" "}
                is ready to help you bring your
                <br className="hidden sm:block" />
                IoT idea to life.
              </span>
            </h2>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 text-center pb-8 sm:pb-12 md:pb-16">
          <Link
            href="https://iot-system-design-tool.protonest.co/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-[150px] sm:w-[170px] lg:w-[180px] h-[45px] sm:h-[48px] xl:h-[50px] gradient-button font-poppins hover:font-medium transition text-sm lg:text-[15px] xl:text-base">
              Get a Quote
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
