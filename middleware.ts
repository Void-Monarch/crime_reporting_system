import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Add the pathname to headers so server components can access it
    response.headers.set('x-pathname', request.nextUrl.pathname);
    response.headers.set('x-invoke-path', request.nextUrl.pathname);

    return response;
}

export const config = {
    // Match all paths except static files and Next.js internals
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};