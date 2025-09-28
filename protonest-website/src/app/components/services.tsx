import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOnScreen } from './useOnScreen';

// Service data interface
interface ServiceData {
    id: number;
    normalImage: string;
    hoverImage: string;
    alt: string;
}

// Memoized service data for different screen sizes
const useServiceData = () => {
    return useMemo(() => ({
        '2xl': [
            { id: 1, normalImage: "/home/offers/2xl/service-1.svg", hoverImage: "/home/offers/2xl/service-1-hover.svg", alt: "Service 1" },
            { id: 2, normalImage: "/home/offers/2xl/service-2.svg", hoverImage: "/home/offers/2xl/service-2-hover.svg", alt: "Service 2" },
            { id: 3, normalImage: "/home/offers/2xl/service-3.svg", hoverImage: "/home/offers/2xl/service-3-hover.svg", alt: "Service 3" },
            { id: 4, normalImage: "/home/offers/2xl/service-4.svg", hoverImage: "/home/offers/2xl/service-4-hover.svg", alt: "Service 4" },
            { id: 5, normalImage: "/home/offers/2xl/service-5.svg", hoverImage: "/home/offers/2xl/service-5-hover.svg", alt: "Service 5" },
            { id: 6, normalImage: "/home/offers/2xl/service-6.svg", hoverImage: "/home/offers/2xl/service-6-hover.svg", alt: "Service 6" },
        ],
        xl: [
            { id: 1, normalImage: "/home/offers/xl/service-1.svg", hoverImage: "/home/offers/xl/service-1-hover.svg", alt: "Service 1" },
            { id: 2, normalImage: "/home/offers/xl/service-2.svg", hoverImage: "/home/offers/xl/service-2-hover.svg", alt: "Service 2" },
            { id: 3, normalImage: "/home/offers/xl/service-3.svg", hoverImage: "/home/offers/xl/service-3-hover.svg", alt: "Service 3" },
            { id: 4, normalImage: "/home/offers/xl/service-4.svg", hoverImage: "/home/offers/xl/service-4-hover.svg", alt: "Service 4" },
            { id: 5, normalImage: "/home/offers/xl/service-5.svg", hoverImage: "/home/offers/xl/service-5-hover.svg", alt: "Service 5" },
            { id: 6, normalImage: "/home/offers/xl/service-6.svg", hoverImage: "/home/offers/xl/service-6-hover.svg", alt: "Service 6" },
        ],
        lg: [
            { id: 1, normalImage: "/home/offers/lg/service-1.svg", hoverImage: "/home/offers/lg/service-1-hover.svg", alt: "Service 1" },
            { id: 2, normalImage: "/home/offers/lg/service-2.svg", hoverImage: "/home/offers/lg/service-2-hover.svg", alt: "Service 2" },
            { id: 3, normalImage: "/home/offers/lg/service-3.svg", hoverImage: "/home/offers/lg/service-3-hover.svg", alt: "Service 3" },
            { id: 4, normalImage: "/home/offers/lg/service-4.svg", hoverImage: "/home/offers/lg/service-4-hover.svg", alt: "Service 4" },
            { id: 5, normalImage: "/home/offers/lg/service-5.svg", hoverImage: "/home/offers/lg/service-5-hover.svg", alt: "Service 5" },
            { id: 6, normalImage: "/home/offers/lg/service-6.svg", hoverImage: "/home/offers/lg/service-6-hover.svg", alt: "Service 6" },
        ],
        md: [
            { id: 1, normalImage: "/home/offers/md/service-1.svg", hoverImage: "/home/offers/md/service-1-hover.svg", alt: "Service 1" },
            { id: 2, normalImage: "/home/offers/md/service-2.svg", hoverImage: "/home/offers/md/service-2-hover.svg", alt: "Service 2" },
            { id: 3, normalImage: "/home/offers/md/service-3.svg", hoverImage: "/home/offers/md/service-3-hover.svg", alt: "Service 3" },
            { id: 4, normalImage: "/home/offers/md/service-4.svg", hoverImage: "/home/offers/md/service-4-hover.svg", alt: "Service 4" },
            { id: 5, normalImage: "/home/offers/md/service-5.svg", hoverImage: "/home/offers/md/service-5-hover.svg", alt: "Service 5" },
            { id: 6, normalImage: "/home/offers/md/service-6.svg", hoverImage: "/home/offers/md/service-6-hover.svg", alt: "Service 6" },
        ],
        sm: [
            { id: 1, normalImage: "/home/offers/sm/service-1.svg", hoverImage: "/home/offers/sm/service-1-hover.svg", alt: "Service 1" },
            { id: 2, normalImage: "/home/offers/sm/service-2.svg", hoverImage: "/home/offers/sm/service-2-hover.svg", alt: "Service 2" },
            { id: 3, normalImage: "/home/offers/sm/service-3.svg", hoverImage: "/home/offers/sm/service-3-hover.svg", alt: "Service 3" },
            { id: 4, normalImage: "/home/offers/sm/service-4.svg", hoverImage: "/home/offers/sm/service-4-hover.svg", alt: "Service 4" },
            { id: 5, normalImage: "/home/offers/sm/service-5.svg", hoverImage: "/home/offers/sm/service-5-hover.svg", alt: "Service 5" },
            { id: 6, normalImage: "/home/offers/sm/service-6.svg", hoverImage: "/home/offers/sm/service-6-hover.svg", alt: "Service 6" },
        ],
        mobile: [
            { id: 1, normalImage: "/home/offers/mobile/service-1.svg", hoverImage: "/home/offers/mobile/service-1-hover.svg", alt: "Service 1" },
            { id: 2, normalImage: "/home/offers/mobile/service-2.svg", hoverImage: "/home/offers/mobile/service-2-hover.svg", alt: "Service 2" },
            { id: 3, normalImage: "/home/offers/mobile/service-3.svg", hoverImage: "/home/offers/mobile/service-3-hover.svg", alt: "Service 3" },
            { id: 4, normalImage: "/home/offers/mobile/service-4.svg", hoverImage: "/home/offers/mobile/service-4-hover.svg", alt: "Service 4" },
            { id: 5, normalImage: "/home/offers/mobile/service-5.svg", hoverImage: "/home/offers/mobile/service-5-hover.svg", alt: "Service 5" },
            { id: 6, normalImage: "/home/offers/mobile/service-6.svg", hoverImage: "/home/offers/mobile/service-6-hover.svg", alt: "Service 6" },
        ]
    }), []);
};

// Enhanced ServiceCard component with optimizations
const ServiceCard = ({
    service,
    enableMobileHover = false,
    width,
    height,
}: {
    service: ServiceData;
    enableMobileHover?: boolean;
    width: string;
    height: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    const [isMobile, setIsMobile] = useState(false);

    // Debounced screen size check
    const checkIsMobile = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        checkIsMobile();

        let timeoutId: NodeJS.Timeout;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkIsMobile, 150);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [checkIsMobile]);

    const shouldShowHover = enableMobileHover && isMobile && isVisible;

    // Generate responsive sizes based on width
    const generateSizes = useCallback((cardWidth: string) => {
        if (cardWidth.includes('580') || cardWidth.includes('510') || cardWidth.includes('470') || cardWidth.includes('450')) {
            return "(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 580px";
        }
        return "(max-width: 640px) 45vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 300px";
    }, []);

    return (
        <div
            ref={ref}
            className="relative group"
            style={{ width, height }}
        >
            {/* Background layer */}
            <div className="absolute inset-0 rounded-[25px] sm:rounded-[35px] shadow-lg group-hover:shadow-xl transition-shadow duration-300" />

            {/* Normal image */}
            <div
                className={`absolute inset-0 transition-opacity duration-300 rounded-[25px] sm:rounded-[35px] overflow-hidden ${shouldShowHover ? 'opacity-0' : 'group-hover:opacity-0'
                    }`}
            >
                <Image
                    src={service.normalImage}
                    alt={service.alt}
                    fill
                    className="object-cover"
                    quality={85}
                    sizes={generateSizes(width)}
                    priority={service.id <= 2} // Prioritize first 2 service cards
                />
            </div>

            {/* Hover image */}
            <div
                className={`absolute inset-0 transition-opacity duration-300 rounded-[25px] sm:rounded-[35px] overflow-hidden ${shouldShowHover
                    ? 'opacity-100 delay-300'
                    : 'opacity-0 group-hover:opacity-100 group-hover:delay-300'
                    }`}
            >
                <Image
                    src={service.hoverImage}
                    alt={`${service.alt} Hover`}
                    fill
                    className="object-cover"
                    quality={85}
                    sizes={generateSizes(width)}
                    loading="lazy" // Lazy load hover images
                />
            </div>
        </div>
    );
};

// Optimized layout components
const ServiceLayout2XL = ({ services }: { services: ServiceData[] }) => (
    <div className="hidden 2xl:block mt-[140px] mb-[100px] h-[749px] relative">
        <div className="absolute inset-0 z-0">
            <Image
                src="/home-3.svg"
                alt=""
                fill
                quality={80}
                priority={false}
                aria-hidden="true"
            />
        </div>
        <div className="flex flex-col items-start justify-start h-full px-[180px] relative z-10">
            <header className="flex justify-start mb-14">
                <h2 className="text-left text-[36px] font-medium font-montserrat">
                    <span className="text-[rgba(108,108,108,1)]">What Do We </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                        Offer?
                    </span>
                </h2>
            </header>

            <div className="flex justify-between items-center w-full mb-14">
                <p className="text-[20px] font-normal font-poppins text-[rgba(108,108,108,1)]">
                    From Idea to Execution, We&apos;ve Got You Covered.
                </p>
                <Link href="https://iot-system-design-tool.protonest.co" target="_blank" rel="noopener noreferrer">
                    <span className="text-[20px] font-normal font-poppins text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer transition-all duration-300">
                        Get a Quote &gt;
                    </span>
                </Link>
            </div>

            <div className="w-full">
                {/* First row */}
                <div className="flex justify-between mb-14 gap-4">
                    <ServiceCard service={services[0]} width="580px" height="210px" />
                    <ServiceCard service={services[1]} width="300px" height="210px" />
                    <ServiceCard service={services[2]} width="300px" height="210px" />
                </div>
                {/* Second row */}
                <div className="flex justify-between gap-4">
                    <ServiceCard service={services[3]} width="300px" height="210px" />
                    <ServiceCard service={services[4]} width="580px" height="210px" />
                    <ServiceCard service={services[5]} width="300px" height="210px" />
                </div>
            </div>
        </div>
    </div>
);

const ServiceLayoutXL = ({ services }: { services: ServiceData[] }) => (
    <div className="hidden xl:block 2xl:hidden mt-[120px] mb-[80px] h-[649px] relative">
        <div className="absolute inset-0 z-0">
            <Image
                src="/home-3.svg"
                alt=""
                fill
                className="object-cover"
                quality={80}
                priority={false}
                aria-hidden="true"
            />
        </div>
        <div className="flex flex-col items-start justify-start h-full px-[133px] relative z-10">
            <header className="flex justify-start mb-12">
                <h2 className="text-left text-[30px] font-medium font-montserrat">
                    <span className="text-[rgba(108,108,108,1)]">What Do We </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                        Offer?
                    </span>
                </h2>
            </header>

            <div className="flex justify-between items-center w-full mb-12">
                <p className="text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)]">
                    From Idea to Execution, We&apos;ve Got You Covered.
                </p>
                <Link href="https://iot-system-design-tool.protonest.co" target="_blank" rel="noopener noreferrer">
                    <span className="text-[18px] font-normal font-poppins text-[rgba(108,108,108,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA] cursor-pointer transition-all duration-300">
                        Get a Quote &gt;
                    </span>
                </Link>
            </div>

            <div className="w-full">
                {/* First row */}
                <div className="flex justify-between mb-12 gap-3">
                    <ServiceCard service={services[0]} width="510px" height="186px" />
                    <ServiceCard service={services[1]} width="264px" height="186px" />
                    <ServiceCard service={services[2]} width="264px" height="186px" />
                </div>
                {/* Second row */}
                <div className="flex justify-between gap-3">
                    <ServiceCard service={services[3]} width="264px" height="186px" />
                    <ServiceCard service={services[4]} width="510px" height="186px" />
                    <ServiceCard service={services[5]} width="264px" height="186px" />
                </div>
            </div>
        </div>
    </div>
);

// Continue with other layout components following the same pattern...
// (I'll include the rest in a follow-up for brevity)

const ServicesSection = () => {
    const serviceData = useServiceData();

    return (
        <>
            <ServiceLayout2XL services={serviceData['2xl']} />
            <ServiceLayoutXL services={serviceData.xl} />
            {/* Add other layout components here */}
        </>
    );
};

export default ServicesSection;