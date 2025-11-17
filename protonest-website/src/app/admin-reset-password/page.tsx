"use client";

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function AdminResetPasswordContent() {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setError('Invalid reset link');
                setValidatingToken(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/validate-reset-token?token=${token}`
                );
                const data = await response.json();

                if (response.ok && data.valid) {
                    setTokenValid(true);
                } else {
                    setError('This reset link is invalid or has expired. Please request a new one.');
                }
            } catch (err) {
                console.error('Token validation error:', err);
                setError('Failed to validate reset link. Please try again.');
            } finally {
                setValidatingToken(false);
            }
        };

        validateToken();
    }, [token]);

    const handleResetPassword = async () => {
        setError('');

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/reset-password`,
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

            if (response.ok && data.success) {
                alert('Password reset successfully! You can now sign in with your new password.');
                router.push('/admin-signin');
            } else {
                setError(data.error || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleResetPassword();
        }
    };

    if (validatingToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto mb-4"></div>
                    <p className="text-gray-600">Validating reset link...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center max-w-md mx-4">
                    <div className="mb-4">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Invalid Reset Link</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/admin-forgot-password')}
                            className="px-6 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                        >
                            Request New Reset Link
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Mobile/Tablet Layout */}
            <div className="block lg:hidden">
                <div className="relative w-full min-h-screen bg-white">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20">
                            <div className="w-full h-full bg-gradient-to-b from-white/0 to-white" />
                        </div>
                    </div>

                    <div className="relative z-10 pb-8">
                        <div className="pt-11 px-4 sm:px-8 md:px-16">
                            <Image
                                src="/logo.png"
                                alt="Protonest Logo"
                                width={112}
                                height={80}
                                priority
                                className="w-25 sm:w-30 md:w-35 object-contain"
                            />
                        </div>

                        <div className="px-4 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-24">
                            <div className="w-full mb-8 sm:mb-12 md:mb-16">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#6c6c6c] font-medium font-['Montserrat'] leading-tight">
                                    Reset Your Admin Password
                                </h1>
                            </div>

                            <div className="w-full mb-6 sm:mb-8 md:mb-10 text-[#949494] text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                Enter a new password for your admin account.
                            </div>

                            <div className="w-full space-y-4 sm:space-y-6">
                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] border border-gray-300 backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={isLoading}
                                        className="w-full bg-transparent text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="text-gray-400"
                                        disabled={isLoading}
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] border border-gray-300 backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={isLoading}
                                        className="w-full bg-transparent text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-400"
                                        disabled={isLoading}
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
                                    onClick={handleResetPassword}
                                    disabled={isLoading}
                                    className="w-full h-14 sm:h-16 md:h-18 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-base sm:text-lg md:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
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
                                <div className="mb-8 lg:mb-6 xl:mb-8 2xl:mb-12">
                                    <Image
                                        src="/logo.png"
                                        alt="Protonest Logo"
                                        width={112}
                                        height={80}
                                        priority
                                        className="w-20 h-16 lg:w-22 lg:h-17 xl:w-28 xl:h-18 2xl:w-28 2xl:h-20 object-contain"
                                    />
                                </div>

                                <div className="mb-6 lg:mb-4 xl:mb-6 2xl:mb-8">
                                    <h1 className="text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#6c6c6c] font-medium font-['Montserrat'] leading-tight">
                                        Reset Your Admin Password
                                    </h1>
                                </div>

                                <div className="mb-8 lg:mb-6 xl:mb-8 2xl:mb-10 text-[#949494] text-base lg:text-sm xl:text-base 2xl:text-lg font-medium font-['Poppins']">
                                    Enter a new password for your admin account.
                                </div>

                                <div className="max-w-2xl space-y-5 lg:space-y-4 xl:space-y-5 2xl:space-y-8">
                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] border border-gray-300 backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled={isLoading}
                                            className="w-full bg-transparent text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none disabled:opacity-50"
                                        />
                                        <button
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="text-gray-400"
                                            disabled={isLoading}
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] border border-gray-300 backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled={isLoading}
                                            className="w-full bg-transparent text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none disabled:opacity-50"
                                        />
                                        <button
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400"
                                            disabled={isLoading}
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
                                        onClick={handleResetPassword}
                                        disabled={isLoading}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] text-white text-base lg:text-sm xl:text-base 2xl:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-stretch min-h-screen">
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

export default function AdminResetPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5530FA] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <AdminResetPasswordContent />
        </Suspense>
    );
}