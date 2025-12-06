'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
    categories: string[];
    author: string;
    published: boolean;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

const calculateReadTime = (content: string): string => {
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingSpeed = 200;
    const minutes = Math.ceil(wordCount / readingSpeed);
    return `${minutes} min read`;
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/blogs/${slug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Blog post not found');
                    }
                    throw new Error('Failed to fetch blog post');
                }

                const result = await response.json();

                if (result.status === 'success') {
                    setBlog(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch blog post');
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError(err instanceof Error ? err.message : 'Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    if (loading) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-[#5530fa] rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[#6c6c6c] font-poppins">Loading blog post...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">
                            {error === 'Blog post not found' ? 'Blog Post Not Found' : 'Error Loading Blog'}
                        </h1>
                        <p className="text-[#6c6c6c] font-poppins mb-6">
                            {error === 'Blog post not found'
                                ? 'The blog post you are looking for does not exist or has been removed.'
                                : error || 'Something went wrong while loading the blog post.'}
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-poppins hover:bg-gray-600 transition-colors"
                            >
                                Go Back
                            </button>
                            <Link
                                href="/blog"
                                className="px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors inline-block"
                            >
                                View All Blogs
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!blog.published) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">Blog Post Not Available</h1>
                        <p className="text-[#6c6c6c] font-poppins mb-6">
                            This blog post is not currently published.
                        </p>
                        <Link
                            href="/blog"
                            className="px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors inline-block"
                        >
                            View All Blogs
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const readTime = calculateReadTime(blog.content);
    const publishDate = blog.published_at || blog.created_at;

    return (
        <div className="overflow-x-hidden">
            <Head>

                <title>{blog.title} - Protonest</title>
                <meta
                    name="description"
                    content={blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'}
                />
                <meta name="keywords" content={blog.categories.join(', ')} />
                <meta name="author" content={blog.author} />


                <link rel="canonical" href={`https://protonest.co/blog/${blog.slug}`} />


                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://protonest.co/blog/${blog.slug}`} />
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'} />
                {blog.cover_image && <meta property="og:image" content={blog.cover_image} />}
                <meta property="og:image:alt" content={blog.title} />


                <meta property="article:author" content={blog.author} />
                <meta property="article:published_time" content={publishDate} />
                <meta property="article:modified_time" content={blog.updated_at} />
                {blog.categories.map((category, index) => (
                    <meta key={index} property="article:tag" content={category} />
                ))}


                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": blog.title,
                        "description": blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
                        "author": {
                            "@type": "Person",
                            "name": blog.author
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Protonest",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://protonest.co/logo.webp"
                            }
                        },
                        "datePublished": publishDate,
                        "dateModified": blog.updated_at,
                        "image": blog.cover_image ? {
                            "@type": "ImageObject",
                            "url": blog.cover_image
                        } : undefined,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://protonest.co/blog/${blog.slug}`
                        },
                        "articleSection": blog.categories.join(', '),
                        "keywords": blog.categories.join(', ')
                    })}
                </script>
            </Head>

            <Navbar />

            <div className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-10">


                {blog.cover_image && (
                    <div className="mb-8 lg:mb-12">
                        <Image
                            src={blog.cover_image}
                            alt={blog.title}
                            width={1125}
                            height={390}
                            className="w-full h-[200px] md:h-[390px] xl:h-[430px] rounded-[11px] object-cover"
                            priority={true}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    </div>
                )}


                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <h1 className="text-[#6c6c6c] text-2xl md:text-3xl lg:text-4xl font-medium font-montserrat leading-tight mb-4 sm:mb-0 sm:pr-8">
                        {blog.title}
                    </h1>
                    <div className="flex flex-col sm:items-end text-sm text-[#83848b] font-poppins whitespace-nowrap">
                        <span className="mb-1">{formatDate(publishDate)}</span>
                        <span>{readTime}</span>
                    </div>
                </div>


                <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
                    {blog.categories.map((category, idx) => (
                        <div
                            key={idx}
                            className="h-9 md:h-11 px-4 py-2 w-auto md:w-[160px] text-center rounded-[57px] gradient-button-static-2 inline-flex items-center justify-center text-[#6c6c6c] text-sm font-medium font-montserrat"
                        >
                            {category}
                        </div>
                    ))}
                </div>


                <article className="prose prose-lg max-w-none">
                    <div
                        className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px]"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </article>

            </div>

            <Footer />

            <style jsx global>{`
        
        .prose {
          color: #6c6c6c;
          font-family: 'Poppins', sans-serif;
        }
        
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          color: #6c6c6c;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .prose h1 {
          font-size: 2rem;
          line-height: 1.2;
        }
        
        .prose h2 {
          font-size: 1.75rem;
          line-height: 1.3;
        }
        
        .prose h3 {
          font-size: 1.5rem;
          line-height: 1.4;
        }
        
        .prose h4 {
          font-size: 1.25rem;
          line-height: 1.4;
        }
        
        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        
        .prose ul, .prose ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .prose li {
          margin: 0.5rem 0;
          line-height: 1.7;
        }
        
        .prose strong {
          font-weight: 600;
          color: #4a5568;
        }
        
        .prose a {
          color: #5530fa;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        .prose a:hover {
          color: #f51da5;
        }
        
        
        .prose .image-container {
          margin: 2rem 0;
          max-width: 100%;
        }
        
        .prose .image-container img {
          border-radius: 8px;
          max-width: 100%;
          height: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        
        .prose img:not(.image-container img) {
          border-radius: 8px;
          margin: 2rem 0;
          max-width: 100%;
          height: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .prose blockquote {
          border-left: 4px solid #5530fa;
          background: #f8f9fa;
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          border-radius: 0 8px 8px 0;
        }
        
        .prose code {
          background: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
          color: #e53e3e;
          font-family: 'Courier New', monospace;
        }
        
        .prose pre {
          background: #1a202c;
          color: #e2e8f0;
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 2rem 0;
        }
        
        .prose pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }
        
        .prose th, .prose td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          text-align: left;
        }
        
        .prose th {
          background: #f7fafc;
          font-weight: 600;
        }
      `}</style>
        </div>
    );
}