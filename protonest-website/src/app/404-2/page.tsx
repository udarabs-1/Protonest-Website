import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

export default function NotFound() {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="min-h-screen overflow-hidden bg-white">
        {/* Main Content Area */}
        <div className="relative w-full h-screen flex items-center justify-center bg-white">
          {/* Background image with proper opacity */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/404-1.svg"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

              {/* Mobile Image - Shows only on smaller screens at the top */}
              <div className="flex-shrink-0 relative lg:hidden order-first">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image
                    src="/404-2.png"
                    alt="404 Page Not Found Illustration"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left max-w-2xl">
                {/* Back navigation - Hidden on smaller screens */}
                <div className="mb-8 lg:mb-12 hidden lg:block">
                  <Link
                    href="/"
                    className="inline-flex items-center text-[#6c6c6c] hover:text-[#5530fa] transition-colors duration-200"
                  >
                    <span className="text-xl font-normal font-['Potta_One'] leading-[30px]">&lt; </span>
                    <span className="text-lg font-normal font-['Poppins'] leading-[30px] ml-1">Back</span>
                  </Link>
                </div>

                {/* Main heading */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#6c6c6c] font-medium font-['Poppins'] leading-tight mb-6 lg:mb-8">
                  Oops! This page doesn&apos;t exist.
                </h1>

                {/* Subheading */}
                <p className="text-base md:text-lg lg:text-xl text-[#6c6c6c] font-medium font-['Poppins'] leading-relaxed mb-8 lg:mb-12 max-w-lg mx-auto lg:mx-0">
                  The page you&apos;re looking for might have been moved, deleted, or never existed.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/">
                    <button className="w-full sm:w-auto px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] outline  outline-offset-[-1px] text-white text-base font-semibold font-['Montserrat'] hover:shadow-lg hover:scale-105 transition-all duration-200">
                      Return Home
                    </button>
                  </Link>

                  <Link href="/contact">
                    <button className="w-full sm:w-auto px-6 py-4 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] outline  outline-offset-[-1px] text-white text-base font-semibold font-['Montserrat'] hover:shadow-lg hover:scale-105 transition-all duration-200">
                      Contact Us
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Content - Desktop Image (Hidden on smaller screens) */}
              <div className="flex-shrink-0 relative hidden lg:block">
                <div className="relative w-96 h-96">
                  <Image
                    src="/404-2.png"
                    alt="404 Page Not Found Illustration"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}