'use client';

import { Icon } from '@iconify/react';
import { useCallback } from 'react';

type SubscriptionConfirmDialogProps = {
    name: string;
    email: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export const SubscriptionConfirmDialog = ({ name, email, onConfirm, onCancel }: SubscriptionConfirmDialogProps) => {
    const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    }, [onCancel]);

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] backdrop-blur-sm px-4"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center gradient-icon">
                        <Icon icon="solar:letter-opened-bold-duotone" className="w-10 h-10" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-[#6c6c6c] font-montserrat mb-4 text-center">
                    Confirm Subscription
                </h3>
                <p className="text-base text-[#6c6c6c] font-poppins mb-6 text-center">
                    Subscribe with <strong>{email}</strong>?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 rounded-[57px] border-2 gradient-border text-[#6c6c6c] text-base font-medium font-poppins hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-[57px] bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] text-white text-base font-semibold font-montserrat transition-all"
                    >
                        Yes, Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
};

type SubscriptionMessageDialogProps = {
    type: 'success' | 'error' | 'info';
    message: string;
    onClose: () => void;
};

export const SubscriptionMessageDialog = ({ type, message, onClose }: SubscriptionMessageDialogProps) => {
    const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'solar:check-circle-bold-duotone';
            case 'error':
                return 'solar:danger-circle-bold-duotone';
            case 'info':
                return 'solar:info-circle-bold-duotone';
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'success':
                return 'Subscription Successful!';
            case 'error':
                return 'Subscription Failed';
            case 'info':
                return 'Already Subscribed';
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] backdrop-blur-sm px-4"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center gradient-icon">
                        <Icon icon={getIcon()} className="w-10 h-10" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-[#6c6c6c] font-montserrat mb-4 text-center">
                    {getTitle()}
                </h3>
                <p className="text-base text-[#6c6c6c] font-poppins mb-6 text-center">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] rounded-[57px] text-white text-base font-semibold font-montserrat transition-all"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export const ContactConfirmDialog = ({ name, email, onConfirm, onCancel }: SubscriptionConfirmDialogProps) => {
    const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    }, [onCancel]);

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] backdrop-blur-sm px-4"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center gradient-icon">
                        <Icon icon="solar:letter-opened-bold-duotone" className="w-10 h-10" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-[#6c6c6c] font-montserrat mb-4 text-center">
                    Confirm Submission
                </h3>
                <p className="text-base text-[#6c6c6c] font-poppins mb-6 text-center">
                    Send your message to Protonest?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 rounded-[57px] border-2 gradient-border text-[#6c6c6c] text-base font-medium font-poppins hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-[57px] bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] text-white text-base font-semibold font-montserrat transition-all"
                    >
                        Yes, Send
                    </button>
                </div>
            </div>
        </div>
    );
};

type ContactMessageDialogProps = {
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
};

export const ContactMessageDialog = ({ type, message, onClose }: ContactMessageDialogProps) => {
    const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const getIcon = () => {
        return type === 'success'
            ? 'solar:check-circle-bold-duotone'
            : 'solar:danger-circle-bold-duotone';
    };

    const getTitle = () => {
        return type === 'success'
            ? 'Message Sent Successfully!'
            : 'Failed to Send Message';
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] backdrop-blur-sm px-4"
            onClick={handleBackgroundClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md bg-white rounded-[25px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.15)] p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center gradient-icon">
                        <Icon icon={getIcon()} className="w-10 h-10" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-[#6c6c6c] font-montserrat mb-4 text-center">
                    {getTitle()}
                </h3>
                <p className="text-base text-[#6c6c6c] font-poppins mb-6 text-center">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#5530fa] to-[#f51da5] hover:from-[#f51da5] hover:to-[#5530fa] rounded-[57px] text-white text-base font-semibold font-montserrat transition-all"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export const SubscriptionDialogStyles = () => (
    <>
        <style jsx global>{`
      .gradient-icon svg {
        width: 100%;
        height: 100%;
      }
      
      .gradient-icon svg path {
        fill: url(#icon-gradient) !important;
      }
      
      .gradient-icon svg circle {
        fill: url(#icon-gradient) !important;
      }
      
      .gradient-icon svg rect {
        fill: url(#icon-gradient) !important;
      }
      
      .gradient-icon svg polygon {
        fill: url(#icon-gradient) !important;
      }
      
      .gradient-border {
        border-image: linear-gradient(135deg, #5530fa, #f51da5) 1;
      }
    `}</style>

        <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
                <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4520E0" />
                    <stop offset="100%" stopColor="#D01888" />
                </linearGradient>
            </defs>
        </svg>
    </>
);
