import { notFound, permanentRedirect } from 'next/navigation';
import { getCmsBlog, getCmsBlogs } from '@/lib/cms-blogs';
import { prepareArticle } from '@/lib/article-html';
import BlogArticle from './BlogArticle';

// Pages are built on the server from the CMS, so search engines get the full article.
// A published edit shows up within a minute.
export const revalidate = 60;

type Props = {
    params: Promise<{ slug: string }>;
};

// Old blog addresses had characters such as ":" and "," in them
// (e.g. /blog/actuator-for-an-iot-project-:-selection-guide); the CMS slugs leave them out
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

    const { content, toc } = prepareArticle(blog.content, blog.title);

    // Two other posts to read next: those sharing a category first, then the newest
    const others = allBlogs.filter((b) => b.id !== blog.id);
    const related = others.filter((b) => b.categories.some((c) => blog.categories.includes(c)));
    const suggested = [...related, ...others.filter((b) => !related.includes(b))].slice(0, 2);

    return <BlogArticle blog={{ ...blog, content }} tocItems={toc} suggestedBlogs={suggested} />;
}
