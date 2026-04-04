import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Get user from cookies/auth
    const userCookie = request.cookies.get('user');
    
    if (!userCookie) {
      // If no user cookie, check if running client-side
      // Server-side middleware can't access localStorage
      // Return response asking client to redirect
      return NextResponse.next();
    }

    try {
      const user = JSON.parse(userCookie.value);
      
      // Check if user has admin role
      if (user.role !== 'admin') {
        // Redirect non-admin users to home
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      // If cookie parsing fails, continue to client-side check
      return NextResponse.next();
    }
  }

  // Protect checkout routes
  if (pathname.startsWith('/checkout')) {
    const userCookie = request.cookies.get('user');
    
    if (!userCookie) {
      // Redirect non-logged-in users to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*'],
};
