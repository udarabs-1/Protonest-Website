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
        <div className="h-screen overflow-y-auto sm:overflow-hidden relative bg-gradient-to-br from-[#5530FA]/5 via-white to-[#F51DA5]/5 flex items-center justify-center px-4 py-4 sm:py-0">
            {modalMessage && <MessageModal message={modalMessage} onClose={closeModal} />}

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

                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-medium font-['Montserrat'] leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Sign In</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-['Poppins'] mt-1">Welcome back to Protonest</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
                        <button
                            type="button"
                            onClick={handleGoogleSignInClick}
                            disabled={isLoading || googleLoadError}
                            className="w-full h-13 px-6 py-3 rounded-full gradient-button flex items-center justify-center gap-3 hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            aria-label="Sign in with Google"
                        >
                            <Image src="/google.svg" alt="" width={22} height={22} className="w-5 h-5" />
                            <span className="text-gray-600 text-sm font-medium font-['Poppins']">
                                {isLoading ? 'Signing in...' : googleLoadError ? 'Google Sign-in Unavailable' : 'Sign in with Google'}
                            </span>
                        </button>

                        <div className="flex items-center gap-3 my-2">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-gray-400 text-xs font-medium font-['Poppins']">or continue</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full h-12 px-5 bg-gray-50 rounded-full border border-gray-200 text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none focus:border-[#5530FA]/50 focus:bg-white transition-colors"
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
                                className="w-full h-12 px-5 pr-11 bg-gray-50 rounded-full border border-gray-200 text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none focus:border-[#5530FA]/50 focus:bg-white transition-colors"
                                required
                                aria-label="Password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            {error && (
                                <div className="text-red-500 text-xs font-medium font-['Poppins']" role="alert">{error}</div>
                            )}
                            <Link
                                href="/forgot-password"
                                className="text-gray-400 text-xs font-medium font-['Poppins'] hover:text-[#5530FA] transition-colors ml-auto"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full h-12 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white text-sm font-semibold font-['Poppins'] hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="text-center pt-2">
                            <span className="text-gray-400 text-sm font-['Poppins']">Don&apos;t have an account? </span>
                            <Link href="/signup" className="text-[#5530FA] text-sm font-medium font-['Poppins'] hover:underline">
                                Sign Up
                            </Link>
                        </div>
                    </form>
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