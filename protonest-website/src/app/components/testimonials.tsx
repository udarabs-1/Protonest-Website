'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const TestimonialSection = () => {
    const sliderRef = useRef<Slider | null>(null);
    const mobileSliderRef = useRef<Slider | null>(null);

    const testimonials = [
        {
            id: 1,
            name: "Peter Hodgson",
            company: "Purbrook Engineering Ltd",
            text: "I collaborated with Udara from Protonest on a test equipment project for a large international company, requiring microcontroller coding. We selected Udara based on his outstanding customer feedback and project discussions. He delivered circuit diagrams, operator instructions, code, and component selection promptly and reliably. Udara's responsiveness and reliable communication were key to achieving our goals. I highly recommend Udara for coding and electronic circuit projects.",
            avatar: "/client1.webp"
        },
        {
            id: 2,
            name: "Leon Hartman",
            company: "Netherlands",
            text: "Great working with Udara, he put a lot of dedication into the project i had given. I am super happy with the communication and off course thank to the help, a working machine. Thanks for all and see you next time",
            avatar: "/client2.webp"
        },
        {
            id: 3,
            name: "Sajjad Akhtar. MD",
            company: "SurgicalBooking.com",
            text: "Very knowledgeable and efficient team. Always available to answer questions and get the job done on time.",
            avatar: "/profile-1.svg"
        },
        {
            id: 4,
            name: "Karl Stoll",
            company: "Stoll-Photobox, Germany",
            text: "Great work. I am working now with Udara for almost a year at several projects. And we proceed. He does solid good work for a fair price. I can recommend!",
            avatar: "/profile-1.svg"
        }
    ];

    // Settings for mobile carousel
    const mobileCarouselSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    // Settings for desktop carousel
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
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    // Desktop carousel handlers
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

    // Mobile carousel handlers
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
            {/* Background Container - Now visible on all screens */}
            <div className="w-full px-2 sm:px-4 md:px-8 lg:px-[150px] xl:px-[250px] 2xl:px-[350px] absolute top-55 md:top-55 lg:top-47 2xl:top-52 left-0 right-0 z-10">
                <div className="relative w-full rounded-[20px] md:rounded-[30px] lg:rounded-[37px] overflow-hidden h-[500px]">
                    <Image
                        src="/home-5.svg"
                        alt="Background"
                        fill
                        className="object-cover"
                        quality={100}
                        priority
                    />
                </div>
            </div>

            {/* Content Container - Independent with standard padding */}
            <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
                {/* Header Section */}
                <div className="w-full mb-12 lg:mb-16">
                    <div className="text-center">
                        <h2 className="text-[#6c6c6c] text-2xl lg:text-[26px] font-medium font-montserrat leading-tight md:leading-[1.3]">
                            Innovation Backed by{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                                Experience
                            </span>
                        </h2>
                        <p className="text-[#6c6c6c] text-sm sm:text-base xl:text-[18px] font-normal font-poppins leading-relaxed my-6 2xl:my-10 mx-auto">
                            Words from those who&apos;ve experienced our process, people, and product delivery first-hand.
                        </p>
                    </div>
                </div>

                {/* Mobile Carousel (hidden on lg and above) */}
                <div className="lg:hidden mt-20 mb-10 md:mb-12 px-2">
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

                {/* Desktop Carousel (visible on lg and above) */}
                <div className="hidden lg:block mt-10 mb-10 md:mb-12 lg:mb-16">
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

                {/* Contact Us Button */}
                <div className="flex justify-center">
                    <Link href="/contact-us">
                        <button className="w-[160px] md:w-[180px] h-[45px] md:h-[52px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat rounded-[25px] md:rounded-[30px] flex justify-center items-center gap-1 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <span className="text-white text-sm md:text-base font-medium">Contact Us</span>
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

// Enhanced Testimonial Card Component with mobile interaction support
const TestimonialCard = ({
    name,
    company,
    text,
    avatar,
    onInteractionStart,
    onInteractionEnd,
    isMobile = false
}: {
    name: string;
    company: string;
    text: string;
    avatar: string;
    onInteractionStart?: () => void;
    onInteractionEnd?: () => void;
    isMobile?: boolean;
}) => {
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const checkScrollable = () => {
            const hasVerticalScroll = container.scrollHeight > container.clientHeight;
            const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
            setShowScrollIndicator(hasVerticalScroll && !isAtBottom);
        };

        // Check initially
        checkScrollable();

        // Add scroll listener
        container.addEventListener('scroll', checkScrollable);

        // Add resize observer to handle dynamic content changes
        const resizeObserver = new ResizeObserver(checkScrollable);
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener('scroll', checkScrollable);
            resizeObserver.disconnect();
        };
    }, [text]); // Re-run when text changes

    // Handle user interaction start (touch/scroll)
    const handleInteractionStart = () => {
        if (!isMobile || isUserInteracting) return;

        setIsUserInteracting(true);
        onInteractionStart?.();

        // Clear any existing timeout
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }
    };

    // Handle user interaction end with delay
    const handleInteractionEnd = () => {
        if (!isMobile) return;

        // Clear any existing timeout
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }

        // Set a timeout to resume autoplay after user stops interacting
        interactionTimeoutRef.current = setTimeout(() => {
            setIsUserInteracting(false);
            onInteractionEnd?.();
        }, 2000); // Resume after 2 seconds of inactivity
    };

    // Function to handle scroll indicator click
    const handleScrollIndicatorClick = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (isMobile) {
            handleInteractionStart();
        }

        // Scroll down by a reasonable amount (e.g., 50px)
        container.scrollBy({
            top: 50,
            behavior: 'smooth'
        });
    };

    // Handle scroll events
    const handleScroll = () => {
        if (isMobile) {
            handleInteractionStart();
            handleInteractionEnd();
        }
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }
        };
    }, []);

    const cardProps = isMobile ? {
        onTouchStart: handleInteractionStart,
        onTouchEnd: handleInteractionEnd,
        onTouchMove: handleInteractionStart,
    } : {};

    return (
        <div
            className="w-full max-w-[343px] mx-auto h-[312px] px-4 sm:px-6 py-8 sm:py-[50px] bg-white/80 rounded-[20px] sm:rounded-[30px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] backdrop-blur-[10px] flex flex-col justify-start items-center gap-2.5 relative"
            {...cardProps}
        >
            {/* Scrollable Content Container with normal Tailwind scrollbar */}
            <div
                ref={scrollContainerRef}
                className="w-full max-w-[259px] h-full overflow-y-auto"
                onScroll={handleScroll}
            >
                <div className="flex flex-col justify-start items-start gap-4 sm:gap-[27px]">
                    {/* Avatar with Gradient Border */}
                    <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] relative bg-gradient-to-br from-[#f51da5] to-[#5530fa] rounded-full flex justify-center items-center">
                        <div className="w-[36px] h-[36px] sm:w-[41px] sm:h-[41px] bg-white rounded-full flex justify-center items-center overflow-hidden">
                            <Image
                                src={avatar}
                                alt={name}
                                width={39}
                                height={39}
                                className="rounded-full w-[34px] h-[34px] sm:w-[39px] sm:h-[39px] object-cover"
                            />
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="flex flex-col gap-2 sm:gap-[13px]">
                        <div className="text-black text-sm sm:text-base font-normal font-poppins">{name}</div>
                        <div className="text-[#989898] text-xs font-normal font-poppins">{company}</div>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-[#6c6c6c] text-xs font-normal font-poppins leading-relaxed">
                        {text}
                    </p>
                </div>
            </div>

            {/* Clickable Double Arrow Scroll Indicator */}
            {showScrollIndicator && (
                <button
                    onClick={handleScrollIndicatorClick}
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                    aria-label="Scroll down to see more content"
                >
                    <div className="animate-bounce flex flex-col items-center -space-y-4">
                        {/* First arrow - Blue */}
                        <svg
                            className="w-5 h-5 text-[#5530fa] animate-pulse"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {/* Second arrow - Pink */}
                        <svg
                            className="w-5 h-5 text-[#f51da5] animate-pulse"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={{ animationDelay: '0.2s' }}
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </button>
            )}
        </div>
    );
};

export default TestimonialSection;