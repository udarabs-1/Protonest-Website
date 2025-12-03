'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const useMultipleOnScreen = (refs: React.RefObject<HTMLDivElement | null>[]) => {
    const [intersectingSlides, setIntersectingSlides] = useState<Set<number>>(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                setIntersectingSlides(prev => {
                    const newSet = new Set(prev);
                    entries.forEach(entry => {
                        const index = refs.findIndex(ref => ref.current === entry.target);
                        if (index !== -1) {
                            if (entry.isIntersecting) {
                                newSet.add(index);
                            } else {
                                newSet.delete(index);
                            }
                        }
                    });
                    return newSet;
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-50px'
            }
        );

        refs.forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            refs.forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, [refs]);

    return intersectingSlides;
};

const images = [
    '/project1.svg',
    '/project2.svg',
    '/project3.webp',
    '/project4.webp',
];

export default function ProjectSlider() {
    const [borderedSlides, setBorderedSlides] = useState<Set<number>>(new Set());
    const [prevHover, setPrevHover] = useState(false);
    const [nextHover, setNextHover] = useState(false);
    const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);
    const [swiperReady, setSwiperReady] = useState(false);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);

    const slideRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>([]);

    useEffect(() => {
        slideRefs.current = images.map(() => React.createRef<HTMLDivElement>());
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {

        const timer = setTimeout(() => {
            setSwiperReady(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const intersectingSlides = useMultipleOnScreen(slideRefs.current);

    useEffect(() => {
        if (isMobile) {

            if (intersectingSlides.has(activeSlideIndex)) {
                setHoveredSlide(activeSlideIndex);
            } else {
                setHoveredSlide(null);
            }
        }
    }, [intersectingSlides, activeSlideIndex, isMobile]);

    const handleSlideChange = (swiper: SwiperType) => {
        const index = swiper.realIndex;
        setActiveSlideIndex(index);

        const newSet = new Set(borderedSlides);
        newSet.add(index);
        setBorderedSlides(newSet);

        setTimeout(() => {
            setBorderedSlides((prev) => {
                const updated = new Set(prev);
                updated.delete(index);
                return new Set(updated);
            });
        }, 500);
    };

    const handleMouseEnter = () => {
        if (swiperRef.current && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.stop();
        }
    };

    const handleMouseLeave = () => {
        if (swiperRef.current && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.start();
        }
    };

    const handleSlideHover = (index: number, isHovering: boolean) => {
        if (!isMobile) {
            setHoveredSlide(isHovering ? index : null);
        }
    };

    return (
        <div>
            <div className="hidden lg:block w-full py-20 lg:py-24 xl:py-28 2xl:py-30 relative">

                <div className="absolute inset-0 -z-10">
                    <Image
                        src="/home-4.svg"
                        alt="Projects background"
                        fill
                        priority={false}
                        quality={70}
                        sizes="100vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                <div className="relative z-10">
                    <h2 className="text-center text-[24px] lg:text-[26px] xl:text-[30px] 2xl:text-[32px] font-medium font-montserrat text-[#6c6c6c] px-4">
                        Bringing IoT Innovation to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Life!</span>
                    </h2>
                    <p className="text-[16px] xl:text-[18px] 2xl:text-[19px] text-center mt-4 lg:mt-5 xl:mt-6 text-[#6c6c6c] font-poppins px-4">
                        Our Success Projects That Inspire
                    </p>

                    <div className="max-w-[1200px] lg:max-w-[1300px] xl:max-w-[1400px] 2xl:max-w-[1440px] mx-auto px-8 lg:px-16 xl:px-24 2xl:px-[133px]">
                        <div
                            className="swiper-button-prev-unique absolute left-4 lg:left-8 xl:left-12 2xl:left-15 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                            onMouseEnter={() => setPrevHover(true)}
                            onMouseLeave={() => setPrevHover(false)}
                        >
                            <Image
                                src={prevHover ? "/leftNav-hover.svg" : "/leftNav.svg"}
                                alt="Previous slide"
                                width={24}
                                height={24}
                                priority={false}
                                quality={80}
                                className="lg:w-[22px] lg:h-[22px] xl:w-[24px] xl:h-[24px]"
                            />
                        </div>
                        <div
                            className="relative overflow-visible mx-auto"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={`transition-opacity duration-300 ${swiperReady ? 'opacity-100' : 'opacity-0'}`}>
                                <Swiper
                                    modules={[Navigation, EffectCoverflow, Autoplay]}
                                    effect="coverflow"
                                    grabCursor={true}
                                    centeredSlides={true}
                                    loop={true}
                                    slidesPerView="auto"
                                    spaceBetween={20}
                                    centeredSlidesBounds={true}
                                    watchSlidesProgress={true}
                                    autoplay={{
                                        delay: 4000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: false,
                                    }}
                                    breakpoints={{
                                        1024: {
                                            spaceBetween: 30,
                                        },
                                        1280: {
                                            spaceBetween: 40,
                                        },
                                        1536: {
                                            spaceBetween: 50,
                                        }
                                    }}
                                    navigation={{
                                        nextEl: '.swiper-button-next-unique',
                                        prevEl: '.swiper-button-prev-unique',
                                    }}
                                    coverflowEffect={{
                                        rotate: 0,
                                        stretch: 0,
                                        depth: 60,
                                        modifier: 1.8,
                                        slideShadows: false,
                                    }}
                                    onSlideChange={handleSlideChange}
                                    onSwiper={(swiper) => {
                                        setSwiperReady(true);
                                        swiperRef.current = swiper;
                                    }}
                                >
                                    {images.map((img, index) => {
                                        const showBorder = borderedSlides.has(index % images.length);
                                        return (
                                            <SwiperSlide
                                                key={index}
                                                style={{
                                                    width: '350px',
                                                    flexShrink: 0,
                                                }}
                                                className="lg:!w-[400px] xl:!w-[450px] 2xl:!w-[480px]"
                                            >
                                                <div
                                                    className={`w-full aspect-w-16 aspect-h-9 rounded-[25px] lg:rounded-[30px] xl:rounded-[35px] shadow-xl backdrop-blur-lg p-[20px] lg:p-[22px] xl:p-[25px] transition-all duration-300 overflow-hidden my-8 lg:my-10 xl:my-12 ${showBorder ? 'bg-black' : 'bg-[rgba(255,255,255,0.05)]'
                                                        }`}
                                                >
                                                    <div
                                                        className="relative rounded-[12px] lg:rounded-[14px] xl:rounded-[15px] overflow-hidden"
                                                        onMouseEnter={() => handleSlideHover(index, true)}
                                                        onMouseLeave={() => handleSlideHover(index, false)}
                                                    >
                                                        <Image
                                                            src={img}
                                                            alt={`Project ${index + 1}`}
                                                            width={480}
                                                            height={360}
                                                            priority={index === 0}
                                                            quality={index === 0 ? 85 : 75}
                                                            sizes="(max-width: 1024px) 350px, (max-width: 1280px) 400px, (max-width: 1536px) 450px, 480px"
                                                            className={`object-cover w-full h-full rounded-[12px] lg:rounded-[14px] xl:rounded-[15px] transition-all duration-300 ${hoveredSlide === index ? 'grayscale' : 'grayscale-0'
                                                                }`}
                                                        />

                                                        <div className={`absolute bottom-3 lg:bottom-4 left-0 right-0 flex justify-center transition-all duration-300 ${hoveredSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                            <Link href="/research-and-project">
                                                                <button className="w-[140px] lg:w-[160px] xl:w-[180px] h-[40px] lg:h-[45px] xl:h-[50px] bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-[57px] font-semibold font-montserrat text-[13px] lg:text-[14px] xl:text-[15px] hover:from-[#F51DA5] hover:to-[#5530FA] hover:font-poppins transition">
                                                                    Read More
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            </div>
                        </div>

                        <div
                            className="swiper-button-next-unique absolute right-4 lg:right-8 xl:right-12 2xl:right-15 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                            onMouseEnter={() => setNextHover(true)}
                            onMouseLeave={() => setNextHover(false)}
                        >
                            <Image
                                src={nextHover ? "/rightNav-hover.svg" : "/rightNav.svg"}
                                alt="Next slide"
                                width={24}
                                height={24}
                                priority={false}
                                quality={80}
                                className="lg:w-[22px] lg:h-[22px] xl:w-[24px] xl:h-[24px]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 lg:mt-8 xl:mt-10 2xl:mt-12 text-center">
                        <Link href="/research-and-project">
                            <button className="w-[140px] lg:w-[160px] xl:w-[180px] h-[40px] lg:h-[45px] xl:h-[50px] gradient-button font-medium font-poppins text-[13px] lg:text-[14px] xl:text-[15px] hover:font-semibold transition">
                                View All Projects
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="lg:hidden w-full py-12 sm:py-16 md:py-20 relative">

                <div className="absolute inset-0 -z-10">
                    <Image
                        src="/home-4.svg"
                        alt="Projects background"
                        fill
                        priority={false}
                        quality={65}
                        sizes="100vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                <div className="relative z-10">
                    <h2 className="text-center text-[24px] font-medium font-montserrat text-[#6c6c6c] px-4">
                        Bringing IoT Innovation to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Life!</span>
                    </h2>
                    <p className="text-[14px] text-center mt-3 sm:mt-4 md:mt-6 text-[#6c6c6c] font-poppins px-4">
                        Our Success Projects That Inspire
                    </p>

                    <div className="max-w-full px-4 sm:px-6 md:px-8 relative mt-8 sm:mt-10 md:mt-12">
                        <div
                            className="swiper-button-prev-unique absolute left-2 sm:left-4 md:left-6 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                            onMouseEnter={() => setPrevHover(true)}
                            onMouseLeave={() => setPrevHover(false)}
                        >
                            <Image
                                src={prevHover ? "/leftNav-hover.svg" : "/leftNav.svg"}
                                alt="Previous slide"
                                width={22}
                                height={22}
                                priority={false}
                                quality={80}
                                className="sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px]"
                            />
                        </div>
                        <div
                            className="relative overflow-visible mx-10 sm:mx-24 md:mx-24"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={`transition-opacity duration-300 ${swiperReady ? 'opacity-100' : 'opacity-0'}`}>
                                <Swiper
                                    modules={[Navigation, EffectCoverflow, Autoplay]}
                                    effect="coverflow"
                                    grabCursor={true}
                                    centeredSlides={true}
                                    loop={true}
                                    slidesPerView={1}
                                    spaceBetween={20}
                                    centeredSlidesBounds={true}
                                    watchSlidesProgress={true}
                                    autoplay={{
                                        delay: 4000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: false,
                                    }}
                                    navigation={{
                                        nextEl: '.swiper-button-next-unique',
                                        prevEl: '.swiper-button-prev-unique',
                                    }}
                                    coverflowEffect={{
                                        rotate: 0,
                                        stretch: 0,
                                        depth: 40,
                                        modifier: 1.2,
                                        slideShadows: false,
                                    }}
                                    onSlideChange={handleSlideChange}
                                    onSwiper={(swiper) => {
                                        setSwiperReady(true);
                                        if (!swiperRef.current) {
                                            swiperRef.current = swiper;
                                        }
                                    }}
                                >
                                    {images.map((img, index) => {
                                        const showBorder = borderedSlides.has(index % images.length);
                                        const isActiveAndVisible = isMobile && index === activeSlideIndex;

                                        return (
                                            <SwiperSlide key={index}>
                                                <div
                                                    ref={slideRefs.current[index]}
                                                    className={`w-full aspect-w-16 aspect-h-9 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] shadow-sm md:shadow-lg backdrop-blur-lg p-[15px] sm:p-[18px] md:p-[22px] transition-all duration-300 overflow-hidden my-6 sm:my-8 md:my-10 ${showBorder ? 'bg-black' : 'bg-[rgba(255,255,255,0.05)]'
                                                        }`}
                                                >
                                                    <div
                                                        className="relative rounded-[10px] sm:rounded-[12px] md:rounded-[14px] overflow-hidden"
                                                        onMouseEnter={() => handleSlideHover(index, true)}
                                                        onMouseLeave={() => handleSlideHover(index, false)}
                                                    >
                                                        <Image
                                                            src={img}
                                                            alt={`Project ${index + 1}`}
                                                            width={400}
                                                            height={300}
                                                            priority={index === 0}
                                                            quality={index === 0 ? 80 : 70}
                                                            sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, 400px"
                                                            className={`object-cover w-full h-full rounded-[10px] sm:rounded-[12px] md:rounded-[14px] transition-all duration-300 ${(hoveredSlide === index || isActiveAndVisible) ? 'grayscale' : 'grayscale-0'
                                                                }`}
                                                        />

                                                        <div className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 flex justify-center transition-all duration-300 ${(hoveredSlide === index || isActiveAndVisible) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                            <Link href="/research-and-project">
                                                                <button className="w-[120px] sm:w-[140px] md:w-[160px] h-[35px] sm:h-[40px] md:h-[45px] bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-[57px] font-semibold font-montserrat text-[11px] sm:text-[12px] md:text-[14px] hover:from-[#F51DA5] hover:to-[#5530FA] hover:font-poppins transition shadow-lg">
                                                                    Read More
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            </div>
                        </div>

                        <div
                            className="swiper-button-next-unique absolute right-2 sm:right-4 md:right-6 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                            onMouseEnter={() => setNextHover(true)}
                            onMouseLeave={() => setNextHover(false)}
                        >
                            <Image
                                src={nextHover ? "/rightNav-hover.svg" : "/rightNav.svg"}
                                alt="Next slide"
                                width={22}
                                height={22}
                                priority={false}
                                quality={80}
                                className="sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 md:mt-10 text-center">
                        <Link href="/research-and-project">
                            <button className="w-[140px] sm:w-[160px] md:w-[170px] h-[40px] sm:h-[45px] md:h-[48px] gradient-button font-medium font-poppins text-[12px] sm:text-[13px] md:text-[14px] hover:font-semibold transition">
                                View All Projects
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}