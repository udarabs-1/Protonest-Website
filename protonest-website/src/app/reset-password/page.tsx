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
        <div className="h-screen overflow-y-auto sm:overflow-hidden relative bg-gradient-to-br from-[#5530FA]/5 via-white to-[#F51DA5]/5 flex items-center justify-center px-4 py-4 sm:py-0">
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
                            Reset Your Password
                        </h1>
                    </div>

                    <div className="mb-6 text-[#949494] text-sm font-medium font-['Poppins']">
                        Enter a new password for your account.
                    </div>

                    <form className="space-y-4" onSubmit={handleResetPassword}>
                        <div className="w-full h-12 px-5 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-between">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-transparent text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="text-gray-400 cursor-pointer ml-2"
                            >
                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="w-full h-12 px-5 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-between">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-transparent text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 cursor-pointer ml-2"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
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
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
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