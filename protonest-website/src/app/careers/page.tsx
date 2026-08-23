import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/footer';
import JobRoleNavigation from '../components/job-role-navigation';
import Navbar from '../components/navbar';
import NewsAndBlogs from '../components/news-and-blogs';
import PageHero from '../components/page-hero';

export default function CareersPage() {
    return (
        <div className="min-h-screen relative">
            <Navbar />


            <PageHero
                backgroundImage="/jobs-1.webp"
                backgroundImageMobile="/jobs-1-mobile.webp"
                heading={{
                    beforeGradient: "Empowering Innovation",
                    gradientText: "Join our Growing Team"
                }}
                description="From bold IoT ideas to fully functional products, Protonest is where innovation becomes real."
                height="h-[400px] lg:h-[500px] xl:h-[439px]"
            />


            <main className="bg-white relative z-10 sm:py-12 lg:py-16">

                <section className="flex flex-col items-center mb-12 sm:mb-16 lg:mb-20 xl:mb-24 max-w-6xl xl:max-w-[1127px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
                    <h2 className="text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[30px] font-medium font-['Montserrat'] leading-tight xl:leading-[55px] text-center mb-8">
                        <span className="text-[#6c6c6c]">Find Your </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Role </span>
                        <span className="text-[#6c6c6c]">in Innovation</span>
                    </h2>

                    <div className="text-center mb-8 xl:mb-10 max-w-2xl xl:max-w-[779px] mx-auto">
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] text-[#6c6c6c] font-normal font-['Poppins'] leading-6 sm:leading-[30px]">
                            We&apos;re building a network of specialists across every IoT domain.
                        </p>
                    </div>

                    <div className="text-center mb-8 xl:mb-10">
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] text-[#6c6c6c] font-normal font-['Poppins'] leading-6 sm:leading-[30px]">
                            View Open Positions
                        </p>
                    </div>


                    <JobRoleNavigation className="px-2 sm:px-4 lg:px-8 xl:px-[60px] mb-6 sm:mb-8 lg:mb-10 w-full max-w-4xl xl:max-w-[1127px]" />
                </section>


                <section className="text-center max-w-4xl xl:max-w-[1127px] w-full px-4 sm:px-6 lg:px-8 mx-auto">
                    <h2 className="text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[30px] font-medium font-['Montserrat'] leading-tight xl:leading-[55px] mb-4 sm:mb-6 lg:mb-8">
                        <span className="text-[#6c6c6c]">Didn&apos;t Find a </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Role </span>
                        <span className="text-[#6c6c6c]">That Fits You?</span>
                    </h2>

                    <p className="text-sm sm:text-base text-[#6c6c6c] font-normal font-['Poppins'] leading-6 sm:leading-[30px] mb-6 sm:mb-8 lg:mb-10 xl:mb-12 max-w-2xl xl:max-w-[779px] mx-auto">
                        Sign up and add your CV to our talent pool and we will find the best fit for you
                    </p>

                    <Link href="/signup">
                        <button className="w-auto min-w-[140px] lg:min-w-[160px] xl:w-[180px] h-[45px] px-6 rounded-full xl:rounded-[57px] gradient-button flex items-center justify-center mx-auto">
                            <span className="text-sm sm:text-base font-medium font-['Poppins']">
                                Sign up
                            </span>
                        </button>
                    </Link>
                </section>
            </main>

            <NewsAndBlogs
                prefix=""
                highlight="Insights"
                suffix="from the Field"
                description={null}
            />


            <section className="relative w-full min-h-screen flex items-center justify-center overflow-visible">

                <Image
                    className="absolute -top-20 left-0 w-auto h-[525.99px] sm:h-[580px] md:h-[650px] lg:hidden xl:hidden"
                    src="/jobs-2-mobile.svg"
                    alt=""
                    width={809}
                    height={809}
                    priority={false}
                    quality={80}
                    aria-hidden="true"
                />
                <Image
                    className="absolute -bottom-24 right-0 w-auto h-[808.63px] sm:h-[880px] md:h-[950px] lg:hidden xl:hidden"
                    src="/jobs-3-mobile.svg"
                    alt=""
                    width={809}
                    height={809}
                    priority={false}
                    quality={80}
                    aria-hidden="true"
                />


                <Image
                    className="absolute -top-60 left-0 hidden lg:block w-auto h-[720px] xl:h-[786.67px]"
                    src="/jobs-2.svg"
                    alt=""
                    width={787}
                    height={787}
                    priority={false}
                    quality={80}
                    aria-hidden="true"
                />
                <Image
                    className="absolute -bottom-50 right-0 hidden lg:block w-auto h-[1000px] xl:h-[1056.88px]"
                    src="/jobs-3.svg"
                    alt=""
                    width={1057}
                    height={1057}
                    priority={false}
                    quality={80}
                    aria-hidden="true"
                />


                <div className="relative z-10 w-[350px] h-auto text-center justify-start sm:w-[420px] md:w-[500px] lg:w-[700px] xl:w-[1014px] xl:h-[109px]">
                    <h2 className="text-[#6c6c6c] text-[32px] font-medium font-['Montserrat'] leading-[55px] sm:text-[34px] md:text-[36px] lg:text-[38px] xl:text-[40px]">
                        Let&apos;s build the{' '}
                        <br className="xl:hidden" />
                        future of IoT
                        <br className="hidden xl:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                            {' '}Together
                        </span>
                    </h2>
                </div>
            </section>

            <Footer />
        </div>
    );
}
