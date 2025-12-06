"use client";

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ResetPasswordContent() {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setError('Invalid reset link. Please request a new password reset.');
                setIsValidating(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/validate-reset-token?token=${token}`
                );

                const data = await response.json();

                if (response.ok && data.valid) {
                    setIsValidToken(true);
                } else {
                    setError('This reset link has expired or is invalid. Please request a new password reset.');
                }
            } catch (error) {
                console.error('Token validation error:', error);
                setError('Failed to validate reset link. Please try again.');
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/reset-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: token,
                        new_password: newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    router.push('/signin');
                }, 3000);
            } else {
                setError(data.error || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530fa] mx-auto"></div>
                    <p className="mt-4 text-[#6c6c6c] font-['Poppins']">Validating reset link...</p>
                </div>
            </div>
        );
    }

    if (!isValidToken && !isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="max-w-md w-full text-center">
                    <div className="text-6xl mb-6">⚠️</div>
                    <h1 className="text-2xl text-[#6c6c6c] font-medium font-['Montserrat'] mb-4">
                        Invalid Reset Link
                    </h1>
                    <p className="text-[#949494] font-['Poppins'] mb-8">
                        {error || 'This password reset link is invalid or has expired.'}
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200"
                    >
                        Request New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-[833px] h-auto bg-white/80 rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] outline-1 outline-offset-[-1px] backdrop-blur-[20px] p-8 md:p-12 relative">
                        <div className="flex flex-col items-center justify-center min-h-[300px]">
                            <div className="text-[80px] md:text-[120px] mb-6">✅</div>
                            <div className="text-center text-[#6c6c6c] text-lg md:text-[25px] font-normal font-['Poppins'] leading-[30px] px-4">
                                Your password has been reset successfully
                            </div>
                            <div className="text-center text-[#949494] text-base md:text-lg font-normal font-['Poppins'] mt-4">
                                Redirecting to sign in...
                            </div>
                        </div>
                    </div>
                </div>
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
                                    src="/logo.webp"
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
                                    Reset Your Password
                                </h1>
                            </div>

                            <div className="w-full mb-6 sm:mb-8 md:mb-10 text-[#949494] text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                Enter a new password for your account.
                            </div>

                            <form className="w-full space-y-4 sm:space-y-6" onSubmit={handleResetPassword}>
                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="text-gray-400"
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-400"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
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
                                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                </button>
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
                                            src="/logo.webp"
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
                                        Reset Your Password
                                    </h1>
                                </div>

                                <div className="mb-8 lg:mb-6 xl:mb-8 2xl:mb-10 text-[#949494] text-base lg:text-sm xl:text-base 2xl:text-lg font-medium font-['Poppins']">
                                    Enter a new password for your account.
                                </div>

                                <form className="max-w-2xl space-y-5 lg:space-y-4 xl:space-y-5 2xl:space-y-8" onSubmit={handleResetPassword}>
                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="text-gray-400"
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
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
                                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="flex items-stretch h-screen">
                            <div className="w-full p-6 lg:p-4 xl:p-6 2xl:p-10 flex">
                                <Image
                                    src="/login1.webp"
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

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530fa]"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}