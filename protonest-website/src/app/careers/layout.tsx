import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Protonest Careers',
    description: 'Protonest Careers',
    alternates: {
        canonical: 'https://protonest.co/careers',
    },
    openGraph: {
        title: 'Protonest Careers',
        description: 'Protonest Careers',
        type: 'website',
        siteName: 'Protonest',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Protonest Careers',
        description: 'Protonest Careers',
    },
};

export { default } from './page';
