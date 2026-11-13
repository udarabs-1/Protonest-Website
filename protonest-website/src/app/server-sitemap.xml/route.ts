import { getServerSideSitemap, type ISitemapField } from 'next-sitemap';
import { getCmsBlogs } from '@/lib/cms-blogs';

// Blog posts from the CMS for search engines. Listed in robots.txt and sitemap.xml by
// next-sitemap (see next-sitemap.config.js), and updated hourly so new posts are found
// without rebuilding the site.
export const revalidate = 3600;

export async function GET() {
    const blogs = await getCmsBlogs(null, { next: { revalidate: 3600 } }).catch((err) => {
        console.error('Error building blog sitemap:', err);
        return [];
    });

    const fields: ISitemapField[] = blogs
        .filter((blog) => blog.published && blog.slug)
        .map((blog) => ({
            loc: `https://protonest.co/blog/${blog.slug}`,
            lastmod: new Date(blog.updated_at || blog.created_at).toISOString(),
            changefreq: 'monthly',
            priority: 0.7,
        }));

    return getServerSideSitemap(fields);
}
