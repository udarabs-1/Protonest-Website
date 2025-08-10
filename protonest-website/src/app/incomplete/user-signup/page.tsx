"use client";

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ResponsiveSignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSignIn = () => {
        if (!email || !password || !firstName || !lastName || !country || !agreedToTerms) {
            setError('Please fill in all fields');
            return;
        }
        // Simulate incorrect password for demo
        setError('Password is required');
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
                                    <span className="text-gray-400">Join the </span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest </span>
                                    <span className="text-gray-400">Freelance Network </span>
                                </h1>
                            </div>

                            {/* Form Container */}
                            <div className="w-full space-y-4 sm:space-y-6">
                                {/* Google Sign In */}
                                <div className="w-full h-14 sm:h-16 md:h-18 px-6 py-4 rounded-[57px] gradient-button inline-flex justify-center items-center gap-4 sm:gap-5 md:gap-6">
                                    <Image
                                        src="/google.svg"
                                        alt="Google"
                                        width={40}
                                        height={40}
                                        className="w-8 h-8 sm:w-10 sm:h-10"
                                    />
                                    <span className="text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins']">Sign up with Google</span>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center space-x-4 my-6 sm:my-8">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins']">or continue</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>

                                {/* Name Inputs */}
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    <div className="w-full sm:w-1/2 h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/2 h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password with 8 or more characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Country Input */}
                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="text-red-500 text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                        {error}
                                    </div>
                                )}

                                {/* Terms and Conditions */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setAgreedToTerms(!agreedToTerms)}
                                        className={`w-4 h-4 rounded-xl outline  ${agreedToTerms ? 'outline-[#5530fa]' : 'outline-gray-400'}`}
                                    >
                                        {agreedToTerms && (
                                            <div className="w-2.5 h-2.5 mx-auto mt-[3px] bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full" />
                                        )}
                                    </button>
                                    <div className="text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                        Yes, I understand and agree to the{' '}
                                        <span className="underline">Protonest Terms and Conditions</span> and{' '}
                                        <span className="underline">Privacy Policy</span>
                                    </div>
                                </div>

                                {/* Sign Up Button */}
                                <button
                                    onClick={handleSignIn}
                                    className="w-full h-14 sm:h-16 md:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-[57px] outline  outline-offset-[-1px] text-white text-base sm:text-lg md:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200"
                                >
                                    Sign up
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="w-full mt-8 sm:mt-12 md:mt-16">
                                <div className="text-center">
                                    <span className="text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins']">Already have an account? </span>
                                    <button className="text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] hover:text-gray-800">Sign in</button>
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
                                        <span className="text-gray-400">Join the </span>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest </span>
                                        <span className="text-gray-400">Freelance Network </span>
                                    </h1>
                                </div>

                                {/* Form Container */}
                                <div className="max-w-2xl space-y-5 lg:space-y-4 xl:space-y-5 2xl:space-y-8">
                                    {/* Google Sign In */}
                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-6 py-4 rounded-[57px] gradient-button inline-flex justify-center items-center gap-4 lg:gap-3 xl:gap-4 2xl:gap-6">
                                        <Image
                                            src="/google.svg"
                                            alt="Google"
                                            width={48}
                                            height={48}
                                            className="w-9 h-9 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-12 2xl:h-12"
                                        />
                                        <span className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">Sign up with Google</span>
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center space-x-4 my-8 lg:my-6 xl:my-8 2xl:my-12">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">or continue</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>

                                    {/* Name Inputs */}
                                    <div className="flex gap-6">
                                        <div className="w-1/2 h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                            />
                                        </div>
                                        <div className="w-1/2 h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password with 8 or more characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    {/* Country Input */}
                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline  outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="text-red-500 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            {error}
                                        </div>
                                    )}

                                    {/* Terms and Conditions */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setAgreedToTerms(!agreedToTerms)}
                                            className={`w-4 h-4 rounded-xl outline  ${agreedToTerms ? 'outline-[#5530fa]' : 'outline-gray-400'}`}
                                        >
                                            {agreedToTerms && (
                                                <div className="w-2.5 h-2.5 mx-auto mt-[3px] bg-gradient-to-b from-[#5530fa] to-[#f51da5] rounded-full" />
                                            )}
                                        </button>
                                        <div className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            Yes, I understand and agree to the{' '}
                                            <span className="underline">Protonest Terms and Conditions</span> and{' '}
                                            <span className="underline">Privacy Policy</span>
                                        </div>
                                    </div>

                                    {/* Sign Up Button */}
                                    <button
                                        onClick={handleSignIn}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-[57px] outline  outline-offset-[-1px] text-white text-base lg:text-sm xl:text-base 2xl:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200"
                                    >
                                        Sign up
                                    </button>
                                </div>

                                {/* Sign In Link */}
                                <div className="max-w-2xl mt-12 lg:mt-8 xl:mt-12 2xl:mt-20 flex justify-center">
                                    <div className="text-center">
                                        <span className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            Already have an account?
                                        </span>
                                        <button className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] hover:text-gray-800 ml-1">
                                            Sign in
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="flex items-stretch min-h-screen">
                            <div className="w-full p-6 lg:p-4 xl:p-6 2xl:p-10 flex">
                                <Image
                                    src="/signup1.svg"
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