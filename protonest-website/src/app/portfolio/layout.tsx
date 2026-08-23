import type { Metadata } from "next";

const description = "Explore the portfolio of projects delivered by Protonest.";

export const metadata: Metadata = {
  title: "Portfolio | Protonest",
  description,
  alternates: {
    canonical: "https://protonest.co/portfolio",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://protonest.co/portfolio",
    siteName: "Protonest",
    title: "Portfolio | Protonest",
    description,
    images: [
      {
        url: "/og-image-home.png",
        width: 1200,
        height: 630,
        alt: "Protonest IoT portfolio and connected product projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Protonest Portfolio",
    description,
    images: ["/og-image-home.png"],
  },
};

export default function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
