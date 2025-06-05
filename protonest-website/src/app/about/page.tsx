"use client";
import Image from "next/image";
import ClientMarquee from "../components/clientMarquee";
import OurTeamSection from "../components/ourTeam";

export default function About() {
  return (
    <div>
      <div
        className="mt-[50px] h-[553px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/about-1.svg')" }}
      >
        <div className="flex flex-col items-center justify-center h-full px-[133px]">
          <div className="flex justify-center">
            <div className="text-center text-[45px] font-medium font-montserrat">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Join the Protonest Freelance Network
              </span>
              <br />
              <span className="text-[rgba(108,108,108,1)]">
                Build Innovative IoT Solutions
              </span>
            </div>
          </div>
          <div className="text-center text-[18px] font-normal font-poppins mt-12 px-auto max-w-[800px]">
            <span className="text-[rgba(108,108,108,1)]">
              At Protonest, we transform visionary IoT concepts into tangible solutions. Join us as a freelance innovator—let’s bring ideas to life together.
            </span>
          </div>
        </div>
      </div>

      <div className="relative w-[1441px] h-[996px]">
        {/* Background Image */}
        <Image
          src="/about-2.svg" // Replace with your actual image path
          alt="Our Journey background"
          width={1440}
          height={575}
          className="absolute left-0 top-[116px]"
        />

        {/* Title */}
        <div className="absolute left-[157px] top-[96px] w-[1127px] text-center">
          <span className="text-[30px] font-medium font-montserrat leading-[55px] bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
            Our Journey
          </span>
        </div>

        {/* Subtitle */}
        <div className="absolute left-[332px] top-[178px] w-[779px] text-center text-[#6c6c6c] text-[18px] font-normal font-poppins leading-[30px]">
          From Engineer&apos;s Vision to a Collective Force
        </div>

        {/* Description Text */}
        <div className="absolute left-[160px] top-[318px] w-[672px] text-[#6c6c6c] text-[16px] font-normal font-poppins leading-[30px]">
          Founded in June 2023 by an electronics engineer passionate about innovation, Protonest began as a vision to simplify IoT prototyping. Today, we&apos;re a growing team of 8+ specialists—engineers, designers, and thinkers—united by a shared goal: turning groundbreaking concepts into tangible, connected products.
          <br /><br />
          What started as one idea has become a collaborative hub for future-focused problem solvers in the IoT space.
        </div>

      </div>

      <div className="-mt-15 relative w-full h-[649px]">
        {/* Background Image */}
        <Image
          src="/about-3.svg" // Replace with your actual image path
          alt="Trusted by pioneers background"
          fill
          className="absolute -mt-20 left-[118px]"
        />

        {/* Title */}
        <div className="flex justify-center text-center w-full">
          <div className="w-[1124px]">
            <span className="text-[#6c6c6c] text-3xl font-medium font-montserrat leading-[55px]">
              Trusted By Pioneers In{' '}
            </span>
            <span className="font-medium font-montserrat text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Innovation</span>
          </div>
        </div>

        <div className="mt-15">
          <ClientMarquee />
        </div>
      </div>

      <div
        className="-mt-15 mb-20 h-[649px] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/about-4.svg')" }}
      >
        <div className="flex flex-col items-start justify-start h-full px-[133px]">
          <div className="flex justify-center">
            <div className="text-center text-[30px] font-medium font-montserrat">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                Our Mission
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center w-full my-12">
            <div className="text-[18px] w-[780px] font-normal font-poppins">
              <span className="text-[rgba(108,108,108,1)]">
                Empower innovators and thinkers by turning their IoT concepts into tangible, innovative, and advanced prototypes.
              </span>
            </div>
          </div>
          <div className="text-center text-[18px] font-normal font-poppins">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
              What Guides Us Every Day
            </span>
          </div>
          <div className="my-20 flex gap-8 justify-center">
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
                className="w-64 h-[360px] bg-white/5 rounded-[35px] shadow-lg border border-white/10 backdrop-blur-[20px] flex flex-col items-center pt-10 pb-8 relative"
              >
                {/* Emoji - Perfectly Centered */}
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[110px] leading-none">{value.emoji}</span>
                </div>


                {/* Title with Gradient Text */}
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-base font-normal font-poppins mb-2">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="pt-3 text-gray-500 text-xs font-normal font-poppins px-4 text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <OurTeamSection />


      <div className="mt-40 flex justify-center w-full">
        <div className="w-[1014px] text-center">
          <h2 className="text-[40px] font-medium font-montserrat leading-[55px]">
            <span className="text-[#6c6c6c]">
              Whether you&apos;re a founder, engineer, or team lead,
              <br />
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest</span>
            <span className="text-[#6c6c6c]">
              {' '}
              is ready to help you bring your
              <br />
              IoT idea to life.
            </span>
          </h2>
        </div>
      </div>



      <div className="mt-12 text-center">
        <button className="w-[180px] h-[50px] gradient-button font-medium font-poppins hover:font-semibold transition">
          Get a Quote
        </button>
      </div>

    </div >
  );
}
