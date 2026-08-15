"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import SectionHeader from "./section-header";
import { useOnScreen } from "./use-on-screen";

const truncateToSentences = (
  text: string,
  sentenceCount: number = 2
): string => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, sentenceCount).join(" ").trim();
};

const truncateByWords = (
  text: string,
  wordLimit: number = 30
): { truncated: string; isTruncated: boolean } => {
  const words = text.split(" ");
  if (words.length <= wordLimit) {
    return { truncated: text, isTruncated: false };
  }
  return {
    truncated: words.slice(0, wordLimit).join(" "),
    isTruncated: true,
  };
};

const NewsAndBlogs = () => {
  const blogs = [
    {
      id: 1,
      title: "Zigbee Communication Reliability Using ESP32-C6 with Inbuilt and External Antennas",
      image: "/blogs4.avif",
      description:
        "The success of Zigbee communications often comes down to the performance of the antenna you use with your ESP32-C6 module. The onboard PCB antenna on the ESP32-C6 module has proven to be decent for low-range applications, but it will begin to degrade significantly in real-world environments. Upgrading to a properly tuned and matched antenna boosts overall Zigbee network reliability.",
      link: "blog/zigbee-communication-reliability-using-esp32-c6-with-inbuilt-and-external-antennas",
    },
    {
      id: 2,
      title: "PCB Component Management System",
      image: "/blogs5.avif",
      description:
        "If you’ve worked on PCB product development, you've probably faced this problem: once PCB counts increase, component tracking stops matching reality. A BOM or spreadsheet may indicate parts are available, but a single missing component can stop the entire build. With each PCB containing hundreds of parts, it becomes hard to track what was used, what's left, and which project or revision consumed which components.",
      link: "blog/pcb-component-management-system",
    },
    {
      id: 3,
      title: "Testing UWB Ranging Reliability: How Antenna Alignment Affects Accuracy",
      image: "/blogs6.avif",
      description:
        "Accurate tracking and positioning in robotics and embedded systems often depend on Ultra-Wideband (UWB) distance measurements. In controlled bench tests using DWM3000 modules, reliable results were obtained when both antennas were aligned in the same direction. However, when the antennas were rotated to different angles, the measured distances consistently decreased, accompanied by weaker signal reception. These findings highlight how antenna orientation can influence short-range UWB performance and provide practical guidance for maintaining measurement accuracy in real-world deployments.",
      link: "blog/testing-uwb-ranging-reliability:-how-antenna-alignment-affects-accuracy",
    },
  ];

  return (
    <div className="mt-15 sm:mt-20 lg:mt-32 xl:mt-40 relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[642px] px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 hidden sm:block">
        <Image
          src="/home-7.svg"
          alt="News and blogs background"
          fill
          priority={false}
          quality={65}
          sizes="100vw"
          className="object-cover opacity-50 sm:opacity-100"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader
          prefix="Latest News and "
          highlight="Blog Articles"
          description="Updates, insights, and announcements from our work and thinking."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-11 justify-items-center">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>
      </div>

      <div className="my-20 text-center px-4">
        <Link href="/blog">
          <button className="w-[160px] sm:w-[180px] h-[45px] lg:h-[50px] gradient-button font-poppins text-[14px] lg:text-[15px] xl:text-[16px]">
            View All Articles
          </button>
        </Link>
      </div>
    </div>
  );
};

const BlogCard = ({
  blog,
  index,
}: {
  blog: {
    id: number;
    title: string;
    image: string;
    description: string;
    link: string;
  };
  index: number;
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  const shouldShowEffects = isMobile ? isVisible : false;

  return (
    <Link href={blog.link} className="block w-full max-w-[345px]">
      <div
        ref={ref}
        className={`group w-full h-[400px] sm:h-[460px] flex flex-col relative bg-white/5 rounded-[20px] sm:rounded-[35px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] sm:shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden p-4 sm:p-6 lg:p-8 transition-all duration-300 md:hover:shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)] cursor-pointer ${shouldShowEffects
          ? "shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)]"
          : ""
          }`}
      >
        <div className="relative w-full h-[140px] sm:h-[164px] rounded-[8px] sm:rounded-[11px] overflow-hidden mb-4 sm:mb-6 flex-shrink-0">
          <Image
            src={blog.image}
            alt={`${blog.title} blog post image`}
            fill
            priority={index === 0}
            quality={index === 0 ? 85 : 75}
            sizes="(max-width: 768px) 279px, (max-width: 1024px) 345px, 279px"
            className={`object-cover transition-all duration-300 md:group-hover:scale-105 md:group-hover:grayscale ${shouldShowEffects ? "scale-105 grayscale" : ""
              }`}
          />

          <div
            className={`absolute bottom-2 left-2 right-2 w-[calc(100%-16px)] h-10 bg-[#A3A3A3] font-poppins text-sm transition-all duration-300 rounded-md md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0 flex items-center justify-center ${shouldShowEffects
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
              }`}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]">
              Read Article
            </span>
          </div>
        </div>

        <h3
          className={`w-full max-w-[240px] mx-auto text-center text-sm sm:text-base font-normal font-poppins mb-3 sm:mb-4 px-2 transition-all duration-300 md:text-[#4d4d4d] md:group-hover:text-transparent md:group-hover:bg-clip-text md:group-hover:bg-gradient-to-r md:from-[#5530FA] md:to-[#F51DA5] ${shouldShowEffects
            ? "text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]"
            : "text-[#4d4d4d]"
            }`}
        >
          {blog.title}
        </h3>

        {(() => {
          const { truncated, isTruncated } = truncateByWords(
            blog.description,
            30
          );
          return (
            <p className="w-full max-w-[279px] mx-auto text-center text-[#6c6c6c] text-xs font-normal font-poppins leading-relaxed px-2 flex-grow">
              {truncated}
              {isTruncated && "... "}
              {isTruncated && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5] font-medium">
                  Read Article
                </span>
              )}
            </p>
          );
        })()}
      </div>
    </Link>
  );
};

export default NewsAndBlogs;
