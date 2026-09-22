import Image from "next/image";
import type { ReactNode } from "react";
import {
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiGlobe,
  FiSettings,
  FiZap,
} from "react-icons/fi";
import SectionHeader from "./section-header";

type ServiceCardData = {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  iconRing: string;
};

const SERVICE_CARDS: ServiceCardData[] = [
  {
    title: "IoT Product Strategy",
    description:
      "We will work with you to turn an early idea into a clear IoT product development plan that feels achievable and grounded from day one.",
    icon: <FiZap size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "IoT Hardware Development",
    description:
      "We design PCBs, enclosures, and product architecture that is reliable and easy to support in real use.",
    icon: <FiCpu size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "Firmware Development",
    description:
      "We develop reliable firmware for embedded products, including device logic, sensor and actuator integration, and communication protocols.",
    icon: <FiCode size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "Software Development",
    description:
      "We build clean, dependable front-end and backend software that supports your IoT product.",
    icon: <FiCheckCircle size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "Testing and Product Validation",
    description:
      "We test your products for reliability and performance under realistic conditions so you can launch them with confidence.",
    icon: <FiSettings size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "IoT Consulting and Support",
    description:
      "We provide clear IoT consulting services to help you make better decisions, and post-development support with updates and maintenance.",
    icon: <FiGlobe size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
];

const ServiceCard = ({
  title,
  description,
  icon,
  iconBg,
  iconRing,
}: ServiceCardData) => (
  <div className="group relative rounded-[34px] p-[1px] transition-transform duration-300">
    <div className="flex h-full flex-col gap-4 rounded-[32px] bg-white p-8 shadow-lg transition duration-300 group-hover:bg-white">
      <div
        className={`h-16 w-16 rounded-2xl ${iconBg} ring-1 ring-inset ${iconRing} flex items-center justify-center transition duration-300 group-hover:rotate-15`}
      >
        {icon}
      </div>
      <h3 className="text-[20px] font-montserrat font-medium leading-snug bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-[15px] font-poppins leading-relaxed text-[#6C6C6C]">
        {description}
      </p>
    </div>
  </div>
);

const ServicesSection = () => (
  <section className="relative mt-8 sm:mt-12 lg:mt-[20px] mb-8 sm:mb-12 lg:mb-[60px] overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <Image
        src="/home-3.svg"
        alt=""
        fill
        priority={false}
        quality={85}
        aria-hidden="true"
        className="object-cover"
      />
    </div>

    <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-[133px] 2xl:px-[180px]">
      <SectionHeader
        prefix="Services We "
        highlight="Offer"
        description="From Idea to Execution, We've Got You Covered."
        linkLabel="Book a Call"
        linkHref="/contact-us"
      />

      <div className="mx-auto mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_CARDS.map((card) => (
          <ServiceCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
