'use client';
import Image from 'next/image';
import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const images = [
    { normal: '/project1.svg', hover: '/project1-hover.svg' },
    { normal: '/project2.svg', hover: '/project2-hover.svg' },
    { normal: '/project1.svg', hover: '/project1-hover.svg' },
    { normal: '/project2.svg', hover: '/project2-hover.svg' },
    { normal: '/project1.svg', hover: '/project1-hover.svg' },
    { normal: '/project2.svg', hover: '/project2-hover.svg' },
];

export default function ProjectSlider() {
    const [borderedSlides, setBorderedSlides] = useState<Set<number>>(new Set());
    const [prevHover, setPrevHover] = useState(false);
    const [nextHover, setNextHover] = useState(false);
    const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);

    const handleSlideChange = (swiper: SwiperType) => {
        const index = swiper.realIndex;
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

    return (
        <div>
            <div className="hidden lg:block w-full py-20 lg:py-24 xl:py-28 2xl:py-30 relative">
                {/* Background Image */}
                <div className="absolute inset-0 -z-10">
                    <Image
                        src="/home-4.svg"
                        alt="Background"
                        fill
                    />
                </div>

                <div className="relative z-10">
                    <h2 className="text-center text-[24px] lg:text-[28px] xl:text-[30px] 2xl:text-[32px] font-medium font-montserrat text-[#6c6c6c] px-4">
                        Bringing IoT Innovation to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Life!</span>
                    </h2>
                    <p className="text-[16px] lg:text-[17px] xl:text-[18px] 2xl:text-[19px] text-center mt-4 lg:mt-5 xl:mt-6 text-[#6c6c6c] font-poppins px-4">
                        Our Success Project&apos;s That Inspire
                    </p>

                    <div className="max-w-[1200px] lg:max-w-[1300px] xl:max-w-[1400px] 2xl:max-w-[1440px] mx-auto px-8 lg:px-16 xl:px-24 2xl:px-[133px]">
                        <div
                            className="swiper-button-prev-unique absolute left-4 lg:left-8 xl:left-12 2xl:left-15 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                            onMouseEnter={() => setPrevHover(true)}
                            onMouseLeave={() => setPrevHover(false)}
                        >
                            <Image
                                src={prevHover ? "/leftNav-hover.svg" : "/leftNav.svg"}
                                alt="Previous"
                                width={20}
                                height={20}
                                className="lg:w-[22px] lg:h-[22px] xl:w-[24px] xl:h-[24px]"
                            />
                        </div>
                        <div className="relative overflow-hidden mx-auto">
                            <Swiper
                                modules={[Navigation, EffectCoverflow]}
                                effect="coverflow"
                                grabCursor={true}
                                centeredSlides={true}
                                loop={true}
                                slidesPerView={2.2}
                                spaceBetween={-20}
                                breakpoints={{
                                    1024: { // lg
                                        slidesPerView: 2.5,
                                        spaceBetween: -80,
                                    },
                                    1280: { // xl
                                        slidesPerView: 2.8,
                                        spaceBetween: -50,
                                    },
                                    1536: { // 2xl
                                        slidesPerView: 3,
                                        spaceBetween: -80,
                                    }
                                }}
                                navigation={{
                                    nextEl: '.swiper-button-next-unique',
                                    prevEl: '.swiper-button-prev-unique',
                                }}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 80,
                                    modifier: 2.5,
                                    slideShadows: false,
                                }}
                                onSlideChange={handleSlideChange}
                            >
                                {images.map((img, index) => {
                                    const showBorder = borderedSlides.has(index % images.length);
                                    return (
                                        <SwiperSlide
                                            key={index}
                                            style={{
                                                transform: 'scale(0.85)',
                                                padding: '30px 0',
                                            }}
                                            className="lg:!scale-[0.88] xl:!scale-90 2xl:!scale-90 lg:!py-8 xl:!py-9 2xl:!py-10"
                                        >
                                            <div
                                                className={`aspect-w-16 aspect-h-9 rounded-[25px] lg:rounded-[30px] xl:rounded-[35px] shadow-xl backdrop-blur-lg p-[20px] lg:p-[22px] xl:p-[25px] transition-all duration-300 overflow-hidden ${showBorder ? 'bg-black' : 'bg-[rgba(255,255,255,0.05)]'
                                                    }`}
                                            >
                                                <div
                                                    className="relative rounded-[12px] lg:rounded-[14px] xl:rounded-[15px] overflow-hidden"
                                                    onMouseEnter={() => setHoveredSlide(index)}
                                                    onMouseLeave={() => setHoveredSlide(null)}
                                                >
                                                    <Image
                                                        src={hoveredSlide === index ? img.hover : img.normal}
                                                        alt={`Slide ${index + 1}`}
                                                        width={440}
                                                        height={440}
                                                        className="object-cover w-full h-full rounded-[12px] lg:rounded-[14px] xl:rounded-[15px]"
                                                    />
                                                    {/* Read More Button */}
                                                    <div className={`absolute bottom-3 lg:bottom-4 left-0 right-0 flex justify-center transition-all duration-300 ${hoveredSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                        <button className="w-[140px] lg:w-[160px] xl:w-[180px] h-[40px] lg:h-[45px] xl:h-[50px] bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-[57px] font-semibold font-montserrat text-[13px] lg:text-[14px] xl:text-[15px] hover:from-[#F51DA5] hover:to-[#5530FA] hover:font-poppins transition">
                                                            Read More
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>

                        <div
                            className="swiper-button-next-unique absolute right-4 lg:right-8 xl:right-12 2xl:right-15 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                            onMouseEnter={() => setNextHover(true)}
                            onMouseLeave={() => setNextHover(false)}
                        >
                            <Image
                                src={nextHover ? "/rightNav-hover.svg" : "/rightNav.svg"}
                                alt="Next"
                                width={20}
                                height={20}
                                className="lg:w-[22px] lg:h-[22px] xl:w-[24px] xl:h-[24px]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 lg:mt-8 xl:mt-10 2xl:mt-12 text-center">
                        <button className="w-[140px] lg:w-[160px] xl:w-[180px] h-[40px] lg:h-[45px] xl:h-[50px] gradient-button font-medium font-poppins text-[13px] lg:text-[14px] xl:text-[15px] hover:font-semibold transition">
                            View All Projects
                        </button>
                    </div>
                </div>
            </div>
            <div className="lg:hidden w-full py-12 sm:py-16 md:py-20 relative">
                {/* Background Image */}
                <div className="absolute inset-0 -z-10">
                    <Image
                        src="/home-4.svg"
                        alt="Background"
                        fill
                    />
                </div>

                <div className="relative z-10">
                    <h2 className="text-center text-[24px] font-medium font-montserrat text-[#6c6c6c] px-4">
                        Bringing IoT Innovation to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Life!</span>
                    </h2>
                    <p className="text-[14px] text-center mt-3 sm:mt-4 md:mt-6 text-[#6c6c6c] font-poppins px-4">
                        Our Success Project&apos;s That Inspire
                    </p>

                    <div className="max-w-full px-4 sm:px-6 md:px-8 relative mt-8 sm:mt-10 md:mt-12">
                        <div
                            className="swiper-button-prev-unique absolute left-2 sm:left-4 md:left-6 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                            onMouseEnter={() => setPrevHover(true)}
                            onMouseLeave={() => setPrevHover(false)}
                        >
                            <Image
                                src={prevHover ? "/leftNav-hover.svg" : "/leftNav.svg"}
                                alt="Previous"
                                width={18}
                                height={18}
                                className="sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px]"
                            />
                        </div>
                        <div className="relative overflow-hidden mx-10 sm:mx-24 md:mx-24">
                            <Swiper
                                modules={[Navigation, EffectCoverflow]}
                                effect="coverflow"
                                grabCursor={true}
                                centeredSlides={true}
                                loop={true}
                                slidesPerView={1}

                                navigation={{
                                    nextEl: '.swiper-button-next-unique',
                                    prevEl: '.swiper-button-prev-unique',
                                }}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 60,
                                    modifier: 1.5,
                                    slideShadows: false,
                                }}
                                onSlideChange={handleSlideChange}
                            >
                                {images.map((img, index) => {
                                    const showBorder = borderedSlides.has(index % images.length);
                                    return (
                                        <SwiperSlide
                                            key={index}
                                            style={{
                                                transform: 'scale(0.95)',
                                                padding: '20px 0',
                                            }}
                                            className="sm:!scale-[0.92] md:!scale-90 sm:!py-6 md:!py-8"
                                        >
                                            <div
                                                className={`aspect-w-16 aspect-h-9 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] shadow-sm md:shadow-lg backdrop-blur-lg p-[15px] sm:p-[18px] md:p-[22px] transition-all duration-300 overflow-hidden ${showBorder ? 'bg-black' : 'bg-[rgba(255,255,255,0.05)]'
                                                    }`}
                                            >
                                                <div
                                                    className="relative rounded-[10px] sm:rounded-[12px] md:rounded-[14px] overflow-hidden"
                                                    onMouseEnter={() => setHoveredSlide(index)}
                                                    onMouseLeave={() => setHoveredSlide(null)}
                                                >
                                                    <Image
                                                        src={hoveredSlide === index ? img.hover : img.normal}
                                                        alt={`Slide ${index + 1}`}
                                                        width={440}
                                                        height={440}
                                                        className="object-cover w-full h-full rounded-[10px] sm:rounded-[12px] md:rounded-[14px]"
                                                    />
                                                    {/* Read More Button */}
                                                    <div className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 flex justify-center transition-all duration-300 ${hoveredSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                        <button className="w-[120px] sm:w-[140px] md:w-[160px] h-[35px] sm:h-[40px] md:h-[45px] bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-[57px] font-semibold font-montserrat text-[11px] sm:text-[12px] md:text-[14px] hover:from-[#F51DA5] hover:to-[#5530FA] hover:font-poppins transition">
                                                            Read More
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>

                        <div
                            className="swiper-button-next-unique absolute right-2 sm:right-4 md:right-6 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                            onMouseEnter={() => setNextHover(true)}
                            onMouseLeave={() => setNextHover(false)}
                        >
                            <Image
                                src={nextHover ? "/rightNav-hover.svg" : "/rightNav.svg"}
                                alt="Next"
                                width={18}
                                height={18}
                                className="sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 md:mt-10 text-center">
                        <button className="w-[140px] sm:w-[160px] md:w-[170px] h-[40px] sm:h-[45px] md:h-[48px] gradient-button font-medium font-poppins text-[12px] sm:text-[13px] md:text-[14px] hover:font-semibold transition">
                            View All Projects
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}