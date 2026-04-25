// lib/auth-cookies.ts
// Client-side cookie utility for managing user session state

export const USER_COOKIE_NAME = 'rc_session'

export function setUserCookie(userData: any) {
  if (typeof document === 'undefined') return
  
  const cookieValue = encodeURIComponent(JSON.stringify(userData))
  // Set cookie for 7 days
  const expires = new Date()
  expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000))
  
  document.cookie = `${USER_COOKIE_NAME}=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

export function getUserCookie() {
  if (typeof document === 'undefined') return null
  
  const name = USER_COOKIE_NAME + "="
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      try {
        return JSON.parse(c.substring(name.length, c.length))
      } catch (e) {
        return null
      }
    }
  }
  return null
}

export function removeUserCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${USER_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
