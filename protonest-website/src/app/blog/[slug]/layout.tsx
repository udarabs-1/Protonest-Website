import { Metadata } from 'next';
import { getCmsBlog } from '@/lib/cms-blogs';
import { htmlToText } from '@/lib/article-html';

type Props = {
    params: Promise<{ slug: string }>;
};

const DEFAULT_IMAGE = 'https://protonest.co/images/og-home.jpg';

// About 155 characters from the start of the article, ending on a word
const extractExcerpt = (html: string, maxLength = 155): string => {
    const text = htmlToText(html);
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > -1 ? truncated.substring(0, lastSpace) : truncated) + '…';
};

// Uses the CMS SEO tab (SEO title, Description, Social image, Canonical URL, noindex) and
// falls back to the post itself for anything left blank. The structured data (JSON-LD) is
// in page.tsx, as a real script tag.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const blog = await getCmsBlog(slug, { next: { revalidate: 60 } });

        if (blog) {
            const title = blog.seo_title || `${blog.title} | Protonest Blog`;
            const description = blog.seo_description || blog.excerpt || extractExcerpt(blog.content);
            const canonical = blog.canonical_url || `https://protonest.co/blog/${blog.slug}`;
            const image = blog.seo_image || blog.cover_image || DEFAULT_IMAGE;
            const tags = [...(blog.categories || []), ...(blog.keywords || [])];

            return {
                title: { absolute: title },
                description,
                keywords: tags.join(', '),
                alternates: { canonical },
                robots: blog.no_index ? { index: false, follow: true } : undefined,
                authors: [{ name: blog.author || 'Protonest IoT' }],
                openGraph: {
                    title,
                    description,
                    url: canonical,
                    siteName: 'Protonest',
                    locale: 'en_US',
                    type: 'article',
                    publishedTime: blog.published_at || blog.created_at,
                    modifiedTime: blog.updated_at,
                    authors: [blog.author || 'Protonest IoT'],
                    section: blog.categories?.[0],
                    tags,
                    images: [{ url: image, alt: blog.title }],
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: [image],
                },
            };
        }
    } catch (error) {
        console.error('Error fetching blog metadata:', error);
    }

    return {
        title: 'Blog Post - Protonest',
        description: 'Read insightful IoT articles and engineering updates from Protonest.',
        alternates: {
            canonical: `https://protonest.co/blog/${slug}`,
        },
    };
}

export default function BlogPostLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
