'use client';

import { ImagePlus, Pencil, Trash2 } from 'lucide-react';
import { useRef, type ChangeEventHandler } from 'react';

type ProfilePhotoActionsProps = {
    hasPhoto: boolean;
    busy: boolean;
    onSelect: ChangeEventHandler<HTMLInputElement>;
    onRemove: () => void;
    status?: string;
};

const buttonClass = 'inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium leading-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export default function ProfilePhotoActions({ hasPhoto, busy, onSelect, onRemove, status }: ProfilePhotoActionsProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <p className="mb-1.5 text-xs font-medium text-gray-700">Profile Image</p>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={onSelect} disabled={busy} tabIndex={-1} aria-hidden="true" className="hidden" />
            <div className="flex flex-wrap items-center gap-1.5">
                <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className={`${buttonClass} border-violet-200 bg-white text-[#5530FA] hover:bg-violet-50 focus-visible:outline-[#5530FA]`}>
                    {hasPhoto ? <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />}
                    {hasPhoto ? 'Edit photo' : 'Add photo'}
                </button>
                {hasPhoto && (
                    <button type="button" onClick={onRemove} disabled={busy} className={`${buttonClass} border-red-200 bg-white text-red-600 hover:bg-red-50 focus-visible:outline-red-500`}>
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Remove photo
                    </button>
                )}
            </div>
            {status && <p role="status" className="mt-2 text-xs text-gray-500">{status}</p>}
        </div>
    );
}
