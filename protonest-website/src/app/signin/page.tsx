"use client";

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ResponsiveSignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        // Reset error state
        setError('');

        // Validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store JWT token in localStorage
                if (data.data && data.data.token) {
                    localStorage.setItem('jwtToken', data.data.token);

                    // Store user data if needed
                    if (data.data.user) {
                        localStorage.setItem('userData', JSON.stringify(data.data.user));
                    }

                    // You can also set an expiration time if needed
                    const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
                    localStorage.setItem('tokenExpiration', expirationTime.toString());

                    // Redirect to dashboard or home page
                    window.location.href = '/dashboard'; // Change this to your desired redirect path
                } else {
                    setError('Login successful but no token received');
                }
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white">
            {/* Mobile/Tablet Layout (sm to md) */}
            <div className="block lg:hidden">
                <div className="relative w-full min-h-screen bg-white">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20">
                            <div className="w-full h-full bg-gradient-to-b from-white/0 to-white" />
                        </div>
                    </div>

                    {/* Side Gradients for Visual Effect */}
                    <div className="absolute left-0 top-64 w-10 h-72 bg-gradient-to-r from-white/0 to-white sm:hidden pointer-events-none" />
                    <div className="absolute left-0 top-96 w-10 h-60 bg-gradient-to-r from-white/0 to-white hidden sm:block md:hidden pointer-events-none" />

                    {/* Main Container */}
                    <div className="relative z-10 pb-8">
                        {/* Header with Logo - Aligned with form */}
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

                        {/* Content Area */}
                        <div className="px-4 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-24">
                            {/* Title - Aligned with form */}
                            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mb-8 sm:mb-12 md:mb-16">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium font-['Montserrat'] leading-tight">
                                    <span className="text-gray-400">Sign in to </span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest</span>
                                </h1>
                            </div>

                            {/* Form Container */}
                            <div className="w-full space-y-4 sm:space-y-6">
                                {/* Email Input */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-12 sm:h-14 md:h-16 px-8 sm:px-10 md:px-12 bg-white rounded-full border border-gray-300 text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:border-transparent backdrop-blur-[50px]"
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 sm:h-14 md:h-16 px-8 sm:px-10 md:px-12 pr-12 sm:pr-14 md:pr-16 bg-white rounded-full border border-gray-300 text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:border-transparent backdrop-blur-[50px]"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 sm:right-5 md:right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Error Message & Forgot Password */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                                    {error && (
                                        <div className="text-red-500 text-sm sm:text-base font-medium font-['Poppins']">
                                            {error}
                                        </div>
                                    )}
                                    <button className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins'] hover:text-gray-600 text-right">
                                        Forgot Password?
                                    </button>
                                </div>

                                {/* Sign In Button */}
                                <button
                                    onClick={handleSignIn}
                                    disabled={isLoading}
                                    className="w-full h-14 sm:h-16 md:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white text-base sm:text-lg font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center space-x-4 my-6 sm:my-8">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins']">or continue</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>

                                {/* Google Sign In */}
                                <button className="w-full h-14 sm:h-16 md:h-18 px-6 py-4 rounded-full gradient-button flex items-center justify-center space-x-4 hover:bg-gray-50 transition-colors duration-200">
                                    <Image
                                        src="/google.svg"
                                        alt="Google"
                                        width={40}
                                        height={40}
                                        className="w-8 h-8 sm:w-10 sm:h-10"
                                    />
                                    <span className="text-gray-600 text-sm sm:text-base font-medium font-['Poppins']">Sign in with Google</span>
                                </button>
                            </div>

                            {/* Sign Up Link - Aligned with form */}
                            <div className="w-full mt-8 sm:mt-12 md:mt-16">
                                <div className="text-center">
                                    <span className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins']">Don&apos;t have an account? </span>
                                    <button className="text-gray-600 text-sm sm:text-base font-medium font-['Poppins'] hover:text-gray-800">Sign up</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout (lg and above) */}
            <div className="hidden lg:block">
                <div className="relative w-full min-h-screen bg-white">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20">
                            <div className="w-full h-full bg-gradient-to-b from-white/0 to-white" />
                        </div>
                    </div>

                    {/* Side Gradients for Visual Effect */}
                    <div className="absolute left-0 top-64 w-10 h-72 bg-gradient-to-r from-white/0 to-white sm:hidden pointer-events-none" />
                    <div className="absolute left-0 top-96 w-10 h-60 bg-gradient-to-r from-white/0 to-white hidden sm:block md:hidden pointer-events-none" />

                    {/* Main Grid Container */}
                    <div className="relative z-10 min-h-screen grid lg:grid-cols-[3fr_2fr] xl:grid-cols-[3fr_2fr] 2xl:grid-cols-[1fr_1fr]">
                        {/* Left Side - Form */}
                        <div className="flex flex-col justify-center min-h-screen">
                            <div className="lg:pl-16 xl:pl-24 2xl:pl-32 py-8">
                                {/* Logo */}
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

                                {/* Title */}
                                <div className="mb-12 lg:mb-10 xl:mb-12 2xl:mb-16">
                                    <h1 className="text-3xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-medium font-['Montserrat'] leading-tight">
                                        <span className="text-gray-400">Sign in to </span>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest</span>
                                    </h1>
                                </div>

                                {/* Form Container */}
                                <div className="max-w-2xl space-y-5 lg:space-y-4 xl:space-y-5 2xl:space-y-8">
                                    {/* Email Input */}
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-full border border-gray-300 text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:border-transparent backdrop-blur-[50px]"
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 pr-14 lg:pr-12 xl:pr-14 2xl:pr-18 bg-white rounded-full border border-gray-300 text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:border-transparent backdrop-blur-[50px]"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 lg:right-4 xl:right-5 2xl:right-7 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* Error Message & Forgot Password */}
                                    <div className="flex justify-between items-center">
                                        {error && (
                                            <div className="text-red-500 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                                {error}
                                            </div>
                                        )}
                                        <button className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] hover:text-gray-600 ml-auto">
                                            Forgot Password?
                                        </button>
                                    </div>

                                    {/* Sign In Button */}
                                    <button
                                        onClick={handleSignIn}
                                        disabled={isLoading}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white text-base lg:text-sm xl:text-base 2xl:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Signing in...' : 'Sign in'}
                                    </button>

                                    {/* Divider */}
                                    <div className="flex items-center space-x-4 my-8 lg:my-6 xl:my-8 2xl:my-12">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">or continue</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>

                                    {/* Google Sign In */}
                                    <button className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-6 py-4 rounded-full gradient-button flex items-center justify-center space-x-4 lg:space-x-3 xl:space-x-4 2xl:space-x-6 hover:bg-gray-50 transition-colors duration-200">
                                        <Image
                                            src="/google.svg"
                                            alt="Google"
                                            width={48}
                                            height={48}
                                            className="w-9 h-9 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-12 2xl:h-12"
                                        />
                                        <span className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">Sign in with Google</span>
                                    </button>
                                </div>

                                {/* Sign Up Link - Centered */}
                                <div className="max-w-2xl mt-12 lg:mt-8 xl:mt-12 2xl:mt-20 flex justify-center">
                                    <div className="text-center">
                                        <span className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            Don&apos;t have an account?
                                        </span>
                                        <button className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] hover:text-gray-800 ml-1">
                                            Sign up
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Image */}
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