import { DashboardLayout } from "@/components/dashboard/layout"
import { cookies } from "next/headers"

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('rc_session')
  
  let userData = { name: "Worker", email: "" }
  
  if (session) {
    try {
      const user = JSON.parse(decodeURIComponent(session.value))
      userData = {
        name: user.fullName || user.name || "Worker",
        email: user.email || ""
      }
    } catch (e) {
      console.error("Layout session parse error:", e)
    }
  }

  return (
    <DashboardLayout role="worker" user={userData}>
      {children}
    </DashboardLayout>
  )
}
