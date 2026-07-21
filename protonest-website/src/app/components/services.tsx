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
      "You work with us to turn an early idea into a clear IoT product development plan, product design direction, feature scope, and delivery roadmap.",
    icon: <FiZap size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "IoT Hardware Development",
    description:
      "We design IoT hardware, sensors, electronics, enclosures, and system architecture around how your product will work in real use.",
    icon: <FiCpu size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "Firmware and Embedded Systems Development",
    description:
      "We help you build reliable embedded systems, firmware, device logic, communication modules, and sensor integrations for real product use.",
    icon: <FiCode size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "Software and Dashboard Development",
    description:
      "We build custom software solutions that connect your IoT devices to cloud platforms, dashboards, mobile apps, and monitoring systems.",
    icon: <FiCheckCircle size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "Testing and Product Validation",
    description:
      "We test connectivity, reliability, performance, power usage, and product readiness so you can move forward with confidence before launch.",
    icon: <FiSettings size={24} />,
    iconBg: "bg-[#5530FA]/5",
    iconRing: "ring-[#5530FA]/10",
  },
  {
    title: "IoT Consulting and Support",
    description:
      "You get clear IoT consulting services for architecture decisions, product direction, troubleshooting, updates, and post-launch improvements.",
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
        className="object-cover"
      />
    </div>

    <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-[133px] 2xl:px-[180px]">
      <SectionHeader
        prefix="IoT Development Services Built"
        highlight="Around Your Product"
        description="From Idea to Execution, We've Got You Covered."
        linkLabel="Book a Call"
        linkHref="/contact-us#book-a-call"
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
