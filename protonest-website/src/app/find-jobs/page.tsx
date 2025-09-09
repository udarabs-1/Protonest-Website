'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Blogs from '../components/blogs';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

export default function CareersPage() {
    const router = useRouter();

    const roles = [
        { emoji: '🖥️', title: 'Front-End', slug: 'front-end' },
        { emoji: '🛠️', title: 'Back-End', slug: 'back-end' },
        { emoji: '⚡️', title: 'Electronics', slug: 'electronics' },
        { emoji: '🎨', title: 'UI/UX\nDesigning', slug: 'ui-ux-designing' },
        { emoji: '⚙️', title: 'Mechanical', slug: 'mechanical' },
        { emoji: '🧑‍💻', title: 'Embedded Firmware', slug: 'embedded-firmware' },
        { emoji: '✍️', title: 'Quality Assurance', slug: 'quality-assurance' },
        { emoji: '➕', title: 'Other Roles', slug: 'other-roles' }
    ];

    const handleRoleClick = (slug: string) => {
        router.push(`/jobs/${slug}`);
    };

    return (
        <div className="min-h-screen relative">
            <Navbar />
            {/* Hero Section with Background */}
            <div className=" h-[400px] lg:h-[500px] xl:h-[439px] relative">
                {/* Background Image - Mobile */}
                <div className="absolute inset-0 -z-10 block sm:hidden">
                    <Image
                        src="/jobs-1-mobile.svg"
                        alt="Careers background mobile"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                {/* Background Image - Desktop */}
                <div className="absolute inset-0 -z-10 hidden sm:block">
                    <Image
                        src="/jobs-1.svg"
                        alt="Careers background"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>

                {/* Top Gradient Overlay */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10" />

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10" />

                {/* Hero Content */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 xl:px-0">
                    <div className="text-center max-w-4xl xl:max-w-[1120px]">
                        <h1 className="text-[24px] sm:text-[30px] md:text-[32px] lg:text-[38px] xl:text-[45px] font-medium font-['Montserrat'] leading-tight xl:leading-[55px] mb-4 sm:mb-6 lg:mb-8">
                            <span className="text-[#6c6c6c]">Empowering Innovation</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Join our Growing Team</span>
                        </h1>
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] text-[#6c6c6c] font-normal font-['Poppins'] leading-6 sm:leading-[30px] max-w-2xl xl:max-w-[1120px] mx-auto">
                            From bold IoT ideas to fully functional products, Protonest is where innovation becomes real.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="bg-white relative z-10 py-4 sm:py-12">

                {/* Roles Section */}
                <div className="flex flex-col items-center mb-12 sm:mb-16 lg:mb-20 xl:mb-24 max-w-6xl xl:max-w-[1127px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
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

                    {/* Role Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 xl:gap-6 px-2 sm:px-4 lg:px-8 xl:px-[60px] mb-6 sm:mb-8 lg:mb-10">
                        {roles.map((role, index) => (
                            <div
                                key={index}
                                onClick={() => handleRoleClick(role.slug)}
                                className="h-14 xl:h-[65.89px] max-w-[250px] px-3 sm:px-6 py-2 sm:py-4 rounded-full xl:rounded-[57px] border gradient-button-static-3 flex hover:bg-gradient-to-r hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] items-center gap-1 sm:gap-2 transition-colors cursor-pointer group min-w-0"
                            >
                                <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                                    <div className="text-base sm:text-2xl xl:text-3xl font-semibold font-['Montserrat'] group-hover:scale-110 transition-transform flex-shrink-0">
                                        {role.emoji}
                                    </div>
                                    <div className="text-xs sm:text-base text-[#6c6c6c] font-medium font-['Montserrat'] group-hover:text-white whitespace-pre-line leading-tight overflow-hidden">
                                        {role.title}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Talent Pool Section */}
                <div className="text-center max-w-4xl xl:max-w-[1127px] w-full px-4 sm:px-6 lg:px-8 mx-auto">
                    <h2 className="text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[30px] font-medium font-['Montserrat'] leading-tight xl:leading-[55px] mb-4 sm:mb-6 lg:mb-8">
                        <span className="text-[#6c6c6c]">Didn&apos;t Find a </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">Role </span>
                        <span className="text-[#6c6c6c]">That Fits You?</span>
                    </h2>

                    <p className="text-sm sm:text-base text-[#6c6c6c] font-normal font-['Poppins'] leading-6 sm:leading-[30px] mb-6 sm:mb-8 lg:mb-10 xl:mb-12 max-w-2xl xl:max-w-[779px] mx-auto">
                        Sign up and add your CV to our talent pool and we will get back to you if a relevant role is available
                    </p>

                    <button className="w-auto min-w-[140px] lg:min-w-[160px] xl:w-[180px] h-[45px] px-6 rounded-full xl:rounded-[57px] gradient-button flex items-center justify-center mx-auto">
                        <span className="text-sm sm:text-base font-medium font-['Poppins']">
                            Sign up
                        </span>
                    </button>
                </div>
            </div>

            <Blogs />

            <div className="relative w-full min-h-screen flex items-center justify-center overflow-visible">
                {/* Background Images - Mobile/Tablet (up to md) */}
                <Image
                    className="absolute -top-20 left-0 w-auto h-[525.99px] sm:h-[580px] md:h-[650px] lg:hidden xl:hidden"
                    src="/jobs-2-mobile.svg"
                    alt=""
                    width={809}
                    height={809}
                    priority
                />
                <Image
                    className="absolute -bottom-24 right-0 w-auto h-[808.63px] sm:h-[880px] md:h-[950px] lg:hidden xl:hidden"
                    src="/jobs-3-mobile.svg"
                    alt=""
                    width={809}
                    height={809}
                    priority
                />

                {/* Background Images - Desktop (lg and xl) */}
                <Image
                    className="absolute -top-60 left-0 hidden lg:block w-auto h-[720px] xl:h-[786.67px]"
                    src="/jobs-2.svg"
                    alt=""
                    width={787}
                    height={787}
                    priority
                />
                <Image
                    className="absolute -bottom-50 right-0 hidden lg:block w-auto h-[1000px] xl:h-[1056.88px]"
                    src="/jobs-3.svg"
                    alt=""
                    width={1057}
                    height={1057}
                    priority
                />

                {/* Text Content */}
                <div className="relative z-10 w-[350px] h-auto text-center justify-start sm:w-[420px] md:w-[500px] lg:w-[700px] xl:w-[1014px] xl:h-[109px]">
                    <span className="text-[#6c6c6c] text-[32px] font-medium font-['Montserrat'] leading-[55px] sm:text-[34px] md:text-[36px] lg:text-[38px] xl:text-[40px]">
                        Let&apos;s build the{' '}
                        <br className="xl:hidden" />
                        future of IoT
                        <br className="hidden xl:inline" />
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] text-[32px] font-medium font-['Montserrat'] leading-[55px] sm:text-[34px] md:text-[36px] lg:text-[38px] xl:text-[40px]">
                        {' '}Together
                    </span>
                </div>
            </div>

            <Footer />
        </div>
    );
}