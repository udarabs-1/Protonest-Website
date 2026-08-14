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
import SectionHeader from "../components/section-header";
import { useOnScreen } from "../components/use-on-screen";

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
      className={`group w-[280px] sm:w-[200px] md:w-[220px] lg:w-64 h-[280px] sm:h-[320px] md:h-[340px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[30px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] flex flex-col items-center relative transition-all duration-300 md:hover:shadow-xl ${shouldShowEffects ? "shadow-xl" : ""
        }`}
    >
      <div
        className={`h-[180px] lg:h-[240px] flex items-center justify-center transition-transform duration-300 md:group-hover:-rotate-7 md:group-hover:scale-115 ${shouldShowEffects ? "-rotate-7 scale-115" : ""
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
          className={`text-sm sm:text-base font-normal font-poppins mb-3 text-center transition-all duration-300 md:text-[#4E4E4E] md:group-hover:text-transparent md:group-hover:bg-clip-text md:group-hover:bg-gradient-to-r md:from-[rgba(85,48,250,1)] md:to-[rgba(245,29,165,1)] ${shouldShowEffects
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
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] mt-[50px]">
          <div className="relative w-full aspect-[16/9] sm:h-[55vw] sm:max-h-[680px] sm:min-h-[300px] rounded-[20px] md:rounded-[30px] overflow-hidden shadow-lg">
            <Image
              src="/team.jpg"
              alt="Protonest team working on IoT product development"
              fill
              priority={true}
              quality={90}
              sizes="(max-width: 1536px) 100vw, 1536px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/30" />
          </div>

          <div className="mt-10 sm:mt-14 lg:mt-16 flex flex-col items-center text-center px-4">
            <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] xl:text-[45px] font-medium font-montserrat leading-tight">
              <span className="text-[#6c6c6c]">About </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                Protonest
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-3xl text-[14px] sm:text-[16px] xl:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] leading-relaxed">
              Protonest is an IoT product development company helping startups,
              companies, and product teams turn connected product ideas into
              reliable hardware, firmware, software, and embedded systems.
            </p>
            <Link
              href="/contact-us#book-a-call"
              className="mt-6 sm:mt-8 inline-flex items-center justify-center w-[160px] sm:w-[180px] h-[45px] sm:h-[50px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 font-poppins font-medium text-sm sm:text-base"
            >
              Book a Call
            </Link>
          </div>
        </div>

        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-16 sm:py-20 lg:py-24">
          <SectionHeader
            highlight="Our Story"
            description="Protonest started with a clear goal: make IoT prototyping simpler for teams building connected products. Since then, the company has grown into a multidisciplinary team working across hardware, firmware, embedded systems, software, and product support."
            align="center"
          />

          <div className="max-w-4xl mx-auto mt-16 sm:mt-20 md:mt-24 relative">
            <div className="relative pb-4">
              {/* Connecting Gradient Line */}
              {/* Center on desktop, left on mobile */}
              <div className="absolute left-[13px] md:left-1/2 top-0 bottom-0 w-[4px] md:-ml-[2px] bg-gradient-to-b from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] rounded-full" />

              <div className="flex flex-col gap-12 md:gap-0 text-[#6c6c6c] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-normal font-poppins leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px]">

                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-start md:items-center w-full md:mb-20 lg:mb-24 last:mb-0">
                  {/* Left Side (Empty space for layout) */}
                  <div className="hidden md:block md:w-1/2 order-1"></div>

                  {/* Node */}
                  <div className="absolute left-[6px] md:left-1/2 top-[4px] md:top-1/2 md:-mt-[9px] md:-ml-[9px] w-[18px] h-[18px] rounded-full bg-white border-[5px] border-[#5530FA] shadow-[0_0_15px_rgba(85,48,250,0.6)] z-10" />

                  {/* Right Side (Desktop Content) */}
                  <div className="w-full md:w-1/2 md:pl-12 lg:pl-16 pl-[45px] order-2 md:order-3 md:text-left">
                    <h4 className="text-[#5530FA] font-medium text-[16px] sm:text-[18px] md:text-[22px] mb-2 sm:mb-3 font-montserrat tracking-wide">Our Beginnings</h4>
                    <p>
                      Protonest was founded in 2023 by an electronics engineer to simplify IoT prototyping for early-stage connected product ideas.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-start md:items-center w-full md:mb-20 lg:mb-24 last:mb-0">
                  {/* Left Side (Desktop Content) */}
                  <div className="w-full md:w-1/2 md:pr-12 lg:pr-16 pl-[45px] md:pl-0 order-2 md:order-1 md:text-right">
                    <h4 className="text-[#F51DA5] font-medium text-[16px] sm:text-[18px] md:text-[22px] mb-2 sm:mb-3 font-montserrat tracking-wide">From Projects to Platforms</h4>
                    <p>
                      Applying the learning from ongoing project-based services, our team now extends their capabilities into building reusable systems to help reduce IoT product development time.
                    </p>
                  </div>

                  {/* Node */}
                  <div className="absolute left-[6px] md:left-1/2 top-[4px] md:top-1/2 md:-mt-[9px] md:-ml-[9px] w-[18px] h-[18px] rounded-full bg-white border-[5px] border-[#F51DA5] shadow-[0_0_15px_rgba(245,29,165,0.6)] z-10" />

                  {/* Right Side (Empty space for layout) */}
                  <div className="hidden md:block md:w-1/2 order-3"></div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-start md:items-center w-full md:mb-0 last:mb-0">
                  {/* Left Side (Empty space for layout) */}
                  <div className="hidden md:block md:w-1/2 order-1"></div>

                  {/* Node */}
                  <div className="absolute left-[6px] md:left-1/2 top-[4px] md:top-1/2 md:-mt-[9px] md:-ml-[9px] w-[18px] h-[18px] rounded-full bg-white border-[5px] border-[#6C9AE1] shadow-[0_0_15px_rgba(108,154,225,0.6)] z-10" />

                  {/* Right Side (Desktop Content) */}
                  <div className="w-full md:w-1/2 md:pl-12 lg:pl-16 pl-[45px] order-2 md:order-3 md:text-left">
                    <h4 className="text-[#6C9AE1] font-medium text-[16px] sm:text-[18px] md:text-[22px] mb-2 sm:mb-3 font-montserrat tracking-wide">Today</h4>
                    <p>
                      Protonest is a multidisciplinary IoT product development company with 20+ team members supporting the designing, engineering, and delivery of production-grade systems.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16">
            <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[300px] lg:h-[300px] flex-shrink-0">
              <Image
                src="/ellipse.svg"
                alt="Profile Background"
                fill
                priority={false}
                quality={80}
                className="object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[140px] w-[140px] sm:h-[170px] sm:w-[170px] lg:h-[230px] lg:w-[230px] rounded-full overflow-hidden">
                  <Image
                    src="/profile.jpg"
                    alt="Udara Kumarasena Chief Executive Officer of Protonest"
                    fill
                    priority={false}
                    quality={90}
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 170px, 230px"
                    className="object-cover"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 w-full text-center lg:text-left">
              <h2 className="text-[22px] sm:text-[26px] xl:text-[30px] font-medium font-montserrat leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                  Founder&apos;s Note
                </span>
              </h2>

              <div className="relative mt-8 sm:mt-10 flex items-start justify-center lg:justify-start">
                <div className="absolute -top-3 -left-4 sm:-left-6 text-gray-300">
                  <Image
                    src="/quotation1.svg"
                    alt="Opening quotation mark"
                    width={48}
                    height={48}
                    priority={false}
                    quality={80}
                  />
                </div>

                <div className="flex-grow px-4 sm:px-8 lg:px-0">
                  <p className="text-[17px] sm:text-[21px] xl:text-[25px] font-montserrat leading-relaxed">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                      At Protonest,
                    </span>
                    <span className="text-[#6C6C6C]">
                      {" "}
                      we design and develop IoT systems that make connected
                      products more reliable, secure, and scalable. Our goal is
                      to help strong product ideas move from concept to real
                      systems.
                    </span>
                  </p>
                </div>

                <div className="absolute -bottom-3 -right-4 sm:-right-6 text-gray-300">
                  <Image
                    src="/quotation2.svg"
                    alt="Closing quotation mark"
                    width={48}
                    height={48}
                    priority={false}
                    quality={80}
                  />
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <p className="text-[16px] sm:text-[18px] xl:text-[20px] font-medium font-poppins text-[#6C6C6C]">
                  Udara Kumarasena
                </p>
                <p className="text-[13px] sm:text-[14px] xl:text-[15px] font-normal font-poppins text-[#999999] mt-1">
                  Chief Executive Officer
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[649px] overflow-visible mt-4 sm:mt-6 md:mt-8 lg:mt-10">
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
                description="We provide services for innovative companies building smart products. When they build, they build with us."
                align="center"
              />
            </div>
          </div>

          <div className="mt-0 relative z-10">
            <ClientMarquee />
          </div>
        </div>

        <div className="min-h-[800px] sm:min-h-[700px] md:min-h-[700px] lg:min-h-[649px] relative mt-4 sm:mt-0 md:-mt-12 lg:-mt-16">
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
                  Accelerate the design and deployment of scalable, user-focused IoT solutions.
                </span>
              </div>
            </div>

            <div className="text-left w-full">
              <h2 className="text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[30px] font-medium font-montserrat">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                  What Guides Us Every Day
                </span>
              </h2>
              <p className="mt-3 sm:mt-4 text-[14px] sm:text-[16px] xl:text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] max-w-[780px]">
                At Protonest, our work is guided by high-quality, clear
                communication and responsibility for the full product system.
              </p>
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
      </div>
      <Footer />
    </div>
  );
}
