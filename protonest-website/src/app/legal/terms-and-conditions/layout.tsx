import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Protonest",
  description:
    "Read the Protonest terms and conditions governing the use of our website and services.",
  alternates: {
    canonical: "https://protonest.co/legal/terms-and-conditions",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditionsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}