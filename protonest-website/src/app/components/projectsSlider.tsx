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
        <div className="w-full py-30 relative">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/home-4.svg"
                    alt="Background"
                    fill
                />
            </div>

            <div className="relative z-10">
                <h2 className="text-center text-[30px] font-medium font-montserrat text-[#6c6c6c]">
                    Bringing IoT Innovation to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Life!</span>
                </h2>
                <p className="text-[18px] text-center mt-6 text-[#6c6c6c] font-poppins">
                    Our Success Project&apos;s That Inspire
                </p>

                <div className="max-w-[1440px] px-[133px]">
                    <div
                        className="swiper-button-prev-unique absolute left-15 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                        onMouseEnter={() => setPrevHover(true)}
                        onMouseLeave={() => setPrevHover(false)}
                    >
                        <Image
                            src={prevHover ? "/leftNav-hover.svg" : "/leftNav.svg"}
                            alt="Previous"
                            width={24}
                            height={24}
                        />
                    </div>
                    <div className="relative overflow-hidden mx-auto">
                        <Swiper
                            modules={[Navigation, EffectCoverflow]}
                            effect="coverflow"
                            grabCursor={true}
                            centeredSlides={true}
                            loop={true}
                            slidesPerView={3}
                            spaceBetween={-30}
                            navigation={{
                                nextEl: '.swiper-button-next-unique',
                                prevEl: '.swiper-button-prev-unique',
                            }}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 100,
                                modifier: 3,
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
                                            transform: 'scale(0.9)',
                                            padding: '40px 0',
                                        }}
                                    >
                                        <div
                                            className={`aspect-w-16 aspect-h-9 rounded-[35px] shadow-xl backdrop-blur-lg p-[25px] transition-all duration-300 overflow-hidden ${showBorder ? 'bg-black' : 'bg-[rgba(255,255,255,0.05)]'
                                                }`}
                                        >
                                            <div
                                                className="relative rounded-[15px] overflow-hidden"
                                                onMouseEnter={() => setHoveredSlide(index)}
                                                onMouseLeave={() => setHoveredSlide(null)}
                                            >
                                                <Image
                                                    src={hoveredSlide === index ? img.hover : img.normal}
                                                    alt={`Slide ${index + 1}`}
                                                    width={440}
                                                    height={440}
                                                    className="object-cover w-full h-full rounded-[15px]"
                                                />
                                                {/* Read More Button */}
                                                <div className={`absolute bottom-4 left-0 right-0 flex justify-center transition-all duration-300 ${hoveredSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                    <button className="w-[180px] h-[50px] bg-gradient-to-r from-[#5530FA] to-[#F51DA5] text-white rounded-[57px] font-semibold font-montserrat hover:from-[#F51DA5] hover:to-[#5530FA] hover:font-poppins transition">
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
                        className="swiper-button-next-unique absolute right-15 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                        onMouseEnter={() => setNextHover(true)}
                        onMouseLeave={() => setNextHover(false)}
                    >
                        <Image
                            src={nextHover ? "/rightNav-hover.svg" : "/rightNav.svg"}
                            alt="Next"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <button className="w-[180px] h-[50px] gradient-button font-medium font-poppins hover:font-semibold transition">
                        View All Projects
                    </button>
                </div>
            </div>
        </div>
    );
}