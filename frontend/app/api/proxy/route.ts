// app/api/proxy/route.ts
// A catch-all reverse proxy that forwards requests to the Node.js backend.
// This means the browser always talks to Next.js (/api/proxy),
// never directly to localhost:3001. Works in dev AND production.

import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'

async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
  }

  // Intercept logout request to clear the HttpOnly cookie
  if (path === '/api/logout') {
    const response = NextResponse.json({ message: 'Logged out successfully' })
    response.cookies.set('rc_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/'
    })
    return response;
  }

  const targetUrl = `${BACKEND}${path}`

  // Extract auth info from the rc_session cookie
  const sessionCookie = req.cookies.get('rc_session')
  let authHeader = ''
  if (sessionCookie) {
    try {
      const decoded = decodeURIComponent(sessionCookie.value)
      const userData = JSON.parse(decoded)
      if (userData && (userData.token || userData.Token)) {
        authHeader = `Bearer ${userData.token || userData.Token}`
      }
    } catch (e) {
      console.error('Failed to parse session cookie for proxy', e)
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  if (authHeader) {
    headers['Authorization'] = authHeader
  }

  const clientAuth = req.headers.get('authorization')
  if (clientAuth) {
    headers['Authorization'] = clientAuth
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD'
        ? await req.text()
        : undefined,
      cache: 'no-store',
    })

    const contentType = backendRes.headers.get('content-type') || ''
    
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Backend returned non-JSON response' }, { status: 502 })
    }

    const data = await backendRes.json()

    const response = NextResponse.json(data, {
      status: backendRes.status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })

    // Intercept successful login/register responses to set the HttpOnly cookie
    if (backendRes.ok && (path === '/api/login' || path === '/api/register') && data.user) {
      const userData = data.user;
      const cookieValue = encodeURIComponent(JSON.stringify(userData));
      
      response.cookies.set('rc_session', cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });
    }

    return response
  } catch (err) {
    console.error('[API Proxy Error]', err)
    return NextResponse.json({ error: 'Backend is unavailable' }, { status: 503 })
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
