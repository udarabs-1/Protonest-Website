"use client";

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    itemLabel?: string;
    className?: string;
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25];

const Pagination = ({
    currentPage,
    totalPages,
    itemsPerPage = 10,
    onPageChange,
    onItemsPerPageChange,
    className = '',
}: PaginationProps) => {
    const safeTotalPages = Math.max(1, totalPages || 1);
    const safeCurrentPage = Math.min(Math.max(1, currentPage || 1), safeTotalPages);

    return (
        <div className={`flex flex-wrap items-center justify-end gap-2 sm:gap-2.5 px-4 py-3 border-t border-gray-100 text-xs sm:text-sm text-gray-600 ${className}`}>
            <span>The page on</span>
            <div className="relative inline-flex items-center">
                <select
                    value={safeCurrentPage}
                    onChange={(e) => onPageChange(Number(e.target.value))}
                    className="h-8 appearance-none border border-gray-300 rounded-md pl-2.5 pr-7 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#5530FA] cursor-pointer text-xs sm:text-sm"
                    aria-label="Select page"
                >
                    {Array.from({ length: safeTotalPages }, (_, i) => i + 1).map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <svg
                    className="pointer-events-none absolute right-2 w-3 h-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            <span>of {safeTotalPages} pages contains</span>
            <div className="relative inline-flex items-center">
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
                    className="h-8 appearance-none border border-gray-300 rounded-md pl-2.5 pr-7 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#5530FA] cursor-pointer text-xs sm:text-sm"
                    aria-label="Items per page"
                >
                    {PAGE_SIZE_OPTIONS.map((val) => (
                        <option key={val} value={val}>
                            {val}
                        </option>
                    ))}
                </select>
                <svg
                    className="pointer-events-none absolute right-2 w-3 h-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            <div className="flex items-center gap-1.5 ml-1">
                <button
                    type="button"
                    onClick={() => onPageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage <= 1}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage >= safeTotalPages}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
