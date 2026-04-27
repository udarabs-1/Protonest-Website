"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
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
import { useOnScreen } from "./components/use-on-screen";
import WhyChooseProtonest from "./components/why-choose";

const HIGHLIGHT_STATS = [
  { value: 100, suffix: "+", label: "Projects" },
  { value: 100, suffix: "+", label: "Satisfied Clients" },
  { value: 3, suffix: "+", label: "Years in the Industry" },
];

function LargeScreenHome() {
  const scrollToTestimonials = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const testimonialSection = document.getElementById("testimonials-section");
    if (testimonialSection) {
      const navbarHeight = 100;
      const elementPosition = testimonialSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="hidden lg:block">
      <div className="mt-[100px] h-full relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-1.webp"
            alt="Hero background"
            fill
            priority={true}
            quality={75}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>

        <div className="flex flex-col items-center justify-center h-full px-[60px] xl:px-[133px] 2xl:px-[180px] relative z-10">
          <div className="flex justify-center">
            <div className="text-center lg:text-[38px] xl:text-[45px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Your Reliable IoT testing
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Development Partner Testing 123
              </span>
            </div>
          </div>
          <div className="text-center text-[16px] xl:text-[18px] font-normal font-poppins mt-8 px-[200px] xl:px-[320px] text-[rgba(108,108,108,1)]">
            <span>
              At Protonest, we design, build, and connect scalable IoT
              solutions.
            </span>
            <br />
            <span className="mt-4 block">Built fast. Built right.</span>
          </div>
          <div className="flex justify-center space-x-[33px] mt-8 h-[60px] xl:h-[65px] font-poppins font-medium text-[15px] xl:text-[16px]">
            <Link
              href="/contact-us#get-in-touch"
              className="w-[280px] xl:w-[312px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 flex items-center justify-center"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-[60px] h-[480px] relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-2.svg"
            alt="Clients background"
            fill
            priority={false}
            quality={70}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="flex flex-col items-start justify-start h-full px-[60px] xl:px-[133px] 2xl:px-[180px]">
          <SectionHeader
            prefix="Explore Our"
            highlight="Clients"
            description="Trusted by pioneers in innovation. When they build, they build with us."
            linkLabel="About Us"
            linkHref="/about-us"
          />

          <ClientMarquee />
        </div>
      </div>



      <ServicesSection />

      <StatsSection stats={HIGHLIGHT_STATS} />
      <ClientsMap />
    </div>
  );
}

function SmallScreenHome() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  const scrollToTestimonials = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const testimonialSection = document.getElementById("testimonials-section");
    if (testimonialSection) {
      const navbarHeight = 80;
      const elementPosition = testimonialSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="lg:hidden">
      <div className="mt-12 sm:mt-6 h-[450px] sm:h-[520px] relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-1.webp"
            alt="Hero background"
            fill
            priority={true}
            quality={70}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>

        <div className="flex flex-col items-center justify-center h-full px-4 sm:px-8 relative z-10">
          <div className="flex justify-center">
            <div className="text-center text-[28px] sm:text-[30px] md:text-[32px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Your Reliable IoT
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Development Partner
              </span>
            </div>
          </div>
          <div className="text-center text-[14px] font-normal font-poppins mt-5 sm:mt-6 px-4 sm:px-8 text-[rgba(108,108,108,1)]">
            <span>
              At Protonest, we design, build, and connect scalable IoT
              solutions.
            </span>
            <br />
            <span className="mt-3 block">Built fast. Built right.</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 font-poppins font-medium text-[14px]">
            <Link
              href="/contact-us#get-in-touch"
            >
              <button className="w-[230px] sm:w-[280px] h-[50px] sm:h-[55px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[30px] sm:rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                Request a Quote
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 min-h-[400px] relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-2.svg"
            alt="Clients background"
            fill
            priority={false}
            quality={65}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="flex flex-col items-start justify-start h-full px-4 sm:px-8 py-8">
          <div className="flex justify-start mb-6">
            <div className="text-center text-[24px] sm:text-[26px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">Explore Our </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Clients
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start w-full mb-8 gap-4">
            <div className="text-[14px] font-normal font-poppins text-left sm:text-left">
              <span className="text-[rgba(108,108,108,1)]">
                Trusted by Pioneers in Innovation. When they build, they build
                with us.
              </span>
            </div>
            <Link href="/about-us">
              <div className="text-[14px] lg:text-[18px] font-normal font-poppins cursor-pointer text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] transition-all duration-300">
                <span className="underline">About Us</span> &gt;
              </div>
            </Link>
          </div>
          <ClientMarquee />
        </div>
      </div>



      <ServicesSection />

      <StatsSection stats={HIGHLIGHT_STATS} />
      <ClientsMap />
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>IoT Development Services by Protonest</title>
        <meta
          name="description"
          content="IoT Development Services by Protonest , We specialized in transforming IoT ideas into reality with expert development and innovative engineering."
        />
        <meta
          name="keywords"
          content="IoT development services, IoT development partner, IoT product development, hardware development, IoT development company"
        />

        <link rel="canonical" href="https://protonest.co/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protonest.co/" />
        <meta
          property="og:title"
          content="IoT Development Services by Protonest"
        />
        <meta
          property="og:description"
          content="Your reliable IoT Development Partner. Built fast. Built right."
        />
        <meta
          property="og:image"
          content="https://protonest.co/images/og-home.jpg"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Protonest",
            url: "https://protonest.co/",
            description:
              "IoT development services to transform ideas into reality.",
            foundingDate: "2023",
            founder: {
              "@type": "Person",
              name: "Udara Kumarasena",
            },
          })}
        </script>
      </Head>
      <Navbar />
      <LargeScreenHome />

      <SmallScreenHome />

      <ProjectSlider />
      <div id="testimonials-section">
        <TestimonialSection />
      </div>
      <WhyChooseProtonest />
      <NewsAndBlogs />
      <Footer />
    </div>
  );
}
