'use client';

import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

// Shown when the CMS can't be reached while building the blog list
export default function BlogListError({ reset }: { error: Error; reset: () => void }) {
    return (
        <div className="overflow-x-hidden">
            <Navbar />
            <div className="flex justify-center items-center min-h-[60vh] px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">Error Loading Blogs</h1>
                    <p className="text-[#6c6c6c] font-poppins mb-6">Something went wrong while loading the blog. Please try again.</p>
                    <button
                        onClick={reset}
                        className="px-6 py-2 bg-[#5530fa] text-white rounded-lg font-poppins hover:bg-[#4520d9] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
