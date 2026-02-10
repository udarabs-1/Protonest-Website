import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Protonest Careers',
    description: 'Protonest Careers',
    openGraph: {
        title: 'Protonest Careers',
        description: 'Protonest Careers',
        type: 'website',
        siteName: 'Protonest',
        locale: 'en_US',
        images: [
            {
                url: '/careers.jpeg',
                width: 1200,
                height: 630,
                alt: 'Protonest Careers',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Protonest Careers',
        description: 'Protonest Careers',
        images: ['/careers.jpeg'],
    },
};

export { default } from './page';
