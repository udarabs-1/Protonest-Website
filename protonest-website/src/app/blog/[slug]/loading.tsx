import Navbar from '@/app/components/navbar';
import { BLOG_EDGE_PADDING, BLOG_EDGE_WIDTH } from '@/lib/blog-layout';
import { articleFont } from './fonts';
import './article.css';

// Shown while an article is on its way. It uses the article's own grid, spacing and
// "Share this post" row (see BlogArticle.tsx), so nothing jumps when the real article replaces it.
//
// Next.js also puts this placeholder at the top of every article page it sends, with the real
// article later in the same page. On a refresh the browser could paint the placeholder for a
// moment before swapping in the article, which made the share icons (and the rest) flicker.
// So the placeholder stays invisible for its first 400ms (.article-loading in article.css):
// a refresh swaps in the article before then, and a slow click-through still shows it.
export default function BlogArticleLoading() {
    const bar = 'rounded-lg bg-[#f1f1ef] animate-pulse';
    return (
        <div className="article-loading overflow-x-hidden" aria-busy="true" aria-label="Loading article">
            <Navbar />
            <div className={`${articleFont.variable} article-page w-full ${BLOG_EDGE_PADDING} py-12 lg:py-16`}>
                <div className={BLOG_EDGE_WIDTH}>
                    <div className="lg:grid lg:grid-cols-[140px_minmax(0,1fr)_180px] lg:gap-x-8 xl:grid-cols-[170px_minmax(0,1fr)_210px] xl:gap-x-10 min-[90rem]:grid-cols-[220px_minmax(0,920px)_220px] min-[90rem]:justify-between min-[90rem]:gap-x-12">
                        <div className="lg:col-start-1 lg:row-start-1">
                            <div className={`${bar} h-[22px] w-20`} />
                        </div>

                        <div className="mt-8 min-w-0 lg:col-start-2 lg:row-start-1 lg:mt-0">
                            {/* Published line */}
                            <div className={`${bar} h-[22px] w-72 max-w-full`} />
                            {/* Title: two lines at the title's size */}
                            <div className="mt-[36px] space-y-2">
                                <div className={`${bar} h-[2.1rem] sm:h-[2.9rem] lg:h-[2.65rem] xl:h-[2.9rem] w-full`} />
                                <div className={`${bar} h-[2.1rem] sm:h-[2.9rem] lg:h-[2.65rem] xl:h-[2.9rem] w-2/3`} />
                            </div>
                            {/* Author */}
                            <div className="mt-[46px] flex items-center gap-2.5">
                                <div className="h-12 w-12 shrink-0 rounded-full bg-[#f1f1ef] animate-pulse" />
                                <div>
                                    <div className={`${bar} h-4 w-44`} />
                                    <div className={`${bar} mt-1.5 h-3.5 w-56`} />
                                </div>
                            </div>
                            {/* Share this post: real label, icon spots in the same places */}
                            <div className="mt-12 sm:mt-[50px] xl:mt-[52px]">
                                <p className="text-[0.95rem] font-medium uppercase tracking-[0.06em] text-black/55">Share this post</p>
                                <div className="mt-2 -ml-2 flex items-center gap-1">
                                    {[0, 1, 2, 3].map((i) => (
                                        <span key={i} className="flex h-8 w-8 items-center justify-center">
                                            <span className="h-[17px] w-[17px] rounded bg-[#f1f1ef] animate-pulse" />
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <hr className="mt-8 w-[90px] border-0 border-t border-[#e9e9e7]" />
                        </div>

                        <div className={`${bar} mt-10 aspect-video w-full lg:col-start-2`} />
                        <div className="mt-10 lg:col-start-2 lg:mt-14">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className={`${bar} mt-5 h-5 ${i % 2 ? 'w-11/12' : 'w-full'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
