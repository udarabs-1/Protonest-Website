import Navbar from '@/app/components/navbar';

// Shown straight away when an article is opened, while the page is still on its way
export default function BlogArticleLoading() {
    const bar = 'rounded-lg bg-[#f1f1ef] animate-pulse';
    return (
        <div className="overflow-x-hidden" aria-busy="true" aria-label="Loading article">
            <Navbar />
            <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 py-12 lg:py-16">
                <div className="mx-auto max-w-[780px]">
                    <div className={`${bar} h-6 w-64`} />
                    <div className={`${bar} mt-8 h-12 w-full`} />
                    <div className={`${bar} mt-3 h-12 w-3/4`} />
                    <div className="mt-8 flex items-center gap-4">
                        <div className="h-[72px] w-[72px] rounded-full bg-[#f1f1ef] animate-pulse" />
                        <div className="flex-1">
                            <div className={`${bar} h-5 w-48`} />
                            <div className={`${bar} mt-2 h-4 w-36`} />
                        </div>
                    </div>
                    <div className={`${bar} mt-12 aspect-video w-full`} />
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`${bar} mt-5 h-5 ${i % 2 ? 'w-11/12' : 'w-full'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
