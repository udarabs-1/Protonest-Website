import type { Metadata } from "next";

const description =
  "Book a call with Protonest to discuss your IoT product idea, technical requirements, or project scope.";

export const metadata: Metadata = {
  title: "Book a Call | Protonest",
  description,
  alternates: {
    canonical: "https://protonest.co/contact-us/book-a-call",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://protonest.co/contact-us/book-a-call",
    siteName: "Protonest",
    title: "Book a Call | Protonest",
    description,
    images: [
      {
        url: "/og-image-home.png",
        width: 1200,
        height: 630,
        alt: "Book a call with Protonest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Call | Protonest",
    description,
    images: ["/og-image-home.png"],
  },
};

export default function BookACallLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
