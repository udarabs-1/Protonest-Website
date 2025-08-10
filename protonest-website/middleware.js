// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    // Only block in production
    if (process.env.NODE_ENV !== 'production') {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;
    const lockedFolders = process.env.LOCKED_FOLDERS ?
        process.env.LOCKED_FOLDERS.split(',').map(folder => `/${folder.trim()}`) :
        [];

    // Check if pathname starts with any locked folder
    const isLocked = lockedFolders.some(folder => pathname.startsWith(folder));

    if (isLocked) {
        return NextResponse.redirect(new URL('/404', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Match all paths under locked folders
    matcher: [
        '/incomplete/:path*',
        // Add other folder patterns if needed
    ]
};