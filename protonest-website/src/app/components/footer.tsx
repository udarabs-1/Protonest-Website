'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Footer() {
    const pathname = usePathname();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const isActive = (path: string): boolean => pathname === path;

    const getNavLinkClass = (path: string, isDesktop: boolean = true): string => {
        const baseClass = "text-[#83848b]";
        const gradientClass = "text-transparent bg-clip-text bg-gradient-to-r from-[#f51da5] to-[#5530fa]";

        if (isDesktop) {
            // Desktop: Show gradient for active item only if nothing is hovered, or for hovered item
            if (hoveredItem === path) {
                return gradientClass;
            } else if (hoveredItem === null && isActive(path)) {
                return gradientClass;
            } else {
                return baseClass;
            }
        } else {
            // Mobile: Show gradient for active item only
            return isActive(path) ? gradientClass : baseClass;
        }
    };

    const handleMouseEnter = (path: string): void => {
        setHoveredItem(path);
    };

    const handleMouseLeave = (): void => {
        setHoveredItem(null);
    };

    return (
        <>
            {/* Desktop Footer (lg screens and up) */}
            <div className="hidden lg:block w-full lg:px-[60px] xl:px-[133px] lg:h-[450px] xl:h-[520px] xxl:h-[578px] lg:mb-[50px] xl:mb-[60px] xxl:mb-[70px]">
                <div className="rounded-b-[25px] relative h-full overflow-hidden">
                    {/* Background GIF */}
                    <div
                        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
                        style={{ backgroundImage: "url('/footerWeb.gif')" }}
                    />

                    <div className='relative z-20 lg:px-[60px] xl:px-[80px] xxl:px-[98px]'>
                        <div className="w-full flex lg:pt-[120px] xl:pt-[150px] xxl:pt-[180px] justify-between">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={149}
                                height={106}
                                className="lg:w-[120px] lg:h-[85px] xl:w-[135px] xl:h-[96px] xxl:w-[149px] xxl:h-[106px]"
                            />
                            <div className="flex flex-col justify-center">
                                <div className='font-montserrat lg:text-[12px] xl:text-[14px] xxl:text-[16px] lg:space-x-[25px] xl:space-x-[30px] xxl:space-x-[35px] text-right'>
                                    <Link
                                        href="/"
                                        className={getNavLinkClass('/', true)}
                                        onMouseEnter={() => handleMouseEnter('/')}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/projects"
                                        className={getNavLinkClass('/projects', true)}
                                        onMouseEnter={() => handleMouseEnter('/projects')}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        Projects
                                    </Link>
                                    <Link
                                        href="/research"
                                        className={getNavLinkClass('/research', true)}
                                        onMouseEnter={() => handleMouseEnter('/research')}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        Research
                                    </Link>
                                    <Link
                                        href="/blogs"
                                        className={getNavLinkClass('/blogs', true)}
                                        onMouseEnter={() => handleMouseEnter('/blogs')}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        Blogs
                                    </Link>
                                    <Link
                                        href="/about"
                                        className={getNavLinkClass('/about', true)}
                                        onMouseEnter={() => handleMouseEnter('/about')}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        About Us
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className={getNavLinkClass('/contact', true)}
                                        onMouseEnter={() => handleMouseEnter('/contact')}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-between items-end lg:mt-[8px] xl:mt-[9px] xxl:mt-[10px]'>
                            <div className='lg:text-[10px] xl:text-[11px] xxl:text-[14px] font-poppins text-[#6c6c6c] lg:max-w-[280px] xl:max-w-[320px] xxl:max-w-none'>
                                503/A, Welivita Road, Kaduwela, Colombo, Sri Lanka, 10640
                            </div>
                            <button className="lg:w-[120px] lg:h-[36px] xl:w-[135px] xl:h-[40px] xxl:w-[147px] xxl:h-[44px] lg:text-[12px] xl:text-[14px] xxl:text-[16px] bg-none border border-[#83848b] text-[#83848b] lg:p-[8px] xl:p-[9px] xxl:p-[10px] rounded-[30px]">
                                Get a Quote
                            </button>
                        </div>

                        <div className='flex lg:space-x-[15px] xl:space-x-[18px] xxl:space-x-[20px] w-auto h-[17px] lg:mt-[30px] xl:mt-[35px] xxl:mt-[40px] cursor-pointer text-[#4d4d4d]'>
                            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#f51da5] transition-colors duration-300">
                                <svg className="lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px] xxl:h-5 xxl:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-[#f51da5] transition-colors duration-300">
                                <svg className="lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px] xxl:h-5 xxl:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </Link>
                            <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#f51da5] transition-colors duration-300">
                                <svg className="lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px] xxl:h-5 xxl:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#f51da5] transition-colors duration-300">
                                <svg className="lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px] xxl:h-5 xxl:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>

                        <div className="bg-gradient-to-r from-[#F51DA5] to-[#5530FA] bg-clip-text text-transparent font-poppins lg:text-[10px] xl:text-[11px] xxl:text-[14px] lg:mt-[80px] xl:mt-[100px] xxl:mt-[120px] w-fit mx-auto">
                            © 2025 Protonest. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Footer (lg screens and down) */}
            <div className="block lg:hidden w-full h-[643px] md:h-[720px] relative">
                {/* Background GIF with margins */}
                <div
                    className="absolute inset-0 mx-4 my-4 md:mx-8 md:my-6 rounded-b-[25px] md:rounded-b-[35px] overflow-hidden bg-no-repeat bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('/footerMobile.gif')" }}
                />

                {/* Gradient Overlay with same margins */}
                <div className="absolute inset-0 mx-4 my-4 md:mx-8 md:my-6 rounded-b-[25px] md:rounded-b-[35px] bg-gradient-to-t from-transparent to-white z-10" />

                {/* Content Container - Centered within the GIF area */}
                <div className="relative z-20 h-full">
                    {/* Logo - Centered */}
                    <div className="w-[149px] h-[106px] md:w-[180px] md:h-[128px] left-1/2 -translate-x-1/2 top-[322px] md:top-[380px] absolute">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={149}
                            height={106}
                            className="w-full h-full"
                        />
                    </div>

                    {/* Address - Centered */}
                    <div className="w-[211px] md:w-[280px] left-1/2 -translate-x-1/2 top-[467px] md:top-[545px] absolute text-center text-[#6c6c6c] text-xs md:text-sm font-normal font-poppins">
                        503/A, Welivita Road, Kaduwela, Colombo, Sri Lanka, 10640
                    </div>

                    {/* Social Icons - Centered */}
                    <div className="left-1/2 -translate-x-1/2 top-[514px] md:top-[590px] absolute inline-flex justify-center items-center gap-[26px] md:gap-[32px]">
                        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="#4d4d4d" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="#4d4d4d" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </Link>
                        <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="#4d4d4d" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="#4d4d4d" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>

                    {/* Menu Columns Container - Centered */}
                    <div className="w-[280px] md:w-[320px] left-1/2 -translate-x-1/2 top-[51px] md:top-[60px] absolute flex justify-start items-start gap-[60px] md:gap-[80px]">
                        {/* Left Menu Column */}
                        <div className="inline-flex flex-col justify-start items-start gap-5 md:gap-6">
                            <Link href="/" className="inline-flex justify-start items-center gap-[7px]">
                                <div className={`text-center text-sm md:text-base font-montserrat leading-normal ${getNavLinkClass('/', false)}`}>Home</div>
                            </Link>
                            <Link href="/projects" className="inline-flex justify-start items-center gap-[7px]">
                                <div className={`text-center text-sm md:text-base font-montserrat leading-normal ${getNavLinkClass('/projects', false)}`}>Projects</div>
                            </Link>
                            <Link href="/research" className="inline-flex justify-start items-center gap-[7px]">
                                <div className={`text-center text-sm md:text-base font-montserrat leading-normal ${getNavLinkClass('/research', false)}`}>Research</div>
                            </Link>
                        </div>

                        {/* Right Menu Column */}
                        <div className="inline-flex flex-col justify-start items-start gap-5 md:gap-6">
                            <Link href="/blogs" className="inline-flex justify-start items-center gap-[7px]">
                                <div className={`text-center text-sm md:text-base font-montserrat leading-normal ${getNavLinkClass('/blogs', false)}`}>Blogs</div>
                            </Link>
                            <Link href="/about" className="inline-flex justify-start items-center gap-[7px]">
                                <div className={`text-center text-sm md:text-base font-montserrat leading-normal ${getNavLinkClass('/about', false)}`}>About Us</div>
                            </Link>
                            <Link href="/contact" className="inline-flex justify-start items-center gap-[7px]">
                                <div className={`text-center text-sm md:text-base font-montserrat leading-normal ${getNavLinkClass('/contact', false)}`}>Contact Us</div>
                            </Link>
                        </div>
                    </div>

                    {/* Get a Quote Button - Centered */}
                    <button className="w-[280px] md:w-[320px] p-2.5 md:p-3 left-1/2 -translate-x-1/2 top-[215px] md:top-[250px] absolute rounded-[30px] md:rounded-[35px] border border-[#83848b] inline-flex justify-center items-center gap-2.5">
                        <div className="text-right text-[#83848b] text-sm md:text-base font-poppins leading-normal">Get a Quote</div>
                    </button>

                    {/* Copyright - Centered */}
                    <div className="w-full px-4 md:px-8 left-1/2 -translate-x-1/2 top-[573px] md:top-[650px] absolute text-center bg-gradient-to-r from-[#F51DA5] to-[#5530FA] bg-clip-text text-transparent text-xs md:text-sm font-normal font-poppins leading-normal">
                        © 2025 Protonest. All Rights Reserved.
                    </div>
                </div>
            </div>
        </>
    );
}