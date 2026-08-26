"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import SectionHeader from "./section-header";

const TestimonialSection = () => {
  const sliderRef = useRef<Slider | null>(null);
  const mobileSliderRef = useRef<Slider | null>(null);

  const testimonials = [
    {
      id: 1,
      name: "Peter Hodgson",
      company: "Purbrook Engineering Ltd",
      text: "I collaborated with Udara from Protonest on a test equipment project for a large international company, requiring microcontroller coding. We selected Udara based on his outstanding customer feedback and project discussions. He delivered everything promptly and reliably.",
      avatar: "/client1.webp",
    },
    {
      id: 2,
      name: "Leon Hartman",
      company: "Netherlands",
      text: "Great working with Udara, he put a lot of dedication into the project i had given. I am super happy with the communication and off course thank to the help, a working machine. Thanks for all and see you next time",
      avatar: "/client2.webp",
    },
    {
      id: 3,
      name: "Sajjad Akhtar. MD",
      company: "SurgicalBooking.com",
      text: "Very knowledgeable and efficient team. Always available to answer questions and get the job done on time.",
      avatar: "/profile-1.svg",
    },
    {
      id: 4,
      name: "Karl Stoll",
      company: "Stoll-Photobox, Germany",
      text: "Great work. I am working now with Udara for almost a year at several projects. And we proceed. He does solid good work for a fair price. I can recommend!",
      avatar: "/profile-1.svg",
    },
    {
      id: 5,
      name: "Oliver Ashbee",
      company: "Entryphone Company, UK",
      text: "The Protonest team is collaborative, flexible, and genuinely invested in our product and business goals. Communication has been excellent, the work consistently strong, and they have become a trusted partner in our development process.",
      avatar: "/profile-1.svg",
    },
    {
      id: 6,
      name: "Charles Palmer",
      company: "Patriot Ingenuities, Inc",
      text: "Grade A company to work with. They were very responsive and I will definitely be using them again.",
      avatar: "/profile-1.svg",
    },
    {
      id: 7,
      name: "Adam Healy",
      company: "station70, USA",
      text: "We’ve worked with this team for over a year and highly recommend them. They bring strong engineering capability across the board and were able to take a complex concept from idea through execution with a high level of professionalism.",
      avatar: "/profile-1.svg",
    },
    {
      id: 8,
      name: "Steven Gribben",
      company: "McCormack Energy, USA",
      text: "Terrific experience. Udara and his team worked to take our idea and make it better through thoughtful execution. Udara's team has a unique blend of experience, as they are able to handle software design, firmware design, industrial design and IOT integration. This is a very professional group.",
      avatar: "/profile-1.svg",
    },
  ];

  const mobileCarouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    pauseOnFocus: false,
    swipeToSlide: true,
    touchThreshold: 10,
    cssEase: "ease-in-out",
  };

  const desktopCarouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    swipeToSlide: true,
    touchThreshold: 10,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
    ],
  };

  const handleCardMouseEnter = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPause();
    }
  };

  const handleCardMouseLeave = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  };

  const handleMobileCardInteractionStart = () => {
    if (mobileSliderRef.current) {
      mobileSliderRef.current.slickPause();
    }
  };

  const handleMobileCardInteractionEnd = () => {
    if (mobileSliderRef.current) {
      mobileSliderRef.current.slickPlay();
    }
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 overflow-hidden relative">
      <div className="w-full px-2 sm:px-4 md:px-8 lg:px-[150px] xl:px-[250px] 2xl:px-[350px] absolute top-55 md:top-55 lg:top-47 2xl:top-52 bottom-0 md:bottom-0 lg:bottom-auto left-0 right-0 z-10">
        <div className="relative w-full rounded-[20px] md:rounded-[30px] lg:rounded-[37px] overflow-hidden h-full lg:h-[500px]">
          <Image
            src="/home-5.svg"
            alt="Testimonials background"
            fill
            priority={false}
            quality={70}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
        <SectionHeader
          prefix="What Our Clients"
          highlight="Say"
          description="How customers describe the engineering services offered by Protonest."
          align="center"
        />

        <div className="lg:hidden mt-10 sm:mt-12 mb-2 sm:mb-4 md:mb-12 px-2">
          <Slider ref={mobileSliderRef} {...mobileCarouselSettings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-6 pb-6">
                <TestimonialCard
                  name={testimonial.name}
                  company={testimonial.company}
                  text={testimonial.text}
                  avatar={testimonial.avatar}
                  onInteractionStart={handleMobileCardInteractionStart}
                  onInteractionEnd={handleMobileCardInteractionEnd}
                  isMobile={true}
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="hidden lg:block mt-2 mb-10 md:mb-12 lg:mb-16">
          <Slider ref={sliderRef} {...desktopCarouselSettings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-3 xl:px-5">
                <div
                  onMouseEnter={handleCardMouseEnter}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <TestimonialCard
                    name={testimonial.name}
                    company={testimonial.company}
                    text={testimonial.text}
                    avatar={testimonial.avatar}
                    isMobile={false}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="flex justify-center">
          <Link href="/contact-us">
            <button className="w-[160px] md:w-[180px] h-[45px] md:h-[52px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat rounded-[25px] md:rounded-[30px] flex justify-center items-center gap-1 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <span className="text-white text-sm md:text-base font-medium">
                Book a Call
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export const TestimonialCard = ({
  name,
  company,
  text,
  avatar,
  onInteractionStart,
  onInteractionEnd,
  isMobile = false,
}: {
  name: string;
  company: string;
  text: string;
  avatar: string;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  isMobile?: boolean;
}) => {
  const cardProps = isMobile
    ? {
        onTouchStart: onInteractionStart,
        onTouchEnd: onInteractionEnd,
        onTouchMove: onInteractionStart,
      }
    : {};

  return (
    <div
      className="w-full max-w-[550px] mx-auto h-[320px] px-5 sm:px-6 py-6 sm:py-7 bg-white rounded-[20px] sm:rounded-[25px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.1)] flex flex-col gap-2 relative"
      {...cardProps}
    >
      <div className="flex-shrink-0">
        <Icon
          icon="mdi:format-quote-open"
          className="text-[48px] text-[#6C9AE1]"
        />
      </div>

      <p className="text-[#333333] text-xs sm:text-[13px] font-normal font-poppins leading-relaxed flex-grow overflow-hidden">
        {text}
      </p>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
          <Image
            src={avatar}
            alt={`${name} profile picture`}
            width={56}
            height={56}
            priority={false}
            quality={85}
            sizes="(max-width: 640px) 48px, 56px"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-[#333333] text-xs sm:text-[13px] font-medium font-poppins">
            {name}
          </div>
          <div className="text-[#999999] text-[10px] sm:text-[11px] font-normal font-poppins">
            {company}
          </div>
        </div>
      </div>
    </div>
  );
};

type TestimonialMarqueeItem = {
  name: string;
  company: string;
  text: string;
  avatar: string;
};

export const TestimonialMarquee = ({
  testimonials,
}: {
  testimonials: TestimonialMarqueeItem[];
}) => {
  const settings = {
    dots: false,
    infinite: testimonials.length > 1,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: testimonials.length > 1,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    pauseOnFocus: true,
    swipeToSlide: true,
    touchThreshold: 10,
    cssEase: "ease-in-out",
  };

  return (
    <div
      className="mr-auto w-full max-w-[550px]"
      role="region"
      aria-label="Client testimonials"
      aria-live="off"
    >
      <Slider {...settings}>
        {testimonials.map((testimonial) => (
          <div
            key={`${testimonial.name}-${testimonial.company}`}
            className="px-2 pb-5"
          >
            <TestimonialCard
              name={testimonial.name}
              company={testimonial.company}
              text={testimonial.text}
              avatar={testimonial.avatar}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialSection;
