import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import PageViewTracker from './components/page-view-tracker';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://protonest.co"),
  title: "Protonest",
};

export const viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main>
          <PageViewTracker />
          {children}
        </main>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}