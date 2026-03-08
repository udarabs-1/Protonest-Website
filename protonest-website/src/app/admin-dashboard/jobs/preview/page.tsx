'use client';

import Footer from '@/app/components/footer';
import Navbar from '@/app/components/navbar';
import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';

export default function JobPreviewPage() {
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const previewData = sessionStorage.getItem('jobPreviewData');
        if (previewData) {
            try {
                const parsed = JSON.parse(previewData);
                // Map the form data to the format expected by the UI
                const jobData = {
                    title: parsed.title || 'Untitled Job',
                    location: parsed.location || 'Not specified',
                    posted: 'Just now',
                    type: parsed.type || 'full-time',
                    deadline: parsed.deadline ? new Date(parsed.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline',
                    experience: parsed.experience || 'Not specified',
                    category: parsed.category || 'Not specified',
                    description: parsed.description || 'No description provided.',
                    responsibilities: typeof parsed.responsibilities === 'string'
                        ? parsed.responsibilities.split('\n').filter((l: string) => l.trim())
                        : (parsed.responsibilities || []),
                    requirements: typeof parsed.requirements === 'string'
                        ? parsed.requirements.split('\n').filter((l: string) => l.trim())
                        : (parsed.requirements || []),
                    what_you_will_get: typeof parsed.what_you_will_get === 'string'
                        ? parsed.what_you_will_get.split('\n').filter((l: string) => l.trim())
                        : (parsed.what_you_will_get || []),
                    nice_to_have: typeof parsed.nice_to_have === 'string'
                        ? parsed.nice_to_have.split('\n').filter((l: string) => l.trim())
                        : (parsed.nice_to_have || []),
                };
                setJob(jobData);
            } catch (err) {
                console.error("Error parsing preview data", err);
                setError('Invalid preview data');
            }
        } else {
            setError('No job data to preview. Please return to the editor and click Preview again.');
        }
        setLoading(false);
    }, []);

    const jobDetailItems = useMemo(() => [
        { icon: 'solar:document-outline', value: job?.type.replace('-', ' '), label: 'Job Type' },
        { icon: 'solar:map-point-wave-outline', value: job?.location, label: 'Location' },
        { icon: 'solar:calendar-outline', value: job?.deadline, label: 'Application Deadline' },
        { icon: 'solar:graph-new-up-outline', value: job?.experience, label: 'Experience Level' }
    ], [job]);

    if (loading) {
        return (
            <div className="min-h-screen relative bg-white overflow-x-hidden">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading preview...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen relative bg-white overflow-x-hidden">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview Not Available</h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        {error}
                    </p>
                    <button
                        onClick={() => window.close()}
                        className="inline-block bg-gradient-to-r from-[#5530fa] to-[#f51da5] text-white px-8 py-3 rounded-[57px] font-semibold hover:opacity-90 transition-opacity"
                    >
                        Close Preview
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-white overflow-x-hidden">
            <style jsx global>{`
                .gradient-icon svg {
                    width: 100%;
                    height: 100%;
                }
                
                .gradient-icon svg path {
                    fill: url(#icon-gradient) !important;
                }
                
                .gradient-icon svg circle {
                    fill: url(#icon-gradient) !important;
                }
                
                .gradient-icon svg rect {
                    fill: url(#icon-gradient) !important;
                }
                
                .gradient-icon svg polygon {
                    fill: url(#icon-gradient) !important;
                }

                .gradient-border {
                    border-image: linear-gradient(to bottom, #4520E0, #D01888) 1;
                }
                
                .preview-banner {
                    background: repeating-linear-gradient(
                      45deg,
                      #ffeb3b,
                      #ffeb3b 10px,
                      #fbc02d 10px,
                      #fbc02d 20px
                    );
                    color: black;
                    text-align: center;
                    font-weight: bold;
                    padding: 8px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    z-index: 1000;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
            `}</style>

            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4520E0" />
                        <stop offset="100%" stopColor="#D01888" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="preview-banner">
                Preview Mode - This is exactly how the job will appear to applicants
            </div>

            <Navbar />

            <main className="px-4 sm:px-8 lg:px-[60px] xl:px-[133px] 2xl:px-[180px] py-8 lg:py-12">

                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-[#6c6c6c] text-[20px] sm:text-[24px] lg:text-[26px] xl:text-3xl font-medium font-montserrat flex-1 pr-4">
                        {job.title}
                    </h1>

                    <div className="flex gap-3 items-center">
                        <button
                            className="text-3xl md:text-4xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 rounded"
                            title="Save job (Disabled in preview)"
                        >
                            <div className="w-8 h-8 text-gray-400 hover:text-transparent hover:scale-110 transition-all">
                                <Icon icon="solar:heart-outline" className="w-full h-full" />
                            </div>
                        </button>
                    </div>
                </div>

                <div className="items-center gap-8 mb-6">
                    <div className="text-[#6c6c6c] text-base font-normal font-poppins mb-2">
                        <span>Category: </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)]">{job.category}</span>
                    </div>
                    <div className="text-[#6c6c6c] text-xs font-light font-poppins">
                        Posted {job.posted}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {jobDetailItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 gradient-icon">
                                <Icon
                                    icon={item.icon}
                                    className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5]"
                                />
                            </div>
                            <div>
                                <div className="text-transparent bg-clip-text bg-gradient-to-r to-[rgba(85,48,250,1)] from-[rgba(245,29,165,1)] text-lg font-medium font-poppins capitalize">
                                    {item.value}
                                </div>
                                <div className="text-[#6c6c6c] text-base font-normal font-poppins">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <section className="mb-8">
                    <p className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed whitespace-pre-wrap">
                        {job.description}
                    </p>
                </section>

                {job.responsibilities && job.responsibilities.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What You&apos;ll Be Doing</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.responsibilities.map((item: string, index: number) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </section>
                )}

                {job.requirements && job.requirements.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What We&apos;re Looking For</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.requirements.map((item: string, index: number) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </section>
                )}

                {job.nice_to_have && job.nice_to_have.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">Nice to Have</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.nice_to_have.map((item: string, index: number) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </section>
                )}

                {job.what_you_will_get && job.what_you_will_get.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[#6c6c6c] text-xl font-medium font-poppins mb-4">What You&apos;ll Get</h2>
                        <div className="text-[#6c6c6c] text-base font-normal font-poppins leading-relaxed">
                            {job.what_you_will_get.map((item: string, index: number) => (
                                <div key={index} className="mb-2">• {item}</div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mb-6">
                    <div className="flex flex-wrap gap-4">
                        <button
                            className="bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] rounded-[57px] py-3 px-8 text-white text-base font-semibold font-montserrat focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50 transition-all opacity-90"
                            onClick={() => alert('This is a preview. Application functionality is disabled.')}
                        >
                            Apply (Disabled in preview)
                        </button>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 flex justify-center">
                    <button
                        onClick={() => window.close()}
                        className="px-8 py-3 rounded-[57px] border-2 border-gray-300 text-[#6c6c6c] text-base font-semibold font-montserrat hover:bg-gray-50 transition-colors"
                    >
                        Close Preview
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
