"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const clients = [
    {
        name: "Peter Hodgson",
        company: "Purbrook Engineering Ltd",
        review:
            "I collaborated with Udara from Protonest on a test equipment project for a large international company, requiring microcontroller coding. We selected Udara based on his outstanding customer feedback and project discussions. He delivered circuit diagrams, operator instructions, code, and component selection promptly and reliably. Udara's responsiveness and reliable communication were key to achieving our goals. I highly recommend Udara for coding and electronic circuit projects.",
        imgSrc: "/client1.webp",
    },
    {
        name: "Leon Hartman",
        company: "Netherlands",
        review:
            "Great working with Udara, he put a lot of dedication into the project i had given. I am super happy with the communication and off course thank to the help, a working machine. Thanks for all and see you next time",
        imgSrc: "/client2.webp",
    },
    {
        name: "Sajjad Akhtar. MD",
        company: "SurgicalBooking.com",
        review:
            "Very knowledgeable and efficient team. Always available to answer questions and get the job done on time.",
        imgSrc: "/profile-1.svg",
    },
    {
        name: "Karl Stoll",
        company: "Stoll-Photobox, Germany",
        review:
            "Great work. I am working now with Udara for almost a year at several projects. And we proceed. He does solid good work for a fair price. I can recommend!",
        imgSrc: "/profile-1.svg",
    },
];

// Optimized client avatar blur placeholder
const avatarBlurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmNWY1ZjUiLz4KPC9zdmc+Cg==";

// Memoized scroll indicator component
const ScrollIndicator = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        aria-label="Scroll down to see more content"
    >
        <div className="animate-bounce flex flex-col items-center -space-y-4 group-hover:scale-110 transition-transform">
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
            <svg
                className="w-5 h-5 text-[#f51da5] animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{ animationDelay: "0.2s" }}
            >
                <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    </button>
);

function ClientCard({ name, company, review, imgSrc }: typeof clients[0]) {
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const checkScrollable = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const hasVerticalScroll = container.scrollHeight > container.clientHeight;
        const isAtBottom =
            container.scrollTop + container.clientHeight >=
            container.scrollHeight - 1;
        setShowScrollIndicator(hasVerticalScroll && !isAtBottom);
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Check initially
        checkScrollable();

        // Add scroll listener
        container.addEventListener("scroll", checkScrollable);

        // Add resize observer to handle dynamic content changes
        const resizeObserver = new ResizeObserver(checkScrollable);
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener("scroll", checkScrollable);
            resizeObserver.disconnect();
        };
    }, [checkScrollable]);

    const handleScrollIndicatorClick = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.scrollBy({
            top: 50,
            behavior: "smooth",
        });
    }, []);

    return (
        <article className="w-full max-w-[343px] mx-auto h-[312px] px-4 sm:px-6 py-8 sm:py-[50px] bg-white/80 rounded-[20px] sm:rounded-[30px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] backdrop-blur-[10px] flex flex-col justify-start items-center gap-2.5 relative">
            {/* Scrollable Content Container */}
            <div
                ref={scrollContainerRef}
                className="w-full max-w-[259px] h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            >
                <div className="flex flex-col justify-start items-start gap-4 sm:gap-[27px]">
                    {/* Avatar with Gradient Border */}
                    <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] relative bg-gradient-to-br from-[#f51da5] to-[#5530fa] rounded-full flex justify-center items-center flex-shrink-0">
                        <div className="w-[36px] h-[36px] sm:w-[41px] sm:h-[41px] bg-white rounded-full flex justify-center items-center overflow-hidden">
                            <Image
                                src={imgSrc}
                                alt={`${name} avatar`}
                                width={39}
                                height={39}
                                className="rounded-full w-[34px] h-[34px] sm:w-[39px] sm:h-[39px] object-cover"
                                placeholder="blur"
                                blurDataURL={avatarBlurDataURL}
                                quality={90}
                                sizes="(max-width: 640px) 34px, 39px"
                            />
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="flex flex-col gap-2 sm:gap-[13px]">
                        <h3 className="text-black text-sm sm:text-base font-normal font-poppins">
                            {name}
                        </h3>
                        <p className="text-[#989898] text-xs font-normal font-poppins">
                            {company}
                        </p>
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-[#6c6c6c] text-xs font-normal font-poppins leading-relaxed">
                        &quot;{review}&quot;
                    </blockquote>
                </div>
            </div>

            {/* Clickable Double Arrow Scroll Indicator */}
            {showScrollIndicator && (
                <ScrollIndicator onClick={handleScrollIndicatorClick} />
            )}
        </article>
    );
}

export default function Testimonials() {
    const [showAll, setShowAll] = useState(false);
    const [isMediumScreen, setIsMediumScreen] = useState(false);

    // Debounced resize handler for better performance
    const checkScreenSize = useCallback(() => {
        setIsMediumScreen(window.innerWidth >= 768);
    }, []);

    useEffect(() => {
        // Check on mount
        checkScreenSize();

        // Debounced resize listener
        let timeoutId: NodeJS.Timeout;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkScreenSize, 150);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [checkScreenSize]);

    // Memoized calculations
    const { visibleClients, shouldShowLoadMore } = useMemo(() => {
        const initialCount = isMediumScreen ? 6 : 3;
        const visibleClients = showAll ? clients : clients.slice(0, initialCount);
        const shouldShowLoadMore = clients.length > initialCount;

        return { initialCount, visibleClients, shouldShowLoadMore };
    }, [isMediumScreen, showAll]);

    const toggleShowAll = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    return (
        <section className="mt-10 sm:mt-16 lg:mt-20 w-full flex-col px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[133px] 2xl:px-[250px] relative py-6 sm:py-8 lg:py-10">
            {/* Title */}
            <h2 className="text-center text-xl sm:text-2xl lg:text-[26px] xl:text-3xl font-medium font-montserrat leading-tight sm:leading-[45px] lg:leading-[55px] text-[#6c6c6c] px-4">
                What Our{" "}
                <span className="bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] bg-clip-text text-transparent font-montserrat">
                    Clients
                </span>{" "}
                Say
            </h2>

            {/* Subtitle */}
            <p className="text-[#6c6c6c] text-sm sm:text-base xl:text-[18px] font-normal font-poppins leading-relaxed my-6 2xl:my-10 mx-auto text-center max-w-3xl">
                Words from those who&apos;ve experienced our process, people, and product
                delivery first-hand.
            </p>

            {/* Testimonial Cards */}
            <div className="mt-12 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-[46px] place-items-center">
                {visibleClients.map((client, idx) => (
                    <ClientCard key={`${client.name}-${idx}`} {...client} />
                ))}
            </div>

            {/* Load More Button */}
            {shouldShowLoadMore && (
                <div className="flex justify-center mt-8 sm:mt-12 lg:mt-15">
                    <button
                        onClick={toggleShowAll}
                        className="w-[160px] md:w-[180px] h-[45px] md:h-[52px] bg-gradient-to-l from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] font-montserrat rounded-[25px] md:rounded-[30px] flex justify-center items-center gap-1 transition-all duration-300 hover:shadow-lg"
                        aria-expanded={showAll}
                        aria-label={showAll ? "Show fewer testimonials" : "Show more testimonials"}
                    >
                        <span className="text-white text-sm md:text-base font-medium">
                            {showAll ? "Show Less" : "Load More"}
                        </span>
                    </button>
                </div>
            )}

            {/* Background Images - Optimized loading */}
            <div className="hidden lg:block">
                <Image
                    src="/contact-4.svg"
                    alt=""
                    width={800}
                    height={800}
                    className="absolute md:-mt-40 xl:-mt-50 -z-10 top-0 left-0"
                    priority={false}
                    quality={85}
                    aria-hidden="true"
                />
            </div>

            <div className="lg:hidden">
                <Image
                    src="/contact-4-mobile.svg"
                    alt=""
                    width={350}
                    height={1000}
                    className="w-full max-w-[350px] h-[1000px] absolute mt-30 -z-10 top-0 left-0 object-cover"
                    priority={false}
                    quality={80}
                    sizes="(max-width: 1024px) 350px, 0px"
                    aria-hidden="true"
                />
            </div>
        </section>
    );
}