import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  // Public routes that don't require authentication
  if (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/registration') ||
      request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for JWT token in cookies
  const cookieHeader = request.headers.get('cookie');
  let token = null;

  if (cookieHeader) {
    // Parse the cookie header to find our auth_token
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, ...rest] = cookie.trim().split('=');
      acc[name] = rest.join('=');
      return acc;
    }, {} as Record<string, string>);

    token = cookies['auth_token'];
  }

  if (!token) {
    // If not in cookies, check for JWT in Authorization header as fallback
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7, authHeader.length);
    }

    if (!token) {
      // Redirect to login if no token exists
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  try {
    // Verify the JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development'
    );

    jwtVerify(token, secret);

    // Token is valid, allow the request to continue
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};