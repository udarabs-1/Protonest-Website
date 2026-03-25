'use client';

import Image from 'next/image';

interface PageHeroProps {
    backgroundImage?: string;
    backgroundImageMobile?: string;
    heading: {
        beforeGradient?: string;
        gradientText: string;
        afterGradient?: string;
    };
    description?: string | React.ReactNode;
    height?: string;
    paddingTop?: boolean;
}

export default function PageHero({
    backgroundImage,
    backgroundImageMobile,
    heading,
    description,
    height = 'h-[400px] sm:h-[480px] lg:h-[553px]',
    paddingTop = false
}: PageHeroProps) {
    return (
        <section className={`${height} relative ${paddingTop ? 'pt-20' : ''}`}>
            {backgroundImage && (
                <>
                    <div className="absolute inset-0 z-0">
                        {backgroundImageMobile ? (
                            <>
                                <div className="absolute inset-0 block sm:hidden">
                                    <Image
                                        src={backgroundImageMobile}
                                        alt=""
                                        fill
                                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                                        priority={true}
                                        quality={100}
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="absolute inset-0 hidden sm:block">
                                    <Image
                                        src={backgroundImage}
                                        alt=""
                                        fill
                                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                                        priority={true}
                                        quality={100}
                                        aria-hidden="true"
                                    />
                                </div>
                            </>
                        ) : (
                            <Image
                                src={backgroundImage}
                                alt=""
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                                priority={true}
                                quality={100}
                                aria-hidden="true"
                            />
                        )}
                    </div>

                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10"></div>
                </>
            )}

            <div className={`${paddingTop ? '' : 'pt-20'} relative z-20 flex flex-col items-center justify-start h-full px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px]`}>
                <div className="flex flex-col items-center">
                    <h1 className="text-center text-[28px] sm:text-[32px] lg:text-[38px] xl:text-[45px] font-medium font-montserrat">
                        {heading.beforeGradient && (
                            <>
                                <span className="text-[#6c6c6c]">{heading.beforeGradient}</span>
                                <br />
                            </>
                        )}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(85,48,250,1)] via-[rgba(245,29,165,1)] to-[rgba(108,154,225,1)]">
                            {heading.gradientText}
                        </span>
                        {heading.afterGradient && (
                            <>
                                <br />
                                <span className="text-[#6c6c6c]">{heading.afterGradient}</span>
                            </>
                        )}
                    </h1>
                    {description && (
                        <p className="text-center text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] font-normal font-montserrat mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-12 md:px-20 lg:px-auto text-[rgba(108,108,108,1)]">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
