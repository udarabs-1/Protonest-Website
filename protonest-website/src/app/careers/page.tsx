'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import Blogs from '../components/blogs';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import PageHero from '../components/page-hero';

const RoleCard = ({ role, onClick }: {
    role: { icon: string; title: string; slug: string };
    onClick: (slug: string) => void;
}) => {
    const handleClick = useCallback(() => {
        onClick(role.slug);
    }, [onClick, role.slug]);

    return (
        <button
            onClick={handleClick}
            className="h-14 xl:h-[65.89px] min-w-[140px] xl:min-w-[160px] px-3 sm:px-6 py-2 sm:py-4 rounded-full xl:rounded-[57px] border gradient-button-static-3 flex items-center justify-center hover:bg-gradient-to-r hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] gap-1 sm:gap-2 transition-colors cursor-pointer group"
            aria-label={`View ${role.title} positions`}
        >
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0 gradient-icon-default group-hover:scale-110 transition-all duration-300">
                    <Icon
                        icon={role.icon}
                        className="w-full h-full group-hover:text-white"
                    />
                </div>
                <div className="text-xs sm:text-base text-[#6c6c6c] font-medium font-['Montserrat'] group-hover:text-white whitespace-pre-line leading-tight overflow-hidden text-center">
                    {role.title}
                </div>
            </div>
        </button>
    );
};

export default function CareersPage() {
    const router = useRouter();

    const roles = useMemo(() => [
        { icon: 'solar:monitor-outline', title: 'Front-End', slug: 'front-end' },
        { icon: 'solar:server-outline', title: 'Back-End', slug: 'back-end' },
        { icon: 'solar:cpu-outline', title: 'Electronics', slug: 'electronics' },
        { icon: 'solar:palette-outline', title: 'UI/UX\nDesigning', slug: 'ui-ux-designing' },
        { icon: 'solar:settings-outline', title: 'Mechanical', slug: 'mechanical' },
        { icon: 'solar:code-2-outline', title: 'Embedded\nFirmware', slug: 'embedded-firmware' },
        { icon: 'solar:shield-check-outline', title: 'Quality\nAssurance', slug: 'quality-assurance' },
        { icon: 'solar:user-plus-outline', title: 'Other Roles', slug: 'other-roles' }
    ], []);

    const handleRoleClick = useCallback((slug: string) => {
        router.push(`/jobs/${slug}`);
    }, [router]);

    return (
        <div className="min-h-screen relative">
            <style jsx global>{`
                .gradient-icon-default svg {
                    width: 100%;
                    height: 100%;
                }
                
                .gradient-icon-default svg path {
                    fill: url(#icon-gradient-default) !important;
                }
                
                .gradient-icon-default svg circle {
                    fill: url(#icon-gradient-default) !important;
                }
                
                .gradient-icon-default svg rect {
                    fill: url(#icon-gradient-default) !important;
                }
                
                .gradient-icon-default svg polygon {
                    fill: url(#icon-gradient-default) !important;
                }

                .group:hover .gradient-icon-default svg path {
                    fill: white !important;
                }
                
                .group:hover .gradient-icon-default svg circle {
                    fill: white !important;
                }
                
                .group:hover .gradient-icon-default svg rect {
                    fill: white !important;
                }
                
                .group:hover .gradient-icon-default svg polygon {
                    fill: white !important;
                }


            `}</style>


            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="icon-gradient-default" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#5530FA" />
                        <stop offset="100%" stopColor="#F51DA5" />
                    </linearGradient>
                </defs>
            </svg>

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


                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 xl:gap-6 px-2 sm:px-4 lg:px-8 xl:px-[60px] mb-6 sm:mb-8 lg:mb-10 w-full max-w-4xl xl:max-w-[1127px]">
                        {roles.map((role, index) => (
                            <RoleCard
                                key={`${role.slug}-${index}`}
                                role={role}
                                onClick={handleRoleClick}
                            />
                        ))}
                    </div>
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

            <Blogs />


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