"use client";
import Head from 'next/head';
import Image from "next/image";
import Link from "next/link";
import { useRef } from 'react';
import ClientMarquee from "./components/client-marquee";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import NewsAndBlogs from "./components/news-and-blogs";
import ProjectSlider from "./components/projects-slider";
import ServicesSection from "./components/services";
import TestimonialSection from "./components/testimonials";
import { useOnScreen } from "./components/use-on-screen";
import WhyChooseProtonest from "./components/why-choose";

function LargeScreenHome() {
  const scrollToTestimonials = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const testimonialSection = document.getElementById('testimonials-section');
    if (testimonialSection) {
      const navbarHeight = 100;
      const elementPosition = testimonialSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="hidden lg:block">
      <div className="h-full relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-1.webp"
            alt="Hero background"
            fill
            priority={true}
            quality={100}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>

        <div className="pt-20 relative z-20 flex flex-col items-center justify-start h-full px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
          <div className="flex flex-col items-center">
            <h1 className="text-center text-[28px] sm:text-[32px] lg:text-[38px] xl:text-[45px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Bringing Your IoT Ideas to Life with
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Expert Prototyping
              </span>
            </h1>
            <p className="text-center text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] font-normal font-montserrat mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-12 md:px-20 lg:px-auto text-[rgba(108,108,108,1)]">
              <span>
                At Protonest, we design, build, and connect scalable IoT solutions.
              </span>
              <br />
              <span className="mt-4 block">
                Built fast. Built right.
              </span>
            </p>
          </div>
          <div className="flex justify-center space-x-[33px] mt-8 h-[60px] xl:h-[65px] font-poppins font-medium text-[15px] xl:text-[16px]">
            <Link href="https://iot-system-design-tool.protonest.co" target="_blank" rel="noopener noreferrer" className="w-[280px] xl:w-[312px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 flex items-center justify-center">
              Get Your Free Quote Now
            </Link>
            <a href="#testimonials-section" onClick={scrollToTestimonials} className="w-[240px] gradient-button font-medium flex items-center justify-center cursor-pointer">
              Client Reviews
            </a>
          </div>
        </div>
      </div>

      <div className="mt-[120px] h-[649px] relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-2.svg"
            alt="Clients background"
            fill
            priority={false}
            quality={70}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div className="flex flex-col items-start justify-start h-full px-[60px] xl:px-[133px] 2xl:px-[180px]">
          <div className="flex justify-center">
            <div className="text-center text-[26px] xl:text-[30px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Explore Our{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Clients
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center w-full my-12">
            <div className="text-[16px] xl:text-[18px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)]">
                Trusted by Pioneers in Innovation. When they build, they build with us.
              </span>
            </div>
            <Link href="/about-us" className="text-[16px] xl:text-[18px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">
                About Us &gt;
              </span>
            </Link>
          </div>
          <ClientMarquee />
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pb-[120px]">
        <div className="relative w-[90px] h-[90px] mb-6">
          <Image
            src="/ellipse.svg"
            alt="Profile Background"
            fill
            priority={false}
            quality={80}
            className="object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[70px] w-[70px] rounded-full overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Udara Kumarasena"
                fill
                priority={false}
                quality={90}
                sizes="70px"
                className="object-cover"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-8 font-poppins text-[16px] xl:text-[18px] text-[#6C6C6C]">
          Udara Kumarasena, Chief Executive Officer
        </div>

        <div className="relative w-full flex items-start">
          <div className="absolute left-4 xl:left-0 top-0 h-16 w-16 -ml-12 -mt-4 text-gray-300">
            <Image
              src="/quotation1.svg"
              alt="Opening quotation mark"
              width={64}
              height={64}
              priority={false}
              quality={80}
              className="h-full w-full"
            />
          </div>

          <div className="flex-grow py-8 text-center">
            <p className="text-[30px] xl:text-[40px] font-montserrat leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">At Protonest,</span>
              <span className="text-[#6C6C6C]"> we design and develop IoT systems that enhance reliability, security, and scalability, helping Innovative ideas go further, faster.</span>
            </p>
          </div>

          <div className="absolute right-4 xl:right-0 bottom-0 h-16 w-16 -mr-12 -mb-4 text-gray-300">
            <Image
              src="/quotation2.svg"
              alt="Closing quotation mark"
              width={64}
              height={64}
              priority={false}
              quality={80}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      <ServicesSection />

      <div className="bg-[#FAFAFA] py-16 w-full h-[316px] flex items-center hover:bg-black transition-all duration-300 group">
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 lg:gap-45 xl:gap-[211px] max-w-screen-xl mx-auto">
          <div className="text-center">
            <div className="text-[#6c6c6c] text-[60px] font-medium font-montserrat leading-[55px] mb-2">
              100+
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[18px] font-normal font-poppins group-hover:from-[#B4B4B4] group-hover:to-[#4E4E4E]">
              Projects
            </div>
          </div>

          <div className="text-center">
            <div className="text-[#6c6c6c] text-[60px] font-medium font-montserrat leading-[55px] mb-2">
              100+
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[18px] font-normal font-poppins group-hover:from-[#B4B4B4] group-hover:to-[#4E4E4E]">
              Satisfied Clients
            </div>
          </div>

          <div className="text-center">
            <div className="text-[#6c6c6c] text-[60px] font-medium font-montserrat leading-[55px] mb-2">
              3+
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[18px] font-normal font-poppins group-hover:from-[#B4B4B4] group-hover:to-[#4E4E4E]">
              Years in the Industry
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallScreenHome() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  const scrollToTestimonials = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const testimonialSection = document.getElementById('testimonials-section');
    if (testimonialSection) {
      const navbarHeight = 80;
      const elementPosition = testimonialSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="lg:hidden">
      <div className="h-[450px] sm:h-[520px] relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-1.webp"
            alt="Hero background"
            fill
            priority={true}
            quality={100}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>

        <div className="pt-20 relative z-20 flex flex-col items-center justify-start h-full px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
          <div className="flex flex-col items-center">
            <h1 className="text-center text-[28px] sm:text-[32px] lg:text-[38px] xl:text-[45px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Bringing Your IoT Ideas to Life with
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Expert Prototyping
              </span>
            </h1>
            <p className="text-center text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] font-normal font-montserrat mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-12 md:px-20 lg:px-auto text-[rgba(108,108,108,1)]">
              <span>
                At Protonest, we design, build, and connect scalable IoT solutions.
              </span>
              <br />
              <span className="mt-4 block">
                Built fast. Built right.
              </span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 font-poppins font-medium text-[14px]">
            <Link href="https://iot-system-design-tool.protonest.co" target="_blank" rel="noopener noreferrer">
              <button className="w-[230px] sm:w-[280px] h-[50px] sm:h-[55px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[30px] sm:rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                Get Your Free Quote Now
              </button>
            </Link>
            <a href="#testimonials-section" onClick={scrollToTestimonials}>
              <button className="w-full sm:w-[240px] h-[50px] sm:h-[55px] gradient-button font-medium">
                Client Reviews
              </button>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 min-h-[400px] relative">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/home-2.svg"
            alt="Clients background"
            fill
            priority={false}
            quality={65}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div className="flex flex-col items-start justify-start h-full px-4 sm:px-8 py-8">
          <div className="flex justify-start mb-6">
            <div className="text-center text-[24px] sm:text-[26px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Explore Our{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Clients
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start w-full mb-8 gap-4">
            <div className="text-[14px] font-normal font-poppins text-left sm:text-left">
              <span className="text-[rgba(108,108,108,1)]">
                Trusted by Pioneers in Innovation. When they build, they build with us.
              </span>
            </div>
            <Link href="/about-us" className="ml-auto">
              <div className="text-[14px] font-normal font-poppins cursor-pointer">
                <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] transition-all duration-300">
                  About Us &gt;
                </span>
              </div>
            </Link>
          </div>
          <ClientMarquee />
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto flex flex-col items-center py-12 sm:py-16 px-4 sm:px-8">
        <div className="relative w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] mb-4">
          <Image
            src="/ellipse.svg"
            alt="Profile Background"
            fill
            priority={false}
            quality={80}
            className="object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[55px] w-[55px] sm:h-[65px] sm:w-[65px] rounded-full overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Udara Kumarasena"
                fill
                priority={false}
                quality={90}
                sizes="(max-width: 640px) 55px, 65px"
                className="object-cover"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-6 font-poppins text-[14px] text-[#6C6C6C]">
          Udara Kumarasena, Chief Executive Officer
        </div>

        <div className="relative w-full flex items-start">
          <div className="absolute left-0 top-0 h-8 w-8 sm:h-12 sm:w-12 -ml-4 sm:-ml-8 -mt-2 sm:-mt-4 text-gray-300">
            <Image
              src="/quotation1.svg"
              alt="Opening quotation mark"
              width={48}
              height={48}
              priority={false}
              quality={80}
              className="h-full w-full"
            />
          </div>

          <div className="flex-grow py-4 sm:py-6 text-center px-6 sm:px-8">
            <p className="text-[18px] sm:text-[24px] font-montserrat leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">At Protonest,</span>
              <span className="text-[#6C6C6C]"> we design and develop IoT systems that enhance reliability, security, and scalability, helping Innovative ideas go further, faster.</span>
            </p>
          </div>

          <div className="absolute right-0 bottom-0 h-8 w-8 sm:h-12 sm:w-12 -mr-4 sm:-mr-8 -mb-2 sm:-mb-4 text-gray-300">
            <Image
              src="/quotation2.svg"
              alt="Closing quotation mark"
              width={48}
              height={48}
              priority={false}
              quality={80}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      <ServicesSection />

      <div
        ref={ref}
        className={`py-20 sm:py-16 w-full min-h-[200px] flex items-center transition-all duration-500 ${isMobile && isVisible ? 'bg-black' : 'bg-[#FAFAFA]'
          }`}
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-24 sm:gap-12 md:gap-16 max-w-screen-xl mx-auto px-4">
          <div className="text-center">
            <div className="text-[#6c6c6c] text-[40px] lg:text-[50px] font-medium font-montserrat leading-[45px] mb-2">
              100+
            </div>
            <div className={`text-transparent bg-clip-text text-[14px] lg:text-[16px] font-normal font-poppins transition-all duration-500 ${isMobile && isVisible
              ? 'bg-gradient-to-r from-[#B4B4B4] to-[#4E4E4E]'
              : 'bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4]'
              }`}>
              Projects
            </div>
          </div>

          <div className="text-center">
            <div className="text-[#6c6c6c] text-[40px] lg:text-[50px] font-medium font-montserrat leading-[45px] mb-2">
              100+
            </div>
            <div className={`text-transparent bg-clip-text text-[14px] lg:text-[16px] font-normal font-poppins transition-all duration-500 ${isMobile && isVisible
              ? 'bg-gradient-to-r from-[#B4B4B4] to-[#4E4E4E]'
              : 'bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4]'
              }`}>
              Satisfied Clients
            </div>
          </div>

          <div className="text-center">
            <div className="text-[#6c6c6c] text-[40px] lg:text-[50px] font-medium font-montserrat leading-[45px] mb-2">
              3+
            </div>
            <div className={`text-transparent bg-clip-text text-[14px] lg:text-[16px] font-normal font-poppins transition-all duration-500 ${isMobile && isVisible
              ? 'bg-gradient-to-r from-[#B4B4B4] to-[#4E4E4E]'
              : 'bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4]'
              }`}>
              Years in the Industry
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>IoT Prototyping Services by Protonest</title>
        <meta
          name="description"
          content="IoT Prototyping Services by Protonest , We specialized in transforming IoT ideas into reality with expert prototyping and innovative engineering."
        />
        <meta name="keywords" content="IoT prototyping services, rapid IoT prototyping, IoT product development, hardware prototyping, IoT prototype company" />

        <link rel="canonical" href="https://protonest.co/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://protonest.co/" />
        <meta property="og:title" content="IoT Prototyping Services by Protonest" />
        <meta property="og:description" content="Transform IoT ideas into reality with expert prototyping from Protonest. Built fast. Built right." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Protonest",
            "url": "https://protonest.co/",
            "description": "IoT prototyping services to transform ideas into reality.",
            "foundingDate": "2023",
            "founder": {
              "@type": "Person",
              "name": "Udara Kumarasena"
            }
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