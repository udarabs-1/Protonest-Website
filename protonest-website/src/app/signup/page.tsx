"use client";

import { Check, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SignUpGoogleOAuthConfig {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select: boolean;
    cancel_on_tap_outside: boolean;
    use_fedcm_for_prompt?: boolean;
    itp_support?: boolean;
    ux_mode?: 'popup' | 'redirect';
    context?: 'signin' | 'signup' | 'use';
}

interface SignUpGoogleAccounts {
    id: {
        initialize: (config: SignUpGoogleOAuthConfig) => void;
        prompt: (callback?: (notification: SignUpPromptMomentNotification) => void) => void;
        renderButton: (element: HTMLElement, options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            width?: number;
        }) => void;
    };
}

interface SignUpGoogleAPI {
    accounts: SignUpGoogleAccounts;
}

interface SignUpPromptMomentNotification {
    isNotDisplayed: () => boolean;
    getNotDisplayedReason: () => string;
    isSkippedMoment: () => boolean;
    getSkippedReason: () => string;
    isDismissedMoment: () => boolean;
    getDismissedReason: () => string;
}

interface PendingJobApplication {
    jobId: string;
    jobTitle: string;
    jobUrl: string;
    role: string;
    timestamp: number;
}

interface GoogleCredentialResponse {
    credential: string;
    select_by: string;
}

interface DecodedGooglePayload {
    email: string;
    given_name: string;
    family_name: string;
    sub: string;
    email_verified: boolean;
    [key: string]: unknown;
}

const getWindowGoogle = (): SignUpGoogleAPI | undefined => {
    return (window as Record<string, unknown>)?.google as SignUpGoogleAPI | undefined;
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

const CustomCheckbox = ({
    checked,
    onChange,
    label
}: {
    checked: boolean;
    onChange: () => void;
    label: string | React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onChange}
        className="flex items-start gap-3 text-left group"
        aria-checked={checked}
        role="checkbox"
        aria-label={typeof label === 'string' ? label : 'checkbox'}
    >
        <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 transition-all duration-200 flex items-center justify-center mt-0.5 ${checked
            ? 'bg-[#5530fa] border-transparent shadow-md'
            : 'border-gray-300 bg-white group-hover:border-[#5530fa] group-hover:shadow-sm'
            }`}>
            {checked && (
                <Check size={16} className="text-white" strokeWidth={3} />
            )}
        </div>
        <span className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-normal font-['Poppins'] leading-relaxed">{label}</span>
    </button>
);

export default function SignUp() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
    const [jobUpdates, setJobUpdates] = useState<boolean>(true);
    const [newsletter, setNewsletter] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pendingJob, setPendingJob] = useState<PendingJobApplication | null>(null);
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

    const togglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const toggleConfirmPassword = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);

    const handleFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
        if (error) setError('');
    }, [error]);

    const handleLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
        if (error) setError('');
    }, [error]);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError('');
    }, [error]);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (error) setError('');
    }, [error]);

    const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (error) setError('');
    }, [error]);

    const toggleAgreedToTerms = useCallback(() => {
        setAgreedToTerms(prev => !prev);
    }, []);

    const closeModal = useCallback(() => {
        setModalMessage('');
    }, []);

    const handleGoogleSignUp = useCallback(async (response: GoogleCredentialResponse): Promise<void> => {
        console.log('handleGoogleSignUp called - SIGNUP flow');
        setIsLoading(true);
        setError('');

        try {
            const payload: DecodedGooglePayload = JSON.parse(atob(response.credential.split('.')[1]));

            const googleUserData = {
                email: payload.email,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                googleId: payload.sub,
                verified: payload.email_verified
            };

            console.log('Google user data:', googleUserData);

            console.log('Calling SIGNUP API:', `${apiConfig.apiUrl}/api/v1/auth/google-signup`);

            const pendingJobStr = localStorage.getItem('pendingJobApplication');
            let skipTalentPool = false;
            let jobId = '';

            if (pendingJobStr) {
                try {
                    const pendingJobData: PendingJobApplication = JSON.parse(pendingJobStr);
                    const isValid = Date.now() - pendingJobData.timestamp < 24 * 60 * 60 * 1000;
                    if (isValid) {
                        skipTalentPool = true;
                        jobId = pendingJobData.jobId;
                    }
                } catch (error) {
                    console.error('Error parsing pending job application:', error);
                }
            }

            const requestData = {
                first_name: googleUserData.firstName,
                last_name: googleUserData.lastName,
                email: googleUserData.email,
                google_id: googleUserData.googleId,
                job_updates: true,
                newsletter: true,
                skip_talent_pool: skipTalentPool,
                oauth_provider: 'google',
                ...(jobId && { job_id: jobId })
            };

            const signupResponse = await fetch(`${apiConfig.apiUrl}/api/v1/auth/google-signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...requestData,
                    id_token: response.credential
                }),
            });

            const signupData = await signupResponse.json();
            console.log('SIGNUP API Response:', signupData);

            if (!signupResponse.ok) {
                if (signupResponse.status === 409) {
                    setModalMessage(signupData.message || 'An account with this email already exists.');
                } else {
                    setModalMessage(signupData.message || 'Google signup failed. Please try again.');
                }
                setIsLoading(false);
                return;
            }

            if (signupData.data && signupData.data.token) {
                setTokenWithExpiration(signupData.data.token);
                localStorage.setItem('userData', JSON.stringify(signupData.data.user));
            }

            try {

                const fullName = googleUserData.lastName
                    ? `${googleUserData.firstName} ${googleUserData.lastName}`.trim()
                    : googleUserData.firstName;

                const subscriptionResponse = await fetch(`${apiConfig.apiUrl}/api/v1/public/subscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: fullName,
                        email: googleUserData.email,
                        career_updates: true,
                        newsletter: true
                    }),
                });

                const subscriptionData = await subscriptionResponse.json();

                if (!subscriptionResponse.ok) {
                    console.warn('Subscription creation failed:', subscriptionData.message);
                }
            } catch (subscriptionError) {
                console.warn('Subscription error:', subscriptionError);
            }

            window.location.replace('/submit-cv');

        } catch (error) {
            console.error('Google signup error:', error);
            setError('Google signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [apiConfig.apiUrl]);

    const handleGoogleSignUpRef = useRef(handleGoogleSignUp);

    useEffect(() => {
        handleGoogleSignUpRef.current = handleGoogleSignUp;
    }, [handleGoogleSignUp]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('Initializing Google OAuth for SIGNUP');

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

                        console.log('Initializing Google with context: signup');

                        google.accounts.id.initialize({
                            client_id: apiConfig.googleClientId,
                            callback: (response: GoogleCredentialResponse) => {
                                console.log('Google callback triggered for SIGNUP');
                                handleGoogleSignUpRef.current(response);
                            },
                            auto_select: false,
                            cancel_on_tap_outside: true,
                            use_fedcm_for_prompt: false,
                            itp_support: true,
                            ux_mode: 'popup',
                            context: 'signup'
                        });

                        setGoogleLoadError(false);
                        console.log('Google OAuth initialized successfully for SIGNUP');
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
                console.log('Google script already exists, reinitializing for SIGNUP...');

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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pendingJobStr = localStorage.getItem('pendingJobApplication');
            if (pendingJobStr) {
                try {
                    const jobData: PendingJobApplication = JSON.parse(pendingJobStr);
                    const isValid = Date.now() - jobData.timestamp < 24 * 60 * 60 * 1000;
                    if (isValid) {
                        setPendingJob(jobData);
                    } else {
                        localStorage.removeItem('pendingJobApplication');
                    }
                } catch {
                    localStorage.removeItem('pendingJobApplication');
                }
            }
        }
    }, []);

    const handleGoogleSignUpClick = useCallback((): void => {
        console.log('Google Sign Up button clicked');

        if (googleLoadError) {
            setError('Google Sign-Up is not available. Please use manual sign-up.');
            return;
        }

        try {
            const google = getWindowGoogle();
            if (!google || !google.accounts || !google.accounts.id) {
                setError('Google Sign-Up is still loading. Please try again in a moment.');
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
                        console.log('Clicking Google button for SIGNUP');
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

                google.accounts.id.prompt((notification: SignUpPromptMomentNotification) => {
                    if (notification.isNotDisplayed()) {
                        const reason = notification.getNotDisplayedReason();
                        console.warn('Google sign-up prompt not displayed:', reason);

                        if (reason === 'browser_not_supported' || reason === 'invalid_client') {
                            setError('Google sign-up not supported. Please use manual sign-up.');
                        } else {
                            setError('Google sign-up unavailable. Please try manual sign-up.');
                        }
                    } else if (notification.isSkippedMoment()) {
                        console.warn('Google sign-up prompt skipped:', notification.getSkippedReason());
                    } else if (notification.isDismissedMoment()) {
                        console.log('Google sign-up prompt dismissed:', notification.getDismissedReason());
                    }
                });
            }
        } catch (error) {
            console.error('Error triggering Google sign-up:', error);
            setError('Google sign-up failed. Please try manual sign-up.');
        }
    }, [googleLoadError]);

    const handleSignUp = useCallback(async (): Promise<void> => {
        setError('');

        if (!email || !password || !confirmPassword || !firstName || !lastName || !agreedToTerms) {
            setError('Please fill in all required fields');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const pendingJobStr = localStorage.getItem('pendingJobApplication');
            let skipTalentPool = false;
            let jobId = '';

            if (pendingJobStr) {
                try {
                    const pendingJobData: PendingJobApplication = JSON.parse(pendingJobStr);
                    const isValid = Date.now() - pendingJobData.timestamp < 24 * 60 * 60 * 1000;
                    if (isValid) {
                        skipTalentPool = true;
                        jobId = pendingJobData.jobId;
                    }
                } catch (error) {
                    console.error('Error parsing pending job application:', error);
                }
            }

            const requestData = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                job_updates: jobUpdates,
                newsletter: newsletter,
                skip_talent_pool: skipTalentPool,
                ...(jobId && { job_id: jobId })
            };

            const signupResponse = await fetch(`${apiConfig.apiUrl}/api/v1/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const signupData = await signupResponse.json();

            if (!signupResponse.ok) {
                if (signupResponse.status === 409) {
                    setModalMessage(signupData.message || 'An account with this email already exists.');
                } else {
                    setError(signupData.message || 'Signup failed. Please try again.');
                }
                setIsLoading(false);
                return;
            }

            if (signupData.data && signupData.data.token) {
                setTokenWithExpiration(signupData.data.token);
                localStorage.setItem('userData', JSON.stringify(signupData.data.user));
            }

            if (jobUpdates || newsletter) {
                try {
                    const subscriptionResponse = await fetch(`${apiConfig.apiUrl}/api/v1/public/subscribe`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: `${firstName} ${lastName}`,
                            email: email,
                            career_updates: jobUpdates,
                            newsletter: newsletter
                        }),
                    });

                    const subscriptionData = await subscriptionResponse.json();

                    if (!subscriptionResponse.ok) {
                        console.warn('Subscription creation failed:', subscriptionData.message);
                    }
                } catch (subscriptionError) {
                    console.warn('Subscription error:', subscriptionError);
                }
            }

            window.location.replace('/submit-cv');

        } catch (error) {
            console.error('Signup error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [firstName, lastName, email, password, confirmPassword, agreedToTerms, jobUpdates, newsletter, apiConfig.apiUrl]);

    const isFormValid = useMemo(() => {
        return email.trim() !== '' &&
            password.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            agreedToTerms;
    }, [email, password, confirmPassword, firstName, lastName, agreedToTerms]);

    const getTitle = useCallback((): React.ReactElement => {
        if (pendingJob) {
            return (
                <>
                    <span className="text-gray-400">Join the </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest </span>
                    <span className="text-gray-400">Team</span>
                </>
            );
        } else {
            return (
                <>
                    <span className="text-gray-400">Join the </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Protonest </span>
                    <span className="text-gray-400">Talent Pool</span>
                </>
            );
        }
    }, [pendingJob]);

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


                        <main className="px-4 sm:px-8 md:px-16 pt-8 sm:pt-12 md:pt-16">

                            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mb-6 sm:mb-8 md:mb-10">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium font-['Montserrat'] leading-tight">
                                    {getTitle()}
                                </h1>
                            </div>


                            <form className="w-full pr-2 space-y-4 sm:space-y-6" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>

                                <button
                                    type="button"
                                    onClick={handleGoogleSignUpClick}
                                    disabled={isLoading || googleLoadError}
                                    className="w-full h-14 sm:h-16 md:h-18 px-6 py-4 rounded-[57px] gradient-button inline-flex justify-center items-center gap-4 sm:gap-5 md:gap-6 hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    aria-label="Sign up with Google"
                                >
                                    <Image
                                        src="/google.svg"
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="w-8 h-8 sm:w-10 sm:h-10"
                                    />
                                    <span className="text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins']">
                                        {isLoading ? 'Processing...' : googleLoadError ? 'Google Sign-up Unavailable' : 'Sign up with Google'}
                                    </span>
                                </button>


                                <div className="flex items-center space-x-4 my-6 sm:my-8">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-gray-400 text-sm sm:text-base font-medium font-['Poppins']">or continue</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>


                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    <div className="w-full sm:w-1/2 h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={handleFirstNameChange}
                                            className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] outline-none"
                                            required
                                            aria-label="First Name"
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/2 h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={handleLastNameChange}
                                            className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] outline-none"
                                            required
                                            aria-label="Last Name"
                                        />
                                    </div>
                                </div>


                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] outline-none"
                                        required
                                        aria-label="Email"
                                    />
                                </div>


                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password with 8 or more characters"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] outline-none"
                                        required
                                        aria-label="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="text-gray-400 cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>


                                <div className="w-full h-14 sm:h-16 md:h-18 px-8 sm:px-10 md:px-12 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className="w-full bg-transparent text-gray-400 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] outline-none"
                                        required
                                        aria-label="Confirm Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPassword}
                                        className="text-gray-400 cursor-pointer"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>


                                <div className="space-y-2">
                                    <CustomCheckbox
                                        checked={jobUpdates}
                                        onChange={() => setJobUpdates(prev => !prev)}
                                        label="Subscribe to our careers page and receive updates of future job postings via email."
                                    />
                                </div>


                                <div className="space-y-2">
                                    <CustomCheckbox
                                        checked={newsletter}
                                        onChange={() => setNewsletter(prev => !prev)}
                                        label="Subscribe to the Protonest Newsletter and receive updates on recent news and blog posts."
                                    />
                                </div>


                                <div className="space-y-2">
                                    <CustomCheckbox
                                        checked={agreedToTerms}
                                        onChange={toggleAgreedToTerms}
                                        label={(
                                            <span>
                                                I understand and agree to the{' '}
                                                <Link href="/terms-and-conditions" className="text-[#5530fa] hover:underline">
                                                    Protonest Terms and Conditions
                                                </Link>{' '}
                                                and{' '}
                                                <Link href="/privacy-policy" className="text-[#5530fa] hover:underline">
                                                    Privacy Policy
                                                </Link>
                                            </span>
                                        )}
                                    />
                                </div>


                                {error && (
                                    <div className="text-red-500 text-sm sm:text-base md:text-lg font-medium font-['Poppins']" role="alert">
                                        {error}
                                    </div>
                                )}
                            </form>


                            <div className="mt-6">
                                <button
                                    onClick={handleSignUp}
                                    disabled={isLoading || !isFormValid}
                                    className="w-full h-14 sm:h-16 md:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-[57px] outline outline-offset-[-1px] text-white text-base sm:text-lg md:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Processing...' : 'Continue to Upload the CV to Sign Up'}
                                </button>
                            </div>


                            <div className="w-full mt-6 sm:mt-8 md:mt-10">
                                <div className="text-center">
                                    <span className="text-gray-500 text-sm sm:text-base md:text-lg font-medium font-['Poppins']">Already have an account? </span>
                                    <Link href="/signin" className="text-gray-600 text-sm sm:text-base md:text-lg font-medium font-['Poppins'] hover:bg-gradient-to-r hover:from-[#5530FA] hover:via-[#F51DA5] hover:to-[#6C9AE1] hover:bg-clip-text hover:text-transparent ml-1">
                                        Sign In
                                    </Link>
                                </div>
                            </div>
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
                                    <h1 className="text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium font-['Montserrat'] leading-tight">
                                        {getTitle()}
                                    </h1>
                                </div>


                                <form className="max-w-2xl space-y-4 lg:space-y-3 xl:space-y-4 2xl:space-y-6" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>

                                    <button
                                        type="button"
                                        onClick={handleGoogleSignUpClick}
                                        disabled={isLoading || googleLoadError}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-6 py-4 rounded-[57px] gradient-button inline-flex justify-center items-center gap-4 lg:gap-3 xl:gap-4 2xl:gap-6 hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                        aria-label="Sign up with Google"
                                    >
                                        <Image
                                            src="/google.svg"
                                            alt=""
                                            width={48}
                                            height={48}
                                            className="w-9 h-9 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-12 2xl:h-12"
                                        />
                                        <span className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            {isLoading ? 'Processing...' : googleLoadError ? 'Google Sign-up Unavailable' : 'Sign up with Google'}
                                        </span>
                                    </button>


                                    <div className="flex items-center space-x-4 my-6 lg:my-4 xl:my-6 2xl:my-8">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">or continue</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>


                                    <div className="flex gap-6">
                                        <div className="w-1/2 h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                value={firstName}
                                                onChange={handleFirstNameChange}
                                                className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] outline-none"
                                                required
                                                aria-label="First Name"
                                            />
                                        </div>
                                        <div className="w-1/2 h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                value={lastName}
                                                onChange={handleLastNameChange}
                                                className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] outline-none"
                                                required
                                                aria-label="Last Name"
                                            />
                                        </div>
                                    </div>


                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] outline-none"
                                            required
                                            aria-label="Email"
                                        />
                                    </div>


                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password with 8 or more characters"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] outline-none"
                                            required
                                            aria-label="Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePassword}
                                            className="text-gray-400 cursor-pointer"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>


                                    <div className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 px-12 lg:px-10 xl:px-12 2xl:px-16 bg-white rounded-[57px] border-1 border-[#c2c2c2] backdrop-blur-[50px] flex items-center justify-between">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter password"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            className="w-full bg-transparent text-gray-400 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] outline-none"
                                            required
                                            aria-label="Confirm Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPassword}
                                            className="text-gray-400 cursor-pointer"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>


                                    <div className="space-y-2">
                                        <CustomCheckbox
                                            checked={jobUpdates}
                                            onChange={() => setJobUpdates(prev => !prev)}
                                            label="Subscribe to our careers page and receive updates of future job postings."
                                        />
                                    </div>


                                    <div className="space-y-2">
                                        <CustomCheckbox
                                            checked={newsletter}
                                            onChange={() => setNewsletter(prev => !prev)}
                                            label="Subscribe to our Newsletter and receive updates."
                                        />
                                    </div>


                                    <div className="space-y-2">
                                        <CustomCheckbox
                                            checked={agreedToTerms}
                                            onChange={toggleAgreedToTerms}
                                            label={(
                                                <span>
                                                    I understand and agree to the{' '}
                                                    <Link href="/terms-and-conditions" className="text-[#5530fa] hover:underline">
                                                        Protonest Terms and Conditions
                                                    </Link>{' '}
                                                    and{' '}
                                                    <Link href="/privacy-policy" className="text-[#5530fa] hover:underline">
                                                        Privacy Policy
                                                    </Link>
                                                </span>
                                            )}
                                        />
                                    </div>


                                    {error && (
                                        <div className="text-red-500 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']" role="alert">
                                            {error}
                                        </div>
                                    )}
                                </form>


                                <div className="max-w-2xl mt-6">
                                    <button
                                        onClick={handleSignUp}
                                        disabled={isLoading || !isFormValid}
                                        className="w-full h-14 lg:h-12 xl:h-14 2xl:h-18 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-[57px] cursor-pointer outline outline-offset-[-1px] text-white text-base lg:text-sm xl:text-base 2xl:text-xl font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Processing...' : 'Sign up and Continue to Upload CV'}
                                    </button>
                                </div>


                                <div className="max-w-2xl mt-8 lg:mt-6 xl:mt-8 2xl:mt-12 flex justify-center">
                                    <div className="text-center">
                                        <span className="text-gray-500 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins']">
                                            Already have an account?
                                        </span>
                                        <Link href="/signin" className="text-gray-600 text-base lg:text-sm xl:text-base 2xl:text-xl font-medium font-['Poppins'] hover:bg-gradient-to-r hover:from-[#5530FA] hover:via-[#F51DA5] hover:to-[#6C9AE1] hover:bg-clip-text hover:text-transparent ml-1">
                                            Sign In
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="hidden lg:flex items-stretch h-screen sticky top-0 self-start">
                            <div className="w-full p-6 lg:p-4 xl:p-6 2xl:p-10 flex">
                                <Image
                                    src="/signup1.webp"
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