import { notFound, permanentRedirect } from 'next/navigation';
import { CMS_URL, getCmsBlog, getCmsBlogs, type CmsBlog } from '@/lib/cms-blogs';
import { htmlToText, prepareArticle } from '@/lib/article-html';
import BlogArticle from './BlogArticle';

// Pages are built on the server from the CMS, so search engines get the full article.
// A published edit shows up within a minute.
export const revalidate = 60;

type Props = {
    params: Promise<{ slug: string }>;
};

// Old blog addresses had characters such as ":" and "," in them
// (e.g. /blog/actuator-for-an-iot-project-:-selection-guide); the CMS slugs leave them out
// Structured data Google uses for article results: the post and its place in the site
const articleJsonLd = (blog: CmsBlog, description: string) => {
    const url = blog.canonical_url || `https://protonest.co/blog/${blog.slug}`;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                headline: blog.title,
                description,
                image: blog.seo_image || blog.cover_image || 'https://protonest.co/images/og-home.jpg',
                url,
                mainEntityOfPage: { '@type': 'WebPage', '@id': url },
                datePublished: blog.published_at || blog.created_at,
                dateModified: blog.updated_at,
                keywords: blog.keywords.join(', ') || undefined,
                articleSection: blog.categories[0],
                inLanguage: 'en',
                author:
                    blog.author === 'Protonest IoT'
                        ? { '@type': 'Organization', name: 'Protonest IoT', url: 'https://protonest.co' }
                        : { '@type': 'Person', name: blog.author, jobTitle: blog.author_role },
                publisher: {
                    '@type': 'Organization',
                    name: 'Protonest IoT',
                    url: 'https://protonest.co',
                    logo: { '@type': 'ImageObject', url: 'https://protonest.co/logo.webp' },
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://protonest.co' },
                    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://protonest.co/blog' },
                    { '@type': 'ListItem', position: 3, name: blog.title, item: url },
                ],
            },
        ],
    };
};

const cleanSlug = (slug: string): string =>
    slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default async function BlogDetailPage({ params }: Props) {
    const { slug: rawSlug } = await params;
    let slug = rawSlug;
    try {
        slug = decodeURIComponent(rawSlug);
    } catch {
        // keep the raw value
    }

    const clean = cleanSlug(slug);
    if (clean && clean !== slug) permanentRedirect(`/blog/${clean}`);

    const cache = { next: { revalidate: 60 } };
    const [blog, allBlogs] = await Promise.all([
        getCmsBlog(slug, cache),
        getCmsBlogs(null, cache).catch((err) => {
            console.error('Error fetching suggested blogs:', err);
            return [];
        }),
    ]);

    if (!blog || !blog.published) notFound();

    const { content, toc } = prepareArticle(blog.content, blog.title, CMS_URL);

    // Two other posts to read next: those sharing a category first, then the newest
    const others = allBlogs.filter((b) => b.id !== blog.id);
    const related = others.filter((b) => b.categories.some((c) => blog.categories.includes(c)));
    const suggested = [...related, ...others.filter((b) => !related.includes(b))].slice(0, 2);

    const description = blog.seo_description || htmlToText(blog.content).slice(0, 155);
    // "<" is escaped so text from the CMS can't close the script tag
    const jsonLd = JSON.stringify(articleJsonLd(blog, description)).replace(/</g, '\\u003c');

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
            <BlogArticle blog={{ ...blog, content }} tocItems={toc} suggestedBlogs={suggested} />
        </>
    );
}
