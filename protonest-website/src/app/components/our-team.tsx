"use client";

import Image from "next/image";
import {
  CircuitBoard,
  Cpu,
  Code2,
  Cog,
  PenTool,
  ClipboardCheck,
} from "lucide-react";
import SectionHeader from "./section-header";

const OurTeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      title: "Electronics Engineers",
      isLeft: true,
      icon: CircuitBoard,
    },
    {
      id: 2,
      title: "Firmware Developers",
      isLeft: false,
      icon: Cpu,
    },
    {
      id: 3,
      title: "Software Engineers",
      isLeft: true,
      icon: Code2,
    },
    {
      id: 4,
      title: "Mechanical Engineers",
      isLeft: false,
      icon: Cog,
    },
    {
      id: 5,
      title: "UI/UX Designers",
      isLeft: true,
      icon: PenTool,
    },
    {
      id: 6,
      title: "Project Managers & QA Experts",
      isLeft: false,
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="w-full">
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 xl:px-16 xl:py-16">
        <SectionHeader
          highlight="Our Team"
          description="Our strength lies in our collective expertise. Each member brings a unique skill set and a shared vision to create meaningful IoT solutions. We combine creativity, strategy, and technology to deliver world-class results."
          align="center"
        />

        <div className="mb-8 hidden justify-center sm:mb-12 lg:mb-16">
          <div className="relative aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/team.webp"
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

      <div className="relative min-h-[300px] w-full overflow-visible sm:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px]">
        <div className="absolute -top-12 bottom-0 left-0 right-0 -z-10 w-full sm:-top-16 lg:-top-20">
          <Image
            src="/about-5-mobile.svg"
            alt="Our team background mobile"
            fill
            quality={65}
            sizes="(max-width: 1024px) 100vw, 0px"
            className="object-cover object-center lg:hidden"
          />

          <Image
            src="/about-5.svg"
            alt="Our team background desktop"
            fill
            quality={70}
            sizes="(min-width: 1024px) 100vw, 0px"
            className="hidden object-cover object-center lg:block"
          />
        </div>

        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-white/0 sm:w-16 lg:w-32 xl:w-40" />

        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-white/0 sm:w-16 lg:w-32 xl:w-40" />

        <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 xl:px-16 xl:py-16">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h3 className="font-poppins text-lg font-normal leading-relaxed sm:text-xl lg:text-2xl">
              <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
                Our Team Includes
              </span>
            </h3>
          </div>

          <div className="mx-auto hidden max-w-6xl grid-cols-3 gap-16 lg:grid xl:gap-20">
            {teamMembers.map((member) => {
              const Icon = member.icon;

              return (
                <div
                  key={member.id}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-[28px] bg-white p-2 shadow-[0_12px_32px_rgba(49,35,92,0.10)] ring-1 ring-[#5530FA]/5 transition-transform duration-300 group-hover:scale-105 xl:h-32 xl:w-32 xl:rounded-[30px]">
                    <div className="flex h-full w-full items-center justify-center rounded-[20px] xl:rounded-[22px]">
                      <Icon
                        aria-hidden="true"
                        className="h-12 w-12 text-[#5530FA] xl:h-14 xl:w-14"
                        strokeWidth={1.6}
                      />
                    </div>
                  </div>

                  <h4 className="max-w-[276px] font-poppins text-[16px] font-normal text-[#4D4D4D] xl:text-lg">
                    {member.title}
                  </h4>
                </div>
              );
            })}
          </div>

          <div className="space-y-8 sm:space-y-12 lg:hidden">
            {teamMembers.map((member) => {
              const Icon = member.icon;

              return (
                <div
                  key={member.id}
                  className={`flex ${
                    member.isLeft ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`inline-flex items-center gap-6 sm:gap-8 ${
                      member.isLeft ? "" : "flex-row-reverse"
                    }`}
                  >
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[22px] bg-white p-1.5 shadow-[0_10px_26px_rgba(49,35,92,0.10)] ring-1 ring-[#5530FA]/5 transition-transform duration-300 hover:scale-105 sm:h-24 sm:w-24 sm:rounded-[26px] sm:p-2">
                      <div className="flex h-full w-full items-center justify-center rounded-[16px] sm:rounded-[18px]">
                        <Icon
                          aria-hidden="true"
                          className="h-9 w-9 text-[#5530FA] sm:h-11 sm:w-11"
                          strokeWidth={1.6}
                        />
                      </div>
                    </div>

                    <h4
                      className={`max-w-[150px] font-poppins text-sm font-normal text-[#4D4D4D] sm:max-w-[180px] sm:text-[15px] ${
                        member.isLeft ? "text-left" : "text-right"
                      }`}
                    >
                      {member.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeamSection;
