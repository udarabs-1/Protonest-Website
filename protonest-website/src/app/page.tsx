import Image from "next/image";
import ClientMarquee from "./components/clientMarquee";
import NewsAndBlogs from "./components/newsAndBlogs";

import ProjectSlider from "./components/projectsSlider";
import TestimonialSection from "./components/testimonials";
import WhyChooseProtonest from "./components/whyChoose";

export default function Home() {
  return (

    <div>

      <div
        className="mt-[50px] h-[553px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/home-1.svg')" }}
      >
        <div className="flex flex-col items-center justify-center h-full px-[133px]">
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

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pb-[120px]">
        {/* Ellipse container */}
        <div className="relative w-[90px] h-[90px] mb-6"> {/* Adjusted dimensions for ellipse */}
          <Image
            src="/ellipse.svg"
            alt="Profile Background"
            fill
            className="object-contain"
            unoptimized
          />
          {/* Profile picture inside ellipse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[70px] w-[70px] rounded-full overflow-hidden"> {/* Circular image container */}
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

        {/* Name and title */}
        <div className="text-center mb-8 font-poppins text-[18px] text-[#6C6C6C]">
          Udara Kumarasena, Chief Executive Officer
        </div>

        {/* Quote container */}
        <div className="relative w-full flex items-start">
          {/* Left quotation mark */}
          <div className="absolute left-0 top-0 h-16 w-16 -ml-12 -mt-4 text-gray-300">
            <Image
              src="/quotation1.svg"
              alt="Opening quotation mark"
              width={64}
              height={64}
              className="h-full w-full"
            />
          </div>

          {/* Quote text */}
          <div className="flex-grow py-8 text-center">
            <p className="text-[40px] font-montserrat leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">At Protonest,</span>
              <span className="text-[#6C6C6C]"> we prototype, engineer, and deliver IoT systems that push boundaries and help great ideas go further, faster.</span>
            </p>
          </div>

          {/* Right quotation mark */}
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
                From Idea to Execution, We’ve Got You Covered.
              </span>
            </div>
            <div className="text-[18px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer">Get a Quote &gt;</span>
            </div>
          </div>

          <div className="w-full">
            {/* First row */}
            <div className="flex justify-between mb-12">
              {/* Image 1 */}
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

              {/* Image 2 */}
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

              {/* Image 3 */}
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
            <div className="flex justify-between">
              {/* Image 4 */}
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

              {/* Image 5 */}
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

              {/* Image 6 */}
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

      <div className="bg-[#FAFAFA] py-16 w-full h-[316px] flex items-center hover:bg-black transition-all duration-300 group">
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 lg:gap-[211px] max-w-screen-xl mx-auto">

          {/* Item 1 */}
          <div className="text-center">
            <div className="text-[#6c6c6c] text-[60px] font-medium font-montserrat leading-[55px] mb-2">
              100+
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[18px] font-normal font-poppins group-hover:from-[#B4B4B4] group-hover:to-[#4E4E4E]">
              Projects
            </div>
          </div>

          {/* Item 2 */}
          <div className="text-center">
            <div className="text-[#6c6c6c] text-[60px] font-medium font-montserrat leading-[55px] mb-2">
              100+
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[18px] font-normal font-poppins group-hover:from-[#B4B4B4] group-hover:to-[#4E4E4E]">
              Satisfied Clients
            </div>
          </div>

          {/* Item 3 */}
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

      <ProjectSlider />

      <TestimonialSection />
      <WhyChooseProtonest />
      <NewsAndBlogs />

      <div className="mt-12 text-center">
        <button className="w-[180px] h-[50px] gradient-button font-medium font-poppins hover:font-semibold transition">
          View All Article
        </button>
      </div>

    </div>

  );
}
