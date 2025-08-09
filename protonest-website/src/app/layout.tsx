import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import { Montserrat, Poppins } from 'next/font/google';
import LoadingScreen from './components/LoadingScreen';
import PageViewTracker from './components/PageViewTracker'; // Add this import
import "./globals.css";
import { LoadingProvider } from './providers/LoadingProvider';

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
  title: "IoT Prototyping Services by Protonest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
      <head>
        {/* Move GoogleAnalytics to head for better performance */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </head>
      <body>
        <LoadingProvider>
          <LoadingScreen logoSrc="/logo.png" />
          <main>
            {children}
            <PageViewTracker />
          </main>
        </LoadingProvider>
      </body>
    </html>
  );
}