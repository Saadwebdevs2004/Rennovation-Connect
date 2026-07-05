import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { WorkerDashboardClient } from "./WorkerDashboardClient"

const API_BASE = 'http://127.0.0.1:3001'

async function getDashboardData(userId: string, token: string) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const [statsRes, bidsRes, profileRes] = await Promise.all([
      fetch(`${API_BASE}/api/stats/worker/${userId}`, { headers, next: { revalidate: 60 } }),
      fetch(`${API_BASE}/api/bids/worker/${userId}`, { headers, next: { revalidate: 30 } }),
      fetch(`${API_BASE}/api/worker/profile/${userId}`, { headers, next: { revalidate: 300 } })
    ])

    return {
      stats: statsRes.ok ? await statsRes.json() : {},
      bids: bidsRes.ok ? await bidsRes.json() : [],
      profile: profileRes.ok ? await profileRes.json() : {}
    }
  } catch (error) {
    console.error("Server-side fetch error:", error)
    return { stats: {}, bids: [], profile: {} }
  }
}

export default async function WorkerDashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('rc_session')

  if (!session) {
    redirect('/login')
  }

  let user
  let token = ''
  try {
    const decoded = decodeURIComponent(session.value)
    user = JSON.parse(decoded)
    token = user.token || user.Token || ''
  } catch (e) {
    redirect('/login')
  }

  const userId = user.id || user.UserID
  const userName = user.fullName || user.name || "Worker"

  if (!userId) {
    redirect('/login')
  }

  // Fetch all data on the server in parallel with auth token
  const data = await getDashboardData(userId, token)

  return (
    <WorkerDashboardClient 
      userName={userName}
      statsData={data.stats}
      bidsData={data.bids}
      profileData={data.profile}
    />
  )
}
