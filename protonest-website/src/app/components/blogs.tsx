'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOnScreen } from './useOnScreen';

// Blog data interface
interface BlogData {
    id: number;
    title: string;
    image: string;
    description: string;
    link: string;
}

// Memoized Blog Card Component
const BlogCard = ({ blog }: { blog: BlogData }) => {
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

    // For mobile and small screens, use intersection observer; for larger screens, use hover
    const shouldShowEffects = isMobile ? isVisible : false;

    return (
        <Link href={blog.link} className="block w-full max-w-[345px]">
            <article
                ref={ref}
                className={`group w-full h-auto min-h-[450px] sm:min-h-[502px] relative bg-white/5 rounded-[20px] sm:rounded-[35px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] sm:shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] border border-white/10 backdrop-blur-[20px] overflow-hidden p-4 sm:p-6 lg:p-8 transition-all duration-300 md:hover:shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)] cursor-pointer ${shouldShowEffects ? 'shadow-[15px_15px_40px_0px_rgba(0,0,0,0.15)]' : ''
                    }`}
            >
                {/* Blog Image with Read More button */}
                <div className="relative w-full max-w-[279px] h-[140px] sm:h-[164px] mx-auto rounded-[8px] sm:rounded-[11px] overflow-hidden mb-4 sm:mb-6">
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className={`object-cover transition-all duration-300 md:group-hover:scale-105 md:group-hover:grayscale ${shouldShowEffects ? 'scale-105 grayscale' : ''
                            }`}
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 279px"
                    />
                    {/* Read More Button */}
                    <div className={`absolute bottom-2 left-2 right-2 w-[calc(100%-16px)] h-10 bg-[#A3A3A3] font-poppins text-sm transition-all duration-300 rounded-md md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0 flex items-center justify-center ${shouldShowEffects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]">
                            Read More
                        </span>
                    </div>
                </div>

                {/* Blog Title */}
                <h3 className={`w-full max-w-[240px] mx-auto text-center text-sm sm:text-base font-normal font-poppins mb-3 sm:mb-4 px-2 transition-all duration-300 md:text-[#4d4d4d] md:group-hover:text-transparent md:group-hover:bg-clip-text md:group-hover:bg-gradient-to-r md:from-[#5530FA] md:to-[#F51DA5] ${shouldShowEffects ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]' : 'text-[#4d4d4d]'
                    }`}>
                    {blog.title}
                </h3>

                {/* Blog Description */}
                <p className="w-full max-w-[279px] mx-auto text-center text-[#6c6c6c] text-xs font-normal font-poppins leading-relaxed px-2">
                    {blog.description}
                </p>
            </article>
        </Link>
    );
};

const Blogs = () => {
    // Memoized blog data to prevent recreation on every render
    const blogs = useMemo<BlogData[]>(() => [
        {
            id: 1,
            title: "Selecting a Suitable Sensor for an IoT Project",
            image: "/blogs1.svg",
            description: "The world of the Internet of Things is a world in constant flux where sensors are silent heroes that will help bring your project to reality. Whether it is to keep your house comfortable with a smart thermostat, monitor your pulse with a fitness tracker, or agricultural systems that guarantee optimal crop growth are in the middle of any application involving IoT.",
            link: "/selecting-a-suitable-sensor-for-an-iot-project"
        },
        {
            id: 2,
            title: "Selecting a Perfect Battery for an IoT Project",
            image: "/blogs2.svg",
            description: "The selection of the proper battery for an IoT project is much more than a technical decision but a strategic one, considering the reliability, lifespan, and performance of your IoT Project.",
            link: "/selecting-a-suitable-battery-for-an-iot-project"
        },
        {
            id: 3,
            title: "Selecting the Perfect Cloud Backend for an IoT Project",
            image: "/blogs3.svg",
            description: "One of the most critical decisions for any IoT project is selecting the right cloud backend for an IoT project. The cloud backend platform serves as a central hub for managing communication, data storage, and processing, with the scalability and security of the whole system in mind.",
            link: "/selecting-a-cloud-backend-for-an-iot-project"
        }
    ], []);

    return (
        <section className="mt-15 sm:mt-20 lg:mt-32 xl:mt-40 relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[642px] px-4 sm:px-6 lg:px-8">
            {/* Background Image - Hidden on mobile for better readability */}
            <div className="absolute inset-0 hidden sm:block">
                <Image
                    src="/home-7.svg"
                    alt=""
                    fill
                    className="object-cover opacity-50 sm:opacity-100"
                    priority={false}
                    quality={80}
                    aria-hidden="true"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <header className="text-center mb-12 lg:mb-16">
                    <h2 className="text-xl sm:text-2xl lg:text-[26px] xl:text-3xl font-medium font-montserrat leading-tight sm:leading-[55px]">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                            Insights
                        </span>{' '}
                        <span className="text-[#6c6c6c]">
                            from the Field
                        </span>
                    </h2>
                </header>

                {/* Blog Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-11 justify-items-center">
                    {blogs.map(blog => (
                        <BlogCard key={blog.id} blog={blog} />
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
        </section>
    );
};

export default Blogs;