'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';




interface NavItem {
    href: string;
    label: string;
    isConditional?: boolean;
}

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        setIsUserSignedIn(!!token);
    }, []);


    const handleNavigation = () => {
        setMobileMenuOpen(false);
    };

    const handleCareersClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (isUserSignedIn) {
            router.push('/dashboard/all-jobs');
        } else {
            router.push('/careers');
        }
        handleNavigation();
    };

    const navItems: NavItem[] = [
        { href: "/", label: "Home" },
        { href: "/about-us", label: "About Us" },
        { href: "/blog", label: "Blog" },
        { href: "/research-and-project", label: "Research & Projects" },
        { href: "/careers", label: "Careers", isConditional: true },
        { href: "/contact-us", label: "Contact Us" }
    ];

    const isNavItemActive = (item: NavItem) => {
        if (item.isConditional && isUserSignedIn) {
            return pathname === '/dashboard/all-jobs';
        }
        return pathname === item.href;
    };

    const shouldShowGradient = (item: NavItem) => {
        const isActive = isNavItemActive(item);
        if (!isActive) return false;
        if (hoveredItem && hoveredItem !== item.href) return false;
        return true;
    };

    const showAccountButton = pathname === "/careers" ||
        pathname.startsWith('/jobs');

    return (
        <div>

            <div className="hidden lg:block">
                <div className="relative">
                    <nav className="fixed top-0 left-0 w-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-4 md:py-[35px] lg:py-[25px] xl:py-[28px] 2xl:py-[30px] z-50 bg-white/80 backdrop-blur-[20px]">
                        <div className="container mx-auto">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Link href="/" onClick={handleNavigation}>
                                        <Image
                                            src="/logo.webp"
                                            alt="Company Logo"
                                            width={100}
                                            height={71}
                                            priority={true}
                                            quality={95}
                                            sizes="(max-width: 1024px) 80px, (max-width: 1280px) 90px, 100px"
                                            className="lg:w-[80px] lg:h-[57px] xl:w-[90px] xl:h-[64px] 2xl:w-[100px] 2xl:h-[71px]"
                                        />
                                    </Link>
                                </div>

                                <div className="font-montserrat text-sm lg:text-[15px] xl:text-base 2xl:text-lg flex items-center space-x-3 lg:space-x-[25px] xl:space-x-[35px] 2xl:space-x-[45px]">
                                    {navItems.map((item) => {
                                        const showGradient = shouldShowGradient(item);
                                        const isHovered = hoveredItem === item.href;
                                        const isConditional = item.isConditional;

                                        return (
                                            <div key={item.href} className="relative">
                                                <div className="flex items-center gap-[5px] xl:gap-[7px] 2xl:gap-[8px]">
                                                    <Link
                                                        href={item.href}
                                                        className={`group flex items-center gap-[5px] xl:gap-[7px] 2xl:gap-[8px] transition-none ${showGradient || isHovered ? 'text-transparent bg-gradient-to-r from-[#f51da5] to-[#5530fa] bg-clip-text' : 'text-[#83848b]'}`}
                                                        onMouseEnter={() => setHoveredItem(item.href)}
                                                        onMouseLeave={() => setHoveredItem(null)}
                                                        onClick={(e) => {
                                                            if (isConditional) {
                                                                handleCareersClick(e);
                                                            } else {
                                                                handleNavigation();
                                                            }
                                                        }}
                                                    >
                                                        <span className={`whitespace-nowrap ${showGradient || isHovered ? '' : 'group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#f51da5] group-hover:to-[#5530fa] group-hover:bg-clip-text'}`}>
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {showAccountButton ? (
                                    <div className="font-poppins flex items-center space-x-3 lg:space-x-[20px] xl:space-x-[25px] 2xl:space-x-[30px]">
                                        <Link
                                            href={isUserSignedIn ? "/dashboard" : "/signin"}
                                            className="cursor-pointer flex items-center justify-center w-[110px] lg:w-[130px] xl:w-[147px] 2xl:w-[160px] h-[40px] lg:h-[42px] xl:h-[44px] 2xl:h-[48px] text-sm lg:text-[15px] xl:text-base 2xl:text-lg bg-none border gradient-button-static p-[8px] lg:p-[9px] xl:p-[10px] rounded-[30px]"
                                        >
                                            My Account
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="font-poppins flex items-center space-x-3 lg:space-x-[20px] xl:space-x-[25px] 2xl:space-x-[30px]">
                                        <Link
                                            href="/contact-us#book-a-call"
                                            className="cursor-pointer flex items-center justify-center w-[110px] lg:w-[130px] xl:w-[147px] 2xl:w-[160px] h-[40px] lg:h-[42px] xl:h-[44px] 2xl:h-[48px] text-sm lg:text-[15px] xl:text-base 2xl:text-lg bg-none border gradient-button-static p-[8px] lg:p-[9px] xl:p-[10px] rounded-[30px]"
                                        >
                                            Book a Call
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>



                    <div className="pt-[100px] lg:pt-[105px] xl:pt-[115px] 2xl:pt-[125px]"></div>
                </div>
            </div>


            <div className="block lg:hidden">
                <div className="relative">
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                className="fixed inset-0 z-40 bg-black/20 backdrop-grayscale"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setMobileMenuOpen(false)}
                            />
                        )}
                    </AnimatePresence>

                    <motion.nav
                        className={`fixed top-0 left-0 w-full px-4 md:px-8 py-6 md:py-8 z-50 backdrop-blur-[20px]`}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex justify-between items-center max-w-7xl mx-auto">
                            <Link href="/" onClick={handleNavigation}>
                                <Image
                                    src="/logo.webp"
                                    alt="Company Logo"
                                    width={100}
                                    height={71}
                                    priority={true}
                                    quality={95}
                                    sizes="(max-width: 768px) 90px, 100px"
                                    className="w-[90px] md:w-[100px] h-16 md:h-18"
                                />
                            </Link>

                            <div className="flex items-center gap-3 md:gap-6">
                                {showAccountButton ? (
                                    <Link
                                        href={isUserSignedIn ? "/dashboard" : "/signin"}
                                        className="cursor-pointer h-[40px] w-[131px] md:w-[145px] lg:w-[160px] p-2.5 md:p-3 rounded-[30px] border border-[#b7b7b7] gradient-button-static flex justify-center items-center gap-2.5"
                                    >
                                        <span className="text-sm font-medium font-montserrat">
                                            My Account
                                        </span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/contact-us#book-a-call"
                                        className="cursor-pointer h-[40px] w-[131px] md:w-[145px] lg:w-[160px] p-2.5 md:p-3 rounded-[30px] border border-[#b7b7b7] gradient-button-static flex justify-center items-center gap-2.5"
                                    >
                                        <span className="text-sm font-medium font-montserrat">
                                            Book a Call
                                        </span>
                                    </Link>
                                )}

                                <button
                                    className="w-[38px] md:w-[44px] h-[38px] md:h-[44px] hover:scale-105 transition-transform"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    aria-label="Toggle mobile menu"
                                >
                                    <Image
                                        src="/menu.svg"
                                        alt=""
                                        width={44}
                                        height={44}
                                        className="w-full h-full"
                                        priority={false}
                                        quality={90}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.nav>

                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                className="fixed top-0 right-0 w-[319px] md:w-[420px] h-full z-50 bg-white/80 backdrop-blur-[20px] shadow-2xl"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                            >
                                <div className="w-[250px] md:w-[350px] h-16 md:h-20 left-[34px] md:left-[35px] top-[35px] md:top-[32px] absolute">
                                    <Image
                                        className="w-[90px] md:w-[100px] h-16 md:h-18 left-0 top-0 absolute"
                                        src="/logo.webp"
                                        alt="Company Logo"
                                        width={100}
                                        height={71}
                                        priority={false}
                                        quality={95}
                                        sizes="(max-width: 768px) 90px, 100px"
                                    />
                                    <button
                                        className="w-[38px] md:w-[44px] h-[38px] md:h-[44px] left-[212px] md:left-[306px] top-[13px] md:top-[18px] absolute hover:scale-105 transition-transform"
                                        onClick={() => setMobileMenuOpen(false)}
                                        aria-label="Close mobile menu"
                                    >
                                        <Image
                                            src="/menu.svg"
                                            alt=""
                                            width={44}
                                            height={44}
                                            className="w-full h-full"
                                            priority={false}
                                            quality={90}
                                        />
                                    </button>
                                </div>

                                <div className="w-[250px] md:w-[350px] left-[34px] md:left-[35px] top-[157px] md:top-[180px] absolute inline-flex flex-col justify-center items-start gap-[35px] md:gap-[42px]">
                                    {navItems.map((item, index) => {
                                        const isConditional = item.isConditional;

                                        return (
                                            <div key={index} className="w-full">
                                                <Link
                                                    href={item.href}
                                                    className="inline-flex justify-start items-center gap-[7px] md:gap-[10px] w-full hover:scale-105 transition-transform origin-left"
                                                    onClick={(e) => {
                                                        if (isConditional) {
                                                            handleCareersClick(e);
                                                        } else {
                                                            handleNavigation();
                                                        }
                                                    }}
                                                >
                                                    <span className={`text-base md:text-lg font-montserrat transition-all duration-200 ${pathname === item.href || (isConditional && isUserSignedIn && pathname === '/dashboard/all-jobs')
                                                        ? 'text-transparent bg-gradient-to-r from-[#f51da5] to-[#5530fa] bg-clip-text'
                                                        : 'text-[#83848b] hover:text-[#f51da5]'}`}
                                                    >
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-[88px] md:pt-[104px]"></div>
                </div>
            </div>
        </div>
    );
}