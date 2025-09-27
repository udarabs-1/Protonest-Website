"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import Footer from "./components/footer";
import Navbar from "./components/navbar";

// Optimized image blur placeholders
const backgroundImageBlurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjhmOGY4Ii8+Cjwvc3ZnPgo=";

const illustrationBlurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjBmMGYwIiByeD0iMjAiLz4KPC9zdmc+Cg==";

// Memoized Back Button Component
const BackButton = () => {
  const handleClick = useCallback(() => {
    // Optional: Add analytics or custom navigation logic here
  }, []);

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="inline-flex items-center text-[#6c6c6c] hover:text-[#5a5a5a] transition-colors duration-200 mb-4 sm:mb-6 focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 rounded-sm"
      aria-label="Go back to homepage"
    >
      <span className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-normal font-['Potta_One'] leading-[30px]">
        &lt;
      </span>
      <span className="text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl font-normal font-['Poppins'] leading-[30px] ml-1">
        Back
      </span>
    </Link>
  );
};

// Memoized Responsive Image Component
const ResponsiveImage = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div className={`relative ${isMobile
    ? 'w-50 h-50 md:w-58 md:h-58'
    : 'w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 2xl:w-[28rem] 2xl:h-[28rem]'
    }`}>
    <Image
      src="/404-2.png"
      alt="404 error illustration showing page not found"
      fill
      className="object-contain"
      sizes={isMobile ? "(max-width: 768px) 100vw" : "(min-width: 1024px) 50vw"}
      placeholder="blur"
      blurDataURL={illustrationBlurDataURL}
      quality={90}
      priority={!isMobile}
    />
  </div>
);

// Memoized Action Button Component
const ActionButton = ({ href, children, ariaLabel }: {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) => {
  const handleClick = useCallback(() => {
    // Optional: Add analytics tracking here
  }, []);

  return (
    <Link href={href} onClick={handleClick}>
      <button
        className="w-full sm:w-auto max-w-[250px] px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-sm sm:text-base font-semibold font-['Montserrat'] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
        aria-label={ariaLabel}
      >
        {children}
      </button>
    </Link>
  );
};

export default function NotFound() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Back Button positioned right below navbar for all screens */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-14 xl:px-16 2xl:px-28 pt-15 lg:pt-8">
        <BackButton />
      </div>

      {/* Main Content Area */}
      <main className="min-h-screen overflow-visible bg-white">
        {/* Background Image Container */}
        <div className="relative w-full h-screen flex items-center justify-center -mt-[150px] sm:-mt-[120px] md:-mt-[100px] lg:-mt-[150px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-10">
            <Image
              src="/404-1.svg"
              alt=""
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              placeholder="blur"
              blurDataURL={backgroundImageBlurDataURL}
              priority={true}
              quality={85}
              aria-hidden="true"
            />
          </div>

          {/* Content Container */}
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-14 xl:px-16 2xl:px-28 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">

              {/* Mobile Image - Shows only on smaller screens */}
              <div className="flex-shrink-0 relative lg:hidden">
                <ResponsiveImage isMobile />
              </div>

              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left max-w-2xl px-2 sm:px-4 md:px-6 lg:px-0">
                {/* Main heading */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-[#6c6c6c] font-medium font-['Poppins'] leading-tight mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
                  Oops! This page doesn&apos;t exist.
                </h1>

                {/* Content paragraphs */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 xl:space-y-10 max-w-lg mx-auto lg:mx-0">
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#6c6c6c] font-medium font-['Poppins'] leading-relaxed">
                    The page you&apos;re looking for might have been moved, deleted, or never existed.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16">
                  <ActionButton
                    href="/"
                    ariaLabel="Return to homepage"
                  >
                    Return Home
                  </ActionButton>
                  <ActionButton
                    href="/contact-us"
                    ariaLabel="Go to contact page"
                  >
                    Contact Us
                  </ActionButton>
                </div>
              </div>

              {/* Desktop Image */}
              <div className="flex-shrink-0 relative hidden lg:block">
                <ResponsiveImage />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}