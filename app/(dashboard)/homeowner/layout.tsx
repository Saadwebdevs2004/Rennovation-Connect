import { DashboardLayout } from "@/components/dashboard/layout"

export default function HomeownerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In production, user data would come from auth context/session
  const user = {
    name: "Sarah Mitchell",
    email: "sarah@example.com",
  }

  return (
    <DashboardLayout role="homeowner" user={user}>
      {children}
    </DashboardLayout>
  )
}
