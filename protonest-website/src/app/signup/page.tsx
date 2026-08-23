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
        <span className="text-gray-600 text-sm font-normal font-['Poppins'] leading-relaxed">{label}</span>
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
    const [showAccountCreatedModal, setShowAccountCreatedModal] = useState<boolean>(false);
    const [showGoogleConsentModal, setShowGoogleConsentModal] = useState<boolean>(false);
    const [googleTermsConsent, setGoogleTermsConsent] = useState<boolean>(false);
    const [googleNewsletterConsent, setGoogleNewsletterConsent] = useState<boolean>(false);
    const [googleJobUpdatesConsent, setGoogleJobUpdatesConsent] = useState<boolean>(false);
    const [pendingGoogleCredential, setPendingGoogleCredential] = useState<{ credential: string; email: string; firstName: string; lastName: string; googleId: string } | null>(null);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);

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
        setError('');

        try {
            const payload: DecodedGooglePayload = JSON.parse(atob(response.credential.split('.')[1]));

            setPendingGoogleCredential({
                credential: response.credential,
                email: payload.email,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                googleId: payload.sub,
            });
            setGoogleTermsConsent(false);
            setGoogleNewsletterConsent(false);
            setGoogleJobUpdatesConsent(false);
            setShowGoogleConsentModal(true);
        } catch (error) {
            console.error('Google signup error:', error);
            setError('Google signup failed. Please try again.');
        }
    }, []);

    const handleGoogleConsentConfirm = useCallback(async (): Promise<void> => {
        if (!pendingGoogleCredential) return;

        setShowGoogleConsentModal(false);
        setIsLoading(true);
        setError('');

        const { credential, email: gEmail, firstName: gFirst, lastName: gLast, googleId } = pendingGoogleCredential;

        try {
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
                } catch (err) {
                    console.error('Error parsing pending job application:', err);
                }
            }

            const requestData = {
                first_name: gFirst,
                last_name: gLast,
                email: gEmail,
                google_id: googleId,
                job_updates: googleJobUpdatesConsent,
                newsletter: googleNewsletterConsent,
                skip_talent_pool: skipTalentPool,
                oauth_provider: 'google',
                ...(jobId && { job_id: jobId })
            };

            const signupResponse = await fetch(`${apiConfig.apiUrl}/api/v1/auth/google-signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...requestData, id_token: credential }),
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

            if (googleJobUpdatesConsent || googleNewsletterConsent) {
                try {
                    const fullName = gLast ? `${gFirst} ${gLast}`.trim() : gFirst;
                    const subscriptionResponse = await fetch(`${apiConfig.apiUrl}/api/v1/public/subscribe`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: fullName,
                            email: gEmail,
                            career_updates: googleJobUpdatesConsent,
                            newsletter: googleNewsletterConsent
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

            setPendingGoogleCredential(null);
            setShowAccountCreatedModal(true);

        } catch (error) {
            console.error('Google signup error:', error);
            setError('Google signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [pendingGoogleCredential, googleJobUpdatesConsent, googleNewsletterConsent, apiConfig.apiUrl]);

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

    const validateForm = useCallback((): boolean => {
        setError('');
        if (!email || !password || !confirmPassword || !firstName || !lastName || !agreedToTerms) {
            setError('Please fill in all required fields');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    }, [email, password, confirmPassword, firstName, lastName, agreedToTerms]);

    const handleSignUpClick = useCallback(() => {
        if (!validateForm()) return;
        setShowSubscriptionModal(true);
    }, [validateForm]);

    const handleSignUp = useCallback(async (): Promise<void> => {
        setShowSubscriptionModal(false);
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
                headers: { 'Content-Type': 'application/json' },
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
                        headers: { 'Content-Type': 'application/json' },
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

            setShowAccountCreatedModal(true);

        } catch (error) {
            console.error('Signup error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [firstName, lastName, email, password, confirmPassword, jobUpdates, newsletter, apiConfig.apiUrl]);

    const isFormValid = useMemo(() => {
        return email.trim() !== '' &&
            password.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            agreedToTerms;
    }, [email, password, confirmPassword, firstName, lastName, agreedToTerms]);


    return (
        <div className="h-screen overflow-y-auto sm:overflow-hidden relative bg-gradient-to-br from-[#5530FA]/5 via-white to-[#F51DA5]/5 flex items-center justify-center px-4 py-4 sm:py-0">
            {modalMessage && <MessageModal message={modalMessage} onClose={closeModal} />}

            {showAccountCreatedModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#5530fa] to-[#f51da5] flex items-center justify-center mx-auto">
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Montserrat']">Your Account has been Created!</h3>
                            <p className="text-gray-500 mb-6 font-['Poppins'] text-sm">Welcome to Protonest. Let&apos;s get your profile set up.</p>
                            <button
                                onClick={() => { setShowAccountCreatedModal(false); window.location.replace('/submit-cv'); }}
                                className="w-full h-12 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white font-semibold font-['Poppins'] hover:shadow-lg transition-shadow duration-200"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSubscriptionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl px-8 py-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 font-['Montserrat']">Stay in the Loop</h3>
                                <p className="text-gray-400 text-sm font-['Poppins'] mt-1">Choose what updates you&apos;d like to receive</p>
                            </div>
                            <button
                                onClick={() => setShowSubscriptionModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-0.5 ml-4 flex-shrink-0"
                                aria-label="Close and go back to form"
                            >
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <div className="space-y-4 mb-6">
                            <CustomCheckbox
                                checked={jobUpdates}
                                onChange={() => setJobUpdates(prev => !prev)}
                                label="Career updates — get notified about future job postings."
                            />
                            <CustomCheckbox
                                checked={newsletter}
                                onChange={() => setNewsletter(prev => !prev)}
                                label="Protonest newsletter — news, blog posts and product updates."
                            />
                        </div>
                        <button
                            onClick={handleSignUp}
                            className="w-full h-12 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white text-sm font-semibold font-['Poppins'] hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}



            {showGoogleConsentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl px-8 py-8 max-w-md w-full shadow-2xl">
                        <div className="mb-5">
                            <h3 className="text-xl font-semibold text-gray-800 font-['Montserrat']">Almost there!</h3>
                            <p className="text-gray-400 text-sm font-['Poppins'] mt-1">Please confirm your preferences before creating your account.</p>
                        </div>
                        <div className="space-y-4 mb-6">
                            <CustomCheckbox
                                checked={googleTermsConsent}
                                onChange={() => setGoogleTermsConsent(prev => !prev)}
                                label={
                                    <span>
                                        I agree to the{' '}
                                        <a href="/legal/terms-and-conditions" target="_blank" className="text-[#5530fa] hover:underline">Terms &amp; Conditions</a>
                                        {' '}and{' '}
                                        <a href="/legal/privacy-policy" target="_blank" className="text-[#5530fa] hover:underline">Privacy Policy</a>
                                    </span>
                                }
                            />
                            <CustomCheckbox
                                checked={googleJobUpdatesConsent}
                                onChange={() => setGoogleJobUpdatesConsent(prev => !prev)}
                                label="Career updates — get notified about future job postings."
                            />
                            <CustomCheckbox
                                checked={googleNewsletterConsent}
                                onChange={() => setGoogleNewsletterConsent(prev => !prev)}
                                label="Protonest newsletter — news, blog posts and product updates."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowGoogleConsentModal(false); setPendingGoogleCredential(null); }}
                                className="flex-1 h-12 border border-gray-200 rounded-full text-gray-500 text-sm font-medium font-['Poppins'] hover:border-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGoogleConsentConfirm}
                                disabled={!googleTermsConsent || isLoading}
                                className="flex-1 h-12 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white text-sm font-semibold font-['Poppins'] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Agree & Continue'}
                            </button>
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

                    <div className="mb-5 pb-5 border-b border-gray-200 text-center">
                        <h1 className="text-2xl sm:text-3xl font-medium font-['Montserrat'] leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1]">Sign Up</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-['Poppins'] mt-1">Welcome to ProtonestHR Portal!</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSignUpClick(); }}>
                        <button
                            type="button"
                            onClick={handleGoogleSignUpClick}
                            disabled={isLoading || googleLoadError}
                            className="w-full h-12 px-6 rounded-full gradient-button flex items-center justify-center gap-3 hover:shadow-lg transition-shadow duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            aria-label="Sign up with Google"
                        >
                            <Image src="/google.svg" alt="" width={20} height={20} className="w-5 h-5" />
                            <span className="text-gray-600 text-sm font-medium font-['Poppins']">
                                {isLoading ? 'Processing...' : googleLoadError ? 'Google Sign-up Unavailable' : 'Sign up with Google'}
                            </span>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-gray-400 text-xs font-medium font-['Poppins']">or continue</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1 h-12 px-4 bg-gray-50 rounded-full border border-gray-200 flex items-center">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                    className="w-full bg-transparent text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none"
                                    required
                                    aria-label="First Name"
                                />
                            </div>
                            <div className="flex-1 h-12 px-4 bg-gray-50 rounded-full border border-gray-200 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                    className="w-full bg-transparent text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none"
                                    required
                                    aria-label="Last Name"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full h-12 px-5 bg-gray-50 rounded-full border border-gray-200 text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none focus:border-[#5530FA]/50 focus:bg-white transition-colors"
                                required
                                aria-label="Email"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password (8+ characters)"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full h-12 px-5 pr-11 bg-gray-50 rounded-full border border-gray-200 text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none focus:border-[#5530FA]/50 focus:bg-white transition-colors"
                                required
                                aria-label="Password"
                            />
                            <button type="button" onClick={togglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="w-full h-12 px-5 pr-11 bg-gray-50 rounded-full border border-gray-200 text-gray-600 text-sm font-medium font-['Poppins'] focus:outline-none focus:border-[#5530FA]/50 focus:bg-white transition-colors"
                                required
                                aria-label="Confirm Password"
                            />
                            <button type="button" onClick={toggleConfirmPassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <CustomCheckbox
                            checked={agreedToTerms}
                            onChange={toggleAgreedToTerms}
                            label={
                                <span>
                                    I agree to the{' '}
                                    <Link href="/legal/terms-and-conditions" className="text-[#5530fa] hover:underline">Terms and Conditions</Link>
                                    {' '}and{' '}
                                    <Link href="/legal/privacy-policy" className="text-[#5530fa] hover:underline">Privacy Policy</Link>
                                </span>
                            }
                        />

                        {error && (
                            <div className="text-red-500 text-xs font-medium font-['Poppins']" role="alert">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full h-12 bg-gradient-to-r from-[#5530fa] to-[#f51da5] rounded-full text-white text-sm font-semibold font-['Poppins'] hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </button>

                        <div className="text-center pt-1">
                            <span className="text-gray-400 text-sm font-['Poppins']">Already have an account? </span>
                            <Link href="/signin" className="text-[#5530FA] text-sm font-medium font-['Poppins'] hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
