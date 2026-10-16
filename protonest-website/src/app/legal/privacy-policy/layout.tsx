import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Protonest",
  description:
    "Read the Protonest privacy policy to understand how we collect, use, and protect your information.",
  alternates: {
    canonical: "https://protonest.co/legal/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}