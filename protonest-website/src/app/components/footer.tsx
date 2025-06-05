import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <div className="w-full px-[133px] h-[578px] mb-[70px]">
            <div className="rounded-b-[25px] relative h-full overflow-hidden">
                {/* Background GIF */}
                <div
                    className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('/footerWeb.gif')" }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white z-10" />


                <div className='relative z-20 px-[98px]'>
                    <div className="w-full flex pt-[180px] justify-between">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={149}
                            height={106}
                        />
                        <div className="flex flex-col justify-center">
                            <div className='font-montserrat text-[14px] space-x-[35px] text-right'>
                                <Link href="/" className="text-[rgba(131,132,139,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[rgba(245,29,165,1)] to-[rgba(85,48,250,1)]">
                                    Home
                                </Link>
                                <Link href="/projects" className="text-[rgba(131,132,139,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[rgba(245,29,165,1)] to-[rgba(85,48,250,1)]">
                                    Projects
                                </Link>
                                <Link href="/research" className="text-[rgba(131,132,139,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[rgba(245,29,165,1)] to-[rgba(85,48,250,1)]">
                                    Research
                                </Link>
                                <Link href="/blogs" className="text-[rgba(131,132,139,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[rgba(245,29,165,1)] to-[rgba(85,48,250,1)]">
                                    Blogs
                                </Link>
                                <Link href="/about" className="text-[rgba(131,132,139,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[rgba(245,29,165,1)] to-[rgba(85,48,250,1)]">
                                    About Us
                                </Link>
                                <Link href="/contact" className="text-[rgba(131,132,139,1)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[rgba(245,29,165,1)] to-[rgba(85,48,250,1)]">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-between items-end mt-[10px]'>
                        <div className=' text-[12px] font-poppins text-[rgba(108,108,108,1)]'>
                            503/A, Welivita Road, Kaduwela, Colombo, Sri Lanka, 10640
                        </div>
                        <button className="w-[147px] h-[44px] text-[14px] bg-none border-[1px] border-[rgba(131,132,139,1)] text-neutral-500 p-[10px] rounded-[30px]">
                            Get a Quote
                        </button>
                    </div>
                    <div className='flex space-x-[20px] w-auto h-[17px] mt-[40px] cursor-pointer text-[rgba(78,78,78,1)]'>
                        <Link
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </Link>
                        <Link
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                    <div className="bg-gradient-to-r from-[#F51DA5] to-[#5530FA] bg-clip-text text-transparent font-poppins text-[12px] mt-[120px] w-fit mx-auto">
                        © 2025 Protonest. All rights reserved.
                    </div>

                </div>
            </div>
        </div>
    );
}