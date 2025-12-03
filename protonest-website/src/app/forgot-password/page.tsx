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
        <div className="bg-white">
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

            
            <div className="block lg:hidden">
                <div className="relative w-full min-h-screen bg-white">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20">
                            <div className="w-full h-full bg-gradient-to-b from-white/0 to-white" />
                        </div>
                    </div>

                    <div className="relative z-10 pb-8">
                        <header className="pt-11 px-4 sm:px-8 md:px-16">
                            <Link href="/">
                                <Image
                                    src="/logo.png"
                                    alt="Protonest Logo"
                                    width={112}
                                    height={80}
                                    priority
                                    className="w-25 sm:w-30 md:w-35 object-contain cursor-pointer"
                                />
                            </Link>
                        </header>

                        <main className="px-4 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-24">
                            <div className="w-full mb-8 sm:mb-12 md:mb-16">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#6c6c6c] font-medium font-['Montserrat'] leading-tight">
                                    Forgot Password?
                                </h1>
                            </div>

                            <div className="w-full mb-6 sm:mb-8 md:mb-10 text-[#949494] text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </div>

                            <form className="w-full space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError('');
                                        }}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                        disabled={isLoading}
                                    />
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 sm:h-16 md:h-18 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-base sm:text-lg md:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>

                                <div className="text-center mt-6">
                                    <Link href="/signin" className="text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] hover:text-gray-800">
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        </main>
                    </div>
                </div>
            </div>

            
            <div className="hidden lg:block">
                <div className="relative w-full min-h-screen bg-white">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20">
                            <div className="w-full h-full bg-gradient-to-b from-white/0 to-white" />
                        </div>
                    </div>

                    <div className="relative z-10 min-h-screen grid lg:grid-cols-[3fr_2fr] xl:grid-cols-[3fr_2fr] 2xl:grid-cols-[1fr_1fr]">
                        <div className="flex flex-col justify-center min-h-screen">
                            <div className="lg:pl-16 xl:pl-24 2xl:pl-32 py-8">
                                <header className="mb-8 lg:mb-6 xl:mb-8 2xl:mb-12">
                                    <Link href="/">
                                        <Image
                                            src="/logo.png"
                                            alt="Protonest Logo"
                                            width={112}
                                            height={80}
                                            priority
                                            className="w-20 h-16 lg:w-22 lg:h-17 xl:w-28 xl:h-18 2xl:w-28 2xl:h-20 object-contain cursor-pointer"
                                        />
                                    </Link>
                                </header>

                                <div className="mb-6 lg:mb-4 xl:mb-6 2xl:mb-8">
                                    <h1 className="text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#6c6c6c] font-medium font-['Montserrat'] leading-tight">
                                        Forgot Password?
                                    </h1>
                                </div>

                                <div className="mb-8 lg:mb-6 xl:mb-8 2xl:mb-10 text-[#949494] text-base lg:text-sm xl:text-base 2xl:text-lg font-medium font-['Poppins']">
                                    Enter your email address and we&apos;ll send you a link to reset your password.
                                </div>

                                <form className="max-w-2xl space-y-5 lg:space-y-4 xl:space-y-5 2xl:space-y-8" onSubmit={handleSubmit}>
                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError('');
                                            }}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-base lg:text-sm xl:text-base 2xl:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                                    </button>

                                    <div className="text-center mt-6">
                                        <Link href="/signin" className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] hover:text-gray-800">
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="flex items-stretch h-screen">
                            <div className="w-full p-6 lg:p-4 xl:p-6 2xl:p-10 flex">
                                <Image
                                    src="/login1.svg"
                                    alt="Welcome illustration"
                                    width={800}
                                    height={600}
                                    priority
                                    className="w-full h-full object-cover rounded-tr-[67px] rounded-tl-[67px] rounded-br-[67px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}