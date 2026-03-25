"use client";
import Image from "next/image";
import SectionHeader from "./section-header";

const OurTeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      title: "Creative Thinkers",
      isLeft: true,
    },
    {
      id: 2,
      title: "Expert Engineers",
      isLeft: false,
    },
    {
      id: 3,
      title: "Designers",
      isLeft: true,
    },
  ];

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16 py-6 sm:py-8 lg:py-12 xl:py-16">
        <SectionHeader
          highlight="Our Team"
          description="Our strength lies in our collective expertise. Each member brings a unique skill set and a shared vision to create meaningful IoT solutions. We combine creativity, strategy, and technology to deliver world-class results."
          align="center"
        />

        <div className="hidden justify-center mb-8 sm:mb-12 lg:mb-16">
          <div className="relative w-full max-w-3xl aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/team.jpg"
              alt="Protonest team"
              fill
              priority
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="relative w-full min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px] overflow-visible">
        <div className="absolute -top-12 sm:-top-16 lg:-top-20 left-0 right-0 bottom-0 w-full -z-10">
          <Image
            src="/about-5-mobile.svg"
            alt="Our team background mobile"
            fill
            priority={false}
            quality={65}
            sizes="(max-width: 1024px) 100vw, 0px"
            className="object-cover object-center lg:hidden"
          />

          <Image
            src="/about-5.svg"
            alt="Our team background desktop"
            fill
            priority={false}
            quality={70}
            sizes="(min-width: 1024px) 100vw, 0px"
            className="object-cover object-center hidden lg:block"
          />
        </div>

        <div className="absolute left-0 top-0 w-8 sm:w-16 lg:w-32 xl:w-40 h-full bg-gradient-to-r from-white to-white/0 pointer-events-none" />
        <div className="absolute right-0 top-0 w-8 sm:w-16 lg:w-32 xl:w-40 h-full bg-gradient-to-l from-white to-white/0 pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-16 py-6 sm:py-8 lg:py-12 xl:py-16">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-normal font-poppins leading-relaxed">
              <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                Our Team Includes
              </span>
            </h3>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-16 xl:gap-20 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-28 h-28 xl:w-32 xl:h-32 mb-6 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={`/team${member.id}.svg`}
                    alt={`${member.title} icon`}
                    width={128}
                    height={128}
                    priority={index === 0}
                    quality={80}
                    sizes="(min-width: 1280px) 128px, 112px"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h4 className="text-[#4d4d4d] text-[16px] xl:text-lg font-normal font-poppins max-w-[276px]">
                  {member.title}
                </h4>
              </div>
            ))}
          </div>

          <div className="lg:hidden space-y-8 sm:space-y-12">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`flex ${member.isLeft ? "justify-start" : "justify-end"
                  }`}
              >
                <div
                  className={`inline-flex items-center gap-6 sm:gap-8 ${member.isLeft ? "" : "flex-row-reverse"
                    }`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mb-0 transition-transform duration-300 hover:scale-105">
                    <Image
                      src={`/team${member.id}.svg`}
                      alt={`${member.title} icon`}
                      width={96}
                      height={96}
                      priority={index === 0}
                      quality={80}
                      sizes="(max-width: 640px) 80px, 96px"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <h4
                    className={`text-[#4d4d4d] text-sm sm:text-[15px] font-normal font-poppins max-w-[150px] sm:max-w-[180px] ${member.isLeft ? "text-left" : "text-right"
                      }`}
                  >
                    {member.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeamSection;
