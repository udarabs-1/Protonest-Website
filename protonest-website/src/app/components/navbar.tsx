'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
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
            { href: "/stay-in-touch/contact", label: "Contact Us", description: "Reach out with questions, quotes, or partnerships." },
            { href: "/stay-in-touch/subscribe", label: "Subscription & Alerts", description: "Get notified about new freelance roles." },
        ]
    };

    const toggleDropdown = (dropdown: DropdownKey) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const handleNavigation = () => {
        setActiveDropdown(null);
    };

    const navItems: NavItem[] = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/whats-new", label: "What's New", hasDropdown: true, key: "whats-new" },
        { href: "/jobs", label: "Find Jobs", hasDropdown: true, key: "jobs" },
        { href: "/stay-in-touch", label: "Stay in Touch", hasDropdown: true, key: "stay-in-touch" }
    ];

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
        <div className="relative">
            <nav className="fixed top-0 left-0 w-full px-[133px] py-[43px] z-50 bg-[rgba(255,255,255,0.8)] backdrop-blur-2xl">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" onClick={handleNavigation}>
                                <Image
                                    src="/logo.svg"
                                    alt="Logo"
                                    width={90}
                                    height={64}
                                    priority
                                />
                            </Link>
                        </div>

                        <div className="font-montserrat text-[16px] flex items-center space-x-[35px]">
                            {navItems.map((item) => {
                                const isDropdownActive = activeDropdown === item.key;
                                const hasDropdown = item.hasDropdown;
                                const shouldShowActiveStyle = isDropdownActive;

                                return (
                                    <div key={item.href} className="relative">
                                        <div className="flex items-center gap-[7px]">
                                            <Link
                                                href={item.href}
                                                className={`group flex items-center gap-[7px] transition-none ${shouldShowActiveStyle ? 'text-transparent bg-gradient-to-r from-[rgba(245,29,165,1)] to-[rgba(85,48,250,1)] bg-clip-text' : 'text-[rgba(131,132,139,1)]'}`}
                                                onClick={(e) => {
                                                    if (hasDropdown && item.key) {
                                                        e.preventDefault();
                                                        toggleDropdown(item.key);
                                                    } else {
                                                        handleNavigation();
                                                    }
                                                }}
                                            >
                                                <span className={`${shouldShowActiveStyle ? '' : 'group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] group-hover:bg-clip-text'}`}>
                                                    {item.label}
                                                </span>
                                                {hasDropdown && (
                                                    <div className="relative h-4 w-4">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke={shouldShowActiveStyle ? "url(#arrowGradientActive)" : "currentColor"}
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className={`absolute inset-0 transition-transform ${isDropdownActive ? 'rotate-180' : ''} ${shouldShowActiveStyle ? '' : 'text-[rgba(131,132,139,1)] group-hover:opacity-0'}`}
                                                        >
                                                            {shouldShowActiveStyle && (
                                                                <defs>
                                                                    <linearGradient id="arrowGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                        <stop offset="0%" stopColor="rgba(245,29,165,1)" />
                                                                        <stop offset="100%" stopColor="rgba(85,48,250,1)" />
                                                                    </linearGradient>
                                                                </defs>
                                                            )}
                                                            <path d="m6 9 6 6 6-6" />
                                                        </svg>
                                                        {!shouldShowActiveStyle && (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
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
                                                                        <stop offset="0%" stopColor="rgba(245,29,165,1)" />
                                                                        <stop offset="100%" stopColor="rgba(85,48,250,1)" />
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

                        <div className="font-poppins flex items-center space-x-[25px]">
                            <button className="w-[147px] h-[44px] text-[16px] bg-none border-[1px] border-[rgba(131,132,139,1)] text-neutral-500 p-[10px] rounded-[30px]">
                                Get a Quote
                            </button>
                            <button className="relative group">
                                <Image
                                    src="/bell-icon.svg"
                                    alt="bellIcon"
                                    width={36}
                                    height={44}
                                    className="group-hover:opacity-0 transition-none"
                                />
                                <Image
                                    src="/bell-icon-colour.svg"
                                    alt="bellIcon"
                                    width={36}
                                    height={44}
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-none"
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
                            className="fixed inset-0 top-[150px] z-30 bg-transparent"
                            onClick={handleNavigation}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={overlayVariants}
                        />

                        <motion.div
                            className="font-montserrat fixed top-[150px] left-0 w-full z-40 bg-[rgba(255,255,255,0.8)] backdrop-blur-2xl"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={dropdownVariants}
                        >
                            <div className="w-full px-[95px]">
                                <div className="w-full border-t border-[rgba(163,163,163,1)]"></div>
                            </div>

                            <div className="container px-[133px] py-[43px]">
                                <div className="flex space-x-[126px]">
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
                                                className="w-[214px] block group"
                                                onClick={handleNavigation}
                                            >
                                                <div className="text-[16px] mb-2 text-[rgba(131,132,139,1)] group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] group-hover:bg-clip-text group-hover:inline-block">
                                                    {dropdownItem.label}
                                                </div>
                                                <div className="text-[12px] text-[rgba(131,132,139,1)] group-hover:text-black">
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

            <div className="pt-[150px]">
            </div>
        </div>
    );
}