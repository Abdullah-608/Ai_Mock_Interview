import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get session cookie to check if user is authenticated
  const sessionCookie = request.cookies.get('session')?.value
  const isAuthenticated = !!sessionCookie
  
  // Check if user is trying to access auth pages
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')
  
  
  // Check if user is trying to access protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/interview') || 
                          pathname.startsWith('/interviews') ||
                          pathname.startsWith('/profile') || 
                          pathname.startsWith('/settings') || 
                          pathname.startsWith('/feedback')
  
  // If authenticated user tries to access auth pages, redirect to dashboard
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If unauthenticated user tries to access protected routes, redirect to sign-in
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  // Allow landing page for everyone (authenticated and unauthenticated)
  // If you want to redirect authenticated users from landing page to dashboard, uncomment below:
  // if (isAuthenticated && isLandingPage) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }
  
  return NextResponse.next()
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
}
