import { Metadata } from 'next';

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/blogs/${slug}`, {
            next: { revalidate: 3600 },
        });

        if (response.ok) {
            const data = await response.json();
            const blog = data.data;

            const title = `${blog.title} - Protonest`;
            const textContent = blog.content.replace(/<[^>]*>/g, '');
            const description = textContent.substring(0, 160) + (textContent.length > 160 ? '...' : '');

            // Combine categories and keywords for comprehensive SEO
            const allKeywords = [
                ...(blog.categories || []),
                ...(blog.keywords || [])
            ].join(', ');

            return {
                title,
                description,
                keywords: allKeywords,
                openGraph: {
                    title,
                    description,
                    type: 'article',
                    siteName: 'Protonest',
                    locale: 'en_US',
                    publishedTime: blog.published_at || blog.created_at,
                    modifiedTime: blog.updated_at,
                    authors: [blog.author],
                    tags: [...(blog.categories || []), ...(blog.keywords || [])],
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                },
                other: {
                    'script:ld+json': JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: blog.title,
                        description: description,
                        author: {
                            '@type': 'Person',
                            name: blog.author
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Protonest',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://protonest.co/logo.webp'
                            }
                        },
                        datePublished: blog.published_at || blog.created_at,
                        dateModified: blog.updated_at,
                        image: blog.cover_image,
                        keywords: (blog.keywords || []).join(', '),
                        articleSection: (blog.categories || []).join(', '),
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `https://protonest.co/blog/${blog.slug}`
                        }
                    })
                }
            };
        }
    } catch (error) {
        console.error('Error fetching blog data for metadata:', error);
    }

    return {
        title: 'Blog Post - Protonest',
        description: 'Read insightful articles and updates from Protonest',
        openGraph: {
            title: 'Blog - Protonest',
            description: 'Read insightful articles and updates from Protonest',
            type: 'website',
            siteName: 'Protonest',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Blog - Protonest',
            description: 'Read insightful articles and updates from Protonest',
        },
    };
}

export { default } from './page';
