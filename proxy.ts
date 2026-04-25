// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('rc_session')
  const { pathname } = request.nextUrl

  // Define protected routes
  const isProtectedRoute = pathname.startsWith('/homeowner') || 
                           pathname.startsWith('/worker') || 
                           pathname.startsWith('/admin')

  // Define auth routes (login/register)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  if (isProtectedRoute && !session) {
    // Redirect to login if trying to access dashboard without session
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && session) {
    // Redirect to respective dashboard if already logged in
    try {
      const userData = JSON.parse(decodeURIComponent(session.value))
      const role = userData.role?.toLowerCase() || 'homeowner'
      
      let redirectUrl = '/homeowner/dashboard'
      if (role === 'worker') redirectUrl = '/worker/dashboard'
      if (role === 'admin') redirectUrl = '/admin/dashboard'
      
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch (e) {
      // If session is corrupt, just continue
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/homeowner/:path*',
    '/worker/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ],
}
