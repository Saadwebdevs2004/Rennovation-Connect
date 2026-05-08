"use client"

import { useState, useEffect } from "react" // Added useEffect
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" // Added useRouter
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { removeUserCookie } from "@/lib/auth-cookies"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Wrench,
  LayoutDashboard,
  ClipboardList,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  Search,
  Briefcase,
  FileText,
  User,
  CreditCard,
  HelpCircle,
  Star,
} from "lucide-react"

export type UserRole = "homeowner" | "worker" | "admin"

interface SidebarProps {
  role: UserRole
}

const homeownerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/homeowner/dashboard" },
  { icon: ClipboardList, label: "My Jobs", href: "/homeowner/jobs" },
  { icon: Users, label: "View Bids", href: "/homeowner/bids" },
  { icon: MessageSquare, label: "Messages", href: "/homeowner/messages" },
  { icon: CreditCard, label: "Payments", href: "/homeowner/payments" },
]

const workerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/worker/dashboard" },
  { icon: Search, label: "Find Jobs", href: "/worker/jobs" },
  { icon: Briefcase, label: "My Bids", href: "/worker/bids" },
  { icon: FileText, label: "Projects", href: "/worker/projects" },
  { icon: MessageSquare, label: "Messages", href: "/worker/messages" },
  { icon: CreditCard, label: "Earnings", href: "/worker/earnings" },
  { icon: Star, label: "Reviews", href: "/worker/reviews" },
]

const adminNavItems = [
  { icon: LayoutDashboard, label: "Admin Panel", href: "/admin/dashboard" },
  { icon: Users, label: "User Management", href: "/admin/users" },
  { icon: ClipboardList, label: "All Jobs", href: "/admin/jobs" },
  { icon: CreditCard, label: "Transactions", href: "/admin/payments" },
  { icon: Settings, label: "System Config", href: "/admin/settings" },
]

const bottomNavItems = [
  { icon: User, label: "Profile", href: (role: UserRole) => `/${role}/profile` },
  { icon: Settings, label: "Settings", href: (role: UserRole) => `/${role}/settings` },
  { icon: HelpCircle, label: "Help", href: "/help" },
]

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter() // Initialize router
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('user') // Clear the "sticky note"
    sessionStorage.removeItem('user') // Clear session storage
    removeUserCookie() // Clear the secure cookie
    window.location.href = '/login' // Force a full navigation
  }

  const navItems = role === "admin" ? adminNavItems : (role === "homeowner" ? homeownerNavItems : workerNavItems)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-500 glass border-r border-border/50 shadow-[4px_0_24px_oklch(0_0_0/0.02)]",
        isCollapsed ? "w-[80px]" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-border/50">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:rotate-6 transition-all duration-500">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-foreground tracking-tight whitespace-nowrap animate-fade-in">
                Reno<span className="text-primary">Connect</span>
              </span>
            )}
          </Link>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Main Navigation */}
        <ScrollArea className="flex-1 py-6">
          <nav className="px-3 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                  )}
                >
                  <Icon className={cn("w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110", isActive && "scale-110")} />
                  {!isCollapsed && (
                    <>
                      <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                      {isActive && (
                        <div className="absolute right-0 top-0 h-full w-1 bg-white/20 rounded-l-full" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className="border-t border-border/50 py-6 px-3 space-y-2">
          {bottomNavItems.map((item) => {
            const href = typeof item.href === "function" ? item.href(role) : item.href
            const isActive = pathname === href
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                <Icon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                {!isCollapsed && <span className="text-sm font-semibold tracking-tight">{item.label}</span>}
              </Link>
            )
          })}

          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full text-left group"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span className="text-sm font-semibold tracking-tight">Log Out</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}