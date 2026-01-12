"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UnsubscribePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [subscriberInfo, setSubscriberInfo] = useState<{ email: string; name: string; newsletter: boolean } | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [unsubscribing, setUnsubscribing] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setError('Invalid unsubscribe link');
            setLoading(false);
            return;
        }

        fetchSubscriberInfo(token);
    }, [searchParams]);

    const fetchSubscriberInfo = async (token: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/unsubscribe?token=${token}`);
            const data = await response.json();

            if (data.status === 'success') {
                setSubscriberInfo(data.data);
            } else {
                setError(data.message || 'Invalid or expired link');
            }
        } catch (err) {
            setError('Failed to load subscription information');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        const token = searchParams.get('token');
        if (!token) return;

        setUnsubscribing(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/unsubscribe/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                setSuccess(true);
            } else {
                setError(data.message || 'Failed to unsubscribe');
            }
        } catch (err) {
            setError('Failed to unsubscribe. Please try again.');
        } finally {
            setUnsubscribing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-montserrat">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-montserrat p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">Successfully Unsubscribed</h1>
                    <p className="text-gray-600 mb-6">
                        You have been successfully unsubscribed from Protonest newsletters. You will no longer receive monthly updates.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-montserrat p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    if (subscriberInfo && !subscriberInfo.newsletter) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-montserrat p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">Already Unsubscribed</h1>
                    <p className="text-gray-600 mb-6">
                        You are already unsubscribed from Protonest newsletters.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-gradient-to-l from-[#5530FA] to-[#F51DA5] text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-montserrat p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">Unsubscribe from Newsletter?</h1>
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to unsubscribe from Protonest newsletters?
                    </p>
                    {subscriberInfo && (
                        <p className="text-sm text-gray-500 mb-6">
                            Email: <span className="font-medium">{subscriberInfo.email}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleUnsubscribe}
                        disabled={unsubscribing}
                        className="w-full px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {unsubscribing ? 'Unsubscribing...' : 'Yes, Unsubscribe'}
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        disabled={unsubscribing}
                        className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
