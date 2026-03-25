import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import { Montserrat, Poppins } from 'next/font/google';
import PageViewTracker from './components/page-view-tracker';
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "IoT Development Services by Protonest",
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
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
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