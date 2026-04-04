import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('authToken')?.value;

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // You could add additional admin role verification here
    // For now, we'll allow authenticated users
  }

  // Protected checkout routes
  if (pathname.startsWith('/checkout') || pathname.startsWith('/cart')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Protect orders page
  if (pathname.startsWith('/orders')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/checkout/:path*',
    '/cart/:path*',
    '/orders/:path*',
  ],
};
