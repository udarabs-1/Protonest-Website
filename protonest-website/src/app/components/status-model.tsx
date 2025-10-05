import React from 'react';

interface StatusModalProps {
    showModal: boolean;
    isSubmitting: boolean;
    submitStatus: string;
    onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
    showModal,
    isSubmitting,
    submitStatus,
    onClose
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/20 z-[9999] backdrop-blur-xl flex items-center justify-center px-4">
            <div className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[833px] h-[250px] sm:h-[280px] md:h-[300px] lg:h-[320px] xl:h-[325px] bg-white rounded-[20px] sm:rounded-[22px] md:rounded-[24px] xl:rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] overflow-hidden flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4">

                {/* Loading State */}
                {isSubmitting && (
                    <>
                        <div className="flex items-center justify-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
                                <div className="w-full h-full rounded-full"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-pink-500 border-r-blue-500 animate-spin bg-gradient-to-r from-pink-500 to-blue-500 rounded-full" style={{
                                    background: 'conic-gradient(from 0deg, #F51DA5, #5530FA, #F51DA5)',
                                    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)',
                                    mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)'
                                }}></div>
                            </div>
                        </div>
                        <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px]">
                            Sending your message...
                        </div>
                    </>
                )}

                {/* Success State */}
                {submitStatus === 'success' && !isSubmitting && (
                    <>
                        <div className="flex items-center justify-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px] space-y-2">
                            <div>Message Sent Successfully!</div>
                            <div className="text-xs sm:text-sm text-[#6c6c6c]/80">We&apos;ll get back to you within 24 hours.</div>
                        </div>
                        <button
                            onClick={onClose}
                            className="gradient-border w-[140px] sm:w-[160px] md:w-[170px] lg:w-[175px] xl:w-[179px] h-[40px] sm:h-[45px] md:h-[48px] lg:h-[50px] xl:h-[51px] px-6 py-4 rounded-[57px] flex justify-center items-center gap-1 hover:scale-102 hover:cursor-pointer"
                        >
                            <div className="text-center text-[#4e4e4e] text-sm sm:text-base font-medium font-poppins">
                                Go Back
                            </div>
                        </button>
                    </>
                )}

                {/* Error State */}
                {submitStatus === 'error' && !isSubmitting && (
                    <>
                        <div className="flex items-center justify-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center text-[#6c6c6c] text-sm sm:text-base md:text-lg font-normal font-poppins leading-[25px] sm:leading-[28px] md:leading-[30px] space-y-2">
                            <div>Failed to Send Message</div>
                            <div className="text-xs sm:text-sm text-[#6c6c6c]/80">Please try again or contact us directly.</div>
                        </div>
                        <button
                            onClick={onClose}
                            className="gradient-border w-[140px] sm:w-[160px] md:w-[170px] lg:w-[175px] xl:w-[179px] h-[40px] sm:h-[45px] md:h-[48px] lg:h-[50px] xl:h-[51px] px-6 py-4 rounded-[57px] flex justify-center items-center gap-1 hover:scale-102 hover:cursor-pointer"
                        >
                            <div className="text-center text-[#4d4d4d] text-sm sm:text-base font-medium font-poppins">
                                Go Back
                            </div>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default StatusModal;