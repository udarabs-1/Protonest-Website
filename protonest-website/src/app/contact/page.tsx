"use client";
import Image from "next/image";
import FAQSection from "../components/faq";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Testimonials from "../components/testimonials-contact";

export default function Contact() {
  return (
    <div>
      <Navbar />
      <div>
        {/* Hero Section */}
        <div
          className="mt-[30px] sm:mt-[40px] md:mt-[45px] lg:mt-[50px] h-[350px] sm:h-[420px] md:h-[480px] lg:h-[553px] bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/contact-1.svg')" }}
        >
          <div className="flex flex-col items-center justify-center h-full px-4 sm:px-8 md:px-12 lg:px-[133px]">
            <div className="flex justify-center">
              <div className="text-center text-[24px] sm:text-[30px] md:text-[37px] lg:text-[45px] font-medium font-montserrat">
                <span className="text-[rgba(108,108,108,1)]">
                  Let&apos;s Build Something
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                  Together!
                </span>
              </div>
            </div>
            <div className="text-center text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal font-poppins mt-6 sm:mt-8 md:mt-10 lg:mt-12 px-4 max-w-[400px] sm:max-w-[450px] md:max-w-[500px]">
              <span className="text-[rgba(108,108,108,1)]">
                Got a project in mind or a question for us? We&apos;re here to help you bring your IoT ideas to life.
              </span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative w-full min-h-screen">
          {/* Combined Background & Decorative Image */}
          <div className="absolute inset-0 w-full h-full z-10 overflow-visible -mt-[150px] sm:-mt-[180px] md:-mt-[220px] lg:-mt-[280px]">
            <Image
              src="/contact-2.svg"
              alt="Background with decorative elements"
              layout="responsive"
              width={1440}
              height={900}
              className="object-cover"
              quality={100}
              priority
            />
          </div>

          {/* Content Container */}
          <div className="relative z-10 pt-[120px] sm:pt-[140px] md:pt-[170px] lg:pt-[200px] px-4 sm:px-8 md:px-12 lg:px-[157px] pb-[60px] sm:pb-[70px] md:pb-[85px] lg:pb-[100px]">
            {/* Title */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[40px] sm:top-[50px] md:top-[65px] lg:top-[80px] w-full max-w-[1127px] text-center px-4">
              <span className="text-[20px] sm:text-[24px] md:text-[27px] lg:text-[30px] font-medium font-montserrat leading-[35px] sm:leading-[40px] md:leading-[50px] lg:leading-[55px] bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                Get in Touch
              </span>
            </div>

            {/* Form Container */}
            <form className="max-w-[500px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[770px] mx-auto space-y-[30px] sm:space-y-[35px] md:space-y-[42px] lg:space-y-[50px]">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-[#6c6c6c] text-base sm:text-base md:text-lg lg:text-lg font-semibold font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] mb-2">
                  Name
                </label>
                <div className="border-b border-[#6c6c6c] pb-2">
                  <input
                    id="name"
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full text-[#6c6c6c]/80 text-sm sm:text-sm md:text-base lg:text-base font-normal font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-[#6c6c6c] text-base sm:text-base md:text-lg lg:text-lg font-semibold font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] mb-2">
                  Email
                </label>
                <div className="border-b border-[#6c6c6c] pb-2">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="w-full text-[#6c6c6c]/80 text-sm sm:text-sm md:text-base lg:text-base font-normal font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-[#6c6c6c] text-base sm:text-base md:text-lg lg:text-lg font-semibold font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] mb-2">
                  Message
                </label>
                <div className="border-b border-[#6c6c6c] pb-2">
                  <textarea
                    id="message"
                    placeholder="Tell us a bit about your project or question"
                    className="w-full text-[#6c6c6c]/80 text-sm sm:text-sm md:text-base lg:text-base font-normal font-poppins leading-[25px] sm:leading-[27px] md:leading-[28px] lg:leading-[30px] bg-transparent outline-none resize-none min-h-[80px] sm:min-h-[90px] md:min-h-[95px] lg:min-h-[100px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="inline-flex justify-center items-center mt-4 text-center w-full">
                <button className="w-[150px] sm:w-[160px] md:w-[170px] lg:w-[180px] h-[45px] sm:h-[47px] md:h-[48px] lg:h-[50px] gradient-button font-medium font-poppins hover:font-semibold text-sm sm:text-sm md:text-base lg:text-base">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Cards Section */}
        <div className="relative w-full max-w-[1440px] mx-auto h-auto mt-0 lg:mt-[-50px] xl:mt-[-70px] pb-[60px] lg:pb-0">
          {/* Background Image */}
          <div className="absolute inset-0 top-[40px] sm:top-[45px] md:top-[51px] lg:top-[57px] h-[400px] sm:h-[450px] md:h-[520px] lg:h-[585px] overflow-hidden">
            <Image
              src="/contact-3.svg"
              alt="Contact background"
              width={1440}
              height={585}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title */}
          <div className="relative z-10 w-full text-center px-4 mb-[60px] sm:mb-[70px] md:mb-[80px] lg:mb-[90px]">
            <h2 className="text-[20px] sm:text-[22px] md:text-[26px] lg:text-3xl font-medium font-montserrat leading-[35px] sm:leading-[38px] md:leading-[48px] lg:leading-[55px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Reach Us </span>
              <span className="text-[#6c6c6c]">Directly</span>
            </h2>
          </div>

          {/* Contact Cards Container */}
          <div className="relative z-10 flex flex-col sm:flex-col md:flex-row justify-center items-center gap-6 sm:gap-6 md:gap-8 lg:gap-[67px] px-4 sm:px-8 md:px-12 lg:px-[160px]">
            {/* Location Card */}
            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[300px] lg:w-[329px] h-[300px] sm:h-[310px] md:h-[340px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
              <div className="absolute w-full top-[40px] sm:top-[45px] md:top-[55px] lg:top-[60px] text-center text-[70px] sm:text-[80px] md:text-[95px] lg:text-[110px]">📍</div>
              <div className="absolute w-full top-[160px] sm:top-[170px] md:top-[200px] lg:top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm sm:text-sm md:text-base lg:text-base font-normal font-poppins">
                Location
              </div>
              <div className="absolute w-[250px] sm:w-[280px] md:w-[270px] lg:w-[277px] left-1/2 transform -translate-x-1/2 top-[190px] sm:top-[200px] md:top-[240px] lg:top-[280px] text-center text-[#6c6c6c] text-[16px] xl:text-[20px] font-semibold font-poppins px-2">
                Kaduwela, Colombo,<br />Sri Lanka
              </div>
              <div className="absolute left-1/2 top-[140px] sm:top-[150px] md:top-[178px] lg:top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
            </div>

            {/* Phone Card */}
            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[300px] lg:w-[329px] h-[300px] sm:h-[310px] md:h-[340px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
              <div className="absolute w-full top-[40px] sm:top-[45px] md:top-[55px] lg:top-[60px] text-center text-[70px] sm:text-[80px] md:text-[95px] lg:text-[110px]">☎️</div>
              <div className="absolute w-full top-[160px] sm:top-[170px] md:top-[200px] lg:top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm sm:text-sm md:text-base lg:text-base font-normal font-poppins">
                Phone
              </div>
              <div className="absolute w-[250px] sm:w-[280px] md:w-[270px] lg:w-[277px] left-1/2 transform -translate-x-1/2 top-[200px] sm:top-[210px] md:top-[250px] lg:top-[289px] text-center text-[#6c6c6c] text-[16px] xl:text-xl font-semibold font-poppins">
                +94 771 482 755
              </div>
              <div className="absolute left-1/2 top-[140px] sm:top-[150px] md:top-[178px] lg:top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
            </div>

            {/* Email Card */}
            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[300px] lg:w-[329px] h-[300px] sm:h-[310px] md:h-[340px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
              <div className="absolute w-full top-[40px] sm:top-[45px] md:top-[55px] lg:top-[60px] text-center text-[70px] sm:text-[80px] md:text-[95px] lg:text-[110px]">📧</div>
              <div className="absolute w-full top-[160px] sm:top-[170px] md:top-[200px] lg:top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm sm:text-sm md:text-base lg:text-base font-normal font-poppins">
                Email
              </div>
              <div className="absolute w-[250px] sm:w-[280px] md:w-[270px] lg:w-[277px] left-1/2 transform -translate-x-1/2 top-[200px] sm:top-[210px] md:top-[250px] lg:top-[289px] text-center text-[#6c6c6c] text-[16px] xl:text-xl font-semibold font-poppins px-2">
                info@protonest.co
              </div>
              <div className="absolute left-1/2 top-[140px] sm:top-[150px] md:top-[178px] lg:top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
            </div>
          </div>
        </div>

        <Testimonials />
        <FAQSection />
      </div>
      <Footer />
    </div>

  );
}