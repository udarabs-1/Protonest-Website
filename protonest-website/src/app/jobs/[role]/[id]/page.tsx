'use client';

import Footer from '@/app/components/footer';
import Navbar from '@/app/components/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Types
type Job = {
    id: number;
    title: string;
    location: string;
    posted: string;
    type: string;
    deadline: string;
    experience: string;
    category: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    overview: string;
};

type JobData = {
    [key: string]: Job[];
};

// Mock job data for each role
const jobData: JobData = {
    'front-end': [
        {
            id: 1,
            title: 'Senior Frontend Developer',
            location: 'Remote',
            posted: '1 day ago',
            type: 'Full Time',
            deadline: 'Oct 3, 2025',
            experience: 'Intermediate',
            category: 'Front-End Development',
            description: 'Protonest is seeking a skilled freelance Frontend Developer to help us build innovative web applications.',
            responsibilities: [
                'Develop and optimize user interfaces for web applications',
                'Collaborate with UI/UX designers to implement responsive designs',
                'Write clean, maintainable code using modern frameworks',
                'Participate in code reviews and team meetings',
                'Debug and resolve technical issues'
            ],
            requirements: [
                'Strong proficiency in JavaScript, HTML, and CSS',
                'Experience with React, Vue, or Angular frameworks',
                'Familiarity with state management solutions',
                'Knowledge of version control tools (Git preferred)',
                'Ability to work independently and in collaborative team environments'
            ],
            overview: 'You\'ll collaborate with our design and back-end teams to create seamless user experiences.'
        },
        {
            id: 2,
            title: 'Junior Frontend Developer',
            location: 'On-Site',
            posted: '3 days ago',
            type: 'Full Time',
            deadline: 'Oct 10, 2025',
            experience: 'Beginner',
            category: 'Front-End Development',
            description: 'Great opportunity for a junior developer to grow their skills in a supportive environment.',
            responsibilities: [
                'Assist in developing user interfaces',
                'Learn and apply best practices in frontend development',
                'Collaborate with senior developers on projects',
                'Participate in training and skill development sessions'
            ],
            requirements: [
                'Basic knowledge of HTML, CSS, and JavaScript',
                'Willingness to learn modern frameworks',
                'Good communication skills',
                'Team player attitude'
            ],
            overview: 'Perfect role for someone starting their career in frontend development.'
        },
        {
            id: 3,
            title: 'React Developer',
            location: 'Hybrid',
            posted: '5 days ago',
            type: 'Project Based',
            deadline: 'Oct 15, 2025',
            experience: 'Moderate',
            category: 'Front-End Development',
            description: 'Looking for a React specialist to work on a specific project with our team.',
            responsibilities: [
                'Develop React components and features',
                'Optimize application performance',
                'Integrate with backend APIs',
                'Write unit tests for components'
            ],
            requirements: [
                'Strong proficiency in React.js',
                'Experience with state management (Redux, Context API)',
                'Knowledge of modern React features (Hooks, etc.)',
                'Familiarity with testing frameworks'
            ],
            overview: 'Project-based role with potential for extension based on performance.'
        }
    ],
    'electronics': [
        {
            id: 1,
            title: 'Freelance Firmware Engineer',
            location: 'Remote',
            posted: 'Yesterday',
            type: 'Contract',
            deadline: '03.08.2025',
            experience: 'Expert',
            category: 'Electronics / PCB & Firmware',
            description: 'Protonest is seeking a skilled freelance Firmware Engineer to help us build innovative IoT prototypes.',
            responsibilities: [
                'Develop and optimize firmware for connected IoT devices',
                'Collaborate with PCB and hardware teams on system integration',
                'Test, debug, and validate embedded systems',
                'Participate in project scoping and milestone setting',
                'Document firmware architecture and coding standards'
            ],
            requirements: [
                'Strong proficiency in C/C++ for embedded systems',
                'Experience with microcontrollers (e.g., STM32, ESP32, Arduino)',
                'Familiarity with IoT communication protocols (BLE, WiFi, LoRa)',
                'Knowledge of version control tools (Git preferred)',
                'Ability to work independently and in collaborative team environments',
                '(Bonus) Experience with PCB design tools or rapid prototyping'
            ],
            overview: 'You\'ll collaborate with our electronics and back-end teams to bring connected devices to life.'
        }
    ],
    // ... other roles with their respective jobs
};

export default function JobDetailPage() {
    const params = useParams();
    const { role, id } = params;

    const [job, setJob] = useState<Job | null>(null);
    const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (role && id) {
            const roleKey = Array.isArray(role) ? role[0] : role;
            const jobId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);

            const jobsInCategory = jobData[roleKey] || [];
            const foundJob = jobsInCategory.find(j => j.id === jobId);

            if (foundJob) {
                setJob(foundJob);

                // Get similar jobs (excluding the current one)
                const similar = jobsInCategory
                    .filter(j => j.id !== jobId)
                    .slice(0, 2); // Show only 2 similar jobs

                setSimilarJobs(similar);
            }
        }
    }, [role, id]);

    if (!job) {
        return (
            <div className="min-h-screen relative bg-white overflow-x-hidden">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <p className="text-gray-600 text-lg">Job not found.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-white overflow-x-hidden">
            <Navbar />

            <div className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-8 lg:py-12">
                {/* Job Title and Menu */}
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-[#6c6c6c] text-[20px] sm:text-[24px] lg:text-[26px] xl:text-3xl font-medium font-montserrat">
                        {job.title}
                    </h1>

                    {/* Three dots menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-[#6c6c6c] text-2xl md:p-2"
                        >
                            &#8942;
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10">
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-[#6c6c6c] hover:bg-gray-100 font-poppins"
                                    onClick={() => setShowMenu(false)}
                                >
                                    Save Job
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category and Posted Date */}
                <div className="items-center gap-8 mb-6">
                    <div className="text-[#6c6c6c] text-base font-normal font-poppins mb-2">
                        <span>Category: </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)]">{job.category}</span>
                    </div>
                    <div className="text-[#6c6c6c] text-xs font-light font-poppins">
                        Posted {job.posted}
                    </div>
                </div>

                {/* Job Details - Job Type, Location, Deadline, Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">✍️</div>
                        <div>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins">{job.type}</div>
                            <div className="text-[#6c6c6c] text-base font-normal font-poppins">Job Type</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-4xl">📍</div>
                        <div>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins">{job.location}</div>
                            <div className="text-[#6c6c6c] text-base font-normal font-poppins">Location</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-4xl">⏳</div>
                        <div>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins">{job.deadline}</div>
                            <div className="text-[#6c6c6c] text-base font-normal font-poppins">Application Deadline</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-4xl">📝</div>
                        <div>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins">{job.experience}</div>
                            <div className="text-[#6c6c6c] text-base font-normal font-poppins">Experience Level</div>
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="mb-8">
                    <p className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                        {job.description} {job.overview}
                    </p>
                </div>

                {/* What You'll Be Doing */}
                <div className="mb-8">
                    <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What You&apos;ll Be Doing</h2>
                    <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                        {job.responsibilities.map((item, index) => (
                            <div key={index} className="mb-2">• {item}</div>
                        ))}
                    </div>
                </div>

                {/* What We're Looking For */}
                <div className="mb-8">
                    <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What We&apos;re Looking For</h2>
                    <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                        {job.requirements.map((item, index) => (
                            <div key={index} className="mb-2">• {item}</div>
                        ))}
                    </div>
                </div>

                {/* Sign in & Apply Button */}
                <div className="mb-6">
                    <button className="bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] hover:cursor-pointer rounded-[57px] py-3 px-8 text-white text-base font-semibold font-montserrat">
                        Sign in & Apply
                    </button>
                </div>

                {/* Sign up prompt */}
                <div className="mb-12">
                    <p className="text-[#6c6c6c] text-base font-normal font-poppins">
                        If you do not already have an account,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] underline cursor-pointer">Sign up to apply</span>
                    </p>
                </div>

                {/* Similar Jobs Section */}
                <div className="pt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[#6c6c6c] text-2xl font-medium font-montserrat">Explore similar jobs on Protonest</h2>
                        <Link
                            href={`/jobs/${role}`}
                            className="text-[#6c6c6c] text-base font-poppins flex items-center hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:to-[rgba(85,48,250,1)] hover:from-[rgba(245,29,165,1)]"
                        >
                            View more
                            <span className="ml-2 text-xl">&gt;</span>
                        </Link>
                    </div>

                    {similarJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {similarJobs.map(similarJob => (
                                <Link
                                    key={similarJob.id}
                                    href={`/jobs/${role}/${similarJob.id}`}
                                    className="group relative w-full bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-[10px_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] overflow-hidden px-6 py-12 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between">
                                        <div className="w-3/4">
                                            <h3 className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] text-base font-poppins leading-tight mb-2 text-[#6c6c6c] font-normal">
                                                {similarJob.title}
                                            </h3>
                                            <p className="text-[9px] font-poppins text-[#6c6c6c] mb-4">
                                                {similarJob.location} ‐ Posted {similarJob.posted}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <p className="text-xs font-medium font-poppins text-[#6c6c6c]">{similarJob.type}</p>
                                            <p className="text-[9px] font-poppins text-[#6c6c6c]">Job Type</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium font-poppins text-[#6c6c6c]">{similarJob.deadline}</p>
                                            <p className="text-[9px] font-poppins text-[#6c6c6c]">Application deadline</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium font-poppins text-[#6c6c6c]">{similarJob.experience}</p>
                                            <p className="text-[9px] font-poppins text-[#6c6c6c]">Experience level</p>
                                        </div>
                                    </div>

                                    {/* Arrow Image Swap on Hover */}
                                    <div className="absolute right-6 top-6 w-[60px] h-[60px] group-hover:w-[70px] group-hover:h-[70px] transition-all duration-300">
                                        {/* Default Arrow */}
                                        <div className="w-full h-full group-hover:hidden">
                                            <Image
                                                src="/upleft.svg"
                                                alt="Arrow"
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {/* Hover Arrow */}
                                        <div className="hidden w-full h-full group-hover:block">
                                            <Image
                                                src="/upleft-hover.svg"
                                                alt="Hover Arrow"
                                                width={50}
                                                height={50}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>

                                    <button className="w-full bg-gradient-to-l from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] py-3 text-white text-sm font-semibold font-montserrat text-center group-hover:from-[rgba(245,29,165,1)] group-hover:to-[rgba(85,48,250,1)] transition-all duration-300">
                                        View Details
                                    </button>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No similar jobs found in this category.</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}