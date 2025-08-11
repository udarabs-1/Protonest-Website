import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import { Montserrat, Poppins } from 'next/font/google';
import LoadingScreen from './components/LoadingScreen';
import PageViewTracker from './components/PageViewTracker';
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
      <body>
        <LoadingProvider>
          <LoadingScreen logoSrc="/logo.png" />
          <main>
            <PageViewTracker />
            {children}
          </main>
        </LoadingProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}