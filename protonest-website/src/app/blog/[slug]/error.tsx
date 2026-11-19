'use client';

import Link from 'next/link';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

// Shown when the CMS can't be reached while building the article page
export default function BlogArticleError({ reset }: { error: Error; reset: () => void }) {
    return (
        <div className="overflow-x-hidden">
            <Navbar />
            <div className="flex justify-center items-center min-h-[60vh] px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">Error Loading Blog</h1>
                    <p className="text-[#6c6c6c] font-poppins mb-6">
                        Something went wrong while loading the blog post. Please try again.
                    </p>
                    <div className="space-x-4">
                        <button
                            onClick={reset}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg font-poppins hover:bg-gray-600 transition-colors"
                        >
                            Try again
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
