"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const MessageModal = ({
    message,
    onClose,
    type = 'error'
}: {
    message: string;
    onClose: () => void;
    type?: 'error' | 'success' | 'info';
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'info':
                return 'ℹ️';
            case 'error':
            default:
                return '⚠️';
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'success':
                return 'Success';
            case 'info':
                return 'Information';
            case 'error':
            default:
                return 'Notice';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <div className="text-center">
                    <div className="mb-4 text-4xl">{getIcon()}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Montserrat']">
                        {getTitle()}
                    </h3>
                    <p className="text-gray-600 mb-6 font-['Poppins']">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full h-12 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-[833px] h-auto bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] outline-1 outline-offset-[-1px] backdrop-blur-[20px] p-8 md:p-12 relative">
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-[80px] md:text-[120px] mb-6">📩</div>
                <div className="text-center text-[#6c6c6c] text-lg md:text-[25px] font-normal font-['Poppins'] leading-[30px] px-4">
                    We&apos;ve emailed you a secure link to reset your password
                </div>
                <Link
                    href="/signin"
                    className="mt-8 px-8 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200"
                >
                    Back to Sign In
                </Link>
            </div>
        </div>
    </div>
);

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'error' | 'success' | 'info'>('error');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setModalMessage('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {

                setShowSuccess(true);
            } else {

                if (response.status === 404) {

                    setModalType('error');
                    setModalMessage(data.error || 'No account found with this email address. Please check your email or sign up for a new account.');
                } else if (response.status === 400) {

                    setModalType('info');
                    setModalMessage(data.error || 'This account uses Google sign-in. Please use "Sign in with Google" to access your account.');
                } else {

                    setModalType('error');
                    setModalMessage(data.error || 'Failed to send reset email. Please try again.');
                }
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setModalType('error');
            setModalMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setModalMessage('');
    };

    return (
        <div className="h-screen overflow-y-auto sm:overflow-hidden relative bg-gradient-to-br from-[#5530FA]/5 via-white to-[#F51DA5]/5 flex items-center justify-center px-4 py-4 sm:py-0">
            {modalMessage && (
                <MessageModal
                    message={modalMessage}
                    onClose={closeModal}
                    type={modalType}
                />
            )}

            {showSuccess && (
                <SuccessModal />
            )}

            <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] bg-gradient-to-br from-[#5530FA]/15 to-[#F51DA5]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] bg-gradient-to-tl from-[#F51DA5]/15 to-[#6C9AE1]/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white rounded-[32px] shadow-2xl shadow-gray-200/60 px-8 sm:px-10 py-7 sm:py-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <div className="flex flex-col items-center mb-5">
                        <Link href="/">
                            <Image
                                src="/logo.webp"
                                alt="Protonest Logo"
                                width={112}
                                height={80}
                                priority
                                className="w-24 h-auto object-contain cursor-pointer"
                            />
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-medium font-['Montserrat'] leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">
                            Forgot Password?
                        </h1>
                    </div>

                    <div className="mb-6 text-[#949494] text-sm font-medium font-['Poppins']">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="w-full h-12 px-5 bg-gray-50 rounded-full border border-gray-200 flex items-center">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full bg-transparent text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none"
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs font-medium font-['Poppins']">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full cursor-pointer text-white text-sm font-semibold font-['Poppins'] hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center pt-2">
                            <Link href="/signin" className="text-[#5530FA] text-sm font-medium font-['Poppins'] hover:underline">
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}