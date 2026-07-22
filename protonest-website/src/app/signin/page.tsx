"use client";

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

const getWindowGoogle = (): SignInGoogleAPI | undefined => {
    return (window as Record<string, unknown>)?.google as SignInGoogleAPI | undefined;
};

const clearExpiredTokens = (): void => {
    if (typeof window === 'undefined') return;

    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (tokenExpiration) {
        const expirationTime = parseInt(tokenExpiration, 10);
        if (Date.now() > expirationTime) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('tokenExpiration');
        }
    }
};

const setTokenWithExpiration = (token: string): void => {
    const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
};

const MessageModal = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
                <div className="mb-4 text-4xl">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Montserrat']">
                    Account Notice
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

function SignInContent() {
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [googleLoadError, setGoogleLoadError] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    const apiConfig = useMemo(() => ({
        apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    }), []);

    useEffect(() => {
        clearExpiredTokens();
    }, []);

    useEffect(() => {
        window.history.replaceState(null, '', window.location.href);

        const handlePopState = (e: PopStateEvent) => {
            e.preventDefault();
            window.history.replaceState(null, '', window.location.href);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError('');
    }, [error]);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (error) setError('');
    }, [error]);

    const closeModal = useCallback(() => {
        setModalMessage('');
    }, []);

    const handlePostSignInRedirect = useCallback(async () => {
        const redirectTo = searchParams.get('redirect');
        if (redirectTo && redirectTo.startsWith('/')) {
            window.location.replace(redirectTo);
            return;
        }

        const pendingApplication = localStorage.getItem('pendingJobApplication');

        if (pendingApplication) {
            try {
                const pending = JSON.parse(pendingApplication);
                const isRecent = Date.now() - pending.timestamp < 10 * 60 * 1000;

                if (isRecent) {


                    const jobUrl = pending.jobUrl || `/jobs/${pending.role || 'all'}/${pending.jobId}`;
                    window.location.replace(jobUrl);
                    return;
                } else {

                    localStorage.removeItem('pendingJobApplication');
                }
            } catch (error) {
                console.error('Error processing pending application:', error);
                localStorage.removeItem('pendingJobApplication');
            }
        }

        window.location.replace('/dashboard');
    }, [searchParams]);

    const handleGoogleSignIn = useCallback(async (response: GoogleCredentialResponse): Promise<void> => {
        console.log('handleGoogleSignIn called - SIGNIN flow');
        setIsLoading(true);
        setError('');

        try {
            if (!apiConfig.apiUrl) {
                setError('API configuration error. Please try again later.');
                setIsLoading(false);
                return;
            }

            console.log('Calling SIGNIN API:', `${apiConfig.apiUrl}/api/v1/auth/google-signin`);

            const signInResponse = await fetch(`${apiConfig.apiUrl}/api/v1/auth/google-signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_token: response.credential
                }),
            });

            const signInData = await signInResponse.json();
            console.log('SIGNIN API Response:', signInData);

            if (signInResponse.ok) {
                if (signInData.data && signInData.data.token) {
                    setTokenWithExpiration(signInData.data.token);
                    localStorage.setItem('userData', JSON.stringify(signInData.data.user));

                    await handlePostSignInRedirect();
                } else {
                    setError('Sign in successful but no token received');
                }
            } else {
                if (signInResponse.status === 404) {
                    setModalMessage('No Google account found. Please sign up with Google first.');
                } else if (signInResponse.status === 400) {
                    setModalMessage(signInData.message || 'This account was created with email and password. Please sign in with your email and password.');
                } else {
                    setModalMessage(signInData.message || 'Google sign in failed. Please try again.');
                }
            }

        } catch (error) {
            console.error('Google sign in error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [apiConfig.apiUrl, handlePostSignInRedirect]);

    const handleGoogleSignInRef = useRef(handleGoogleSignIn);

    useEffect(() => {
        handleGoogleSignInRef.current = handleGoogleSignIn;
    }, [handleGoogleSignIn]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('Initializing Google OAuth for SIGNIN');

            const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

            const initializeGoogle = () => {
                try {
                    const google = getWindowGoogle();
                    if (google && google.accounts) {
                        if (!apiConfig.googleClientId) {
                            console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured');
                            setGoogleLoadError(true);
                            return;
                        }

                        console.log('Initializing Google with context: signin');

                        google.accounts.id.initialize({
                            client_id: apiConfig.googleClientId,
                            callback: (response: GoogleCredentialResponse) => {
                                console.log('Google callback triggered for SIGNIN');
                                handleGoogleSignInRef.current(response);
                            },
                            auto_select: false,
                            cancel_on_tap_outside: true,
                            use_fedcm_for_prompt: false,
                            itp_support: true,
                            ux_mode: 'popup',
                            context: 'signin'
                        });

                        setGoogleLoadError(false);
                        console.log('Google OAuth initialized successfully for SIGNIN');
                    } else {
                        console.error('Google accounts library not loaded properly');
                        setGoogleLoadError(true);
                    }
                } catch (error) {
                    console.error('Error initializing Google OAuth:', error);
                    setGoogleLoadError(true);
                }
            };

            if (existingScript) {
                console.log('Google script already exists, reinitializing for SIGNIN...');

                setTimeout(initializeGoogle, 100);
            } else {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    console.log('Google script loaded');
                    setTimeout(initializeGoogle, 100);
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
        }
    }, [apiConfig.googleClientId]);

    const handleGoogleSignInClick = useCallback((): void => {
        console.log('Google Sign In button clicked');

        if (googleLoadError) {
            setError('Google Sign-In is not available. Please use manual sign-in.');
            return;
        }

        try {
            const google = getWindowGoogle();
            if (!google || !google.accounts || !google.accounts.id) {
                setError('Google Sign-In is still loading. Please try again in a moment.');
                return;
            }

            const buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'fixed';
            buttonContainer.style.top = '-9999px';
            buttonContainer.style.left = '-9999px';
            document.body.appendChild(buttonContainer);

            try {
                google.accounts.id.renderButton(buttonContainer, {
                    theme: 'outline',
                    size: 'large',
                    width: 250
                });

                setTimeout(() => {
                    const button = buttonContainer.querySelector('[role="button"]') as HTMLElement;
                    if (button) {
                        console.log('Clicking Google button for SIGNIN');
                        button.click();
                    }
                    if (document.body.contains(buttonContainer)) {
                        document.body.removeChild(buttonContainer);
                    }
                }, 100);
            } catch (renderError) {
                console.warn('renderButton failed, falling back to prompt method:', renderError);
                if (document.body.contains(buttonContainer)) {
                    document.body.removeChild(buttonContainer);
                }

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
        } catch (error) {
            console.error('Error triggering Google sign-in:', error);
            setError('Google sign-in failed. Please try manual sign-in.');
        }
    }, [googleLoadError]);

    const handleSignIn = useCallback(async (): Promise<void> => {
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            if (!apiConfig.apiUrl) {
                setError('API configuration error. Please try again later.');
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${apiConfig.apiUrl}/api/v1/auth/login`, {
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
                if (data.data && data.data.token) {
                    setTokenWithExpiration(data.data.token);

                    if (data.data.user) {
                        localStorage.setItem('userData', JSON.stringify(data.data.user));
                    }

                    await handlePostSignInRedirect();
                } else {
                    setError('Login successful but no token received');
                }
            } else {
                if (response.status === 400 && data.message.includes('Google')) {
                    setModalMessage(data.message);
                } else {
                    setError(data.message || 'Login failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Sign in error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [email, password, apiConfig.apiUrl, handlePostSignInRedirect]);

    const isFormValid = useMemo(() => {
        return email.trim() !== '' && password.trim() !== '';
    }, [email, password]);

    return (
        <div className="bg-white">
            {modalMessage && <MessageModal message={modalMessage} onClose={closeModal} />}


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
                            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mb-4 sm:mb-6 md:mb-8">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium font-['Montserrat'] leading-tight">
                                    <span className="text-gray-400">Sign In</span>
                                </h1>
                            </div>

                            <form className="w-full space-y-4 sm:space-y-6" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
                                <button
                                    type="button"
                                    onClick={handleGoogleSignInClick}
                                    disabled={isLoading || googleLoadError}
                                    className="w-full h-14 sm:h-16 md:h-18 px-6 py-4 rounded-full gradient-button flex items-center justify-center space-x-4 hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    aria-label="Sign in with Google"
                                >
                                    <Image
                                        src="/google.svg"
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="w-8 h-8 sm:w-10 sm:h-10"
                                    />
                                    <span className="text-gray-600 text-sm sm:text-base font-medium font-['Poppins']">
                                        {isLoading ? 'Signing in...' : googleLoadError ? 'Google Sign-in Unavailable' : 'Sign in with Google'}
                                    </span>
                                </button>

                                <div className="flex items-center space-x-4 my-6 sm:my-8">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins']">or continue</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>

                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="w-full h-12 sm:h-14 md:h-16 px-8 sm:px-10 md:px-12 bg-white rounded-full border border-gray-300 text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] backdrop-blur-[50px]"
                                        required
                                        aria-label="Email address"
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="w-full h-12 sm:h-14 md:h-16 px-8 sm:px-10 md:px-12 pr-12 sm:pr-14 md:pr-16 bg-white rounded-full border border-gray-300 text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] backdrop-blur-[50px]"
                                        required
                                        aria-label="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 sm:right-5 md:right-6 top-1/2 transform -translate-y-1/2 text-gray-400 rounded cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                                    {error && (
                                        <div className="text-red-500 text-sm sm:text-base font-medium font-['Poppins']" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    <Link
                                        href="/forgot-password"
                                        className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins'] hover:text-gray-600 text-right rounded ml-auto"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !isFormValid}
                                    className="w-full h-14 sm:h-16 md:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white text-base sm:text-lg font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </button>

                                <div className="w-full mt-6 text-center">
                                    <div className="text-gray-500 text-sm sm:text-base font-medium font-['Poppins']">
                                        If you don&apos;t already have an account,{' '}
                                        <Link
                                            href="/signup"
                                            className="text-gray-600 hover:bg-gradient-to-r hover:from-[#5530FA] hover:via-[#F51DA5] hover:to-[#6C9AE1] hover:bg-clip-text hover:text-transparent"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
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

                    <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
                        <div className="flex flex-col justify-center items-center min-h-screen">
                            <div className="w-full max-w-3xl px-8 lg:px-12 xl:px-16 py-8">
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

                                <div className="mb-8 lg:mb-6 xl:mb-8 2xl:mb-12">
                                    <h1 className="text-3xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-medium font-['Montserrat'] leading-tight">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Sign In</span>
                                    </h1>
                                </div>

                                <form className="max-w-2xl space-y-5 lg:space-y-4 xl:space-y-5 2xl:space-y-8" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
                                    <button
                                        type="button"
                                        onClick={handleGoogleSignInClick}
                                        disabled={isLoading || googleLoadError}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-6 py-4 rounded-full gradient-button flex items-center justify-center space-x-4 lg:space-x-3 xl:space-x-4 2xl:space-x-6 hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                        aria-label="Sign in with Google"
                                    >
                                        <Image
                                            src="/google.svg"
                                            alt=""
                                            width={48}
                                            height={48}
                                            className="w-9 h-9 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-12 2xl:h-12"
                                        />
                                        <span className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            {isLoading ? 'Signing in...' : googleLoadError ? 'Google Sign-in Unavailable' : 'Sign in with Google'}
                                        </span>
                                    </button>

                                    <div className="flex items-center space-x-4 my-8 lg:my-6 xl:my-8 2xl:my-12">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">or continue</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-full border border-gray-300 text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] backdrop-blur-[50px]"
                                            required
                                            aria-label="Email address"
                                        />
                                    </div>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 pr-14 lg:pr-12 xl:pr-14 2xl:pr-18 bg-white rounded-full border border-gray-300 text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] backdrop-blur-[50px]"
                                            required
                                            aria-label="Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-5 lg:right-4 xl:right-5 2xl:right-7 top-1/2 transform -translate-y-1/2 text-gray-400 rounded cursor-pointer"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        {error && (
                                            <div className="text-red-500 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']" role="alert">
                                                {error}
                                            </div>
                                        )}
                                        <Link
                                            href="/forgot-password"
                                            className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins'] hover:text-gray-600 text-right rounded ml-auto"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !isFormValid}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full cursor-pointer text-white text-base lg:text-sm xl:text-base 2xl:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </button>

                                    <div className="w-full text-center pt-4">
                                        <div className="text-gray-500 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            If you don&apos;t already have an account,{' '}
                                            <Link
                                                href="/signup"
                                                className="text-gray-600 hover:bg-gradient-to-r hover:from-[#5530FA] hover:via-[#F51DA5] hover:to-[#6C9AE1] hover:bg-clip-text hover:text-transparent"
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    </div>
                                </form>
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

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>}>
            <SignInContent />
        </Suspense>
    );
}