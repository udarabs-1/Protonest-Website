'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type DropdownKey = 'whats-new' | 'jobs' | 'stay-in-touch';

interface DropdownItem {
    href: string;
    label: string;
    description: string;
}

interface NavItem {
    href: string;
    label: string;
    hasDropdown?: boolean;
    key?: DropdownKey;
}

export default function Navbar() {
    const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const pathname = usePathname(); // Get current route

    const dropdownItems: Record<DropdownKey, DropdownItem[]> = {
        "whats-new": [
            { href: "/whats-new/blogs", label: "Blogs", description: "Insights, trends & stories from the IoT frontier." },
            { href: "/whats-new/research", label: "Research & Projects", description: "Explore case studies, prototypes & real-world applications." },
        ],
        "jobs": [
            { href: "/jobs/home", label: "Careers Home", description: "Join the Protonest freelance network." },
            { href: "/jobs/categories", label: "Career Categories", description: "Browse roles by tech focus — firmware, design, etc." },
            { href: "/jobs/apply", label: "Submit Your CV", description: "Upload your CV to get matched to open roles." }
        ],
        "stay-in-touch": [
            { href: "/contact", label: "Contact Us", description: "Reach out with questions, quotes, or partnerships." },
            { href: "/stay-in-touch/subscribe", label: "Subscription & Alerts", description: "Get notified about new freelance roles." },
        ]
    };

    const toggleDropdown = (dropdown: DropdownKey) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const handleNavigation = () => {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
    };

    const navItems: NavItem[] = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/whats-new", label: "What's New", hasDropdown: true, key: "whats-new" },
        { href: "/jobs", label: "Find Jobs", hasDropdown: true, key: "jobs" },
        { href: "/stay-in-touch", label: "Stay in Touch", hasDropdown: true, key: "stay-in-touch" }
    ];

    // Function to check if a nav item is active
    const isNavItemActive = (item: NavItem) => {
        if (item.hasDropdown) {
            return activeDropdown === item.key;
        }
        // For regular nav items, check if current pathname matches
        return pathname === item.href;
    };

    // Function to check if item should show gradient (active and not hovering other items)
    const shouldShowGradient = (item: NavItem) => {
        const isActive = isNavItemActive(item);
        if (!isActive) return false;

        // If hovering on another item, don't show gradient for this item
        if (hoveredItem && hoveredItem !== item.href) return false;

        // NEW: If any dropdown is open and this item doesn't have a dropdown, remove gradient
        if (activeDropdown && !item.hasDropdown) return false;

        return true;
    };

    const dropdownVariants = {
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2, ease: "easeOut" }
        },
        closed: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2, ease: "easeIn" }
        }
    };

    const itemVariants = {
        open: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.03,
                duration: 0.2,
                ease: "easeOut"
            }
        }),
        closed: {
            opacity: 0,
            y: -5,
            transition: { duration: 0.2 }
        }
    };

    const overlayVariants = {
        open: { opacity: 1, transition: { duration: 0.2 } },
        closed: { opacity: 0, transition: { duration: 0.15 } }
    };

    return (
        <div>
            {/* Desktop Navigation (lg screens and up) */}
            <div className="hidden lg:block">
                <div className="relative">
                    <nav className="fixed top-0 left-0 w-full px-4 sm:px-8 md:px-16 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-4 md:py-[35px] lg:py-[40px] xl:py-[43px] 2xl:py-[50px] z-50 bg-white/80 backdrop-blur-[20px]">
                        <div className="container mx-auto">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Link href="/" onClick={handleNavigation}>
                                        <Image
                                            src="/logo.png"
                                            alt="Logo"
                                            width={90}
                                            height={64}
                                            className="lg:w-[80px] lg:h-[57px] xl:w-[90px] xl:h-[64px] 2xl:w-[100px] 2xl:h-[71px]"
                                        />
                                    </Link>
                                </div>

                                <div className="font-montserrat text-sm lg:text-base xl:text-base 2xl:text-lg flex items-center space-x-3 lg:space-x-[25px] xl:space-x-[35px] 2xl:space-x-[45px]">
                                    {navItems.map((item) => {
                                        const showGradient = shouldShowGradient(item);
                                        const hasDropdown = item.hasDropdown;
                                        const isHovered = hoveredItem === item.href;

                                        return (
                                            <div key={item.href} className="relative">
                                                <div className="flex items-center gap-[5px] xl:gap-[7px] 2xl:gap-[8px]">
                                                    <Link
                                                        href={item.href}
                                                        className={`group flex items-center gap-[5px] xl:gap-[7px] 2xl:gap-[8px] transition-none ${showGradient || isHovered ? 'text-transparent bg-gradient-to-r from-[#f51da5] to-[#5530fa] bg-clip-text' : 'text-[#83848b]'}`}
                                                        onMouseEnter={() => setHoveredItem(item.href)}
                                                        onMouseLeave={() => setHoveredItem(null)}
                                                        onClick={(e) => {
                                                            if (hasDropdown && item.key) {
                                                                e.preventDefault();
                                                                toggleDropdown(item.key);
                                                            } else {
                                                                handleNavigation();
                                                            }
                                                        }}
                                                    >
                                                        <span className={`whitespace-nowrap ${showGradient || isHovered ? '' : 'group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#f51da5] group-hover:to-[#5530fa] group-hover:bg-clip-text'}`}>
                                                            {item.label}
                                                        </span>
                                                        {hasDropdown && (
                                                            <div className="relative h-3 w-3 lg:h-4 lg:w-4 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="100%"
                                                                    height="100%"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke={showGradient || isHovered ? "url(#arrowGradientActive)" : "currentColor"}
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className={`absolute inset-0 transition-transform ${activeDropdown === item.key ? 'rotate-180' : ''} ${showGradient || isHovered ? '' : 'text-[#83848b] group-hover:opacity-0'}`}
                                                                >
                                                                    {(showGradient || isHovered) && (
                                                                        <defs>
                                                                            <linearGradient id="arrowGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                                <stop offset="0%" stopColor="#f51da5" />
                                                                                <stop offset="100%" stopColor="#5530fa" />
                                                                            </linearGradient>
                                                                        </defs>
                                                                    )}
                                                                    <path d="m6 9 6 6 6-6" />
                                                                </svg>
                                                                {!(showGradient || isHovered) && (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="100%"
                                                                        height="100%"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="url(#arrowGradient)"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all"
                                                                    >
                                                                        <defs>
                                                                            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                                <stop offset="0%" stopColor="#f51da5" />
                                                                                <stop offset="100%" stopColor="#5530fa" />
                                                                            </linearGradient>
                                                                        </defs>
                                                                        <path d="m6 9 6 6 6-6" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="font-poppins flex items-center space-x-3 lg:space-x-[20px] xl:space-x-[25px] 2xl:space-x-[30px]">
                                    <button className="w-[110px] lg:w-[130px] xl:w-[147px] 2xl:w-[160px] h-[40px] lg:h-[42px] xl:h-[44px] 2xl:h-[48px] text-sm lg:text-base xl:text-base 2xl:text-lg bg-none border border-[#b7b7b7] text-[#83848b] p-[8px] lg:p-[9px] xl:p-[10px] rounded-[30px]">
                                        Get a Quote
                                    </button>
                                    <button className="relative group">
                                        <Image
                                            src="/bell-icon.svg"
                                            alt="bellIcon"
                                            width={32}
                                            height={40}
                                            className="lg:w-[32px] lg:h-[40px] xl:w-[36px] xl:h-[44px] 2xl:w-[40px] 2xl:h-[48px] group-hover:opacity-0 transition-none"
                                        />
                                        <Image
                                            src="/bell-icon-colour.svg"
                                            alt="bellIcon"
                                            width={32}
                                            height={40}
                                            className="lg:w-[32px] lg:h-[40px] xl:w-[36px] xl:h-[44px] 2xl:w-[40px] 2xl:h-[48px] absolute inset-0 opacity-0 group-hover:opacity-100 transition-none"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <AnimatePresence>
                        {activeDropdown && (
                            <>
                                <motion.div
                                    className="fixed inset-0 top-[130px] lg:top-[135px] xl:top-[150px] 2xl:top-[165px] z-30 bg-transparent"
                                    onClick={handleNavigation}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    variants={overlayVariants}
                                />

                                <motion.div
                                    className="font-montserrat fixed top-[130px] lg:top-[135px] xl:top-[150px] 2xl:top-[165px] left-0 w-full z-40 bg-white/80 backdrop-blur-[20px]"
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    variants={dropdownVariants}
                                >
                                    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-[70px] xl:px-[95px] 2xl:px-[140px]">
                                        <div className="w-full border-t border-[#a3a3a3]"></div>
                                    </div>

                                    <div className="container px-4 sm:px-8 md:px-16 lg:px-[100px] xl:px-[133px] 2xl:px-[180px] py-[35px] lg:py-[40px] xl:py-[43px] 2xl:py-[50px]">
                                        <div className="flex flex-wrap gap-4 lg:gap-[100px] xl:gap-[126px] 2xl:gap-[160px]">
                                            {dropdownItems[activeDropdown].map((dropdownItem, index) => (
                                                <motion.div
                                                    key={dropdownItem.href}
                                                    custom={index}
                                                    initial="closed"
                                                    animate="open"
                                                    exit="closed"
                                                    variants={itemVariants}
                                                >
                                                    <Link
                                                        href={dropdownItem.href}
                                                        className="w-full lg:w-[190px] xl:w-[214px] 2xl:w-[240px] block group"
                                                        onClick={handleNavigation}
                                                    >
                                                        <div className="text-sm lg:text-base xl:text-base 2xl:text-lg mb-2 text-[#83848b] group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#f51da5] group-hover:to-[#5530fa] group-hover:bg-clip-text inline-block">
                                                            {dropdownItem.label}
                                                        </div>
                                                        <div className="text-xs lg:text-xs xl:text-xs 2xl:text-sm text-[#83848b] group-hover:text-black leading-relaxed">
                                                            {dropdownItem.description}
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <div className="pt-[130px] lg:pt-[135px] xl:pt-[150px] 2xl:pt-[165px]"></div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="block lg:hidden">
                <div className="relative">
                    {/* Grayscale Overlay - covers entire screen when menu is open */}
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

                    {/* Mobile/Tablet Header */}
                    <motion.nav
                        className={`fixed top-0 left-0 w-full px-4 md:px-8 py-6 md:py-8 z-50 backdrop-blur-[20px]`}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex justify-between items-center max-w-7xl mx-auto">
                            <Link href="/" onClick={handleNavigation}>
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={90}
                                    height={64}
                                    className="w-[90px] md:w-[110px] h-16 md:h-20"
                                />
                            </Link>

                            <div className="flex items-center gap-3 md:gap-6">
                                <button className="w-[131px] md:w-[160px] p-2.5 md:p-3 rounded-[30px] border border-[#b7b7b7] flex justify-center items-center gap-2.5 ">
                                    <span className="text-[#83848b] text-sm md:text-base font-medium font-montserrat">Get a Quote</span>
                                </button>

                                <button className="relative group">
                                    <Image
                                        src="/bell-icon.svg"
                                        alt="bellIcon"
                                        width={36}
                                        height={44}
                                        className="w-9 md:w-10 h-11 md:h-12 group-hover:opacity-0 transition-opacity duration-200"
                                    />
                                    <Image
                                        src="/bell-icon-colour.svg"
                                        alt="bellIcon"
                                        width={36}
                                        height={44}
                                        className="absolute inset-0 w-9 md:w-10 h-11 md:h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    />
                                </button>

                                <button
                                    className="w-[38px] md:w-[44px] h-[38px] md:h-[44px] hover:scale-105 transition-transform"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    <Image
                                        src="/menu.svg"
                                        alt="Menu Toggle Icon"
                                        width={38}
                                        height={38}
                                        className="w-full h-full"
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.nav>

                    {/* Mobile/Tablet Menu */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                className="fixed top-0 right-0 w-[319px] md:w-[420px] h-full z-50 bg-white/80 backdrop-blur-[20px] shadow-2xl"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                            >
                                {/* Menu Header */}
                                <div className="w-[250px] md:w-[350px] h-16 md:h-20 left-[34px] md:left-[35px] top-[35px] md:top-[32px] absolute">
                                    <Image
                                        className="w-[90px] md:w-[110px] h-16 md:h-20 left-0 top-0 absolute"
                                        src="/logo.png"
                                        alt="Logo"
                                        width={90}
                                        height={64}
                                    />
                                    <button
                                        className="w-[38px] md:w-[44px] h-[38px] md:h-[44px] left-[212px] md:left-[306px] top-[13px] md:top-[18px] absolute hover:scale-105 transition-transform"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Image
                                            src="/menu.svg"
                                            alt="Close Menu"
                                            width={38}
                                            height={38}
                                            className="w-full h-full"
                                        />
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <div className="w-[250px] md:w-[350px] left-[34px] md:left-[35px] top-[157px] md:top-[180px] absolute inline-flex flex-col justify-center items-start gap-[35px] md:gap-[42px]">
                                    {navItems.map((item, index) => {
                                        const showGradient = shouldShowGradient(item);
                                        const hasDropdown = item.hasDropdown;

                                        return (
                                            <div key={index} className="w-full">
                                                {/* Main Navigation Item */}
                                                {hasDropdown ? (
                                                    // For dropdown items, use a button to toggle dropdown
                                                    <button
                                                        className="inline-flex justify-start items-center gap-[7px] md:gap-[10px] w-full text-left hover:scale-105 transition-transform origin-left"
                                                        onClick={() => {
                                                            if (item.key) {
                                                                toggleDropdown(item.key);
                                                            }
                                                        }}
                                                    >
                                                        <span className={`text-base md:text-lg font-montserrat transition-all duration-200 ${showGradient
                                                            ? 'text-transparent bg-gradient-to-r from-[#f51da5] to-[#5530fa] bg-clip-text'
                                                            : 'text-[#83848b] hover:text-[#f51da5]'}`}
                                                        >
                                                            {item.label}
                                                        </span>

                                                        <div className="relative h-4 md:h-5 w-4 md:w-5">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke={showGradient ? "url(#arrowGradientActiveMobile)" : "#83848b"}
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className={`absolute inset-0 w-full h-full transition-transform duration-300 ${activeDropdown === item.key ? 'rotate-180' : ''}`}
                                                            >
                                                                {showGradient && (
                                                                    <defs>
                                                                        <linearGradient id="arrowGradientActiveMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                            <stop offset="0%" stopColor="#f51da5" />
                                                                            <stop offset="100%" stopColor="#5530fa" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                )}
                                                                <path d="m6 9 6 6 6-6" />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                ) : (
                                                    // For regular items, use Link component
                                                    <Link
                                                        href={item.href}
                                                        className="inline-flex justify-start items-center gap-[7px] md:gap-[10px] w-full hover:scale-105 transition-transform origin-left"
                                                        onClick={handleNavigation}
                                                    >
                                                        <span className={`text-base md:text-lg font-montserrat transition-all duration-200 ${pathname === item.href
                                                            ? 'text-transparent bg-gradient-to-r from-[#f51da5] to-[#5530fa] bg-clip-text'
                                                            : 'text-[#83848b] hover:text-[#f51da5]'}`}
                                                        >
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                )}

                                                {/* Dropdown Content */}
                                                {hasDropdown && activeDropdown === item.key && (
                                                    <motion.div
                                                        className="pl-6 md:pl-8 mt-4 md:mt-5"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <div className="flex flex-col gap-[19px] md:gap-[24px]">
                                                            {dropdownItems[item.key as DropdownKey].map((dropdownItem, subIndex) => (
                                                                <Link
                                                                    key={subIndex}
                                                                    href={dropdownItem.href}
                                                                    className="block group hover:scale-105 transition-transform origin-left"
                                                                    onClick={handleNavigation}
                                                                >
                                                                    <div className="text-[#83848b] text-base md:text-lg font-montserrat group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#f51da5] group-hover:to-[#5530fa] transition-all duration-200">
                                                                        {dropdownItem.label}
                                                                    </div>
                                                                    <div className="text-[#83848b] text-xs md:text-sm font-montserrat mt-1 md:mt-1.5 group-hover:text-black transition-colors duration-200">
                                                                        {dropdownItem.description}
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
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