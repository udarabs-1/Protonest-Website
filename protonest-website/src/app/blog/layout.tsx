import type { Metadata } from "next";

const description =
  "Read the Protonest IoT blog for practical articles, guides, reliability tests, and product development insights.";

export const metadata: Metadata = {
  title: "Blog | Protonest",
  description,
  alternates: {
    canonical: "https://protonest.co/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://protonest.co/blog",
    siteName: "Protonest",
    title: "Blog | Protonest",
    description,
    images: [
      {
        url: "/og-image-home.png",
        width: 1200,
        height: 630,
        alt: "Protonest IoT blog articles and product development insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Protonest Blog",
    description,
    images: ["/og-image-home.png"],
  },
};

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
