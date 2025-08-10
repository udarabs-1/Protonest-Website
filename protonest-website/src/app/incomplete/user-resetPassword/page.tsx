"use client";

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ResponsiveSignIn() {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = () => {
        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Password doesn't match");
            return;
        }
        // Password reset logic here
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
                            {/* Title */}
                            <div className="w-full mb-8 sm:mb-12 md:mb-16">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#6c6c6c] font-medium font-['Montserrat'] leading-tight">
                                    Reset Your Password
                                </h1>
                            </div>

                            {/* Instruction Text */}
                            <div className="w-full mb-6 sm:mb-8 md:mb-10 text-[#949494] text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                Enter a new password for your account.
                            </div>

                            {/* Form Container */}
                            <div className="w-full space-y-4 sm:space-y-6">
                                {/* New Password Input */}
                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="text-gray-400"
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-400"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="text-red-500 text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                        {error}
                                    </div>
                                )}

                                {/* Reset Password Button */}
                                <button
                                    onClick={handleResetPassword}
                                    className="w-full h-14 sm:h-16 md:h-18 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] outline outline-offset-[-1px] text-white text-base sm:text-lg md:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200"
                                >
                                    Reset Password
                                </button>
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
                                <div className="mb-6 lg:mb-4 xl:mb-6 2xl:mb-8">
                                    <h1 className="text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#6c6c6c] font-medium font-['Montserrat'] leading-tight">
                                        Reset Your Password
                                    </h1>
                                </div>

                                {/* Instruction Text */}
                                <div className="mb-8 lg:mb-6 xl:mb-8 2xl:mb-10 text-[#949494] text-base lg:text-sm xl:text-base 2xl:text-lg font-medium font-['Poppins']">
                                    Enter a new password for your account.
                                </div>

                                {/* Form Container */}
                                <div className="max-w-2xl space-y-5 lg:space-y-4 xl:space-y-5 2xl:space-y-8">
                                    {/* New Password Input */}
                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                        />
                                        <button
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="text-gray-400"
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    {/* Confirm Password Input */}
                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] outline outline-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] focus:outline-none"
                                        />
                                        <button
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="text-red-500 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            {error}
                                        </div>
                                    )}

                                    {/* Reset Password Button */}
                                    <button
                                        onClick={handleResetPassword}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 bg-gradient-to-l from-[#5530fa] to-[#f51da5] rounded-[57px] outline outline-offset-[-1px] text-white text-base lg:text-sm xl:text-base 2xl:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200"
                                    >
                                        Reset Password
                                    </button>
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