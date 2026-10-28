// Blog posts from Protonest CMS (Payload), mapped to the shape the blog pages already use.

export const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.protonest.co').replace(/\/$/, '');
const TENANT = process.env.NEXT_PUBLIC_CMS_TENANT || 'protonest-website';

export interface CmsBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  categories: string[];
  keywords: string[];
  author: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

type Named = { name?: string } | string | null | undefined;
type Media = { url?: string | null } | string | null | undefined;

type PayloadPost = {
  id: string;
  title: string;
  slug: string;
  content_html?: string | null;
  featuredImage?: Media;
  author?: Named;
  categories?: Named[] | null;
  tags?: Named[] | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  _status?: string;
  seo?: { description?: string | null; image?: Media } | null;
};

// Media URLs from the CMS are relative, e.g. /api/media/file/photo.jpg
const mediaUrl = (media: Media): string | undefined => {
  if (!media || typeof media !== 'object' || !media.url) return undefined;
  return media.url.startsWith('http') ? media.url : `${CMS_URL}${media.url}`;
};

const names = (items?: Named[] | null): string[] =>
  (items ?? []).flatMap((item) => (item && typeof item === 'object' && item.name ? [item.name] : []));

const toBlog = (post: PayloadPost): CmsBlog => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  content: post.content_html ?? '',
  excerpt: post.seo?.description || undefined,
  cover_image: mediaUrl(post.featuredImage) ?? mediaUrl(post.seo?.image),
  categories: names(post.categories),
  keywords: names(post.tags),
  author: post.author && typeof post.author === 'object' && post.author.name ? post.author.name : 'Protonest',
  published: post._status !== 'draft',
  published_at: post.publishedAt ?? undefined,
  created_at: post.publishedAt ?? post.createdAt,
  updated_at: post.updatedAt,
});

const cmsFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${CMS_URL}/api/${path}`, init);
  if (!response.ok) throw new Error(`CMS request failed (${response.status}): ${path}`);
  return response.json() as Promise<T>;
};

// Posts are filtered by the tenant's ID, looked up once from its slug
let tenantIdPromise: Promise<string | null> | null = null;

// The lookup is shared between callers, so it doesn't use any one caller's abort signal
const getTenantId = (): Promise<string | null> => {
  tenantIdPromise ??= cmsFetch<{ docs: { id: string }[] }>(
    `tenants?where[slug][equals]=${encodeURIComponent(TENANT)}&depth=0&limit=1`,
  )
    .then(({ docs }) => {
      // Don't remember a miss, so fixing the tenant slug works without a reload
      if (!docs[0]) tenantIdPromise = null;
      return docs[0]?.id ?? null;
    })
    .catch((err) => {
      tenantIdPromise = null;
      throw err;
    });
  return tenantIdPromise;
};

const tenantQuery = async (init?: RequestInit): Promise<string | null> => {
  const id = await getTenantId();
  init?.signal?.throwIfAborted();
  if (!id) console.error(`CMS tenant "${TENANT}" not found`);
  return id ? `where[tenant][equals]=${id}` : null;
};

/** All published posts for this website, newest first. Optionally only one category. */
export const getCmsBlogs = async (category?: string | null, init?: RequestInit): Promise<CmsBlog[]> => {
  const tenant = await tenantQuery(init);
  if (!tenant) return [];
  const { docs } = await cmsFetch<{ docs: PayloadPost[] }>(
    `blog-posts?${tenant}&depth=1&limit=100&sort=-publishedAt`,
    init,
  );
  const blogs = docs.map(toBlog);
  return category ? blogs.filter((blog) => blog.categories.includes(category)) : blogs;
};

/** One published post by slug, or null if it doesn't exist. */
export const getCmsBlog = async (slug: string, init?: RequestInit): Promise<CmsBlog | null> => {
  const tenant = await tenantQuery(init);
  if (!tenant) return null;
  const { docs } = await cmsFetch<{ docs: PayloadPost[] }>(
    `blog-posts?${tenant}&where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`,
    init,
  );
  return docs[0] ? toBlog(docs[0]) : null;
};

/** Category names for this website. */
export const getCmsBlogCategories = async (init?: RequestInit): Promise<string[]> => {
  const tenant = await tenantQuery(init);
  if (!tenant) return [];
  const { docs } = await cmsFetch<{ docs: { name: string }[] }>(
    `categories?${tenant}&depth=0&limit=100&sort=name`,
    init,
  );
  return docs.map((category) => category.name);
};
