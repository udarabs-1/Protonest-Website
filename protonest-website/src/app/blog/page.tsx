import { getCmsBlogCategories, getCmsBlogs } from '@/lib/cms-blogs';
import BlogList from './BlogList';

// Built on the server from the CMS, so search engines see every post. New posts appear within a minute.
export const revalidate = 60;

export default async function BlogPage() {
    const cache = { next: { revalidate: 60 } };
    const [blogs, categories] = await Promise.all([
        getCmsBlogs(null, cache),
        getCmsBlogCategories(cache).catch((err) => {
            console.error('Error fetching categories:', err);
            return [];
        }),
    ]);

    return <BlogList initialBlogs={blogs} categories={categories} />;
}
