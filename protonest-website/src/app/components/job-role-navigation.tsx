'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';

export const JOB_ROLES = [
    { icon: 'solar:monitor-outline', title: 'Front-End', slug: 'front-end' },
    { icon: 'solar:server-outline', title: 'Back-End', slug: 'back-end' },
    { icon: 'solar:layers-minimalistic-outline', title: 'Full-Stack', slug: 'full-stack' },
    { icon: 'solar:cpu-outline', title: 'Electronics', slug: 'electronics' },
    { icon: 'solar:palette-outline', title: 'UI/UX\nDesigning', slug: 'ui-ux-designing' },
    { icon: 'solar:settings-outline', title: 'Mechanical', slug: 'mechanical' },
    { icon: 'solar:code-2-outline', title: 'Embedded\nFirmware', slug: 'embedded-firmware' },
    { icon: 'solar:shield-check-outline', title: 'Quality\nAssurance', slug: 'quality-assurance' },
    { icon: 'solar:user-plus-outline', title: 'Other Roles', slug: 'other-roles' }
] as const;

type JobRoleNavigationProps = {
    activeRole?: string;
    className?: string;
};

export default function JobRoleNavigation({
    activeRole,
    className = ''
}: JobRoleNavigationProps) {
    return (
        <nav aria-label="Job categories" className={className}>
            <style jsx global>{`
                .job-role-icon svg {
                    width: 100%;
                    height: 100%;
                }

                .job-role-icon:not(.job-role-icon-active) svg path,
                .job-role-icon:not(.job-role-icon-active) svg circle,
                .job-role-icon:not(.job-role-icon-active) svg rect,
                .job-role-icon:not(.job-role-icon-active) svg polygon {
                    fill: url(#job-role-icon-gradient) !important;
                }

                .job-role-link:hover .job-role-icon svg path,
                .job-role-link:hover .job-role-icon svg circle,
                .job-role-link:hover .job-role-icon svg rect,
                .job-role-link:hover .job-role-icon svg polygon {
                    fill: white !important;
                }
            `}</style>

            <svg width="0" height="0" aria-hidden="true" className="absolute">
                <defs>
                    <linearGradient id="job-role-icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#5530FA" />
                        <stop offset="100%" stopColor="#F51DA5" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full">
                {JOB_ROLES.map((role) => {
                    const isActive = role.slug === activeRole;

                    return (
                        <Link
                            key={role.slug}
                            href={`/jobs/${role.slug}`}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`${isActive ? 'Currently viewing' : 'View'} ${role.title.replace('\n', ' ')} positions`}
                            className={`job-role-link h-14 xl:h-[65.89px] min-w-[140px] xl:min-w-[160px] px-3 sm:px-6 py-2 sm:py-4 rounded-full xl:rounded-[57px] border flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-offset-2 ${
                                isActive
                                    ? 'border-transparent bg-gradient-to-r from-[#F51DA5] to-[#5530FA] shadow-[0_8px_22px_rgba(85,48,250,0.22)]'
                                    : 'gradient-button-static-3 hover:bg-gradient-to-r hover:from-[#F51DA5] hover:to-[#5530FA]'
                            }`}
                        >
                            <span className="flex items-center justify-center gap-1.5 sm:gap-2.5 min-w-0">
                                <span className={`job-role-icon w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'job-role-icon-active text-white' : ''}`}>
                                    <Icon icon={role.icon} className="w-full h-full" />
                                </span>
                                <span className={`text-xs sm:text-base font-medium font-['Montserrat'] whitespace-pre-line leading-tight overflow-hidden text-center transition-colors ${isActive ? 'text-white' : 'text-[#6c6c6c] group-hover:text-white'}`}>
                                    {role.title}
                                </span>
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
