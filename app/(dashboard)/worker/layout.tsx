import { DashboardLayout } from "@/components/dashboard/layout"

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = {
    name: "Mike Johnson",
    email: "mike@example.com",
  }

  return (
    <DashboardLayout role="worker" user={user}>
      {children}
    </DashboardLayout>
  )
}
