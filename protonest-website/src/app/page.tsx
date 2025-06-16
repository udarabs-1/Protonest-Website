// Main Homepage Component
import Image from "next/image";
import ClientMarquee from "./components/clientMarquee";
import NewsAndBlogs from "./components/newsAndBlogs";
import ProjectSlider from "./components/projectsSlider";
import TestimonialSection from "./components/testimonials";
import WhyChooseProtonest from "./components/whyChoose";

// Large Screen Component (lg, xl, 2xl)
function LargeScreenHome() {
  return (
    <div className="hidden lg:block">
      {/* Hero Section */}
      <div
        className="mt-[50px] h-[553px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/home-1.svg')" }}
      >
        <div className="flex flex-col items-center justify-center h-full px-auto xl:px-[133px]">
          <div className="flex justify-center">
            <div className="text-center text-[45px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Powering the Next Wave of
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Connected Devices
              </span>
            </div>
          </div>
          <div className="text-center text-[18px] font-normal font-poppins mt-12 px-[320px]">
            <span className="text-[rgba(108,108,108,1)]">
              At Protonest, we bring bold IoT visions to life—prototyping, engineering, and building the future of connectivity.
            </span>
          </div>
          <div className="flex justify-center space-x-[33px] mt-12 h-[65px] font-poppins font-medium text-[16px]">
            <button className="w-[312px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300">
              Get Your Free Quote Now
            </button>
            <button className="w-[266px] gradient-button font-medium">
              Join as a Freelancer
            </button>
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div
        className="mt-[120px] h-[649px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/home-2.svg')" }}
      >
        <div className="flex flex-col items-start justify-start h-full px-[133px]">
          <div className="flex justify-center">
            <div className="text-center text-[30px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Explore Our{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Clients
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center w-full my-12">
            <div className="text-[18px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)]">
                Trusted by Pioneers in Innovation. When they build, they build with us.
              </span>
            </div>
            <div className="text-[18px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">About Us &gt;</span>
            </div>
          </div>
          <ClientMarquee />
        </div>
      </div>

      {/* CEO Quote Section */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pb-[120px]">
        <div className="relative w-[90px] h-[90px] mb-6">
          <Image
            src="/ellipse.svg"
            alt="Profile Background"
            fill
            className="object-contain"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[70px] w-[70px] rounded-full overflow-hidden">
              <Image
                src="/profile.svg"
                alt="Udara Kumarasena"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-8 font-poppins text-[18px] text-[#6C6C6C]">
          Udara Kumarasena, Chief Executive Officer
        </div>

        <div className="relative w-full flex items-start">
          <div className="absolute left-0 top-0 h-16 w-16 -ml-12 -mt-4 text-gray-300">
            <Image
              src="/quotation1.svg"
              alt="Opening quotation mark"
              width={64}
              height={64}
              className="h-full w-full"
            />
          </div>

          <div className="flex-grow py-8 text-center">
            <p className="text-[35px] xl:text-[40px] font-montserrat leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">At Protonest,</span>
              <span className="text-[#6C6C6C]"> we prototype, engineer, and deliver IoT systems that push boundaries and help great ideas go further, faster.</span>
            </p>
          </div>

          <div className="absolute right-0 bottom-0 h-16 w-16 -mr-12 -mb-4 text-gray-300">
            <Image
              src="/quotation2.svg"
              alt="Closing quotation mark"
              width={64}
              height={64}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div
        className="mt-[120px] mb-[80px] h-[649px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/home-3.svg')" }}
      >
        <div className="flex flex-col items-start justify-start h-full px-[133px]">
          <div className="flex justify-center">
            <div className="text-center text-[30px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                What Do We{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Offer?
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center w-full my-12">
            <div className="text-[18px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)]">
                From Idea to Execution, We&apos;ve Got You Covered.
              </span>
            </div>
            <div className="text-[18px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">Get a Quote &gt;</span>
            </div>
          </div>

          <div className="w-full">
            {/* First row */}
            <div className="flex justify-between mb-12 gap-3">
              <div className="relative group w-[510px] h-[186px]">
                <div className="absolute inset-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-[35px]">
                  <Image
                    src="/service-1.svg"
                    alt="Service 1"
                    width={510}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
                <div className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]">
                  <Image
                    src="/service-1-hover.svg"
                    alt="Service 1 Hover"
                    width={510}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
              </div>

              <div className="relative group w-[264px] h-[186px]">
                <div className="absolute inset-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-[35px]">
                  <Image
                    src="/service-2.svg"
                    alt="Service 2"
                    width={264}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
                <div className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]">
                  <Image
                    src="/service-2-hover.svg"
                    alt="Service 2 Hover"
                    width={264}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
              </div>

              <div className="relative group w-[264px] h-[186px]">
                <div className="absolute inset-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-[35px]">
                  <Image
                    src="/service-3.svg"
                    alt="Service 3"
                    width={264}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
                <div className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]">
                  <Image
                    src="/service-3-hover.svg"
                    alt="Service 3 Hover"
                    width={264}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
              </div>
            </div>

            {/* Second row */}
            <div className="flex justify-between gap-3">
              <div className="relative group w-[264px] h-[186px]">
                <div className="absolute inset-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-[35px]">
                  <Image
                    src="/service-4.svg"
                    alt="Service 4"
                    width={264}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
                <div className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]">
                  <Image
                    src="/service-4-hover.svg"
                    alt="Service 4 Hover"
                    width={264}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
              </div>

              <div className="relative group w-[510px] h-[186px]">
                <div className="absolute inset-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-[35px]">
                  <Image
                    src="/service-5.svg"
                    alt="Service 5"
                    width={510}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
                <div className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]">
                  <Image
                    src="/service-5-hover.svg"
                    alt="Service 5 Hover"
                    width={510}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
              </div>

              <div className="relative group w-[264px] h-[186px]">
                <div className="absolute inset-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-[35px]">
                  <Image
                    src="/service-6.svg"
                    alt="Service 6"
                    width={264}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
                <div className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]">
                  <Image
                    src="/service-6-hover.svg"
                    alt="Service 6 Hover"
                    width={264}
                    height={186}
                    className="object-contain rounded-[35px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#FAFAFA] py-16 w-full h-[316px] flex items-center hover:bg-black transition-all duration-300 group">
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 lg:gap-[211px] max-w-screen-xl mx-auto">
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

// Small/Medium Screen Component (sm, md)
function SmallScreenHome() {
  return (
    <div className="lg:hidden">
      {/* Hero Section */}
      <div
        className="mt-8 h-[400px] sm:h-[500px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/home-1.svg')" }}
      >
        <div className="flex flex-col items-center justify-center h-full px-4 sm:px-8">
          <div className="flex justify-center">
            <div className="text-center text-[24px] sm:text-[32px] md:text-[36px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Powering the Next Wave of
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Connected Devices
              </span>
            </div>
          </div>
          <div className="text-center text-[14px] sm:text-[16px] font-normal font-poppins mt-6 sm:mt-8 px-4 sm:px-8">
            <span className="text-[rgba(108,108,108,1)]">
              At Protonest, we bring bold IoT visions to life—prototyping, engineering, and building the future of connectivity.
            </span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8 font-poppins font-medium text-[14px] sm:text-[16px]">
            <button className="w-[230px] sm:w-[280px] h-[50px] sm:h-[60px] cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[30px] sm:rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300">
              Get Your Free Quote Now
            </button>
            <button className="w-full sm:w-[240px] h-[50px] sm:h-[60px] gradient-button font-medium">
              Join as a Freelancer
            </button>
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div
        className="mt-12 sm:mt-16 min-h-[400px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/home-2.svg')" }}
      >
        <div className="flex flex-col items-center justify-start h-full px-4 sm:px-8 py-8">
          <div className="flex justify-center mb-6">
            <div className="text-center text-[24px] sm:text-[28px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Explore Our{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Clients
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-8 gap-4">
            <div className="text-[14px] sm:text-[16px] font-normal font-poppins text-center sm:text-left">
              <span className="text-[rgba(108,108,108,1)]">
                Trusted by Pioneers in Innovation. When they build, they build with us.
              </span>
            </div>
            <div className="text-[14px] sm:text-[16px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">About Us &gt;</span>
            </div>
          </div>
          <ClientMarquee />
        </div>
      </div>

      {/* CEO Quote Section */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center py-12 sm:py-16 px-4 sm:px-8">
        <div className="relative w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] mb-4">
          <Image
            src="/ellipse.svg"
            alt="Profile Background"
            fill
            className="object-contain"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[55px] w-[55px] sm:h-[65px] sm:w-[65px] rounded-full overflow-hidden">
              <Image
                src="/profile.svg"
                alt="Udara Kumarasena"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-6 font-poppins text-[14px] sm:text-[16px] text-[#6C6C6C]">
          Udara Kumarasena, Chief Executive Officer
        </div>

        <div className="relative w-full flex items-start">
          <div className="absolute left-0 top-0 h-8 w-8 sm:h-12 sm:w-12 -ml-4 sm:-ml-8 -mt-2 sm:-mt-4 text-gray-300">
            <Image
              src="/quotation1.svg"
              alt="Opening quotation mark"
              width={48}
              height={48}
              className="h-full w-full"
            />
          </div>

          <div className="flex-grow py-4 sm:py-6 text-center px-6 sm:px-8">
            <p className="text-[18px] sm:text-[24px] md:text-[28px] font-montserrat leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">At Protonest,</span>
              <span className="text-[#6C6C6C]"> we prototype, engineer, and deliver IoT systems that push boundaries and help great ideas go further, faster.</span>
            </p>
          </div>

          <div className="absolute right-0 bottom-0 h-8 w-8 sm:h-12 sm:w-12 -mr-4 sm:-mr-8 -mb-2 sm:-mb-4 text-gray-300">
            <Image
              src="/quotation2.svg"
              alt="Closing quotation mark"
              width={48}
              height={48}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div
        className="mt-12 sm:mt-16 mb-12 min-h-[600px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/home-3.svg')" }}
      >
        <div className="flex flex-col items-center justify-start h-full px-4 sm:px-8 py-8">
          <div className="flex justify-center mb-6">
            <div className="text-center text-[24px] sm:text-[28px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                What Do We{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Offer?
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-8 gap-4">
            <div className="text-[14px] sm:text-[16px] font-normal font-poppins text-center sm:text-left">
              <span className="text-[rgba(108,108,108,1)]">
                From Idea to Execution, We&apos;ve Got You Covered.
              </span>
            </div>
            <div className="text-[14px] sm:text-[16px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">Get a Quote &gt;</span>
            </div>
          </div>

          <div className="w-full max-w-sm sm:max-w-2xl">
            {/* Services Grid - Updated with glassmorphism cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Service 1 - Concept Development */}
              <div className="w-full h-[186px] relative bg-white/5 rounded-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden group hover:bg-white/10 transition-all duration-300">
                <div className="w-[100px] sm:w-[113px] left-[15px] sm:left-[20px] top-[20px] sm:top-[27px] absolute text-[#4d4d4d] text-xs sm:text-sm font-normal font-poppins leading-tight">
                  Concept Development and Ideation
                </div>
                <div className="absolute bottom-2 right-2 w-16 h-16 sm:w-20 sm:h-20 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <Image
                    src="/service-1-icon.svg"
                    alt="Concept Development"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Service 2 - Hardware Design */}
              <div className="w-full h-[186px] relative bg-white/5 rounded-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden group hover:bg-white/10 transition-all duration-300">
                <div className="absolute top-2 right-2 w-16 h-16 sm:w-20 sm:h-20 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <Image
                    src="/service-2-icon.svg"
                    alt="Hardware Design"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="w-[80px] sm:w-[90px] left-[15px] sm:left-[20px] bottom-[20px] sm:bottom-[25px] absolute text-[#4d4d4d] text-xs sm:text-sm font-normal font-poppins leading-tight">
                  Custom Hardware Designing
                </div>
              </div>

              {/* Service 3 - Software Development */}
              <div className="w-full h-[186px] relative bg-white/5 rounded-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden group hover:bg-white/10 transition-all duration-300">
                <div className="absolute top-2 left-2 w-16 h-16 sm:w-20 sm:h-20 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <Image
                    src="/service-3-icon.svg"
                    alt="Software Development"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="w-[90px] sm:w-[100px] right-[15px] sm:right-[20px] bottom-[20px] sm:bottom-[25px] absolute text-right text-[#4d4d4d] text-xs sm:text-sm font-normal font-poppins leading-tight">
                  Software Development
                </div>
              </div>

              {/* Service 4 - Testing */}
              <div className="w-full h-[186px] relative bg-white/5 rounded-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden group hover:bg-white/10 transition-all duration-300">
                <div className="absolute top-2 left-2 w-20 h-20 sm:w-24 sm:h-24 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <Image
                    src="/service-4-icon.svg"
                    alt="Testing"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="w-[85px] sm:w-[95px] left-[15px] sm:left-[20px] bottom-[20px] sm:bottom-[25px] absolute text-[#4d4d4d] text-xs sm:text-sm font-normal font-poppins leading-tight">
                  Testing and Validation
                </div>
              </div>

              {/* Service 5 - Consultation */}
              <div className="w-full h-[186px] relative bg-white/5 rounded-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden group hover:bg-white/10 transition-all duration-300">
                <div className="w-[90px] sm:w-[100px] left-[15px] sm:left-[20px] top-[20px] sm:top-[27px] absolute text-[#4d4d4d] text-xs sm:text-sm font-normal font-poppins leading-tight">
                  Consultation
                </div>
                <div className="absolute bottom-2 right-2 w-16 h-16 sm:w-20 sm:h-20 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <Image
                    src="/service-5-icon.svg"
                    alt="Consultation"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Service 6 - Post Development */}
              <div className="w-full h-[186px] relative bg-white/5 rounded-[35px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden group hover:bg-white/10 transition-all duration-300">
                <div className="absolute bottom-2 left-2 w-16 h-16 sm:w-20 sm:h-20 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <Image
                    src="/service-6-icon.svg"
                    alt="Post Development"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="w-[90px] sm:w-[100px] right-[15px] sm:right-[20px] bottom-[20px] sm:bottom-[25px] absolute text-right text-[#4d4d4d] text-xs sm:text-sm font-normal font-poppins leading-tight">
                  Post Development Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#FAFAFA] py-12 sm:py-16 w-full min-h-[200px] flex items-center hover:bg-black transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-16 max-w-screen-xl mx-auto px-4">
          <div className="text-center">
            <div className="text-[#6c6c6c] text-[40px] sm:text-[50px] font-medium font-montserrat leading-[45px] mb-2">
              100+
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[14px] sm:text-[16px] font-normal font-poppins group-hover:from-[#B4B4B4] group-hover:to-[#4E4E4E]">
              Projects
            </div>
          </div>

          <div className="text-center">
            <div className="text-[#6c6c6c] text-[40px] sm:text-[50px] font-medium font-montserrat leading-[45px] mb-2">
              100+
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[14px] sm:text-[16px] font-normal font-poppins group-hover:from-[#B4B4B4] group-hover:to-[#4E4E4E]">
              Satisfied Clients
            </div>
          </div>

          <div className="text-center">
            <div className="text-[#6c6c6c] text-[40px] sm:text-[50px] font-medium font-montserrat leading-[45px] mb-2">
              3+
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[14px] sm:text-[16px] font-normal font-poppins group-hover:from-[#B4B4B4] group-hover:to-[#4E4E4E]">
              Years in the Industry
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Export Component
export default function Home() {
  return (
    <div>
      {/* Large Screen Layout */}
      <LargeScreenHome />

      {/* Small/Medium Screen Layout */}
      <SmallScreenHome />

      {/* Shared Components - These remain the same for all screen sizes */}
      <ProjectSlider />
      <TestimonialSection />
      <WhyChooseProtonest />
      <NewsAndBlogs />
    </div>
  );
}