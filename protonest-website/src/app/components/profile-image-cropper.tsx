'use client';

import { RotateCcw, RotateCw, X } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';

type Offset = { x: number; y: number };

type ProfileImageCropperProps = {
    file: File;
    onClose: () => void;
    onConfirm: (file: File) => Promise<void>;
};

const VIEW_SIZE = 300;
const OUTPUT_SIZE = 512;

export const profileImageFileError = (file: File): string | null => {
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        return 'Choose a JPEG, PNG, GIF, or WebP image.';
    }
    if (file.size > 20 * 1024 * 1024) {
        return 'Image must be 20 MB or smaller.';
    }
    return null;
};

const imageScale = (image: HTMLImageElement, zoom: number, rotation: number) => {
    const turned = rotation % 180 !== 0;
    const width = turned ? image.naturalHeight : image.naturalWidth;
    const height = turned ? image.naturalWidth : image.naturalHeight;
    return Math.max(VIEW_SIZE / width, VIEW_SIZE / height) * zoom;
};

const clampOffset = (image: HTMLImageElement, zoom: number, rotation: number, offset: Offset): Offset => {
    const turned = rotation % 180 !== 0;
    const scale = imageScale(image, zoom, rotation);
    const width = (turned ? image.naturalHeight : image.naturalWidth) * scale;
    const height = (turned ? image.naturalWidth : image.naturalHeight) * scale;
    const maxX = Math.max(0, (width - VIEW_SIZE) / 2);
    const maxY = Math.max(0, (height - VIEW_SIZE) / 2);
    return {
        x: Math.min(maxX, Math.max(-maxX, offset.x)),
        y: Math.min(maxY, Math.max(-maxY, offset.y)),
    };
};

const drawCrop = (canvas: HTMLCanvasElement, image: HTMLImageElement, zoom: number, rotation: number, offset: Offset) => {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image editing is unavailable in this browser.');
    const ratio = canvas.width / VIEW_SIZE;
    const position = clampOffset(image, zoom, rotation, offset);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, VIEW_SIZE, VIEW_SIZE);
    context.translate(VIEW_SIZE / 2 + position.x, VIEW_SIZE / 2 + position.y);
    context.rotate(rotation * Math.PI / 180);
    const scale = imageScale(image, zoom, rotation);
    context.scale(scale, scale);
    context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
    context.setTransform(1, 0, 0, 1, 0, 0);
};

export default function ProfileImageCropper({ file, onClose, onConfirm }: ProfileImageCropperProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const pointerRef = useRef<{ id: number; x: number; y: number; offset: Offset } | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        const nextImage = new window.Image();
        nextImage.onload = () => {
            if (!nextImage.naturalWidth || !nextImage.naturalHeight) {
                setError('This image could not be opened. Choose another file.');
                return;
            }
            setImage(nextImage);
        };
        nextImage.onerror = () => setError('This image could not be opened. Choose another file.');
        nextImage.src = url;
        return () => {
            nextImage.onload = null;
            nextImage.onerror = null;
            URL.revokeObjectURL(url);
        };
    }, [file]);

    useEffect(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const frame = requestAnimationFrame(() => {
            try {
                drawCrop(canvas, image, zoom, rotation, offset);
            } catch (cause) {
                setError(cause instanceof Error ? cause.message : 'Could not preview the image.');
            }
        });
        return () => cancelAnimationFrame(frame);
    }, [image, zoom, rotation, offset]);

    useEffect(() => {
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        closeButtonRef.current?.focus();
        return () => previousFocus?.focus();
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !saving) onClose();
            if (event.key === 'Tab' && dialogRef.current) {
                const controls = Array.from(dialogRef.current.querySelectorAll<HTMLButtonElement | HTMLInputElement>('button:not(:disabled), input:not(:disabled)'));
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose, saving]);

    const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
        if (!image || saving) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, offset };
    };

    const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
        const start = pointerRef.current;
        if (!start || start.id !== event.pointerId || !image) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const ratio = VIEW_SIZE / bounds.width;
        setOffset(clampOffset(image, zoom, rotation, {
            x: start.offset.x + (event.clientX - start.x) * ratio,
            y: start.offset.y + (event.clientY - start.y) * ratio,
        }));
    };

    const onPointerEnd = (event: PointerEvent<HTMLCanvasElement>) => {
        if (pointerRef.current?.id === event.pointerId) pointerRef.current = null;
    };

    const moveWithKeyboard = (key: string) => {
        if (!image || saving) return false;
        const steps: Record<string, Offset> = {
            ArrowLeft: { x: -10, y: 0 },
            ArrowRight: { x: 10, y: 0 },
            ArrowUp: { x: 0, y: -10 },
            ArrowDown: { x: 0, y: 10 },
        };
        const step = steps[key];
        if (!step) return false;
        setOffset(current => clampOffset(image, zoom, rotation, { x: current.x + step.x, y: current.y + step.y }));
        return true;
    };

    const saveCrop = async () => {
        if (!image || saving) return;
        setSaving(true);
        setError('');
        try {
            const output = document.createElement('canvas');
            output.width = OUTPUT_SIZE;
            output.height = OUTPUT_SIZE;
            drawCrop(output, image, zoom, rotation, offset);
            const blob = await new Promise<Blob>((resolve, reject) => {
                output.toBlob(value => value ? resolve(value) : reject(new Error('Could not create the cropped image.')), 'image/jpeg', 0.9);
            });
            await onConfirm(new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' }));
            onClose();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Image upload failed. Try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/65 px-4 py-6" role="presentation">
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="profile-crop-title" className="my-auto max-h-[calc(100dvh-3rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="profile-crop-title" className="text-lg font-semibold text-gray-900">Crop profile photo</h2>
                        <p className="mt-1 text-sm text-gray-500">Drag or use arrow keys to choose a square crop.</p>
                    </div>
                    <button ref={closeButtonRef} type="button" onClick={onClose} disabled={saving} aria-label="Close photo editor" className="rounded-full p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"><X className="h-5 w-5" /></button>
                </div>
                <div className="mx-auto mt-5 aspect-square w-full max-w-[300px] overflow-hidden rounded-lg bg-gray-100">
                    <canvas ref={canvasRef} width={600} height={600} tabIndex={0} aria-label="Square photo crop preview. Drag or use arrow keys to reposition." onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onKeyDown={event => { if (moveWithKeyboard(event.key)) event.preventDefault(); }} className="h-full w-full cursor-grab touch-none focus:outline-2 focus:outline-[#5530fa] active:cursor-grabbing" />
                </div>
                <div className="mt-5 flex items-center gap-3">
                    <label htmlFor="profile-crop-zoom" className="shrink-0 text-sm font-medium text-gray-700">Zoom</label>
                    <input id="profile-crop-zoom" type="range" min="1" max="3" step="0.01" value={zoom} disabled={!image || saving} onChange={event => {
                        const value = Number(event.target.value);
                        setZoom(value);
                        if (image) setOffset(current => clampOffset(image, value, rotation, current));
                    }} className="w-full accent-[#5530fa]" />
                    <span className="w-10 text-right text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => { setRotation((rotation + 270) % 360); setOffset({ x: 0, y: 0 }); }} disabled={!image || saving} className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"><RotateCcw className="h-4 w-4" /> Rotate left</button>
                    <button type="button" onClick={() => { setRotation((rotation + 90) % 360); setOffset({ x: 0, y: 0 }); }} disabled={!image || saving} className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"><RotateCw className="h-4 w-4" /> Rotate right</button>
                </div>
                {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={saving} className="min-h-10 rounded-lg border border-gray-200 px-4 text-sm text-gray-700 disabled:opacity-50">Cancel</button>
                    <button type="button" onClick={saveCrop} disabled={!image || saving} className="min-h-10 rounded-lg bg-gradient-to-r from-[#5530fa] to-[#f51da5] px-5 text-sm font-medium text-white disabled:opacity-50">{saving ? 'Uploading...' : 'Crop & upload'}</button>
                </div>
            </div>
        </div>
    );
}
