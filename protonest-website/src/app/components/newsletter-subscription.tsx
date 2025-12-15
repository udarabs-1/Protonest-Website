'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { SubscriptionConfirmDialog, SubscriptionDialogStyles, SubscriptionMessageDialog } from './subscription-dialogs';

interface SubscriptionForm {
    name: string;
    email: string;
    career_updates: boolean;
    newsletter: boolean;
}

export default function NewsletterSubscription() {
    const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionForm>({
        name: '',
        email: '',
        career_updates: false,
        newsletter: true
    });

    const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [subscriptionMessage, setSubscriptionMessage] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showMessageDialog, setShowMessageDialog] = useState<'success' | 'error' | 'info' | null>(null);

    const handleSubscriptionSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmDialog(true);
    }, []);

    const confirmSubscription = useCallback(async () => {
        setShowConfirmDialog(false);
        setSubscriptionStatus('loading');
        setSubscriptionMessage('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: subscriptionForm.name,
                    email: subscriptionForm.email,
                    career_updates: subscriptionForm.career_updates,
                    newsletter: subscriptionForm.newsletter
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSubscriptionStatus('success');
                setSubscriptionMessage(data.message || 'Thank you for subscribing! You will receive updates in your inbox.');
                setShowMessageDialog('success');
                setSubscriptionForm({
                    name: '',
                    email: '',
                    career_updates: false,
                    newsletter: true
                });
            } else {
                setSubscriptionStatus('error');
                const message = data.message || 'Failed to subscribe. Please try again.';
                setSubscriptionMessage(message);

                if (message.toLowerCase().includes('already subscribed') || message.toLowerCase().includes('already exists')) {
                    setShowMessageDialog('info');
                } else {
                    setShowMessageDialog('error');
                }
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setSubscriptionStatus('error');
            setSubscriptionMessage('An error occurred. Please try again later.');
            setShowMessageDialog('error');
        }
    }, [subscriptionForm]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSubscriptionForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    return (
        <>
            <section className="mt-20 sm:mt-40 lg:mt-60 relative">
                <div className="flex flex-col items-start gap-12 sm:gap-16 lg:gap-24">
                    <div className="w-full lg:w-1/2 relative">
                        <h2 className="text-[#6c6c6c] text-xl md:text-[22px] lg:text-[26px] xl:text-3xl font-medium font-montserrat leading-[35px] sm:leading-[45px] lg:leading-[55px] max-w-[200px] md:max-w-none">
                            Stay Ahead in the IoT Space
                        </h2>

                        <div className="block lg:hidden absolute -top-40 right-0 -mr-4 sm:-mr-8">
                            <Image
                                src="/blogs-2-mobile.svg"
                                width={150}
                                height={150}
                                alt=""
                                className="opacity-80"
                                priority={false}
                                quality={85}
                                aria-hidden="true"
                            />
                        </div>

                        <p className="mt-4 text-[#6c6c6c] text-sm lg:text-[15px] xl:text-base font-normal font-poppins leading-[24px] sm:leading-[30px]">
                            Get the latest articles, insights, and stories delivered to your inbox.
                        </p>

                        <form onSubmit={handleSubscriptionSubmit} className="mt-6 sm:mt-8 space-y-8 sm:space-y-12 lg:space-y-16">
                            <div className="space-y-1">
                                <label htmlFor="newsletter-name" className="text-[#6c6c6c] text-base xl:text-lg xl:font-medium font-poppins leading-[30px]">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="newsletter-name"
                                    name="name"
                                    value={subscriptionForm.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter Your Name"
                                    required
                                    className="w-full border-b border-[#6c6c6c] py-2 text-[#6c6c6c] text-sm xl:text-base font-normal font-poppins leading-[30px] focus:outline-none focus:border-[#5530fa]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="newsletter-email" className="text-[#6c6c6c] text-base xl:text-lg xl:font-medium font-poppins leading-[30px]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="newsletter-email"
                                    name="email"
                                    value={subscriptionForm.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter Your Email"
                                    required
                                    className="w-full border-b border-[#6c6c6c] py-2 text-[#6c6c6c] text-sm xl:text-base font-normal font-poppins leading-[30px] focus:outline-none focus:border-[#5530fa]"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="career-updates"
                                    name="career_updates"
                                    checked={subscriptionForm.career_updates}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#5530fa] bg-gray-100 border-gray-300 rounded focus:ring-[#5530fa] focus:ring-2"
                                />
                                <label htmlFor="career-updates" className="text-[#6c6c6c] text-sm xl:text-base font-normal font-poppins leading-[24px] sm:leading-[30px]">
                                    I&apos;m interested in career updates too.
                                </label>
                            </div>

                            <div className="flex justify-start mt-8 sm:mt-12">
                                <button
                                    type="submit"
                                    disabled={subscriptionStatus === 'loading'}
                                    className="h-[50px] w-[160px] lg:w-[180px] lg:font-semibold text-[15px] xl:text-[16px] font-montserrat cursor-pointer text-white bg-gradient-to-r from-[rgba(85,48,250,1)] to-[rgba(245,29,165,1)] rounded-[57px] hover:from-[rgba(245,29,165,1)] hover:to-[rgba(85,48,250,1)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-opacity-50"
                                >
                                    {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="hidden lg:block absolute top-1/2 transform -translate-y-1/2 right-0 -mr-15 xl:-mr-32 2xl:-mr-45">
                    <Image
                        src="/blogs-2.svg"
                        width={600}
                        height={600}
                        alt=""
                        className="opacity-80"
                        priority={false}
                        quality={85}
                        aria-hidden="true"
                    />
                </div>
            </section>

            {typeof document !== 'undefined' && showConfirmDialog && createPortal(
                <SubscriptionConfirmDialog
                    name={subscriptionForm.name}
                    email={subscriptionForm.email}
                    onConfirm={confirmSubscription}
                    onCancel={() => setShowConfirmDialog(false)}
                />,
                document.body
            )}

            {typeof document !== 'undefined' && showMessageDialog && createPortal(
                <SubscriptionMessageDialog
                    type={showMessageDialog}
                    message={subscriptionMessage}
                    onClose={() => {
                        setShowMessageDialog(null);
                        setSubscriptionStatus('idle');
                    }}
                />,
                document.body
            )}

            <SubscriptionDialogStyles />
        </>
    );
}
