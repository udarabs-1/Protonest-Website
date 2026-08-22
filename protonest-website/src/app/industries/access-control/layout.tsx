import type { Metadata } from "next";

const description =
  "Protonest provides IoT product development services to help companies in the access control industry build security-first smart systems.";

export const metadata: Metadata = {
  title: "Access Control | IoT Development Services | Protonest",
  description,
  alternates: {
    canonical: "https://protonest.co/industries/access-control",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://protonest.co/industries/access-control",
    siteName: "Protonest",
    title: "Access Control IoT Development Services | Protonest",
    description,
    images: [
      {
        url: "/og-image-home.png",
        width: 1200,
        height: 630,
        alt: "Protonest access control IoT development services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Access Control | IoT Development Services | Protonest",
    description,
    images: ["/og-image-home.png"],
  },
};

export default function AccessControlLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
