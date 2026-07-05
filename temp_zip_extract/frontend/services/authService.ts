import { apiUrl } from "@/lib/api";

export class AuthService {
  /**
   * Log in user, store dashboard session, and let Next.js set the secure HttpOnly cookie.
   */
  static async login(email: string, password: string) {
    const response = await fetch(apiUrl('/api/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Check credentials');
    }
    return data.user || data;
  }

  /**
   * Register a new user and let Next.js set the secure HttpOnly cookie.
   */
  static async register(fullName: string, email: string, password: string, role: string) {
    const response = await fetch(apiUrl('/api/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        email,
        password,
        userRole: role === "worker" ? "Worker" : "Homeowner"
      }),
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const textData = await response.text();
      data = { message: textData };
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Check your fields');
    }
    return data;
  }

  /**
   * Log out, delete local sessions, and tell Next.js to expire the HttpOnly cookie.
   */
  static async logout() {
    try {
      await fetch(apiUrl('/api/logout'));
    } catch (e) {
      console.error('Failed to trigger logout proxy', e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    }
  }
}
