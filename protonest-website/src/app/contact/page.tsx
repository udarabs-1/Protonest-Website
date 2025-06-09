"use client";
import Image from "next/image";
import FAQSection from "../components/faq";
import Testimonials from "../components/testimonials-contact";

export default function Contact() {
  return (
    <div>
      <div
        className="mt-[50px] h-[553px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/contact-1.svg')" }}
      >
        <div className="flex flex-col items-center justify-center h-full px-[133px]">
          <div className="flex justify-center">
            <div className="text-center text-[45px] font-medium font-montserrat">
              <span className="text-[rgba(108,108,108,1)]">
                Let’s Build Something
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Together!
              </span>
            </div>
          </div>
          <div className="text-center text-[18px] font-normal font-poppins mt-12 px-auto max-w-[500px]">
            <span className="text-[rgba(108,108,108,1)]">
              Got a project in mind or a question for us? We’re here to help you bring your IoT ideas to life.
            </span>
          </div>
        </div>
      </div>

      <div className="relative w-full min-h-screen">
        {/* Combined Background & Decorative Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/contact-2.svg" // Your exported combined image
            alt="Background with decorative elements"
            fill
            className="object-cover z-10 overflow-visible mt-[10px]"
            quality={100}
            priority
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 pt-[200px] px-[157px] pb-[100px]">
          {/* Title */}
          <div className="absolute left-[157px] top-[80px] w-[1127px] text-center">
            <span className="text-[30px] font-medium font-montserrat leading-[55px] bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
              Get in Touch
            </span>
          </div>


          {/* Form Container */}
          <form className="max-w-[770px] space-y-[50px]">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-[#6c6c6c] text-lg font-semibold font-poppins leading-[30px] mb-2">
                Name
              </label>
              <div className="border-b border-[#6c6c6c] pb-2">
                <input
                  id="name"
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full text-[#6c6c6c]/80 text-base font-normal font-poppins leading-[30px] bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[#6c6c6c] text-lg font-semibold font-poppins leading-[30px] mb-2">
                Email
              </label>
              <div className="border-b border-[#6c6c6c] pb-2">
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full text-[#6c6c6c]/80 text-base font-normal font-poppins leading-[30px] bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-[#6c6c6c] text-lg font-semibold font-poppins leading-[30px] mb-2">
                Message
              </label>
              <div className="border-b border-[#6c6c6c] pb-2">
                <textarea
                  id="message"
                  placeholder="Tell us a bit about your project or question"
                  className="w-full text-[#6c6c6c]/80 text-base font-normal font-poppins leading-[30px] bg-transparent outline-none resize-none min-h-[100px]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="inline-flex justify-center items-center mt-4 text-center">
              <button className="w-[180px] h-[50px] gradient-button font-medium font-poppins hover:font-semibold">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="relative w-[1440px] h-[656px] mt-[120px]">
        {/* Background Image */}
        <Image
          src="/contact-3.svg" // Replace with your image
          alt="Contact background"
          width={1440}
          height={585}
          className="absolute left-0 top-[57px] w-full h-[585px] object-cover"
        />

        {/* Title */}
        <div className="absolute left-[157px] top-0 w-[1127px] text-center">
          <h2 className="text-3xl font-medium font-montserrat leading-[55px]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Reach Us </span>
            <span className="text-[#6c6c6c]">Directly</span>
          </h2>
        </div>


        {/* Contact Cards Container */}
        <div className="absolute left-[160px] top-[148px] flex gap-[67px]">
          {/* Location Card */}
          <div className="w-[329px] h-[360px] bg-white/5 rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
            <div className="absolute w-full top-[60px] text-center text-[110px]">📍</div>
            <div className="absolute w-full top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4]  text-base font-normal font-poppins">
              Location
            </div>
            <div className="absolute w-[277px] left-1/2 transform -translate-x-1/2 top-[280px] text-center text-[#6c6c6c] text-[20px] font-semibold font-poppins">
              Kaduwela, Colombo,<br />Sri Lanka
            </div>
            <div className="absolute left-1/2 top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
          </div>

          {/* Phone Card */}
          <div className="w-[329px] h-[360px] bg-white/5 rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
            <div className="absolute w-full top-[60px] text-center text-[110px]">☎️</div>
            <div className="absolute w-full top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-base font-normal font-poppins">
              Phone
            </div>
            <div className="absolute w-[277px] left-1/2 transform -translate-x-1/2 top-[289px] text-center text-[#6c6c6c] text-xl font-semibold font-poppins">
              +94 771 482 755
            </div>
            <div className="absolute left-1/2 top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
          </div>

          {/* Email Card */}
          <div className="w-[329px] h-[360px] bg-white/5 rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] relative overflow-hidden">
            <div className="absolute w-full top-[60px] text-center text-[110px]">📧</div>
            <div className="absolute w-full top-[232px] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-base font-normal font-poppins">
              Email
            </div>
            <div className="absolute w-[277px] left-1/2 transform -translate-x-1/2 top-[289px] text-center text-[#6c6c6c] text-xl font-semibold font-poppins">
              info@protonest.co
            </div>
            <div className="absolute left-1/2 top-[196px] w-px h-px bg-[#767676] rounded-full transform -translate-x-1/2" />
          </div>
        </div>
      </div>

      <Testimonials />
      <FAQSection />
    </div >
  );
}
