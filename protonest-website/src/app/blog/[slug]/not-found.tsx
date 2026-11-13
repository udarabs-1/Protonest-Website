import Link from 'next/link';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

export default function BlogArticleNotFound() {
    return (
        <div className="overflow-x-hidden">
            <Navbar />
            <div className="flex justify-center items-center min-h-[60vh] px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#6c6c6c] mb-4">Blog Post Not Found</h1>
                    <p className="text-[#6c6c6c] font-poppins mb-6">
                        The blog post you are looking for does not exist or has been removed.
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
