import { Inter } from 'next/font/google';

// The article text (everything inside the article body) uses Inter; the rest of the blog uses
// the site's Montserrat.
export const articleFont = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-article',
});
