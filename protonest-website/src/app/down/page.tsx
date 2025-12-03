"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

const BackButton = () => {
  const handleClick = useCallback(() => {

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

const ResponsiveImage = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div className={`relative ${isMobile
    ? 'w-50 h-50 md:w-58 md:h-58'
    : 'w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 2xl:w-[28rem] 2xl:h-[28rem]'
    }`}>
    <Image
      src="/down-1.png"
      alt="Maintenance illustration showing system upgrades in progress"
      fill
      className="object-contain"
      sizes={isMobile ? "(max-width: 768px) 100vw" : "(min-width: 1024px) 50vw"}

      quality={90}
      priority={!isMobile}
    />
  </div>
);

export default function Down() {
  return (
    <div className="bg-white">
      <Navbar />

      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-14 xl:px-16 2xl:px-28 pt-15 lg:pt-8">
        <BackButton />
      </div>

      
      <main className="min-h-screen overflow-visible bg-white">
        
        <div className="relative w-full h-screen flex items-center justify-center -mt-[150px] sm:-mt-[120px] md:-mt-[100px] lg:-mt-[150px]">
          
          <div className="absolute inset-0 z-10">
            <Image
              src="/404-1.svg"
              alt=""
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={true}
              quality={85}
              aria-hidden="true"
            />
          </div>

          
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-14 xl:px-16 2xl:px-28 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">

              
              <div className="flex-shrink-0 relative lg:hidden">
                <ResponsiveImage isMobile />
              </div>

              
              <div className="flex-1 text-center lg:text-left max-w-2xl px-2 sm:px-4 md:px-6 lg:px-0">
                
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-[#6c6c6c] font-medium font-['Poppins'] leading-tight mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
                  We&apos;ll be right back!
                </h1>

                
                <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 xl:space-y-10 max-w-lg mx-auto lg:mx-0">
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#6c6c6c] font-medium font-['Poppins'] leading-relaxed">
                    We&apos;re performing some upgrades to serve you better. Protonest will be back online shortly.
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#6c6c6c] font-medium font-['Poppins'] leading-relaxed">
                    Thanks for your patience! Innovation takes a little fine-tuning.
                  </p>
                </div>
              </div>

              
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