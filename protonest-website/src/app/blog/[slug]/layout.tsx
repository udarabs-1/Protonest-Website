import { Metadata } from 'next';
import { getCmsBlog } from '@/lib/cms-blogs';

type Props = {
    params: Promise<{ slug: string }>;
};

const extractExcerpt = (html: string, maxLength = 160): string => {
    const text = html.replace(/<[^>]*>/g, '').trim();
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > -1 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const blog = await getCmsBlog(slug, { next: { revalidate: 60 } });

        if (blog) {

            const title = `${blog.title} | Protonest Blog`;
            const description = extractExcerpt(blog.content);
            const canonical = `https://protonest.co/blog/${blog.slug}`;
            const coverImage = blog.cover_image || 'https://protonest.co/images/og-home.jpg';

            const keywords = [
                ...(blog.categories || []),
                ...(blog.keywords || []),
            ].join(', ');

            return {
                title,
                description,
                keywords,
                alternates: {
                    canonical,
                },
                openGraph: {
                    title,
                    description,
                    url: canonical,
                    siteName: 'Protonest',
                    locale: 'en_US',
                    type: 'article',
                    publishedTime: blog.published_at || blog.created_at,
                    modifiedTime: blog.updated_at,
                    authors: [blog.author || 'Protonest'],
                    tags: [...(blog.categories || []), ...(blog.keywords || [])],
                    images: [
                        {
                            url: coverImage,
                            width: 1200,
                            height: 630,
                            alt: blog.title,
                        },
                    ],
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: [coverImage],
                },
                other: {
                    'script:ld+json': JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: blog.title,
                        description,
                        image: coverImage,
                        url: canonical,
                        datePublished: blog.published_at || blog.created_at,
                        dateModified: blog.updated_at,
                        keywords: (blog.keywords || []).join(', '),
                        articleSection: (blog.categories || []).join(', '),
                        author: {
                            '@type': 'Person',
                            name: blog.author || 'Protonest',
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Protonest',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://protonest.co/logo.webp',
                            },
                        },
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': canonical,
                        },
                    }),
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
        openGraph: {
            title: 'Blog - Protonest',
            description: 'Read insightful IoT articles and engineering updates from Protonest.',
            type: 'article',
            siteName: 'Protonest',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Blog - Protonest',
            description: 'Read insightful IoT articles and engineering updates from Protonest.',
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
