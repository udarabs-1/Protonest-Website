export type DropdownKey =
  | "industries"
  | "solutions"
  | "company"
  | "resources";

export interface DropdownItem {
  id: string;
  href: string;
  label: string;
  description: string;
  external?: boolean;
  isConditional?: boolean;
}

export interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
  key?: DropdownKey;
  isConditional?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: readonly FooterLink[];
}

export const SITE_LINKS = {
  home: "/",
  careers: "/careers",
  bookCall: "/contact-us",
  signIn: "/signin",
  dashboard: "/dashboard",
  jobs: "/dashboard/all-jobs",
} as const;

export const SOCIAL_LINKS = {
  linkedin: "https://lk.linkedin.com/company/protonestiot",
  youtube:
    "https://www.youtube.com/channel/UCe-RO03jOqiEAClVACUno2A/about",
  x: "https://x.com/ProtonestIoT",
  facebook: "https://www.facebook.com/profile.php?id=61562590660146",
} as const;

export const DROPDOWN_ITEMS: Record<DropdownKey, readonly DropdownItem[]> = {
  industries: [
    {
      id: "industries-access-control",
      href: "/industries/access-control",
      label: "Access Control",
      description:
        "IoT product development for connected access control systems.",
    },
  ],
  solutions: [
    {
      id: "solutions-protonest-connect",
      href: "https://protonestconnect.co/",
      label: "Protonest Connect",
      description: "Launch and manage IoT systems without the backend hassle.",
      external: true,
    },
    {
      id: "solutions-protonest-master",
      href: "https://protonestmaster.co/",
      label: "Protonest Master",
      description:
        "Configure, deploy, and monitor connected industrial IoT devices.",
      external: true,
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
      href: SITE_LINKS.careers,
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

export const NAV_ITEMS: readonly NavItem[] = [
  { href: SITE_LINKS.home, label: "Home" },
  {
    href: "/industries",
    label: "Industries",
    hasDropdown: true,
    key: "industries",
  },
  {
    href: "/solutions",
    label: "Solutions",
    hasDropdown: true,
    key: "solutions",
  },
  {
    href: "/company",
    label: "Company",
    hasDropdown: true,
    key: "company",
  },
  {
    href: "/resources",
    label: "Resources",
    hasDropdown: true,
    key: "resources",
  },
];

const toFooterLink = (link: DropdownItem): FooterLink => ({
  label: link.label,
  href: link.href,
  external: link.external,
});

export const FOOTER_SECTIONS: readonly FooterSection[] = [
  {
    title: "Navigate",
    links: [{ label: "Home", href: SITE_LINKS.home }],
  },
  {
    title: "Industries",
    links: DROPDOWN_ITEMS.industries.map(toFooterLink),
  },
  {
    title: "Solutions",
    links: DROPDOWN_ITEMS.solutions.map(toFooterLink),
  },
  {
    title: "Company",
    links: DROPDOWN_ITEMS.company.map(toFooterLink),
  },
  {
    title: "Resources",
    links: DROPDOWN_ITEMS.resources.map(toFooterLink),
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
