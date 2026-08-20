"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import SectionHeader from "./section-header";
import { useOnScreen } from "./use-on-screen";
import { ArrowUpRight } from "lucide-react";

const truncateToSentences = (
  text: string,
  sentenceCount: number = 2,
): string => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, sentenceCount).join(" ").trim();
};

const truncateByWords = (
  text: string,
  wordLimit: number = 30,
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
      title:
        "Zigbee Communication Reliability Using ESP32-C6 with Inbuilt and External Antennas",
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
      title:
        "Testing UWB Ranging Reliability: How Antenna Alignment Affects Accuracy",
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
          description="Updates, insights, and announcements from our work."
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
    <Link
      href={blog.link}
      className="block h-full w-full max-w-[380px] rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5530FA] focus-visible:ring-offset-4"
    >
      <article
        ref={ref}
        className={`group relative flex h-full min-h-[440px] w-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_4px_18px_rgba(23,23,23,0.06)] transition-all duration-300 sm:rounded-[28px] md:hover:-translate-y-1 md:hover:shadow-[0_14px_35px_rgba(85,48,250,0.10)] ${
          shouldShowEffects
            ? "-translate-y-1 shadow-[0_14px_35px_rgba(85,48,250,0.10)]"
            : ""
        }`}
      >
        <div className="relative aspect-[16/10] w-full flex-shrink-0 overflow-hidden">
          <Image
            src={blog.image}
            alt={`${blog.title} blog post image`}
            fill
            priority={index === 0}
            quality={index === 0 ? 85 : 75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className={`object-cover transition-transform duration-700 ease-out md:group-hover:scale-[1.04] ${
              shouldShowEffects ? "scale-[1.04]" : ""
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-montserrat text-[18px] font-medium leading-snug text-[#333333] transition-colors duration-300 group-hover:text-[#5530FA] sm:text-[20px]">
            {blog.title}
          </h3>

          {(() => {
            const { truncated, isTruncated } = truncateByWords(
              blog.description,
              26,
            );

            return (
              <p className="mt-3 font-poppins text-[13px] font-normal leading-relaxed text-[#6C6C6C] sm:text-[14px]">
                {truncated}
                {isTruncated && "..."}
              </p>
            );
          })()}

          <div className="mt-auto flex items-center justify-between pt-6">
            <span className="bg-gradient-to-r from-[#5530FA] to-[#F51DA5] bg-clip-text font-poppins text-[13px] font-medium text-transparent sm:text-[14px]">
              Read article
            </span>

            <ArrowUpRight
              aria-hidden="true"
              className="h-5 w-5 text-[#5530FA] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.8}
            />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] transition-transform duration-500 group-hover:scale-x-100" />
      </article>
    </Link>
  );
};

export default NewsAndBlogs;
