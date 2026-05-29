import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { HomeownerDashboardClient } from "./HomeownerDashboardClient"

const API_BASE = 'http://127.0.0.1:3001'

async function getDashboardData(userId: string) {
  try {
    const [statsRes, jobsRes] = await Promise.all([
      fetch(`${API_BASE}/api/stats/homeowner/${userId}`, { next: { revalidate: 60 } }),
      fetch(`${API_BASE}/api/jobs/homeowner/${userId}`, { next: { revalidate: 30 } })
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
  try {
    user = JSON.parse(decodeURIComponent(session.value))
  } catch (e) {
    redirect('/login')
  }

  const userId = user.id || user.UserID
  const userName = user.fullName || user.name || "Homeowner"

  if (!userId) {
    redirect('/login')
  }

  // Fetch all data on the server in parallel
  const data = await getDashboardData(userId)

  return (
    <HomeownerDashboardClient 
      userName={userName}
      statsData={data.stats}
      jobsData={data.jobs}
    />
  )
}