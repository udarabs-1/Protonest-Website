"use client";

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResponsiveSignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async () => {

        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {

                localStorage.setItem('adminToken', data.data.token);

                localStorage.setItem('adminInfo', JSON.stringify(data.data.admin));

                router.push('/admin-dashboard');

            } else {

                setError(data.message || data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSignIn();
        }
    };

    const handleForgotPassword = () => {
        router.push('/admin-forgot-password');
    };

    return (
        <div className="bg-white">

            <div className="block lg:hidden">
                <div className="relative w-full min-h-screen bg-white">

                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20">
                            <div className="w-full h-full bg-gradient-to-b from-white/0 to-white" />
                        </div>
                    </div>


                    <div className="absolute left-0 top-64 w-10 h-72 bg-gradient-to-r from-white/0 to-white sm:hidden pointer-events-none" />
                    <div className="absolute left-0 top-96 w-10 h-60 bg-gradient-to-r from-white/0 to-white hidden sm:block md:hidden pointer-events-none" />


                    <div className="relative z-10 pb-8">

                        <div className="pt-11 px-4 sm:px-8 md:px-16">
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
                        </div>


                        <div className="px-4 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-24">

                            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mb-4 sm:mb-12 md:mb-16">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium font-['Montserrat'] leading-tight">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest </span>
                                    <span className="text-gray-400">Admin Access</span>
                                </h1>
                            </div>

                            <div className="w-full mb-12 sm:mb-16 md:mb-20 text-[#949494] text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                Authorized access only
                            </div>


                            <div className="w-full space-y-4 sm:space-y-6">

                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={isLoading}
                                        className="w-full h-12 sm:h-14 md:h-16 px-8 sm:px-10 md:px-12 bg-white rounded-full border border-gray-300 text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:border-transparent backdrop-blur-[50px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>


                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={isLoading}
                                        className="w-full h-12 sm:h-14 md:h-16 px-8 sm:px-10 md:px-12 pr-12 sm:pr-14 md:pr-16 bg-white rounded-full border border-gray-300 text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:border-transparent backdrop-blur-[50px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        className="absolute right-4 sm:right-5 md:right-6 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer disabled:opacity-50"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>


                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                                    {error && (
                                        <div className="text-red-500 text-sm sm:text-base font-medium font-['Poppins']">
                                            {error}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins'] hover:text-gray-600 text-right cursor-pointer"
                                        disabled={isLoading}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>


                                <button
                                    type="button"
                                    onClick={handleSignIn}
                                    disabled={isLoading}
                                    className="w-full h-14 sm:h-16 md:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full cursor-pointer text-white text-base sm:text-lg font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                >
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>
                        </div>
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


                    <div className="absolute left-0 top-64 w-10 h-72 bg-gradient-to-r from-white/0 to-white sm:hidden pointer-events-none" />
                    <div className="absolute left-0 top-96 w-10 h-60 bg-gradient-to-r from-white/0 to-white hidden sm:block md:hidden pointer-events-none" />


                    <div className="relative z-10 min-h-screen grid lg:grid-cols-2">

                        <div className="flex flex-col justify-center items-center min-h-screen">
                            <div className="w-full max-w-3xl px-8 lg:px-12 xl:px-16 py-8">

                                <div className="mb-8 lg:mb-6 xl:mb-8 2xl:mb-12">
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
                                </div>


                                <div className="lg:mb-5 2xl:mb-8">
                                    <h1 className="text-3xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-medium font-['Montserrat'] leading-tight">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest </span>
                                        <span className="text-gray-400">Admin Access</span>
                                    </h1>
                                </div>

                                <div className="mb-8 lg:mb-6 xl:mb-10 text-[#949494] text-base lg:text-sm xl:text-base 2xl:text-lg font-medium font-['Poppins']">
                                    Authorized access only
                                </div>


                                <div className="max-w-2xl space-y-5 lg:space-y-4 xl:space-y-5 2xl:space-y-8">

                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled={isLoading}
                                            className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-full border border-gray-300 text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:border-transparent backdrop-blur-[50px] disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>


                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled={isLoading}
                                            className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 pr-14 lg:pr-12 xl:pr-14 2xl:pr-18 bg-white rounded-full border border-gray-300 text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:border-transparent backdrop-blur-[50px] disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                            className="absolute right-5 lg:right-4 xl:right-5 2xl:right-7 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer disabled:opacity-50"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>


                                    <div className="flex justify-between items-center">
                                        {error && (
                                            <div className="text-red-500 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                                {error}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] hover:text-gray-600 ml-auto cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>


                                    <button
                                        type="button"
                                        onClick={handleSignIn}
                                        disabled={isLoading}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full cursor-pointer text-white text-base lg:text-sm xl:text-base 2xl:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                    >
                                        {isLoading ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="hidden lg:flex items-stretch h-screen sticky top-0 self-start">
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