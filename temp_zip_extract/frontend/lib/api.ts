// lib/api.ts
// Central API configuration and typed fetcher for SWR

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'

/**
 * Generic fetcher for SWR. Throws on error so SWR can handle it.
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error: any = new Error('API request failed')
    error.status = res.status
    throw error
  }
  return res.json()
}

/**
 * Build a proxied API URL that goes through Next.js route handlers
 * instead of hitting the backend directly from the browser.
 */
export const apiUrl = (path: string) => `/api/proxy?path=${encodeURIComponent(path)}`
