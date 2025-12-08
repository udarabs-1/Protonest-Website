'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Content {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
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

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [content, setContent] = useState<Content | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/research/${slug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Research not found');
                    }
                    throw new Error('Failed to fetch research');
                }

                const result = await response.json();

                if (result.status === 'success') {
                    setContent(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch research');
                }
            } catch (err) {
                console.error('Error fetching research:', err);
                setError(err instanceof Error ? err.message : 'Failed to load research');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [slug]);

    if (loading) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-[#5530fa] rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[#6c6c6c] font-poppins">Loading...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">
                            {error === 'Research not found' ? 'Research Not Found' : 'Error Loading Research'}
                        </h1>
                        <p className="text-[#6c6c6c] font-poppins mb-6">
                            {error === 'Research not found'
                                ? 'The research you are looking for does not exist or has been removed.'
                                : error || 'Something went wrong while loading the research.'}
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-poppins hover:bg-gray-600 transition-colors"
                            >
                                Go Back
                            </button>
                            <Link
                                href="/whats-new/research"
                                className="px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors inline-block"
                            >
                                View All Research
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!content.published) {
        return (
            <div className="overflow-x-hidden">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">Research Not Available</h1>
                        <p className="text-[#6c6c6c] font-poppins mb-6">
                            This research is not currently published.
                        </p>
                        <Link
                            href="/whats-new/research"
                            className="px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors inline-block"
                        >
                            View All Research
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const readTime = calculateReadTime(content.content);
    const publishDate = content.published_at || content.created_at;

    return (
        <div className="overflow-x-hidden">
            <Head>
                <title>{content.title} - Protonest</title>
                <meta name="description" content={content.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'} />
                <meta name="author" content={content.author} />
                <link rel="canonical" href={`https://protonest.co/whats-new/research/${content.slug}`} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://protonest.co/whats-new/research/${content.slug}`} />
                <meta property="og:title" content={content.title} />
                <meta property="og:description" content={content.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'} />
                {content.cover_image && <meta property="og:image" content={content.cover_image} />}
            </Head>

            <Navbar />

            <div className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-10">
                {content.cover_image && (
                    <div className="mb-8 lg:mb-12">
                        <div className="relative w-full aspect-video rounded-[11px] overflow-hidden">
                            <Image
                                src={content.cover_image}
                                alt={content.title}
                                fill
                                className="object-cover"
                                priority={true}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <h1 className="text-[#6c6c6c] text-2xl md:text-3xl lg:text-4xl font-medium font-montserrat leading-tight mb-4">
                        {content.title}
                    </h1>
                    <div className="text-sm text-[#83848b] font-poppins">
                        <span>{formatDate(publishDate)}</span>
                    </div>
                </div>

                <article className="prose prose-lg max-w-none">
                    <div
                        className="text-[#6c6c6c] text-base font-normal font-poppins leading-[30px]"
                        dangerouslySetInnerHTML={{ __html: content.content }}
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
                
                .prose h1 { font-size: 2rem; line-height: 1.2; }
                .prose h2 { font-size: 1.75rem; line-height: 1.3; }
                .prose h3 { font-size: 1.5rem; line-height: 1.4; }
                .prose h4 { font-size: 1.25rem; line-height: 1.4; }
                
                .prose p { margin-bottom: 1.5rem; line-height: 1.8; }
                .prose ul, .prose ol { margin: 1.5rem 0; padding-left: 2rem; }
                .prose li { margin: 0.5rem 0; line-height: 1.7; }
                .prose strong { font-weight: 600; color: #4a5568; }
                
                .prose a {
                    color: #5530fa;
                    text-decoration: underline;
                    transition: color 0.2s ease;
                }
                .prose a:hover { color: #f51da5; }
                
                .prose .image-container { margin: 2rem 0; max-width: 100%; }
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
                
                .prose pre code { background: transparent; color: inherit; padding: 0; }
                
                .prose table { width: 100%; border-collapse: collapse; margin: 2rem 0; }
                .prose th, .prose td { border: 1px solid #e2e8f0; padding: 0.75rem; text-align: left; }
                .prose th { background: #f7fafc; font-weight: 600; }
            `}</style>
        </div>
    );
}