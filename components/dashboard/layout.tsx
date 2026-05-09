"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { DashboardSidebar, UserRole } from "./sidebar"
import { DashboardHeader } from "./header"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: UserRole
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function DashboardLayout({ children, role, user }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background mesh-gradient relative">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.5_0.18_250/0.05),transparent_50%)] pointer-events-none" />
      {/* Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 z-40">
        <DashboardSidebar role={role} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <DashboardSidebar role={role} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 transition-all duration-300">
        <DashboardHeader
          role={role}
          user={user}
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
