"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { FooterSection } from "@/lib/navigation";

export default function FooterNavLinks({
  sections,
  variant,
}: {
  sections: readonly FooterSection[];
  variant: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (path: string): boolean => pathname === path;

  const getNavLinkClass = (path: string): string => {
    const baseClass = "text-[#83848b]";
    const gradientClass =
      "text-transparent bg-clip-text bg-gradient-to-r from-[#f51da5] to-[#5530fa]";

    if (variant === "desktop") {
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

  if (variant === "desktop") {
    return (
      <nav
        aria-label="Footer navigation"
        className="grid w-full grid-cols-3 content-start gap-x-6 gap-y-10 font-montserrat xl:gap-x-8 2xl:gap-x-10"
      >
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-3 text-sm font-medium text-[#4d4d4d]">
              {section.title}
            </h2>
            <div className="flex flex-col items-start gap-2">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener" : undefined}
                  className={`text-left text-sm leading-snug transition-colors ${getNavLinkClass(link.href)}`}
                  onMouseEnter={() => setHoveredItem(link.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Footer navigation"
      className="col-span-2 row-start-6 mt-8 grid w-full grid-cols-2 gap-x-10 gap-y-6 md:gap-x-16 md:gap-y-7"
    >
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="mb-2 font-montserrat text-sm font-medium text-[#4d4d4d]">
            {section.title}
          </h2>
          <div className="flex flex-col items-start gap-1.5 md:gap-2">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener" : undefined}
                className={`text-left font-montserrat text-sm leading-snug ${getNavLinkClass(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
