'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const projects = [
    { id: 1, title: 'Compact GPS Tracker', image: '/project1.png' },
    { id: 2, title: 'Smart Door Lock', image: '/project2.png' },
    { id: 3, title: 'Smart WiFi Rebooter', image: '/project3.png' },
    { id: 4, title: 'Soap Dose Tracking System', image: '/project4.png' },
];

export default function ProjectSlider() {
    const swiperRef = useRef<SwiperType | null>(null);

    const handlePrev = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
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

                <div className="relative z-10 px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]">
                    <div className="flex justify-between items-center mb-12 lg:mb-16">
                        <div>
                            <h2 className="text-[24px] lg:text-[26px] xl:text-[30px] 2xl:text-[32px] font-medium font-montserrat text-[#6c6c6c]">
                                Bringing IoT Innovation to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Life!</span>
                            </h2>
                            <p className="text-[16px] xl:text-[18px] 2xl:text-[19px] mt-2 text-[#6c6c6c] font-poppins">
                                Our Success Projects That Inspire
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handlePrev}
                                className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border-2 border-gray-400 text-gray-600 flex items-center justify-center cursor-pointer hover:scale-105"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border-2 border-gray-400 text-gray-600 flex items-center justify-center cursor-pointer hover:scale-105"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={3}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            reverseDirection: false,
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            1280: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {projects.map((project) => (
                            <SwiperSlide key={project.id}>
                                <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200">
                                    <div className="relative w-full aspect-video">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1280px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-[#333333] text-sm font-medium font-poppins">
                                            {project.title}
                                        </h3>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="mt-12 text-center">
                        <Link href="/research-and-project?tab=projects">
                            <button className="w-[160px] sm:w-[180px] h-[45px] lg:h-[50px] gradient-button font-poppins text-[14px] lg:text-[15px] xl:text-[16px]">
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

                <div className="relative z-10 px-4 sm:px-6">
                    <div className="mb-8">
                        <div className="sm:flex sm:justify-between sm:items-center">
                            <div>
                                <h2 className="text-[24px] font-medium font-montserrat text-[#6c6c6c]">
                                    Bringing IoT Innovation to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Life!</span>
                                </h2>
                                <p className="text-[14px] mt-2 text-[#6c6c6c] font-poppins">
                                    Our Success Projects That Inspire
                                </p>
                            </div>
                            <div className="hidden sm:flex gap-4">
                                <button
                                    onClick={handlePrev}
                                    className="mobile-nav-prev w-10 h-10 rounded-full border-2 border-gray-400 text-gray-600 flex items-center justify-center cursor-pointer hover:scale-105"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="mobile-nav-next w-10 h-10 rounded-full border-2 border-gray-400 text-gray-600 flex items-center justify-center cursor-pointer hover:scale-105"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex sm:hidden justify-end gap-3 mt-4">
                            <button
                                onClick={handlePrev}
                                className="mobile-nav-prev w-10 h-10 rounded-full border-2 border-gray-400 text-gray-600 flex items-center justify-center cursor-pointer hover:scale-105"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNext}
                                className="mobile-nav-next w-10 h-10 rounded-full border-2 border-gray-400 text-gray-600 flex items-center justify-center cursor-pointer hover:scale-105"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={16}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                reverseDirection: false,
                            }}
                            breakpoints={{
                                480: {
                                    slidesPerView: 1,
                                    spaceBetween: 16,
                                },
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                            }}
                            navigation={{
                                prevEl: '.mobile-nav-prev',
                                nextEl: '.mobile-nav-next',
                            }}
                        >
                            {projects.map((project) => (
                                <SwiperSlide key={project.id}>
                                    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200">
                                        <div className="relative w-full aspect-video">
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                                sizes="90vw"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-[#333333] text-sm font-medium font-poppins">
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/research-and-project?tab=projects">
                            <button className="w-[160px] h-[45px] gradient-button font-medium font-poppins text-[13px] hover:font-semibold transition">
                                View All Projects
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}