// Page edges of the blog (list and articles) and of the navbar on blog pages. The blog is a bit
// wider than the rest of the site: on laptops and desktops the logo and "Book a Call" sit closer to
// the screen edges. Phones and tablets use the site's normal edges (16px, then 32px from 768px).
// Tailwind needs these as complete strings, so they are written out in full here.
export const BLOG_EDGE_PADDING = 'px-4 md:px-8 lg:px-[40px] xl:px-[72px] 2xl:px-[110px]';
export const BLOG_EDGE_WIDTH = 'w-full lg:mx-auto lg:max-w-[1760px]';
