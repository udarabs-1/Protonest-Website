"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type DropdownKey = "industries" | "company" | "resources";

interface DropdownItem {
  id: string;
  href: string;
  label: string;
  description: string;
  isConditional?: boolean;
}

interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
  key?: DropdownKey;
  isConditional?: boolean;
}

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(
    null,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const showCareersAuth = pathname === "/careers";
  const router = useRouter();
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsUserSignedIn(!!token);
  }, []);

  const dropdownItems: Record<DropdownKey, DropdownItem[]> = {
    industries: [
      {
        id: "industries-access-control",
        href: "/industries/access-control",
        label: "Access Control",
        description:
          "IoT product development for connected access control systems.",
      },
    ],
    company: [
      {
        id: "company-about",
        href: "/about",
        label: "About",
        description: "Learn about Protonest, our work, and our team.",
      },
      {
        id: "company-careers",
        href: "/careers",
        label: "Careers",
        description: "Explore open roles and opportunities at Protonest.",
        isConditional: true,
      },
      {
        id: "company-contact",
        href: "/contact-us",
        label: "Contact Us",
        description: "Get in touch with our team about your project.",
      },
    ],
    resources: [
      {
        id: "resources-blog",
        href: "/blog",
        label: "Blog",
        description: "Insights, trends & stories from the IoT frontier.",
      },
      {
        id: "resources-projects",
        href: "/portfolio",
        label: "Projects",
        description: "Explore our work and research conducted by our team.",
      },
    ],
  };

  const toggleDropdown = (dropdown: DropdownKey) => {
    setProfileDropdownOpen(false);
    setActiveDropdown((current) => (current === dropdown ? null : dropdown));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideDesktop =
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(target);
      const outsideMobile =
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(target);
      if (outsideDesktop && outsideMobile) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleCareersClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isUserSignedIn) {
      router.push("/dashboard/all-jobs");
    } else {
      router.push("/careers");
    }
    handleNavigation();
  };

  const handleProfileIconClick = () => {
    setActiveDropdown(null);
    if (isUserSignedIn) {
      router.push("/dashboard");
      setProfileDropdownOpen(false);
    } else {
      setProfileDropdownOpen((prev) => !prev);
    }
  };

  const navItems: NavItem[] = [
    { href: "/", label: "Home" },
    {
      href: "/industries",
      label: "Industries",
      hasDropdown: true,
      key: "industries",
    },
    { href: "/company", label: "Company", hasDropdown: true, key: "company" },
    {
      href: "/resources",
      label: "Resources",
      hasDropdown: true,
      key: "resources",
    },
  ];

  const isNavItemActive = (item: NavItem) => {
    if (item.hasDropdown && item.key) {
      const hasActiveChild = dropdownItems[item.key].some((dropdownItem) => {
        if (dropdownItem.isConditional && isUserSignedIn) {
          return pathname === "/dashboard/all-jobs";
        }

        return (
          pathname === dropdownItem.href ||
          pathname.startsWith(`${dropdownItem.href}/`)
        );
      });

      return activeDropdown === item.key || hasActiveChild;
    }

    if (item.isConditional && isUserSignedIn) {
      return pathname === "/dashboard/all-jobs";
    }
    return pathname === item.href;
  };

  const shouldShowGradient = (item: NavItem) => {
    const isActive = isNavItemActive(item);
    if (!isActive) return false;
    if (hoveredItem && hoveredItem !== item.href) return false;
    if (activeDropdown && !item.hasDropdown) return false;
    return true;
  };

  const dropdownVariants: Variants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const itemVariants: Variants = {
    open: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.03, duration: 0.2, ease: "easeOut" },
    }),
    closed: {
      opacity: 0,
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  const overlayVariants: Variants = {
    open: { opacity: 1, transition: { duration: 0.2 } },
    closed: { opacity: 0, transition: { duration: 0.15 } },
  };

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
                    const hasDropdown = item.hasDropdown;
                    const isHovered = hoveredItem === item.href;
                    const isConditional = item.isConditional;

                    return (
                      <div key={item.href} className="relative">
                        <div className="flex items-center gap-[5px] xl:gap-[7px] 2xl:gap-[8px]">
                          <Link
                            href={item.href}
                            className={`group flex items-center gap-[5px] xl:gap-[7px] 2xl:gap-[8px] transition-none ${showGradient || isHovered ? "text-transparent bg-gradient-to-r from-[#f51da5] to-[#5530fa] bg-clip-text" : "text-[#83848b]"}`}
                            onMouseEnter={() => setHoveredItem(item.href)}
                            onMouseLeave={() => setHoveredItem(null)}
                            aria-expanded={
                              hasDropdown
                                ? activeDropdown === item.key
                                : undefined
                            }
                            aria-haspopup={hasDropdown ? "menu" : undefined}
                            onClick={(e) => {
                              if (hasDropdown && item.key) {
                                e.preventDefault();
                                toggleDropdown(item.key);
                              } else if (isConditional) {
                                handleCareersClick(e);
                              } else {
                                handleNavigation();
                              }
                            }}
                          >
                            <span
                              className={`whitespace-nowrap ${showGradient || isHovered ? "" : "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#f51da5] group-hover:to-[#5530fa] group-hover:bg-clip-text"}`}
                            >
                              {item.label}
                            </span>
                            {hasDropdown && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={
                                  showGradient || isHovered
                                    ? "#f51da5"
                                    : "currentColor"
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                                className={`transition-transform duration-200 ${
                                  activeDropdown === item.key
                                    ? "rotate-180"
                                    : ""
                                }`}
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            )}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="font-poppins flex items-center space-x-3 lg:space-x-[16px] xl:space-x-[20px] 2xl:space-x-[24px]">
                  <Link
                    href="/contact-us#book-a-call"
                    className="cursor-pointer flex items-center justify-center w-[110px] lg:w-[130px] xl:w-[147px] 2xl:w-[160px] h-[40px] lg:h-[42px] xl:h-[44px] 2xl:h-[48px] text-sm lg:text-[15px] xl:text-base 2xl:text-lg bg-none border gradient-button-static p-[8px] lg:p-[9px] xl:p-[10px] rounded-[30px]"
                  >
                    Book a Call
                  </Link>

                  {showCareersAuth && (
                    <div className="relative" ref={desktopDropdownRef}>
                      <button
                        id="navbar-profile-icon-btn"
                        onClick={handleProfileIconClick}
                        aria-label="ProtonestHR account"
                        className="flex items-center gap-[5px] cursor-pointer px-1.5 py-1.5 rounded-full hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="w-[34px] h-[34px] lg:w-[36px] lg:h-[36px] xl:w-[38px] xl:h-[38px] rounded-full border border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-center flex-shrink-0">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#9ca3af"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
                          </svg>
                        </div>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9ca3af"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transition: "transform 0.2s",
                            transform: profileDropdownOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {profileDropdownOpen && !isUserSignedIn && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 top-[calc(100%+8px)] w-[200px] bg-white rounded-2xl z-50"
                            style={{
                              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                              border: "1px solid #f3f4f6",
                            }}
                          >
                            <div className="px-5 pt-4 pb-3">
                              <p
                                className="text-sm font-bold font-montserrat"
                                style={{
                                  background:
                                    "linear-gradient(90deg, #f51da5, #5530fa)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  backgroundClip: "text",
                                }}
                              >
                                Protonest
                              </p>
                            </div>
                            <div className="px-3 pb-3 flex flex-col gap-0.5">
                              <Link
                                href="/signin"
                                id="navbar-dropdown-signin"
                                onClick={handleNavigation}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium font-poppins text-[#6b7280] transition-colors duration-150 hover:bg-gray-50"
                              >
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#9ca3af"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                                  <polyline points="10 17 15 12 10 7" />
                                  <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Sign In
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            {activeDropdown && (
              <>
                <motion.div
                  className="fixed inset-0 top-[100px] z-30 bg-transparent lg:top-[105px] xl:top-[115px] 2xl:top-[125px]"
                  onClick={handleNavigation}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={overlayVariants}
                  aria-hidden="true"
                />

                <motion.div
                  key={activeDropdown}
                  className="fixed left-0 top-[100px] z-40 w-full bg-white/80 font-montserrat backdrop-blur-[20px] lg:top-[105px] xl:top-[115px] 2xl:top-[125px]"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={dropdownVariants}
                  role="menu"
                  aria-label={`${activeDropdown} navigation`}
                >
                  <div className="absolute left-0 top-2 h-px w-full bg-gradient-to-r from-transparent via-[#a3a3a3] to-transparent opacity-30" />

                  <div className="container px-4 py-[35px] sm:px-8 md:px-16 lg:px-[100px] lg:py-[25px] xl:px-[133px] xl:py-[28px] 2xl:px-[180px] 2xl:py-[30px]">
                    <div className="flex flex-wrap gap-4 lg:gap-[100px] xl:gap-[126px] 2xl:gap-[160px]">
                      {dropdownItems[activeDropdown].map(
                        (dropdownItem, index) => (
                          <motion.div
                            key={dropdownItem.id}
                            custom={index}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={itemVariants}
                            role="none"
                          >
                            <Link
                              href={dropdownItem.href}
                              className="group block w-full lg:w-[200px] xl:w-[214px] 2xl:w-[240px]"
                              role="menuitem"
                              onClick={(e) => {
                                if (dropdownItem.isConditional) {
                                  handleCareersClick(e);
                                } else {
                                  handleNavigation();
                                }
                              }}
                            >
                              <div className="mb-2 inline-block text-sm text-[#83848b] group-hover:bg-gradient-to-r group-hover:from-[#f51da5] group-hover:to-[#5530fa] group-hover:bg-clip-text group-hover:text-transparent lg:text-[15px] xl:text-base 2xl:text-lg">
                                {dropdownItem.label}
                              </div>
                              <div className="text-xs leading-relaxed text-[#83848b] group-hover:text-black 2xl:text-sm">
                                {dropdownItem.description}
                              </div>
                            </Link>
                          </motion.div>
                        ),
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

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

              <div className="flex items-center gap-3 md:gap-4">
                {showCareersAuth && (
                  <div className="relative" ref={mobileDropdownRef}>
                    <button
                      id="mobile-profile-icon-btn"
                      onClick={handleProfileIconClick}
                      aria-label="ProtonestHR account"
                      className="flex items-center gap-[4px] cursor-pointer px-1 py-1 rounded-full hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="w-[34px] h-[34px] rounded-full border border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-center flex-shrink-0">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9ca3af"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
                        </svg>
                      </div>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transition: "transform 0.2s",
                          transform: profileDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {profileDropdownOpen && !isUserSignedIn && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.97 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 top-[calc(100%+8px)] w-[190px] bg-white rounded-2xl z-50"
                          style={{
                            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                            border: "1px solid #f3f4f6",
                          }}
                        >
                          <div className="px-5 pt-4 pb-3">
                            <p
                              className="text-sm font-bold font-montserrat"
                              style={{
                                background:
                                  "linear-gradient(90deg, #f51da5, #5530fa)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                              }}
                            >
                              ProtonestHR
                            </p>
                          </div>
                          <div className="px-3 pb-3 flex flex-col gap-0.5">
                            <Link
                              href="/signin"
                              id="mobile-dropdown-signin"
                              onClick={handleNavigation}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium font-poppins text-[#6b7280] transition-colors duration-150 hover:bg-gray-50"
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#9ca3af"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                              </svg>
                              Sign In
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
                className="fixed top-0 right-0 w-[319px] md:w-[420px] h-full z-50 overflow-y-auto bg-white/80 backdrop-blur-[20px] shadow-2xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
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
                    const showGradient = shouldShowGradient(item);
                    const hasDropdown = item.hasDropdown;
                    const isConditional = item.isConditional;

                    return (
                      <div key={index} className="w-full">
                        {hasDropdown ? (
                          <button
                            type="button"
                            className="inline-flex w-full origin-left items-center justify-start gap-[7px] text-left transition-transform hover:scale-105 md:gap-[10px]"
                            aria-expanded={activeDropdown === item.key}
                            aria-controls={`mobile-${item.key}-menu`}
                            onClick={() => {
                              if (item.key) {
                                toggleDropdown(item.key);
                              }
                            }}
                          >
                            <span
                              className={`font-montserrat text-base transition-all duration-200 md:text-lg ${
                                showGradient
                                  ? "bg-gradient-to-r from-[#f51da5] to-[#5530fa] bg-clip-text text-transparent"
                                  : "text-[#83848b] hover:text-[#f51da5]"
                              }`}
                            >
                              {item.label}
                            </span>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={showGradient ? "#f51da5" : "#83848b"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              className={`transition-transform duration-200 ${
                                activeDropdown === item.key ? "rotate-180" : ""
                              }`}
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            className="inline-flex w-full origin-left items-center justify-start gap-[7px] transition-transform hover:scale-105 md:gap-[10px]"
                            onClick={(e) => {
                              if (isConditional) {
                                handleCareersClick(e);
                              } else {
                                handleNavigation();
                              }
                            }}
                          >
                            <span
                              className={`font-montserrat text-base transition-all duration-200 md:text-lg ${
                                showGradient
                                  ? "bg-gradient-to-r from-[#f51da5] to-[#5530fa] bg-clip-text text-transparent"
                                  : "text-[#83848b] hover:text-[#f51da5]"
                              }`}
                            >
                              {item.label}
                            </span>
                          </Link>
                        )}

                        <AnimatePresence initial={false}>
                          {hasDropdown &&
                            activeDropdown === item.key &&
                            item.key && (
                              <motion.div
                                id={`mobile-${item.key}-menu`}
                                className="mt-4 pl-6 md:mt-5 md:pl-8"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex flex-col gap-[19px] md:gap-[24px]">
                                  {dropdownItems[item.key].map(
                                    (dropdownItem) => (
                                      <Link
                                        key={dropdownItem.id}
                                        href={dropdownItem.href}
                                        className="group block origin-left transition-transform hover:scale-105"
                                        onClick={(e) => {
                                          if (dropdownItem.isConditional) {
                                            handleCareersClick(e);
                                          } else {
                                            handleNavigation();
                                          }
                                        }}
                                      >
                                        <div className="font-montserrat text-base text-[#83848b] transition-all duration-200 group-hover:bg-gradient-to-r group-hover:from-[#f51da5] group-hover:to-[#5530fa] group-hover:bg-clip-text group-hover:text-transparent md:text-lg">
                                          {dropdownItem.label}
                                        </div>
                                        <div className="mt-1 font-montserrat text-xs text-[#83848b] transition-colors duration-200 group-hover:text-black md:mt-1.5 md:text-sm">
                                          {dropdownItem.description}
                                        </div>
                                      </Link>
                                    ),
                                  )}
                                </div>
                              </motion.div>
                            )}
                        </AnimatePresence>
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
