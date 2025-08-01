"use client";
import Image from "next/image";
import ClientMarquee from "../components/clientMarquee";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import OurTeamSection from "../components/ourTeam";

export default function About() {
  return (
    <div>
      <Navbar />
      <div>
        <div
          className="mt-[50px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[553px] bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/about-1.svg')" }}
        >
          <div className="flex flex-col items-center justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[133px]">
            <div className="flex justify-center">
              <div className="text-center text-[24px] sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[45px] font-medium font-montserrat">
                <span className="text-[rgba(108,108,108,1)]">
                  Building the Future of
                </span>

                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                  IoT Innovation
                </span>
              </div>
            </div>
            <div className="text-center text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal font-poppins mt-6 sm:mt-8 md:mt-10 lg:mt-12 px-4 max-w-[300px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] xl:max-w-[1000px]">
              <span className="text-[rgba(108,108,108,1)]">
                Protonest is a dynamic IoT engineering lab transforming visionary ideas into scalable, working products. Whether you&apos;re launching a new smart device or need rapid prototyping, we’re here to help.</span>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px] xl:h-[996px] overflow-visible">
          {/* Background Image */}
          <div className="absolute inset-0 flex justify-center">
            <Image
              src="/about-2.svg"
              alt="Our Journey background"
              width={1440}
              height={575}
              className="absolute top-[60px] sm:top-[80px] md:top-[100px] lg:top-[116px] w-full h-auto object-contain"
            />
          </div>

          {/* Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[40px] sm:top-[60px] md:top-[80px] lg:top-[96px] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[1127px] text-center">
            <span className="text-[20px] sm:text-[24px] md:text-[27px] lg:text-[30px] font-medium font-montserrat leading-[35px] sm:leading-[40px] md:leading-[50px] lg:leading-[55px] bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
              Our Journey
            </span>
          </div>

          {/* Subtitle */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[90px] sm:top-[120px] md:top-[150px] lg:top-[178px] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[779px] text-center text-[#6c6c6c] text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal font-poppins leading-[24px] sm:leading-[28px] lg:leading-[30px]">
            From Engineer&apos;s Vision to a Collective Force
          </div>

          {/* Description Text */}
          <div className="absolute left-2 md:left-[15%] top-[150px] sm:top-[220px] md:top-[260px] lg:top-[318px] w-[70%] sm:w-[80%] md:w-[70%] lg:w-[45%] text-[#6c6c6c] text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-normal font-poppins leading-[20px] sm:leading-[24px] md:leading-[28px] lg:leading-[30px] px-4 lg:px-0">
            Founded in June 2023 by an electronics engineer passionate about innovation, Protonest began as a vision to simplify IoT prototyping. Today, we&apos;re a growing team of 8+ specialists—engineers, designers, and thinkers—united by a shared goal: turning groundbreaking concepts into tangible, connected products.
            <br /><br />
            What started as one idea has become a collaborative hub for future-focused problem solvers in the IoT space.
          </div>
        </div>

        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[649px] overflow-hidden -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">
          {/* Background Image */}
          <div className="absolute inset-0 flex justify-center">
            <Image
              src="/about-3.svg"
              alt="Trusted by pioneers background"
              width={1440}
              height={649}
              className="w-full max-w-[1440px] h-auto object-contain"
            />
          </div>

          {/* Title */}
          <div className="flex justify-center text-center w-full pt-8 sm:pt-12 md:pt-16 lg:pt-20">
            <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[1124px] px-4">
              <span className="text-[#6c6c6c] text-[20px] sm:text-[24px] md:text-[28px] lg:text-3xl font-medium font-montserrat leading-[35px] sm:leading-[40px] md:leading-[50px] lg:leading-[55px]">
                Trusted By Pioneers In{' '}
              </span>
              <span className="font-medium font-montserrat text-[20px] sm:text-[24px] md:text-[28px] lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Innovation</span>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-15">
            <ClientMarquee />
          </div>
        </div>

        {/* Our Mission Section - Reduced spacing */}
        <div
          className="min-h-[800px] sm:min-h-[700px] md:min-h-[700px] lg:min-h-[649px] bg-no-repeat bg-cover bg-center -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16"
          style={{ backgroundImage: "url('/about-4.svg')" }}
        >
          <div className="flex flex-col items-start justify-start h-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[133px] py-8 sm:py-12 md:py-16">
            <div className="flex justify-center w-full">
              <div className="text-center text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] font-medium font-montserrat">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                  Our Mission
                </span>
              </div>
            </div>
            <div className="flex justify-center w-full my-6 sm:my-8 md:my-10 lg:my-12">
              <div className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] w-full max-w-[780px] font-normal font-poppins text-center">
                <span className="text-[rgba(108,108,108,1)]">
                  Empower innovators and thinkers by turning their IoT concepts into tangible, innovative, and advanced prototypes.
                </span>
              </div>
            </div>
            <div className="text-center text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal font-poppins w-full">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                What Guides Us Every Day
              </span>
            </div>
            <div className="w-full my-8 sm:my-12 md:my-16 lg:my-20 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  title: "Innovation",
                  emoji: "🚀",
                  description: "We push the edge of what's possible in connected tech."
                },
                {
                  title: "Collaboration",
                  emoji: "🤝",
                  description: "Working side-by-side with our clients to co-create."
                },
                {
                  title: "Excellence",
                  emoji: "🎯",
                  description: "Every detail matters, from PCB to final delivery."
                },
                {
                  title: "Integrity",
                  emoji: "🛡️",
                  description: "Transparent, honest, and always accountable."
                }
              ].map((value, index) => (
                <div
                  key={index}
                  className="w-[280px] sm:w-[200px] md:w-[220px] lg:w-64 h-[280px] sm:h-[320px] md:h-[340px] lg:h-[360px] bg-white/5 rounded-[25px] sm:rounded-[30px] lg:rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] flex flex-col items-center relative"
                >
                  {/* Emoji Section - Fixed Height */}
                  <div className="h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] flex items-center justify-center">
                    <span className="text-[80px] md:text-[100px] lg:text-[110px] leading-none">{value.emoji}</span>
                  </div>

                  {/* Content Section - Fixed positioning */}
                  <div className="flex-1 flex flex-col items-center justify-start pt-2">
                    {/* Title with Gradient Text */}
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-sm sm:text-base font-normal font-poppins mb-3 text-center">
                      {value.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-[10px] sm:text-xs font-normal font-poppins px-3 sm:px-4 text-center leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Team Section - Reduced top margin */}
        <div className="-mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16">
          <OurTeamSection />
        </div>

        {/* Final CTA Section - Reduced top margin */}
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 flex justify-center w-full px-4">
          <div className="w-full max-w-[1014px] text-center">
            <h2 className="text-[24px] sm:text-[30px] md:text-[35px] xl:text-[40px] font-medium font-montserrat leading-[35px] sm:leading-[40px] md:leading-[50px] lg:leading-[55px]">
              <span className="text-[#6c6c6c]">
                Whether you&apos;re a founder, engineer, or team lead,
                <br className="hidden sm:block" />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest</span>
              <span className="text-[#6c6c6c]">
                {' '}
                is ready to help you bring your
                <br className="hidden sm:block" />
                IoT idea to life.
              </span>
            </h2>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 text-center pb-8 sm:pb-12 md:pb-16">
          <button className="w-[150px] sm:w-[170px] md:w-[180px] h-[45px] sm:h-[48px] md:h-[50px] gradient-button font-medium font-poppins hover:font-semibold transition text-sm sm:text-base">
            Get a Quote
          </button>
        </div>

      </div>
      <Footer />
    </div>

  );
}