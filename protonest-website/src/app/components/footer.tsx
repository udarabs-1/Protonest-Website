"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Navigate",
    links: [{ label: "Home", href: "/" }],
  },
  {
    title: "Industries",
    links: [{ label: "Access Control", href: "/industries/access-control" }],
  },
  {
    title: "Solutions",
    links: [
      {
        label: "Protonest Connect",
        href: "https://protonestconnect.co/",
        external: true,
      },
      {
        label: "Protonest Master",
        href: "https://protonestmaster.co/",
        external: true,
      },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Projects", href: "/portfolio" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      {
        label: "Terms & Conditions",
        href: "/legal/terms-and-conditions",
      },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (path: string): boolean => pathname === path;

  const getNavLinkClass = (path: string, isDesktop: boolean = true): string => {
    const baseClass = "text-[#83848b]";
    const gradientClass =
      "text-transparent bg-clip-text bg-gradient-to-r from-[#f51da5] to-[#5530fa]";

    if (isDesktop) {
      if (hoveredItem === path) {
        return gradientClass;
      } else if (hoveredItem === null && isActive(path)) {
        return gradientClass;
      } else {
        return baseClass;
      }
    } else {
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
      <div className="hidden lg:block w-full lg:px-[60px] xl:px-[133px] 2xl:px-[180px] lg:h-[450px] xl:h-[520px] 2xl:h-[578px] lg:mb-[50px] xl:mb-[60px] 2xl:mb-[70px]">
        <div className="rounded-b-[25px] relative h-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            >
              <source src="/footerWeb.webm" type="video/webm" />
              <source src="/footerWeb.mp4" type="video/mp4" />

              <Image
                src="/footerWeb.gif"
                unoptimized
                alt="Footer background"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                quality={60}
                priority={false}
                sizes="100vw"
              />
            </video>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white z-10" />

          <div className="relative z-20 lg:px-[60px] xl:px-[80px] 2xl:px-[98px]">
            <div className="w-full lg:pt-[90px] xl:pt-[115px] 2xl:pt-[140px]">
              <nav
                aria-label="Footer navigation"
                className="grid w-full grid-cols-3 gap-x-8 gap-y-6 font-montserrat xl:grid-cols-6 xl:gap-x-7 2xl:gap-x-9"
              >
                {footerSections.map((section) => (
                  <div key={section.title}>
                    <h2 className="mb-3 text-[12px] font-medium text-[#4d4d4d] xl:text-[13px] 2xl:text-[14px]">
                      {section.title}
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener" : undefined}
                          className={`text-left text-[11px] leading-snug transition-colors xl:text-[12px] 2xl:text-[13px] ${getNavLinkClass(link.href, true)}`}
                          onMouseEnter={() => handleMouseEnter(link.href)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="mt-6 grid grid-cols-[auto_1fr_auto] grid-rows-2 items-center gap-x-8 border-y border-white/30 py-5 xl:mt-7 xl:py-6 2xl:mt-8">
              <div className="contents">
                <Link
                  href="/"
                  aria-label="Protonest home"
                  className="row-span-2"
                >
                  <Image
                    src="/logo.webp"
                    alt="Protonest Logo"
                    width={149}
                    height={106}
                    priority={false}
                    quality={90}
                    sizes="(max-width: 1024px) 100px, (max-width: 1280px) 115px, 130px"
                    className="h-auto w-[100px] xl:w-[115px] 2xl:w-[130px]"
                  />
                </Link>

              <div className="col-start-2 row-start-2 mt-2 font-poppins text-[10px] text-[#6c6c6c] xl:max-w-[320px] xl:text-[11px] 2xl:max-w-none 2xl:text-[14px]">
                503/A, Welivita Road, Kaduwela, Colombo, Sri Lanka. 10640
              </div>

              <Link
                href="/contact-us#book-a-call"
                className="col-start-3 row-span-2 row-start-1 flex h-[36px] w-[120px] items-center justify-center rounded-[30px] border border-[#83848b] font-poppins text-[12px] text-[#83848b] transition-transform hover:scale-105 xl:h-[40px] xl:w-[135px] xl:text-[14px] 2xl:h-[44px] 2xl:w-[147px] 2xl:text-[16px]"
              >
                Book a Call
              </Link>
            </div>

            <div className="col-start-2 row-start-1 flex h-[17px] w-auto cursor-pointer space-x-[15px] self-end text-[#4d4d4d] xl:space-x-[18px] 2xl:space-x-[20px]">
              <Link
                href="https://lk.linkedin.com/company/protonestiot"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  className="lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px] 2xl:h-5 2xl:w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="https://www.youtube.com/channel/UCe-RO03jOqiEAClVACUno2A/about"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <svg
                  className="lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px] 2xl:h-5 2xl:w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="https://x.com/ProtonestIoT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <svg
                  className="lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px] 2xl:h-5 2xl:w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://www.facebook.com/profile.php?id=61562590660146"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg
                  className="lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px] 2xl:h-5 2xl:w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            </div>

            <div className="mx-auto mt-6 w-fit bg-gradient-to-r from-[#F51DA5] to-[#5530FA] bg-clip-text font-poppins text-[10px] text-transparent xl:mt-8 xl:text-[11px] 2xl:mt-10 2xl:text-[14px]">
              © 2023–{new Date().getFullYear()} Protonest. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      <div className="block lg:hidden w-full h-[760px] md:h-[850px] relative">
        <div className="absolute inset-0 mx-4 my-4 md:mx-8 md:my-6 rounded-b-[25px] md:rounded-b-[35px] overflow-hidden z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ objectPosition: "center" }}
          >
            <source src="/footerMobile.webm" type="video/webm" />
            <source src="/footerMobile.mp4" type="video/mp4" />

            <Image
              src="/footerMobile.gif"
              unoptimized
              alt="Footer background"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              quality={50}
              priority={false}
              sizes="100vw"
            />
          </video>
        </div>

        <div className="absolute inset-0 mx-4 my-4 md:mx-8 md:my-6 rounded-b-[25px] md:rounded-b-[35px] bg-gradient-to-t from-transparent to-white z-10" />

        <div className="relative z-20 h-full">
          <div className="w-[149px] h-[106px] md:w-[170px] md:h-[120px] left-1/2 -translate-x-1/2 top-[350px] md:top-[420px] absolute">
            <Image
              src="/logo.webp"
              alt="Protonest Logo"
              width={170}
              height={120}
              priority={false}
              quality={90}
              sizes="(max-width: 768px) 149px, 170px"
              className="w-full h-full"
            />
          </div>

          <div className="w-[211px] md:w-[280px] left-1/2 -translate-x-1/2 top-[535px] md:top-[620px] absolute text-center text-[#6c6c6c] text-xs md:text-sm font-normal font-poppins">
            503/A, Welivita Road, Kaduwela, Colombo, Sri Lanka. 10640
          </div>

          <div className="left-1/2 -translate-x-1/2 top-[495px] md:top-[575px] absolute inline-flex justify-center items-center gap-[26px] md:gap-[32px]">
            <Link
              href="https://lk.linkedin.com/company/protonestiot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="#4d4d4d"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="https://www.youtube.com/channel/UCe-RO03jOqiEAClVACUno2A/about"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="#4d4d4d"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="https://x.com/ProtonestIoT"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="#4d4d4d"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=61562590660146"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="#4d4d4d"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <nav
            aria-label="Footer navigation"
            className="absolute left-1/2 top-[45px] grid w-[280px] -translate-x-1/2 grid-cols-2 gap-x-10 gap-y-6 md:top-[55px] md:w-[430px] md:gap-x-16 md:gap-y-7"
          >
            {footerSections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-2 font-montserrat text-sm font-medium text-[#4d4d4d] md:text-base">
                  {section.title}
                </h2>
                <div className="flex flex-col items-start gap-1.5 md:gap-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener" : undefined}
                      className={`text-left font-montserrat text-xs leading-snug md:text-sm ${getNavLinkClass(link.href, false)}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div
            aria-hidden="true"
            className="absolute left-8 right-8 top-[320px] h-px bg-gradient-to-r from-transparent via-[#a3a3a3]/40 to-transparent md:left-12 md:right-12 md:top-[385px]"
          />

          <Link
            href="/contact-us#book-a-call"
            className="absolute w-[280px] md:w-[300px] left-1/2 -translate-x-1/2 top-[590px] md:top-[685px]"
          >
            <button className="w-full p-2.5 md:p-3 rounded-[30px] md:rounded-[35px] border border-[#83848b] inline-flex justify-center items-center gap-2.5 hover:scale-105">
              <div className="text-right text-[#83848b] text-sm md:text-base font-poppins leading-normal hover:scale-105">
                Book a Call
              </div>
            </button>
          </Link>

          <div
            aria-hidden="true"
            className="absolute left-8 right-8 top-[665px] h-px bg-gradient-to-r from-transparent via-[#a3a3a3]/40 to-transparent md:left-12 md:right-12 md:top-[760px]"
          />

          <div className="w-full px-4 md:px-8 left-1/2 -translate-x-1/2 top-[705px] md:top-[795px] absolute text-center bg-gradient-to-r from-[#F51DA5] to-[#5530FA] bg-clip-text text-transparent text-xs md:text-sm font-normal font-poppins leading-normal">
            © 2023–{new Date().getFullYear()} Protonest. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
