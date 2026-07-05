import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { HomeownerDashboardClient } from "./HomeownerDashboardClient"

const API_BASE = 'http://127.0.0.1:3001'

async function getDashboardData(userId: string, token: string) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const [statsRes, jobsRes] = await Promise.all([
      fetch(`${API_BASE}/api/stats/homeowner/${userId}`, { headers, next: { revalidate: 60 } }),
      fetch(`${API_BASE}/api/jobs/homeowner/${userId}`, { headers, next: { revalidate: 30 } })
    ])

    return {
      stats: statsRes.ok ? await statsRes.json() : {},
      jobs: jobsRes.ok ? await jobsRes.json() : []
    }
  } catch (error) {
    console.error("Server-side fetch error:", error)
    return { stats: {}, jobs: [] }
  }
}

export default async function HomeownerDashboardPage() {
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
  const userName = user.fullName || user.name || "Homeowner"

  if (!userId) {
    redirect('/login')
  }

  // Fetch all data on the server in parallel with auth token
  const data = await getDashboardData(userId, token)

  return (
    <HomeownerDashboardClient 
      userName={userName}
      statsData={data.stats}
      jobsData={data.jobs}
    />
  )
}