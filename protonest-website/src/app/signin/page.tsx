"use client";

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Google OAuth types - isolated to avoid conflicts
interface SignInGoogleOAuthConfig {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select: boolean;
    cancel_on_tap_outside: boolean;
    use_fedcm_for_prompt?: boolean;
    itp_support?: boolean;
    ux_mode?: 'popup' | 'redirect';
    context?: 'signin' | 'signup' | 'use';
}

interface SignInGoogleAccounts {
    id: {
        initialize: (config: SignInGoogleOAuthConfig) => void;
        prompt: (callback?: (notification: SignInPromptMomentNotification) => void) => void;
        renderButton: (element: HTMLElement, options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            width?: number;
        }) => void;
    };
}

interface SignInGoogleAPI {
    accounts: SignInGoogleAccounts;
}

interface SignInPromptMomentNotification {
    isNotDisplayed: () => boolean;
    getNotDisplayedReason: () => string;
    isSkippedMoment: () => boolean;
    getSkippedReason: () => string;
    isDismissedMoment: () => boolean;
    getDismissedReason: () => string;
}

interface GoogleCredentialResponse {
    credential: string;
    select_by: string;
}
// Helper functions to safely access window properties
const getWindowGoogle = (): SignInGoogleAPI | undefined => {
    return (window as Record<string, unknown>)?.google as SignInGoogleAPI | undefined;
};

const getWindowGoogleInitialized = (): boolean => {
    return ((window as Record<string, unknown>)?.googleInitialized as boolean) || false;
};

const setWindowGoogleInitialized = (value: boolean): void => {
    (window as Record<string, unknown>).googleInitialized = value;
};

export default function ResponsiveSignIn() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [googleLoadError, setGoogleLoadError] = useState<boolean>(false);

    // Initialize Google OAuth with improved error handling
    useEffect(() => {
        if (typeof window !== 'undefined' && !getWindowGoogleInitialized()) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;

            script.onload = () => {
                try {
                    const google = getWindowGoogle();
                    if (google && google.accounts) {
                        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

                        if (!clientId) {
                            console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured');
                            setGoogleLoadError(true);
                            return;
                        }

                        console.log('Initializing Google OAuth for SignIn...');

                        google.accounts.id.initialize({
                            client_id: clientId,
                            callback: handleGoogleSignIn,
                            auto_select: false,
                            cancel_on_tap_outside: true,
                            use_fedcm_for_prompt: false,
                            itp_support: true,
                            ux_mode: 'popup',
                            context: 'signin'
                        });

                        setWindowGoogleInitialized(true);
                        console.log('Google OAuth initialized successfully');
                        setGoogleLoadError(false);
                    } else {
                        console.error('Google accounts library not loaded properly');
                        setGoogleLoadError(true);
                    }
                } catch (error) {
                    console.error('Error initializing Google OAuth:', error);
                    setGoogleLoadError(true);
                }
            };

            script.onerror = () => {
                console.error('Failed to load Google accounts script');
                setGoogleLoadError(true);
            };

            document.head.appendChild(script);

            return () => {
                if (document.head.contains(script)) {
                    document.head.removeChild(script);
                }
            };
        }
    }, []);

    // Handle Google OAuth response for sign-in with improved error handling
    const handleGoogleSignIn = async (response: GoogleCredentialResponse): Promise<void> => {
        setIsLoading(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!apiUrl) {
                setError('API configuration error. Please try again later.');
                setIsLoading(false);
                return;
            }

            // Use the dedicated Google sign-in endpoint for existing users only
            const signInResponse = await fetch(`${apiUrl}/api/v1/auth/google-signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_token: response.credential
                }),
            });

            const signInData = await signInResponse.json();

            if (signInResponse.ok) {
                // Store JWT token and user data
                if (signInData.data && signInData.data.token) {
                    localStorage.setItem('jwtToken', signInData.data.token);
                    localStorage.setItem('userData', JSON.stringify(signInData.data.user));

                    // Set expiration time
                    const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
                    localStorage.setItem('tokenExpiration', expirationTime.toString());

                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } else {
                    setError('Sign in successful but no token received');
                }
            } else {
                // Handle specific error cases
                if (signInResponse.status === 404) {
                    setError('No Google account found. Please sign up with Google first.');
                } else if (signInResponse.status === 400) {
                    setError(signInData.message || 'Google sign in failed. Please check your account.');
                } else {
                    setError(signInData.message || 'Google sign in failed. Please try again.');
                }
            }

        } catch (error) {
            console.error('Google sign in error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google Sign-In button click with improved error handling and FedCM bypass
    const handleGoogleSignInClick = (): void => {
        if (googleLoadError) {
            setError('Google Sign-In is not available. Please use manual sign-in.');
            return;
        }

        try {
            const google = getWindowGoogle();
            if (google && google.accounts && google.accounts.id) {
                console.log('Triggering Google sign-in prompt');

                // Alternative approach: Use renderButton instead of prompt to avoid FedCM issues
                const buttonContainer = document.createElement('div');
                buttonContainer.style.position = 'fixed';
                buttonContainer.style.top = '-9999px';
                buttonContainer.style.left = '-9999px';
                document.body.appendChild(buttonContainer);

                try {
                    // Render a hidden button and click it programmatically
                    google.accounts.id.renderButton(buttonContainer, {
                        theme: 'outline',
                        size: 'large',
                        width: 250
                    });

                    // Click the button after a short delay
                    setTimeout(() => {
                        const button = buttonContainer.querySelector('[role="button"]') as HTMLElement;
                        if (button) {
                            button.click();
                        }
                        // Clean up the hidden button
                        document.body.removeChild(buttonContainer);
                    }, 100);
                } catch (renderError) {
                    console.warn('renderButton failed, falling back to prompt method:', renderError);
                    document.body.removeChild(buttonContainer);

                    // Fallback to prompt method
                    google.accounts.id.prompt((notification: SignInPromptMomentNotification) => {
                        if (notification.isNotDisplayed()) {
                            const reason = notification.getNotDisplayedReason();
                            console.warn('Google sign-in prompt not displayed:', reason);

                            if (reason === 'browser_not_supported' || reason === 'invalid_client') {
                                setError('Google sign-in not supported. Please use manual sign-in.');
                            } else {
                                setError('Google sign-in unavailable. Please try manual sign-in.');
                            }
                        } else if (notification.isSkippedMoment()) {
                            console.warn('Google sign-in prompt skipped:', notification.getSkippedReason());
                        } else if (notification.isDismissedMoment()) {
                            console.log('Google sign-in prompt dismissed:', notification.getDismissedReason());
                        }
                    });
                }
            } else {
                console.error('Google accounts API not available');
                setError('Google Sign-In is not available. Please try manual sign-in.');
            }
        } catch (error) {
            console.error('Error triggering Google sign-in:', error);
            setError('Google sign-in failed. Please try manual sign-in.');
        }
    };

    const handleSignIn = async (): Promise<void> => {
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

            if (!apiUrl) {
                setError('API configuration error. Please try again later.');
                setIsLoading(false);
                return;
            }

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

                    // Set expiration time
                    const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
                    localStorage.setItem('tokenExpiration', expirationTime.toString());

                    // Redirect to dashboard
                    window.location.href = '/dashboard';
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
                            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mb-4 sm:mb-6 md:mb-8">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium font-['Montserrat'] leading-tight">
                                    <span className="text-gray-400">Sign in to </span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest</span>
                                </h1>
                                {/* Added text below the title */}
                                <div className="w-full justify-start text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] text-sm sm:text-base font-medium font-['Poppins'] mt-4">
                                    To sign up, you have to either submit your CV to our talent pool or apply for a job
                                </div>
                            </div>

                            {/* Form Container */}
                            <div className="w-full space-y-4 sm:space-y-6">
                                {/* Google Sign In */}
                                <button
                                    onClick={handleGoogleSignInClick}
                                    disabled={isLoading || googleLoadError}
                                    className="w-full h-14 sm:h-16 md:h-18 px-6 py-4 rounded-full gradient-button flex items-center justify-center space-x-4 hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <Image
                                        src="/google.svg"
                                        alt="Google"
                                        width={40}
                                        height={40}
                                        className="w-8 h-8 sm:w-10 sm:h-10"
                                    />
                                    <span className="text-gray-600 text-sm sm:text-base font-medium font-['Poppins']">
                                        {isLoading ? 'Signing in...' : googleLoadError ? 'Google Sign-in Unavailable' : 'Sign in with Google'}
                                    </span>
                                </button>

                                {/* Divider */}
                                <div className="flex items-center space-x-4 my-6 sm:my-8">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins']">or continue</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>

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
                                        type="button"
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
                                <div className="mb-8 lg:mb-6 xl:mb-8 2xl:mb-12">
                                    <h1 className="text-3xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-medium font-['Montserrat'] leading-tight">
                                        <span className="text-gray-400">Sign in to </span>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest</span>
                                    </h1>
                                    {/* Added text below the title */}
                                    <div className="w-[579px] justify-start text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] text-base lg:text-sm xl:text-base 2xl:text-lg font-medium font-['Poppins'] mt-4">
                                        To sign up, you have to either submit your CV to our talent pool or apply for a job
                                    </div>
                                </div>

                                {/* Form Container */}
                                <div className="max-w-2xl space-y-5 lg:space-y-4 xl:space-y-5 2xl:space-y-8">
                                    {/* Google Sign In */}
                                    <button
                                        onClick={handleGoogleSignInClick}
                                        disabled={isLoading || googleLoadError}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-6 py-4 rounded-full gradient-button flex items-center justify-center space-x-4 lg:space-x-3 xl:space-x-4 2xl:space-x-6 hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <Image
                                            src="/google.svg"
                                            alt="Google"
                                            width={48}
                                            height={48}
                                            className="w-9 h-9 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-12 2xl:h-12"
                                        />
                                        <span className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            {isLoading ? 'Signing in...' : googleLoadError ? 'Google Sign-in Unavailable' : 'Sign in with Google'}
                                        </span>
                                    </button>

                                    {/* Divider */}
                                    <div className="flex items-center space-x-4 my-8 lg:my-6 xl:my-8 2xl:my-12">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">or continue</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>

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
                                            type="button"
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
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="flex items-stretch h-screen">
                            <div className="w-full p-6 lg:p-4 2xl:p-6 flex">
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