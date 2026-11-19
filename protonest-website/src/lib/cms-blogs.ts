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
  /** The CMS "card" size (768 px wide) of the cover, for cards and lists */
  cover_card?: string;
  /** Tiny blurred copy of the cover, shown while the picture loads */
  cover_blur?: string;
  categories: string[];
  keywords: string[];
  author: string;
  author_role?: string;
  author_photo?: string;
  /** From the CMS SEO tab; empty when the writer left them blank */
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  canonical_url?: string;
  no_index?: boolean;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

type Named = { name?: string } | string | null | undefined;
type MediaSize = { url?: string | null } | null | undefined;
type Media =
  | { url?: string | null; blurDataURL?: string | null; sizes?: { thumbnail?: MediaSize; card?: MediaSize } | null }
  | string
  | null
  | undefined;
type Author = { name?: string; role?: string | null; photo?: Media } | string | null | undefined;

type PayloadPost = {
  id: string;
  title: string;
  slug: string;
  content_html?: string | null;
  featuredImage?: Media;
  author?: Author;
  categories?: Named[] | null;
  tags?: Named[] | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  _status?: string;
  seo?: {
    title?: string | null;
    description?: string | null;
    image?: Media;
    canonicalURL?: string | null;
    noIndex?: boolean | null;
  } | null;
};

// Media URLs from the CMS are relative, e.g. /api/media/file/photo.jpg
const absolute = (url?: string | null): string | undefined =>
  url ? (url.startsWith('http') ? url : `${CMS_URL}${url}`) : undefined;

const mediaUrl = (media: Media): string | undefined =>
  media && typeof media === 'object' ? absolute(media.url) : undefined;

// A smaller copy made by the CMS when the image was uploaded, or the original if there is none
const mediaSizeUrl = (media: Media, size: 'thumbnail' | 'card'): string | undefined =>
  media && typeof media === 'object' ? absolute(media.sizes?.[size]?.url) ?? mediaUrl(media) : undefined;

const mediaBlur = (media: Media): string | undefined =>
  media && typeof media === 'object' && media.blurDataURL?.startsWith('data:image/') ? media.blurDataURL : undefined;

/**
 * CMS images go through Next.js image optimisation, which resizes them for each screen,
 * converts them to WebP/AVIF and caches them on the CDN, so phones don't download the
 * full-size original. Only images from a CMS running on this computer skip it.
 */
export const skipImageOptimization = (src?: string | null): boolean =>
  Boolean(src && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(src));

const names = (items?: Named[] | null): string[] =>
  (items ?? []).flatMap((item) => (item && typeof item === 'object' && item.name ? [item.name] : []));

const toBlog = (post: PayloadPost): CmsBlog => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  content: post.content_html ?? '',
  excerpt: post.seo?.description || undefined,
  cover_image: mediaUrl(post.featuredImage) ?? mediaUrl(post.seo?.image),
  cover_card: mediaSizeUrl(post.featuredImage, 'card') ?? mediaSizeUrl(post.seo?.image, 'card'),
  cover_blur: mediaBlur(post.featuredImage) ?? mediaBlur(post.seo?.image),
  categories: names(post.categories),
  keywords: names(post.tags),
  // Articles without an author are credited to the company
  author: post.author && typeof post.author === 'object' && post.author.name ? post.author.name : 'Protonest IoT',
  author_role: post.author && typeof post.author === 'object' ? post.author.role || undefined : undefined,
  author_photo: post.author && typeof post.author === 'object' ? mediaSizeUrl(post.author.photo, 'thumbnail') : undefined,
  seo_title: post.seo?.title?.trim() || undefined,
  seo_description: post.seo?.description?.trim() || undefined,
  seo_image: mediaUrl(post.seo?.image),
  canonical_url: post.seo?.canonicalURL?.trim() || undefined,
  no_index: Boolean(post.seo?.noIndex),
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
    // depth=2 so the author's photo comes back as an image, not just its ID
    `blog-posts?${tenant}&depth=2&limit=100&sort=-publishedAt`,
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
    `blog-posts?${tenant}&where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`,
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
